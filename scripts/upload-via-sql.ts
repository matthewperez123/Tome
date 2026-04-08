#!/usr/bin/env npx tsx
/**
 * Upload parsed book/chapter data to Supabase by executing SQL files
 * via the Supabase Management API (same as MCP execute_sql).
 *
 * Requires SUPABASE_ACCESS_TOKEN env var (your Supabase personal access token)
 * OR falls back to reading SQL files and printing them.
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ID = 'vjaezrcuuzmbmnsfrtwt';
const SQL_DIR = path.resolve('.tmp/sql');

// Try to get access token from env
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

async function executeSql(sql: string): Promise<void> {
  if (!ACCESS_TOKEN) throw new Error('No SUPABASE_ACCESS_TOKEN');

  const resp = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`SQL execution failed: ${resp.status} ${text.substring(0, 200)}`);
  }
}

async function main() {
  console.log('=== Uploading SQL to Supabase ===\n');

  if (!ACCESS_TOKEN) {
    console.log('No SUPABASE_ACCESS_TOKEN set.');
    console.log('SQL files are ready at .tmp/sql/');
    console.log('Set SUPABASE_ACCESS_TOKEN and re-run, or use MCP execute_sql.');
    return;
  }

  const files = fs.readdirSync(SQL_DIR).sort();

  // Process book files first, then chapter files
  const bookFiles = files.filter(f => f.endsWith('-book.sql'));
  const chapterFiles = files.filter(f => f.includes('-ch-'));

  console.log(`Books: ${bookFiles.length}, Chapter batches: ${chapterFiles.length}\n`);

  // Execute book files
  let booksDone = 0;
  for (const file of bookFiles) {
    const sql = fs.readFileSync(path.join(SQL_DIR, file), 'utf-8');
    try {
      await executeSql(sql);
      booksDone++;
      if (booksDone % 10 === 0) console.log(`  Books: ${booksDone}/${bookFiles.length}`);
    } catch (err: any) {
      console.error(`  FAIL ${file}: ${err.message}`);
    }
  }
  console.log(`✓ Books done: ${booksDone}/${bookFiles.length}\n`);

  // Execute chapter files
  let chaptersDone = 0;
  let chaptersFailed = 0;
  for (const file of chapterFiles) {
    const sql = fs.readFileSync(path.join(SQL_DIR, file), 'utf-8');
    try {
      await executeSql(sql);
      chaptersDone++;
      if (chaptersDone % 50 === 0) console.log(`  Chapters: ${chaptersDone}/${chapterFiles.length}`);
    } catch (err: any) {
      chaptersFailed++;
      console.error(`  FAIL ${file}: ${err.message.substring(0, 100)}`);
    }
  }
  console.log(`\n✓ Done: ${chaptersDone}/${chapterFiles.length} chapter batches (${chaptersFailed} failed)`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
