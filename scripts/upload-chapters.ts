#!/usr/bin/env npx tsx
/**
 * Upload chapter data to Supabase using the Management API.
 * This bypasses RLS by using the Management API endpoint.
 *
 * Usage: SUPABASE_ACCESS_TOKEN=sbp_xxx npx tsx scripts/upload-chapters.ts
 *
 * To get your access token:
 *   1. Go to https://supabase.com/dashboard/account/tokens
 *   2. Generate a new token
 *   3. Pass it as SUPABASE_ACCESS_TOKEN env var
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ID = 'vjaezrcuuzmbmnsfrtwt';
const SQL_DIR = path.resolve('.tmp/sql2');

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

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
if (!ACCESS_TOKEN) {
  console.error('ERROR: Set SUPABASE_ACCESS_TOKEN env var.');
  console.error('Get one at: https://supabase.com/dashboard/account/tokens');
  process.exit(1);
}

async function executeSql(sql: string): Promise<any> {
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
    throw new Error(`${resp.status}: ${text.substring(0, 300)}`);
  }
  return resp.json();
}

async function main() {
  console.log('=== Uploading to Supabase via Management API ===\n');

  const files = fs.readdirSync(SQL_DIR).sort();
  const bookFiles = files.filter(f => f.endsWith('-book.sql'));
  const chapterFiles = files.filter(f => f.includes('-ch-'));

  console.log(`Books: ${bookFiles.length}, Chapter batches: ${chapterFiles.length}\n`);

  // Insert all books first
  let booksOk = 0, booksFail = 0;
  for (const file of bookFiles) {
    const sql = fs.readFileSync(path.join(SQL_DIR, file), 'utf-8');
    try {
      await executeSql(sql);
      booksOk++;
    } catch (err: any) {
      booksFail++;
      console.error(`  FAIL book ${file}: ${err.message.substring(0, 100)}`);
    }
  }
  console.log(`Books: ${booksOk} ok, ${booksFail} failed\n`);

  // Insert chapters
  let chOk = 0, chFail = 0;
  for (let i = 0; i < chapterFiles.length; i++) {
    const file = chapterFiles[i];
    const sql = fs.readFileSync(path.join(SQL_DIR, file), 'utf-8');

    try {
      // Try the full batch first
      await executeSql(sql);
      chOk++;
    } catch (err: any) {
      // If batch fails, try individual statements
      const stmts = sql.split(';\n').filter(s => s.trim());
      let stmtOk = 0;
      for (const stmt of stmts) {
        try {
          await executeSql(stmt + ';');
          stmtOk++;
        } catch (innerErr: any) {
          console.error(`  FAIL ${file} stmt: ${innerErr.message.substring(0, 100)}`);
        }
      }
      if (stmtOk === stmts.length) chOk++;
      else chFail++;
    }

    if ((i + 1) % 50 === 0) {
      console.log(`  Progress: ${i + 1}/${chapterFiles.length} batches`);
    }
  }

  console.log(`\nChapter batches: ${chOk} ok, ${chFail} failed`);

  // Verify
  try {
    const result = await executeSql(
      "SELECT count(*) as n FROM chapters WHERE content_html IS NOT NULL AND book_id IN (SELECT id FROM books WHERE se_slug IS NOT NULL)"
    );
    console.log(`\nVerification: ${JSON.stringify(result)}`);
  } catch {}

  console.log('\nDone!');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
