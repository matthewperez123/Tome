#!/usr/bin/env npx tsx
/**
 * Recovery ingestion for failed slugs.
 * Re-uses the same parsing logic as ingest-standard-ebooks.ts
 */

import { XMLParser } from 'fast-xml-parser';
import simpleGit from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';

const TMP_DIR = path.resolve('.tmp/se-ingest');
const SE_GITHUB_BASE = 'https://github.com/standardebooks';

// Map corrected SE slug → desired book_id
const RECOVERY = [
  { se_slug: 'homer_the-iliad_william-cullen-bryant', book_id: 'the-iliad' },
  { se_slug: 'homer_the-odyssey_william-cullen-bryant', book_id: 'the-odyssey' },
  { se_slug: 'daniel-defoe_the-life-and-adventures-of-robinson-crusoe', book_id: 'robinson-crusoe' },
  { se_slug: 'voltaire_candide_the-modern-library', book_id: 'candide' },
  { se_slug: 'plato_dialogues_benjamin-jowett', book_id: 'the-republic' },
  { se_slug: 'edgar-allan-poe_poetry', book_id: 'the-raven-and-other-poems' },
];

interface TocEntry { href: string; title: string; depth: number }

function stripTags(html: string): string { return html.replace(/<[^>]*>/g, ''); }
function countWords(text: string): number { return text.split(/\s+/).filter(Boolean).length; }
function ensureArray<T>(val: T | T[] | undefined | null): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function rewriteEpubAttributes(html: string): string {
  let result = html.replace(/\bepub:type\s*=\s*/g, 'data-epub-type=');
  result = result.replace(/\bepub:(\w+)\s*=\s*/g, 'data-epub-$1=');
  result = result.replace(/\s*xmlns:epub\s*=\s*"[^"]*"/g, '');
  result = result.replace(/\s*xmlns:?\w*\s*=\s*"[^"]*"/g, '');
  return result;
}

function extractBodyContent(xhtml: string): string {
  let content = xhtml.replace(/<\?xml[^?]*\?>\s*/g, '');
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) content = bodyMatch[1];
  content = rewriteEpubAttributes(content);
  return content.trim();
}

function parseTocXhtml(tocXml: string): TocEntry[] {
  const entries: TocEntry[] = [];
  function walkOl(html: string, depth: number) {
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/g;
    let match;
    while ((match = liRegex.exec(html)) !== null) {
      const liContent = match[1];
      const aMatch = liContent.match(/<a\s+[^>]*href\s*=\s*"([^"]*)"[^>]*>([\s\S]*?)<\/a>/);
      if (aMatch) {
        const href = aMatch[1];
        const title = stripTags(aMatch[2]).trim();
        if (href && title) entries.push({ href, title, depth });
      }
      const nestedOlMatch = liContent.match(/<ol[^>]*>([\s\S]*)<\/ol>/);
      if (nestedOlMatch) walkOl(nestedOlMatch[1], depth + 1);
    }
  }
  const navMatch = tocXml.match(/<nav[^>]*epub:type\s*=\s*"toc"[^>]*>([\s\S]*)<\/nav>/i)
    || tocXml.match(/<nav[^>]*>([\s\S]*)<\/nav>/i);
  if (navMatch) {
    const olMatch = navMatch[1].match(/<ol[^>]*>([\s\S]*)<\/ol>/);
    if (olMatch) walkOl(olMatch[1], 0);
  }
  return entries;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  isArray: (name) => ['dc:subject', 'meta', 'dc:creator', 'itemref', 'item'].includes(name),
  processEntities: true,
  htmlEntities: true,
});

async function main() {
  console.log('=== Recovery Ingestion ===\n');
  fs.mkdirSync(TMP_DIR, { recursive: true });

  const recoveredBooks: any[] = [];
  const recoveredChapters: any[] = [];
  const results: any[] = [];

  for (const { se_slug, book_id } of RECOVERY) {
    try {
      console.log(`Cloning ${se_slug}...`);
      const cloneDir = path.join(TMP_DIR, se_slug);
      if (!fs.existsSync(cloneDir)) {
        const git = simpleGit();
        await git.clone(`${SE_GITHUB_BASE}/${se_slug}.git`, cloneDir, ['--depth', '1']);
      }

      // Parse content.opf
      const opfPath = path.join(cloneDir, 'src/epub/content.opf');
      const opfXml = fs.readFileSync(opfPath, 'utf-8');
      const parsed = xmlParser.parse(opfXml);
      const pkg = parsed.package || parsed['opf:package'];
      const metadata = pkg?.metadata;

      const titleNode = metadata['dc:title'];
      let title = '';
      let subtitle: string | null = null;
      if (Array.isArray(titleNode)) {
        title = typeof titleNode[0] === 'object' ? titleNode[0]['#text'] : titleNode[0];
        if (titleNode.length > 1) subtitle = typeof titleNode[1] === 'object' ? titleNode[1]['#text'] : titleNode[1];
      } else if (typeof titleNode === 'object') {
        title = titleNode['#text'] || '';
      } else {
        title = titleNode || '';
      }

      const creatorNode = metadata['dc:creator'];
      let author = '';
      if (Array.isArray(creatorNode)) {
        author = typeof creatorNode[0] === 'object' ? creatorNode[0]['#text'] : creatorNode[0];
      } else if (typeof creatorNode === 'object') {
        author = creatorNode['#text'] || '';
      } else {
        author = creatorNode || '';
      }

      const description = metadata['dc:description'] || null;
      const language = metadata['dc:language'] || 'en';
      const dateStr = metadata['dc:date'] || '';
      const year = dateStr ? parseInt(dateStr.toString().substring(0, 4), 10) || null : null;
      const subjectNodes = ensureArray(metadata['dc:subject']);
      const subjects = subjectNodes.map((s: any) => (typeof s === 'object' ? s['#text'] : s)).filter(Boolean);

      const metas = ensureArray(metadata.meta);
      let longDescription: string | null = null;
      let authorBirthYear: number | null = null;
      let authorDeathYear: number | null = null;
      let sourceEdition: string | null = null;
      let seWordCount: number | null = null;

      for (const meta of metas) {
        if (!meta || typeof meta !== 'object') continue;
        const prop = meta['@_property'] || '';
        const val = meta['#text'] || '';
        if (prop === 'se:long-description') longDescription = val;
        if (prop === 'se:url.vcs.github') sourceEdition = val;
        if (prop === 'se:word-count') seWordCount = parseInt(val, 10) || null;
        if (prop.includes('birth') || prop.includes('born')) authorBirthYear = parseInt(val, 10) || null;
        if (prop.includes('death') || prop.includes('died')) authorDeathYear = parseInt(val, 10) || null;
      }

      // Spine
      const spine = pkg?.spine;
      const spineItems: string[] = [];
      if (spine?.itemref) {
        for (const ref of ensureArray(spine.itemref)) {
          const idref = typeof ref === 'object' ? ref['@_idref'] : ref;
          if (idref) spineItems.push(idref);
        }
      }
      const manifest = pkg?.manifest;
      const itemMap = new Map<string, string>();
      if (manifest?.item) {
        for (const item of ensureArray(manifest.item)) {
          if (item && typeof item === 'object' && item['@_id'] && item['@_href'])
            itemMap.set(item['@_id'], item['@_href']);
        }
      }
      const spineHrefs = spineItems.map(id => itemMap.get(id)).filter((h): h is string => !!h && h.startsWith('text/'));

      // TOC
      const tocPath = path.join(cloneDir, 'src/epub/toc.xhtml');
      let tocEntries: TocEntry[] = [];
      if (fs.existsSync(tocPath)) {
        tocEntries = parseTocXhtml(fs.readFileSync(tocPath, 'utf-8'));
      }
      const tocMap = new Map<string, TocEntry>();
      for (const entry of tocEntries) {
        const normalized = entry.href.replace(/^\.\.\//, '').replace(/^text\//, '');
        tocMap.set(normalized, entry);
      }

      // Chapters
      const textDir = path.join(cloneDir, 'src/epub/text');
      const chapters: any[] = [];
      let totalWordCount = 0;
      let chapterIdx = 0;

      for (const href of spineHrefs) {
        const filename = href.replace(/^text\//, '');
        const filePath = path.join(textDir, filename);
        if (!fs.existsSync(filePath)) continue;
        const xhtml = fs.readFileSync(filePath, 'utf-8');
        const bodyContent = extractBodyContent(xhtml);
        if (!bodyContent || bodyContent.length < 10) continue;
        const words = countWords(stripTags(bodyContent));
        totalWordCount += words;
        const tocEntry = tocMap.get(filename) || tocMap.get(href);
        const chapterTitle = tocEntry?.title || filename.replace(/\.xhtml$/, '').replace(/-/g, ' ');
        const tocDepth = tocEntry?.depth ?? 0;
        chapterIdx++;
        chapters.push({
          id: `${book_id}/ch-${chapterIdx}`,
          book_id: book_id,
          chapter_index: chapterIdx,
          title: chapterTitle,
          toc_depth: tocDepth,
          content_html: bodyContent,
          word_count: words,
          estimated_minutes: Math.ceil(words / 250),
        });
      }

      const finalWordCount = seWordCount || totalWordCount;
      const seUrl = `https://standardebooks.org/ebooks/${se_slug.replace(/_/g, '/')}`;

      const book = {
        id: book_id,
        se_slug,
        title,
        subtitle,
        author,
        author_birth_year: authorBirthYear,
        author_death_year: authorDeathYear,
        synopsis: typeof description === 'object' ? (description as any)['#text'] : description,
        long_description: longDescription,
        language,
        year,
        subjects,
        word_count: finalWordCount,
        reading_time_minutes: Math.ceil(finalWordCount / 250),
        chapter_count: chapters.length,
        standard_ebooks_url: seUrl,
        source_edition: sourceEdition,
        source: 'standard-ebooks',
        ingestion_status: 'success',
      };

      recoveredBooks.push(book);
      recoveredChapters.push(...chapters);
      console.log(`  ✓ ${book_id}: ${chapters.length} chapters, ${finalWordCount.toLocaleString()} words`);
      results.push({ slug: se_slug, bookId: book_id, status: 'success', chapterCount: chapters.length, wordCount: finalWordCount });
    } catch (err: any) {
      console.log(`  ✗ ${book_id}: ${err.message}`);
      results.push({ slug: se_slug, bookId: book_id, status: 'failed', reason: err.message });
    }

    await new Promise(r => setTimeout(r, 1000));
  }

  // Write recovery data
  const recoveryPath = path.resolve('.tmp/recovery-data.json');
  fs.writeFileSync(recoveryPath, JSON.stringify({ books: recoveredBooks, chapters: recoveredChapters }, null, 2));
  console.log(`\nRecovery data written to ${recoveryPath}`);

  // Update the main report
  const reportPath = path.resolve('.tmp/ingest-report.json');
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    const newSucceeded = results.filter(r => r.status === 'success');
    const stillFailed = results.filter(r => r.status === 'failed');

    // Remove recovered slugs from failed, add to succeeded
    const recoveredBookIds = new Set(newSucceeded.map(r => r.bookId));
    report.failed = report.failed.filter((f: any) => !recoveredBookIds.has(f.bookId));
    report.failed.push(...stillFailed.map(f => ({ slug: f.slug, bookId: f.bookId, reason: f.reason })));

    for (const s of newSucceeded) {
      report.succeeded.push({ slug: s.slug, bookId: s.bookId, chapters: s.chapterCount, words: s.wordCount });
      report.totalChapters += s.chapterCount;
      report.totalWords += s.wordCount;
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log('Updated ingest-report.json');
  }

  console.log(`\n=== Recovery Summary ===`);
  console.log(`Recovered: ${results.filter(r => r.status === 'success').length}/${RECOVERY.length}`);
  console.log(`Still failed: ${results.filter(r => r.status === 'failed').length}/${RECOVERY.length}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
