/**
 * Tome — Single-Book EPUB Download & Parse Script
 *
 * This script handles the mechanical parts of book ingestion:
 * 1. Selects the next book from the priority queue (reads from stdin which book)
 * 2. Downloads the EPUB from Standard Ebooks (Gutenberg fallback)
 * 3. Parses the EPUB into individual chapter HTML files
 * 4. Saves chapters to /tmp/tome-ingest/{slug}/chapters/
 *
 * DB operations are done separately via Supabase MCP tools.
 *
 * Usage: npx tsx scripts/ingest-book.ts "Pride and Prejudice"
 *        npx tsx scripts/ingest-book.ts --slug "pride-and-prejudice"
 */

import AdmZip from 'adm-zip';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { PRIORITY_BOOKS, type PriorityBook } from './priority-books';

// --- Utilities ---

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function countWords(text: string): number {
  return text.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
}

// --- EPUB Download ---

async function downloadEpub(book: PriorityBook, outPath: string): Promise<boolean> {
  // Try Standard Ebooks first
  if (book.standardEbooksSlug) {
    const seSlug = book.standardEbooksSlug;
    // Standard Ebooks URL pattern: the filename uses underscores for path separators
    const filename = seSlug.replace(/\//g, '_');
    // Standard Ebooks requires ?source=download to serve the actual EPUB (otherwise returns HTML interstitial)
    const url = `https://standardebooks.org/ebooks/${seSlug}/downloads/${filename}.epub?source=download`;

    console.log(`  Trying Standard Ebooks: ${url}`);
    try {
      execSync(`curl -f -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" -o "${outPath}" "${url}" 2>/dev/null`, { timeout: 60000 });
      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
        // Verify it's actually a zip file (EPUB), not an HTML error page
        const header = Buffer.alloc(4);
        const fd = fs.openSync(outPath, 'r');
        fs.readSync(fd, header, 0, 4, 0);
        fs.closeSync(fd);
        if (header[0] === 0x50 && header[1] === 0x4B) { // PK zip magic bytes
          console.log(`  ✓ Downloaded from Standard Ebooks (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
          return true;
        } else {
          console.log(`  ✗ Standard Ebooks returned non-EPUB content`);
          fs.unlinkSync(outPath);
        }
      }
    } catch {
      console.log(`  ✗ Standard Ebooks download failed`);
    }
  }

  // Fallback to Gutenberg
  if (book.gutenbergId) {
    const gutUrl = `https://www.gutenberg.org/cache/epub/${book.gutenbergId}/pg${book.gutenbergId}-images.epub`;
    console.log(`  Trying Gutenberg: ${gutUrl}`);
    try {
      execSync(`curl -f -L -A "Mozilla/5.0 (Macintosh)" -o "${outPath}" "${gutUrl}" 2>/dev/null`, { timeout: 30000 });
      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
        console.log(`  ✓ Downloaded from Gutenberg (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
        return true;
      }
    } catch {
      // Try alternate Gutenberg URL without -images
      const gutUrl2 = `https://www.gutenberg.org/cache/epub/${book.gutenbergId}/pg${book.gutenbergId}.epub`;
      console.log(`  Trying Gutenberg (alt): ${gutUrl2}`);
      try {
        execSync(`curl -f -L -A "Mozilla/5.0 (Macintosh)" -o "${outPath}" "${gutUrl2}" 2>/dev/null`, { timeout: 30000 });
        if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
          console.log(`  ✓ Downloaded from Gutenberg alt (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
          return true;
        }
      } catch {
        console.log(`  ✗ Gutenberg download also failed`);
      }
    }
  }

  return false;
}

// --- EPUB Parsing ---

interface ParsedChapter {
  chapter_number: number;
  title: string;
  content: string; // HTML string
  word_count: number;
}

function parseEpub(epubPath: string, filterFilePattern?: string): ParsedChapter[] {
  const zip = new AdmZip(epubPath);
  const entries = zip.getEntries();

  // Find container.xml to get OPF path
  const containerEntry = entries.find(e => e.entryName === 'META-INF/container.xml');
  if (!containerEntry) {
    throw new Error('No META-INF/container.xml found in EPUB');
  }

  const container$ = cheerio.load(containerEntry.getData().toString('utf-8'), { xml: true });
  const opfPath = container$('rootfile').attr('full-path');
  if (!opfPath) {
    throw new Error('No OPF path found in container.xml');
  }

  // Parse OPF to get spine order
  const opfEntry = entries.find(e => e.entryName === opfPath);
  if (!opfEntry) {
    throw new Error(`OPF file not found: ${opfPath}`);
  }

  const opfDir = path.dirname(opfPath);
  const opf$ = cheerio.load(opfEntry.getData().toString('utf-8'), { xml: true });

  // Build manifest map: id -> href
  const manifest: Record<string, string> = {};
  opf$('manifest item').each((_, el) => {
    const id = opf$(el).attr('id');
    const href = opf$(el).attr('href');
    const mediaType = opf$(el).attr('media-type');
    if (id && href && mediaType?.includes('html')) {
      manifest[id] = href;
    }
  });

  // Get spine order
  const spineIds: string[] = [];
  opf$('spine itemref').each((_, el) => {
    const idref = opf$(el).attr('idref');
    if (idref && manifest[idref]) {
      spineIds.push(idref);
    }
  });

  console.log(`  Found ${spineIds.length} spine entries`);

  // Parse each spine file, splitting multi-chapter files (Standard Ebooks style)
  const chapters: ParsedChapter[] = [];
  let chapterNum = 0;

  for (const id of spineIds) {
    const href = manifest[id];
    const fullPath = opfDir === '.' ? href : `${opfDir}/${href}`;

    // If a file filter is set (e.g., "inferno" for Divine Comedy), skip non-matching files
    if (filterFilePattern) {
      const basename = path.basename(href, '.xhtml');
      if (!new RegExp(filterFilePattern, 'i').test(basename)) continue;
    }

    const entry = entries.find(e => e.entryName === fullPath);
    if (!entry) continue;

    const html = entry.getData().toString('utf-8');
    const $ = cheerio.load(html, { xml: true });

    // Skip non-content files
    const epubType = $('body').attr('epub:type') || '';
    const filename = path.basename(href, '.xhtml');
    if (/endnote|colophon|imprint|titlepage|uncopyright|halftitle|toc/i.test(filename)) continue;
    if (/backmatter|endnotes/i.test(epubType)) continue;

    // Check for Standard Ebooks multi-chapter structure:
    // Files like inferno.xhtml contain many <section epub:type="chapter"> children
    const chapterSections = $('section[epub\\:type*="chapter"], section[role="doc-chapter"]');

    if (chapterSections.length > 1) {
      // Multi-chapter file (Standard Ebooks): split into individual chapters
      console.log(`  Splitting ${filename}.xhtml into ${chapterSections.length} chapters`);
      chapterSections.each((_, section) => {
        const sec$ = cheerio.load($.html(section), { xml: true });

        // Extract title from h3 (Standard Ebooks uses <h3><span>Canto</span><span>I</span></h3>)
        const labelSpan = sec$('h3 span[epub\\:type="label"]').text().trim();
        const ordinalSpan = sec$('h3 span[epub\\:type="ordinal"]').text().trim();
        const bridgehead = sec$('[epub\\:type="bridgehead"]').text().trim();

        let title: string;
        if (labelSpan && ordinalSpan) {
          title = `${labelSpan} ${ordinalSpan}`;
          if (bridgehead) title += ` — ${bridgehead}`;
        } else {
          title = sec$('h3').first().text().trim()
            || sec$('h2').first().text().trim()
            || `Chapter ${chapterNum + 1}`;
        }
        title = title.replace(/\s+/g, ' ').trim();
        if (title.length > 200) title = title.substring(0, 200) + '...';

        const content = sec$('body').html() || sec$.html();
        const cleanContent = content.replace(/\s+/g, ' ').replace(/<(br|hr)\s*\/?>/gi, '<br/>').trim();
        const wordCount = countWords(cleanContent);

        if (wordCount >= 20) {
          chapterNum++;
          chapters.push({ chapter_number: chapterNum, title, content: cleanContent, word_count: wordCount });
        }
      });
    } else {
      // Single-chapter file (Gutenberg style): treat the whole file as one chapter
      // Remove nav, toc, etc.
      $('nav').remove();

      // Check for preface/epigraph sections and handle them
      const preface = $('section[epub\\:type*="preface"]');
      if (preface.length > 0 && chapterSections.length === 0) {
        // It's a preface/intro, include it as a chapter
        const content = preface.html() || '';
        const title = preface.find('h2, h3').first().text().trim() || 'Preface';
        const cleanContent = content.replace(/\s+/g, ' ').replace(/<(br|hr)\s*\/?>/gi, '<br/>').trim();
        const wordCount = countWords(cleanContent);
        if (wordCount >= 20) {
          chapterNum++;
          chapters.push({ chapter_number: chapterNum, title: title.replace(/\s+/g, ' ').trim(), content: cleanContent, word_count: wordCount });
        }
        continue;
      }

      const body = $('body').html() || $('section').html() || $.html();
      if (!body || body.trim().length < 50) continue;

      let title = $('h1').first().text().trim()
        || $('h2').first().text().trim()
        || $('title').text().trim()
        || `Chapter ${chapterNum + 1}`;
      title = title.replace(/\s+/g, ' ').trim();
      if (title.length > 200) title = title.substring(0, 200) + '...';

      // Skip license/legal text
      if (/gutenberg|license|project gutenberg/i.test(title)) continue;

      const cleanContent = body.replace(/\s+/g, ' ').replace(/<(br|hr)\s*\/?>/gi, '<br/>').trim();
      const wordCount = countWords(cleanContent);
      if (wordCount < 20) continue;

      chapterNum++;
      chapters.push({ chapter_number: chapterNum, title, content: cleanContent, word_count: wordCount });
    }
  }

  return chapters;
}

// --- Main ---

async function main() {
  const bookTitle = process.argv[2];
  if (!bookTitle) {
    console.log('Usage: npx tsx scripts/ingest-book.ts "Book Title"');
    console.log('\nPriority queue:');
    for (const pb of PRIORITY_BOOKS) {
      console.log(`  #${pb.order} ${pb.title} — ${pb.author}`);
    }
    process.exit(1);
  }

  // Find the book in the priority queue
  const book = PRIORITY_BOOKS.find(
    pb => pb.title.toLowerCase() === bookTitle.toLowerCase()
      || slugify(pb.title) === slugify(bookTitle)
  );

  if (!book) {
    console.error(`❌ Book "${bookTitle}" not found in priority queue`);
    process.exit(1);
  }

  const slug = slugify(book.title);
  const workDir = `/tmp/tome-ingest/${slug}`;
  const chaptersDir = `${workDir}/chapters`;
  const epubPath = `${workDir}/book.epub`;

  console.log(`\n📖 Processing: ${book.title} by ${book.author} (rank #${book.order})`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Tradition: ${book.tradition} | Era: ${book.era} | Difficulty: ${book.difficulty}`);
  console.log(`   Genres: ${book.genres.join(', ')}`);
  console.log('');

  // Create working directory
  fs.mkdirSync(chaptersDir, { recursive: true });

  // Step 1: Download EPUB
  console.log('⬇️  Downloading EPUB...');
  const downloaded = await downloadEpub(book, epubPath);
  if (!downloaded) {
    console.error('❌ Failed to download EPUB from any source');
    process.exit(1);
  }

  // Step 2: Parse EPUB
  console.log('\n📄 Parsing EPUB...');
  const chapters = parseEpub(epubPath, book.epubFileFilter);
  console.log(`   Parsed ${chapters.length} chapters`);

  const totalWords = chapters.reduce((sum, c) => sum + c.word_count, 0);
  console.log(`   Total words: ${totalWords.toLocaleString()}`);
  console.log(`   Estimated reading time: ${Math.round(totalWords / 250)} minutes`);

  // Step 3: Save chapters to disk
  console.log('\n💾 Saving chapters...');
  const metadata = {
    title: book.title,
    author: book.author,
    slug,
    tradition: book.tradition,
    era: book.era,
    difficulty: book.difficulty,
    genres: book.genres,
    year: book.year,
    isTier1: book.isTier1,
    painting: book.painting,
    standardEbooksSlug: book.standardEbooksSlug,
    gutenbergId: book.gutenbergId,
    totalWords,
    chapterCount: chapters.length,
    estimatedMinutes: Math.round(totalWords / 250),
  };

  fs.writeFileSync(`${workDir}/metadata.json`, JSON.stringify(metadata, null, 2));

  for (const ch of chapters) {
    const filename = String(ch.chapter_number).padStart(3, '0');
    fs.writeFileSync(`${chaptersDir}/${filename}.html`, ch.content);
    fs.writeFileSync(`${chaptersDir}/${filename}.meta.json`, JSON.stringify({
      chapter_number: ch.chapter_number,
      title: ch.title,
      word_count: ch.word_count,
    }, null, 2));
  }

  // Step 4: Check cover image
  const coverPath = `public/covers/${slug}.webp`;
  const coverExists = fs.existsSync(coverPath);

  // Step 5: Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ EPUB PARSED: ${book.title}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`   Chapters: ${chapters.length}`);
  console.log(`   Words: ${totalWords.toLocaleString()}`);
  console.log(`   Reading time: ~${Math.round(totalWords / 250)} min`);
  console.log(`   Cover: ${coverExists ? '✓ found' : `⚠️ missing — ${coverPath}`}`);
  console.log(`   Files: ${workDir}/`);
  console.log('');
  console.log('Chapter breakdown:');
  for (const ch of chapters) {
    console.log(`   ${String(ch.chapter_number).padStart(3, ' ')}. ${ch.title} (${ch.word_count.toLocaleString()} words)`);
  }

  if (!coverExists) {
    console.log(`\n⚠️  Cover not found: ${coverPath}`);
    console.log(`   Expected: "${book.painting.title}" by ${book.painting.artist} (${book.painting.year})`);
    console.log(`   Source: ${book.painting.source}`);
    console.log(`   → Download the painting manually later.`);
  }

  console.log(`\n📋 Next steps for Claude Code:`);
  console.log(`   1. Write author bio → scripts/ingest-data/${slugify(book.author)}-bio.ts`);
  console.log(`   2. Write book metadata → scripts/ingest-data/${slug}-metadata.ts`);
  console.log(`   3. Insert book + chapters into Supabase via MCP`);
  console.log(`   4. Read each chapter, write 3-5 annotations per chapter`);
  console.log(`   5. Write 3 quizzes (Apprentice/Scholar/Master) with 5 questions each`);
  console.log(`   6. Verify and log\n`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
