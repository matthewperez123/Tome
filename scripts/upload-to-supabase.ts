#!/usr/bin/env npx tsx
/**
 * Upload parsed book/chapter data to Supabase via REST API.
 * RLS must be disabled on books/chapters tables before running.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq > 0) {
      const k = trimmed.substring(0, eq).trim();
      const v = trimmed.substring(eq + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or key in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

// Metadata for required NOT NULL columns
const bookMeta: Record<string, { tradition: string; era: string; difficulty: string; author_id: string }> = {
  'the-iliad': { tradition: 'Ancient Greek', era: 'Ancient', difficulty: 'Advanced', author_id: 'homer' },
  'the-odyssey': { tradition: 'Ancient Greek', era: 'Ancient', difficulty: 'Advanced', author_id: 'homer' },
  'the-aeneid': { tradition: 'Roman', era: 'Ancient', difficulty: 'Advanced', author_id: 'virgil' },
  'meditations': { tradition: 'Roman', era: 'Ancient', difficulty: 'Intermediate', author_id: 'marcus-aurelius' },
  'the-republic': { tradition: 'Ancient Greek', era: 'Ancient', difficulty: 'Scholar', author_id: 'plato' },
  'the-art-of-war': { tradition: 'Eastern', era: 'Ancient', difficulty: 'Beginner', author_id: 'sun-tzu' },
  'the-divine-comedy': { tradition: 'Medieval European', era: 'Medieval', difficulty: 'Scholar', author_id: 'dante-alighieri' },
  'don-quixote': { tradition: 'Renaissance', era: 'Renaissance', difficulty: 'Advanced', author_id: 'miguel-de-cervantes' },
  'hamlet': { tradition: 'Renaissance', era: 'Renaissance', difficulty: 'Intermediate', author_id: 'william-shakespeare' },
  'romeo-and-juliet': { tradition: 'Renaissance', era: 'Renaissance', difficulty: 'Intermediate', author_id: 'william-shakespeare' },
  'macbeth': { tradition: 'Renaissance', era: 'Renaissance', difficulty: 'Intermediate', author_id: 'william-shakespeare' },
  'paradise-lost': { tradition: 'Renaissance', era: 'Renaissance', difficulty: 'Scholar', author_id: 'john-milton' },
  'gullivers-travels': { tradition: 'Enlightenment', era: 'Enlightenment', difficulty: 'Intermediate', author_id: 'jonathan-swift' },
  'robinson-crusoe': { tradition: 'Enlightenment', era: 'Enlightenment', difficulty: 'Intermediate', author_id: 'daniel-defoe' },
  'candide': { tradition: 'Enlightenment', era: 'Enlightenment', difficulty: 'Intermediate', author_id: 'voltaire' },
  'pride-and-prejudice': { tradition: 'Romantic', era: 'Enlightenment', difficulty: 'Beginner', author_id: 'jane-austen' },
  'sense-and-sensibility': { tradition: 'Romantic', era: 'Enlightenment', difficulty: 'Beginner', author_id: 'jane-austen' },
  'emma': { tradition: 'Romantic', era: 'Enlightenment', difficulty: 'Beginner', author_id: 'jane-austen' },
  'frankenstein': { tradition: 'Romantic', era: 'Enlightenment', difficulty: 'Intermediate', author_id: 'mary-shelley' },
  'a-tale-of-two-cities': { tradition: 'Victorian', era: 'Modern', difficulty: 'Intermediate', author_id: 'charles-dickens' },
  'great-expectations': { tradition: 'Victorian', era: 'Modern', difficulty: 'Intermediate', author_id: 'charles-dickens' },
  'oliver-twist': { tradition: 'Victorian', era: 'Modern', difficulty: 'Intermediate', author_id: 'charles-dickens' },
  'jane-eyre': { tradition: 'Victorian', era: 'Modern', difficulty: 'Intermediate', author_id: 'charlotte-bronte' },
  'wuthering-heights': { tradition: 'Victorian', era: 'Modern', difficulty: 'Intermediate', author_id: 'emily-bronte' },
  'the-scarlet-letter': { tradition: 'American', era: 'Modern', difficulty: 'Advanced', author_id: 'nathaniel-hawthorne' },
  'moby-dick': { tradition: 'American', era: 'Modern', difficulty: 'Advanced', author_id: 'herman-melville' },
  'the-raven-and-other-poems': { tradition: 'American', era: 'Modern', difficulty: 'Intermediate', author_id: 'edgar-allan-poe' },
  'walden': { tradition: 'American', era: 'Modern', difficulty: 'Advanced', author_id: 'henry-david-thoreau' },
  'little-women': { tradition: 'American', era: 'Modern', difficulty: 'Beginner', author_id: 'louisa-may-alcott' },
  'the-adventures-of-huckleberry-finn': { tradition: 'American', era: 'Modern', difficulty: 'Beginner', author_id: 'mark-twain' },
  'the-adventures-of-tom-sawyer': { tradition: 'American', era: 'Modern', difficulty: 'Beginner', author_id: 'mark-twain' },
  'crime-and-punishment': { tradition: 'Russian', era: 'Modern', difficulty: 'Advanced', author_id: 'fyodor-dostoevsky' },
  'the-brothers-karamazov': { tradition: 'Russian', era: 'Modern', difficulty: 'Scholar', author_id: 'fyodor-dostoevsky' },
  'war-and-peace': { tradition: 'Russian', era: 'Modern', difficulty: 'Scholar', author_id: 'leo-tolstoy' },
  'anna-karenina': { tradition: 'Russian', era: 'Modern', difficulty: 'Advanced', author_id: 'leo-tolstoy' },
  'les-miserables': { tradition: 'French', era: 'Modern', difficulty: 'Advanced', author_id: 'victor-hugo' },
  'madame-bovary': { tradition: 'French', era: 'Modern', difficulty: 'Advanced', author_id: 'gustave-flaubert' },
  'alices-adventures-in-wonderland': { tradition: 'Victorian', era: 'Modern', difficulty: 'Beginner', author_id: 'lewis-carroll' },
  'dracula': { tradition: 'Victorian', era: 'Modern', difficulty: 'Intermediate', author_id: 'bram-stoker' },
  'the-strange-case-of-dr-jekyll-and-mr-hyde': { tradition: 'Victorian', era: 'Modern', difficulty: 'Intermediate', author_id: 'robert-louis-stevenson' },
  'treasure-island': { tradition: 'Victorian', era: 'Modern', difficulty: 'Beginner', author_id: 'robert-louis-stevenson' },
  'the-adventures-of-sherlock-holmes': { tradition: 'Victorian', era: 'Modern', difficulty: 'Beginner', author_id: 'arthur-conan-doyle' },
  'the-time-machine': { tradition: 'Speculative', era: 'Modern', difficulty: 'Intermediate', author_id: 'h-g-wells' },
  'the-war-of-the-worlds': { tradition: 'Speculative', era: 'Modern', difficulty: 'Intermediate', author_id: 'h-g-wells' },
  'the-picture-of-dorian-gray': { tradition: 'Victorian', era: 'Modern', difficulty: 'Intermediate', author_id: 'oscar-wilde' },
  'heart-of-darkness': { tradition: 'Modernist', era: 'Modern', difficulty: 'Advanced', author_id: 'joseph-conrad' },
  'the-awakening': { tradition: 'American', era: 'Modern', difficulty: 'Intermediate', author_id: 'kate-chopin' },
  'the-turn-of-the-screw': { tradition: 'Victorian', era: 'Modern', difficulty: 'Advanced', author_id: 'henry-james' },
  'the-great-gatsby': { tradition: 'Modernist', era: 'Modern', difficulty: 'Intermediate', author_id: 'f-scott-fitzgerald' },
  'a-portrait-of-the-artist-as-a-young-man': { tradition: 'Modernist', era: 'Modern', difficulty: 'Advanced', author_id: 'james-joyce' },
};

async function main() {
  console.log('=== Uploading to Supabase ===\n');

  const mainData = JSON.parse(fs.readFileSync('.tmp/parsed-data.json', 'utf-8'));
  const recoveryData = fs.existsSync('.tmp/recovery-data.json')
    ? JSON.parse(fs.readFileSync('.tmp/recovery-data.json', 'utf-8'))
    : { books: [], chapters: [] };

  const allBooks = [...mainData.books, ...recoveryData.books];
  const allChapters = [...mainData.chapters, ...recoveryData.chapters];

  console.log(`Books: ${allBooks.length}, Chapters: ${allChapters.length}\n`);

  // Upsert all books
  const bookRows = allBooks.map(b => {
    const meta = bookMeta[b.id] || { tradition: 'World Literature', era: 'Modern', difficulty: 'Intermediate', author_id: b.id };
    return {
      id: b.id,
      slug: b.id,
      se_slug: b.se_slug,
      title: b.title,
      subtitle: b.subtitle || null,
      author: b.author,
      author_id: meta.author_id,
      tradition: meta.tradition,
      era: meta.era,
      difficulty: meta.difficulty,
      author_birth_year: b.author_birth_year,
      author_death_year: b.author_death_year,
      synopsis: b.synopsis || null,
      long_description: b.long_description || null,
      language: b.language,
      year: b.year,
      subjects: b.subjects || [],
      word_count: b.word_count || 0,
      reading_time_minutes: b.reading_time_minutes || 0,
      chapter_count: b.chapter_count || 0,
      standard_ebooks_url: b.standard_ebooks_url || null,
      source_edition: b.source_edition || null,
      source: 'standard-ebooks',
      ingestion_status: 'success',
      updated_at: new Date().toISOString(),
    };
  });

  const { error: bookErr } = await supabase.from('books').upsert(bookRows, { onConflict: 'id' });
  if (bookErr) {
    console.error('Book upsert error:', bookErr.message);
    process.exit(1);
  }
  console.log(`✓ Upserted ${bookRows.length} books\n`);

  // Group chapters by book
  const byBook: Record<string, any[]> = {};
  for (const ch of allChapters) {
    if (!byBook[ch.book_id]) byBook[ch.book_id] = [];
    byBook[ch.book_id].push(ch);
  }

  // Process each book's chapters
  let totalInserted = 0;
  let failures = 0;

  for (const bookId of Object.keys(byBook).sort()) {
    const chapters = byBook[bookId];

    // Delete existing chapters
    await supabase.from('chapters').delete().eq('book_id', bookId);

    // Insert in batches of 10
    let bookOk = true;
    for (let i = 0; i < chapters.length; i += 10) {
      const batch = chapters.slice(i, i + 10).map(ch => ({
        id: ch.id,
        book_id: ch.book_id,
        chapter_index: ch.chapter_index,
        title: ch.title,
        toc_depth: ch.toc_depth || 0,
        content_html: ch.content_html,
        word_count: ch.word_count || 0,
        estimated_minutes: ch.estimated_minutes || 0,
      }));

      const { error } = await supabase.from('chapters').insert(batch);
      if (error) {
        console.error(`  ✗ ${bookId} batch ${i}: ${error.message.substring(0, 80)}`);
        // Try individual inserts for this batch
        for (const ch of batch) {
          const { error: singleErr } = await supabase.from('chapters').insert(ch);
          if (singleErr) {
            console.error(`    ✗ ${ch.id}: ${singleErr.message.substring(0, 60)}`);
            bookOk = false;
          } else {
            totalInserted++;
          }
        }
      } else {
        totalInserted += batch.length;
      }
    }

    if (bookOk) {
      process.stdout.write(`  ${bookId}: ${chapters.length} ch  `);
      if (totalInserted % 200 < chapters.length) process.stdout.write('\n');
    } else {
      failures++;
    }
  }

  console.log(`\n\n✓ Inserted ${totalInserted} chapters (${failures} books had issues)`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
