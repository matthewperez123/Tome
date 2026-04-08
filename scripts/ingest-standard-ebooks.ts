#!/usr/bin/env npx tsx
/**
 * Standard Ebooks Ingestion Pipeline for Tome
 *
 * Clones SE repos, parses XHTML content, and writes book + chapter data
 * to Supabase. Outputs parsed data to .tmp/parsed-data.json as fallback.
 *
 * Usage: npx tsx scripts/ingest-standard-ebooks.ts
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (in .env.local)
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { XMLParser } from 'fast-xml-parser';
import simpleGit from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ──────────────────────────────────────────────────────────────────

const BOOKS_TO_INGEST = [
  'homer_the-iliad_alexander-pope',
  'homer_the-odyssey_samuel-butler',
  'virgil_the-aeneid_john-dryden',
  'marcus-aurelius_meditations_george-long',
  'plato_the-republic_benjamin-jowett',
  'sun-tzu_the-art-of-war_lionel-giles',
  'dante-alighieri_the-divine-comedy_henry-wadsworth-longfellow',
  'miguel-de-cervantes-saavedra_don-quixote_john-ormsby',
  'william-shakespeare_hamlet',
  'william-shakespeare_romeo-and-juliet',
  'william-shakespeare_macbeth',
  'john-milton_paradise-lost',
  'jonathan-swift_gullivers-travels',
  'daniel-defoe_robinson-crusoe',
  'voltaire_candide_philip-littell',
  'jane-austen_pride-and-prejudice',
  'jane-austen_sense-and-sensibility',
  'jane-austen_emma',
  'mary-shelley_frankenstein',
  'charles-dickens_a-tale-of-two-cities',
  'charles-dickens_great-expectations',
  'charles-dickens_oliver-twist',
  'charlotte-bronte_jane-eyre',
  'emily-bronte_wuthering-heights',
  'nathaniel-hawthorne_the-scarlet-letter',
  'herman-melville_moby-dick',
  'edgar-allan-poe_the-raven-and-other-poems',
  'henry-david-thoreau_walden',
  'louisa-may-alcott_little-women',
  'mark-twain_the-adventures-of-huckleberry-finn',
  'mark-twain_the-adventures-of-tom-sawyer',
  'fyodor-dostoevsky_crime-and-punishment_constance-garnett',
  'fyodor-dostoevsky_the-brothers-karamazov_constance-garnett',
  'leo-tolstoy_war-and-peace_louise-maude_aylmer-maude',
  'leo-tolstoy_anna-karenina_constance-garnett',
  'victor-hugo_les-miserables_isabel-f-hapgood',
  'gustave-flaubert_madame-bovary_eleanor-marx-aveling',
  'lewis-carroll_alices-adventures-in-wonderland',
  'bram-stoker_dracula',
  'robert-louis-stevenson_the-strange-case-of-dr-jekyll-and-mr-hyde',
  'robert-louis-stevenson_treasure-island',
  'arthur-conan-doyle_the-adventures-of-sherlock-holmes',
  'h-g-wells_the-time-machine',
  'h-g-wells_the-war-of-the-worlds',
  'oscar-wilde_the-picture-of-dorian-gray',
  'joseph-conrad_heart-of-darkness',
  'kate-chopin_the-awakening',
  'henry-james_the-turn-of-the-screw',
  'f-scott-fitzgerald_the-great-gatsby',
  'james-joyce_a-portrait-of-the-artist-as-a-young-man',
];

const TMP_DIR = path.resolve('.tmp/se-ingest');
const REPORT_PATH = path.resolve('.tmp/ingest-report.json');
const PARSED_DATA_PATH = path.resolve('.tmp/parsed-data.json');
const CLONE_DELAY_MS = 1000;
const SE_GITHUB_BASE = 'https://github.com/standardebooks';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParsedBook {
  id: string;
  se_slug: string;
  title: string;
  subtitle: string | null;
  author: string;
  author_birth_year: number | null;
  author_death_year: number | null;
  synopsis: string | null;
  long_description: string | null;
  language: string;
  year: number | null;
  subjects: string[];
  word_count: number;
  reading_time_minutes: number;
  chapter_count: number;
  standard_ebooks_url: string;
  source_edition: string | null;
  source: string;
  ingestion_status: string;
}

interface ParsedChapter {
  id: string;
  book_id: string;
  chapter_index: number;
  title: string;
  toc_depth: number;
  content_html: string;
  word_count: number;
  estimated_minutes: number;
}

interface TocEntry {
  href: string;
  title: string;
  depth: number;
}

interface IngestResult {
  slug: string;
  bookId: string;
  status: 'success' | 'skipped' | 'failed';
  reason?: string;
  chapterCount?: number;
  wordCount?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function deriveBookId(seSlug: string): string {
  // e.g. 'homer_the-odyssey_samuel-butler' → 'the-odyssey'
  const parts = seSlug.split('_');
  if (parts.length >= 2) return parts[1];
  return seSlug;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function rewriteEpubAttributes(html: string): string {
  // Handle epub:type with optional whitespace: epub:type="..." or epub:type = "..."
  let result = html.replace(/\bepub:type\s*=\s*/g, 'data-epub-type=');

  // Handle epub:prefix and any other epub: namespace attributes
  result = result.replace(/\bepub:(\w+)\s*=\s*/g, 'data-epub-$1=');

  // Strip xmlns:epub declarations
  result = result.replace(/\s*xmlns:epub\s*=\s*"[^"]*"/g, '');

  // Strip other xmlns declarations that are invalid in HTML
  result = result.replace(/\s*xmlns:?\w*\s*=\s*"[^"]*"/g, '');

  return result;
}

function extractBodyContent(xhtml: string): string {
  // Remove XML declaration
  let content = xhtml.replace(/<\?xml[^?]*\?>\s*/g, '');

  // Extract body innerHTML
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    content = bodyMatch[1];
  }

  // Rewrite epub: namespace attributes
  content = rewriteEpubAttributes(content);

  return content.trim();
}

async function checkRepoExists(slug: string): Promise<boolean> {
  const url = `${SE_GITHUB_BASE}/${slug}`;
  try {
    const resp = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return resp.ok;
  } catch {
    return false;
  }
}

function ensureArray<T>(val: T | T[] | undefined | null): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

// ─── OPF Parsing ─────────────────────────────────────────────────────────────

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  isArray: (name) => {
    // These can appear multiple times
    return ['dc:subject', 'meta', 'dc:creator', 'itemref', 'item'].includes(name);
  },
  stopNodes: ['*.se:long-description'],
  processEntities: true,
  htmlEntities: true,
});

function parseOpf(opfXml: string, seSlug: string) {
  const parsed = xmlParser.parse(opfXml);
  const pkg = parsed.package || parsed['opf:package'];
  const metadata = pkg?.metadata;

  if (!metadata) throw new Error('No metadata in content.opf');

  // Title
  const titleNode = metadata['dc:title'];
  let title = '';
  let subtitle: string | null = null;
  if (Array.isArray(titleNode)) {
    title = typeof titleNode[0] === 'object' ? titleNode[0]['#text'] : titleNode[0];
    if (titleNode.length > 1) {
      subtitle = typeof titleNode[1] === 'object' ? titleNode[1]['#text'] : titleNode[1];
    }
  } else if (typeof titleNode === 'object') {
    title = titleNode['#text'] || '';
  } else {
    title = titleNode || '';
  }

  // Author
  const creatorNode = metadata['dc:creator'];
  let author = '';
  if (Array.isArray(creatorNode)) {
    author = typeof creatorNode[0] === 'object' ? creatorNode[0]['#text'] : creatorNode[0];
  } else if (typeof creatorNode === 'object') {
    author = creatorNode['#text'] || '';
  } else {
    author = creatorNode || '';
  }

  // Description
  const description = metadata['dc:description'] || null;

  // Language
  const language = metadata['dc:language'] || 'en';

  // Date → year
  const dateStr = metadata['dc:date'] || '';
  const year = dateStr ? parseInt(dateStr.toString().substring(0, 4), 10) || null : null;

  // Subjects
  const subjectNodes = ensureArray(metadata['dc:subject']);
  const subjects = subjectNodes.map((s: any) => (typeof s === 'object' ? s['#text'] : s)).filter(Boolean);

  // Meta properties
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
    // Birth/death are sometimes in different meta formats
    if (prop.includes('birth') || prop.includes('born')) {
      authorBirthYear = parseInt(val, 10) || null;
    }
    if (prop.includes('death') || prop.includes('died')) {
      authorDeathYear = parseInt(val, 10) || null;
    }
  }

  // Source
  const dcSource = metadata['dc:source'];
  if (!sourceEdition && dcSource) {
    sourceEdition = Array.isArray(dcSource) ? dcSource[0] : dcSource;
    if (typeof sourceEdition === 'object') sourceEdition = (sourceEdition as any)['#text'] || null;
  }

  // Spine order
  const spine = pkg?.spine;
  const spineItems: string[] = [];
  if (spine?.itemref) {
    for (const ref of ensureArray(spine.itemref)) {
      const idref = typeof ref === 'object' ? ref['@_idref'] : ref;
      if (idref) spineItems.push(idref);
    }
  }

  // Manifest items → map id to href
  const manifest = pkg?.manifest;
  const itemMap = new Map<string, string>();
  if (manifest?.item) {
    for (const item of ensureArray(manifest.item)) {
      if (item && typeof item === 'object' && item['@_id'] && item['@_href']) {
        itemMap.set(item['@_id'], item['@_href']);
      }
    }
  }

  // Build ordered list of text file hrefs from spine
  const spineHrefs = spineItems
    .map((id) => itemMap.get(id))
    .filter((href): href is string => !!href && href.startsWith('text/'));

  const seUrl = `https://standardebooks.org/ebooks/${seSlug.replace(/_/g, '/')}`;

  return {
    title,
    subtitle,
    author,
    authorBirthYear,
    authorDeathYear,
    description: typeof description === 'object' ? (description as any)['#text'] : description,
    longDescription,
    language,
    year,
    subjects,
    sourceEdition,
    seWordCount,
    seUrl,
    spineHrefs,
  };
}

// ─── TOC Parsing ─────────────────────────────────────────────────────────────

function parseTocXhtml(tocXml: string): TocEntry[] {
  // Use regex-based parsing for TOC since the nested structure is tricky with fast-xml-parser
  const entries: TocEntry[] = [];

  function walkOl(html: string, depth: number) {
    // Match <li> elements, handling nested <ol>
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/g;
    let match;
    while ((match = liRegex.exec(html)) !== null) {
      const liContent = match[1];

      // Extract <a href="...">Title</a>
      const aMatch = liContent.match(/<a\s+[^>]*href\s*=\s*"([^"]*)"[^>]*>([\s\S]*?)<\/a>/);
      if (aMatch) {
        const href = aMatch[1];
        const title = stripTags(aMatch[2]).trim();
        if (href && title) {
          entries.push({ href, title, depth });
        }
      }

      // Check for nested <ol>
      const nestedOlMatch = liContent.match(/<ol[^>]*>([\s\S]*)<\/ol>/);
      if (nestedOlMatch) {
        walkOl(nestedOlMatch[1], depth + 1);
      }
    }
  }

  // Find the toc <nav>
  const navMatch = tocXml.match(/<nav[^>]*epub:type\s*=\s*"toc"[^>]*>([\s\S]*)<\/nav>/i)
    || tocXml.match(/<nav[^>]*>([\s\S]*)<\/nav>/i);

  if (navMatch) {
    const olMatch = navMatch[1].match(/<ol[^>]*>([\s\S]*)<\/ol>/);
    if (olMatch) {
      walkOl(olMatch[1], 0);
    }
  }

  return entries;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Standard Ebooks Ingestion Pipeline ===\n');

  // Load .env.local
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let supabase: SupabaseClient | null = null;
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized (service role)\n');
  } else {
    console.log('⚠ No SUPABASE_SERVICE_ROLE_KEY found — will write parsed data to JSON only');
    console.log('  Set SUPABASE_SERVICE_ROLE_KEY in .env.local for direct DB writes\n');
  }

  // Ensure tmp dirs
  fs.mkdirSync(TMP_DIR, { recursive: true });
  fs.mkdirSync(path.resolve('.tmp'), { recursive: true });

  const results: IngestResult[] = [];
  const allParsedBooks: ParsedBook[] = [];
  const allParsedChapters: ParsedChapter[] = [];
  const total = BOOKS_TO_INGEST.length;

  for (let i = 0; i < total; i++) {
    const seSlug = BOOKS_TO_INGEST[i];
    const bookId = deriveBookId(seSlug);
    const idx = `[${i + 1}/${total}]`;

    try {
      // 1. Check if repo exists
      const exists = await checkRepoExists(seSlug);
      if (!exists) {
        console.log(`${idx} ${seSlug}... ✗ repo not found`);
        results.push({ slug: seSlug, bookId, status: 'failed', reason: 'repo not found (404)' });
        if (i < total - 1) await sleep(CLONE_DELAY_MS);
        continue;
      }

      // 2. Clone
      const cloneDir = path.join(TMP_DIR, seSlug);
      if (!fs.existsSync(cloneDir)) {
        const git = simpleGit();
        await git.clone(`${SE_GITHUB_BASE}/${seSlug}.git`, cloneDir, ['--depth', '1']);
      }

      // 3. Parse content.opf
      const opfPath = path.join(cloneDir, 'src/epub/content.opf');
      if (!fs.existsSync(opfPath)) {
        throw new Error('content.opf not found');
      }
      const opfXml = fs.readFileSync(opfPath, 'utf-8');
      const opf = parseOpf(opfXml, seSlug);

      // 4. Parse toc.xhtml
      const tocPath = path.join(cloneDir, 'src/epub/toc.xhtml');
      let tocEntries: TocEntry[] = [];
      if (fs.existsSync(tocPath)) {
        const tocXml = fs.readFileSync(tocPath, 'utf-8');
        tocEntries = parseTocXhtml(tocXml);
      }

      // Build a map of href → toc entry for title/depth lookup
      const tocMap = new Map<string, TocEntry>();
      for (const entry of tocEntries) {
        // Normalize href: remove leading ../ and text/ prefix
        const normalized = entry.href.replace(/^\.\.\//, '').replace(/^text\//, '');
        tocMap.set(normalized, entry);
      }

      // 5. Read chapter files in spine order
      const textDir = path.join(cloneDir, 'src/epub/text');
      const chapters: ParsedChapter[] = [];
      let totalWordCount = 0;
      let chapterIdx = 0;

      for (const href of opf.spineHrefs) {
        const filename = href.replace(/^text\//, '');
        const filePath = path.join(textDir, filename);

        if (!fs.existsSync(filePath)) continue;

        const xhtml = fs.readFileSync(filePath, 'utf-8');
        const bodyContent = extractBodyContent(xhtml);

        if (!bodyContent || bodyContent.length < 10) continue;

        const words = countWords(stripTags(bodyContent));
        totalWordCount += words;

        // Lookup TOC entry for title and depth
        const tocEntry = tocMap.get(filename) || tocMap.get(href);
        const chapterTitle = tocEntry?.title || filename.replace(/\.xhtml$/, '').replace(/-/g, ' ');
        const tocDepth = tocEntry?.depth ?? 0;

        chapterIdx++;
        chapters.push({
          id: `${bookId}/ch-${chapterIdx}`,
          book_id: bookId,
          chapter_index: chapterIdx,
          title: chapterTitle,
          toc_depth: tocDepth,
          content_html: bodyContent,
          word_count: words,
          estimated_minutes: Math.ceil(words / 250),
        });
      }

      if (chapters.length === 0) {
        throw new Error('No chapters extracted');
      }

      // Use SE word count if available, otherwise sum chapters
      const finalWordCount = opf.seWordCount || totalWordCount;

      const book: ParsedBook = {
        id: bookId,
        se_slug: seSlug,
        title: opf.title,
        subtitle: opf.subtitle,
        author: opf.author,
        author_birth_year: opf.authorBirthYear,
        author_death_year: opf.authorDeathYear,
        synopsis: opf.description,
        long_description: opf.longDescription,
        language: opf.language,
        year: opf.year,
        subjects: opf.subjects,
        word_count: finalWordCount,
        reading_time_minutes: Math.ceil(finalWordCount / 250),
        chapter_count: chapters.length,
        standard_ebooks_url: opf.seUrl,
        source_edition: opf.sourceEdition,
        source: 'standard-ebooks',
        ingestion_status: 'success',
      };

      // 6. Write to Supabase if available
      if (supabase) {
        // Delete existing chapters for this book (avoid ID conflicts)
        await supabase.from('chapters').delete().eq('book_id', bookId);

        // Upsert book
        const { error: bookErr } = await supabase.from('books').upsert(book, { onConflict: 'id' });
        if (bookErr) throw new Error(`Book upsert failed: ${bookErr.message}`);

        // Insert chapters in batches of 50
        for (let j = 0; j < chapters.length; j += 50) {
          const batch = chapters.slice(j, j + 50);
          const { error: chErr } = await supabase.from('chapters').upsert(batch, { onConflict: 'id' });
          if (chErr) throw new Error(`Chapter upsert failed at batch ${j}: ${chErr.message}`);
        }
      }

      allParsedBooks.push(book);
      allParsedChapters.push(...chapters);

      const wordStr = finalWordCount.toLocaleString();
      console.log(`${idx} ${seSlug}... ✓ ${chapters.length} chapters, ${wordStr} words`);
      results.push({
        slug: seSlug,
        bookId,
        status: 'success',
        chapterCount: chapters.length,
        wordCount: finalWordCount,
      });
    } catch (err: any) {
      const reason = err?.message || String(err);
      console.log(`${idx} ${seSlug}... ✗ ${reason}`);
      results.push({ slug: seSlug, bookId, status: 'failed', reason });
    }

    // Delay between clones
    if (i < total - 1) await sleep(CLONE_DELAY_MS);
  }

  // ─── Report ──────────────────────────────────────────────────────────────

  const succeeded = results.filter((r) => r.status === 'success');
  const failed = results.filter((r) => r.status === 'failed');

  const report = {
    timestamp: new Date().toISOString(),
    totalBooks: total,
    totalChapters: succeeded.reduce((a, r) => a + (r.chapterCount || 0), 0),
    totalWords: succeeded.reduce((a, r) => a + (r.wordCount || 0), 0),
    succeeded: succeeded.map((r) => ({ slug: r.slug, bookId: r.bookId, chapters: r.chapterCount, words: r.wordCount })),
    failed: failed.map((r) => ({ slug: r.slug, bookId: r.bookId, reason: r.reason })),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${REPORT_PATH}`);

  // Write parsed data as fallback for MCP-driven insertion
  if (!supabase) {
    fs.writeFileSync(
      PARSED_DATA_PATH,
      JSON.stringify({ books: allParsedBooks, chapters: allParsedChapters }, null, 2)
    );
    console.log(`Parsed data written to ${PARSED_DATA_PATH}`);
  }

  console.log(`\n=== Ingestion Summary ===`);
  console.log(`Success: ${succeeded.length}/${total}`);
  console.log(`Failed:  ${failed.length}/${total}`);
  console.log(`Total chapters: ${report.totalChapters.toLocaleString()}`);
  console.log(`Total words:    ${report.totalWords.toLocaleString()}`);
  if (failed.length > 0) {
    console.log(`\nFailed books:`);
    for (const f of failed) {
      console.log(`  - ${f.slug}: ${f.reason}`);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
