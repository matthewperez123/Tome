/**
 * Insert books into Supabase using the REST API.
 * Reads /tmp/bulk-books.json and inserts in batches.
 *
 * Usage: npx tsx scripts/insert-books.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY with insert policies)
 */

import * as fs from "fs"
import * as path from "path"
import { config } from "dotenv"

// Load .env.local
config({ path: path.resolve(__dirname, "../.env.local") })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or key")
  process.exit(1)
}

async function main() {
  const books: any[] = JSON.parse(fs.readFileSync("/tmp/bulk-books.json", "utf-8"))
  console.log(`Loaded ${books.length} books to insert`)

  // First check existing IDs
  const existingRes = await fetch(`${SUPABASE_URL}/rest/v1/books?select=id`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  })
  const existing = await existingRes.json()
  const existingIds = new Set(existing.map((r: any) => r.id))
  console.log(`${existingIds.size} books already in DB`)

  const toInsert = books.filter(b => !existingIds.has(b.id))
  console.log(`${toInsert.length} new books to insert`)

  // Insert in batches of 50
  const BATCH = 50
  let inserted = 0
  let failed = 0

  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH).map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      author_id: b.author_id,
      year: b.year,
      language: b.language,
      tradition: b.tradition,
      era: b.era,
      genres: b.genres,
      difficulty: b.difficulty,
      chapter_count: b.chapter_count,
      word_count: b.word_count,
      reading_time_minutes: b.reading_time_minutes,
      estimated_reading_time: b.estimated_reading_time,
      synopsis: b.synopsis,
      themes: b.themes,
      country: b.country,
      cover_colors: b.cover_colors,
      featured: b.featured,
      standard_ebooks_url: b.standard_ebooks_url,
      cover_image_path: b.cover_image_path,
      source: b.source,
      ingestion_status: b.ingestion_status,
    }))

    const res = await fetch(`${SUPABASE_URL}/rest/v1/books`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal,resolution=ignore-duplicates",
      },
      body: JSON.stringify(batch),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`Batch ${Math.floor(i / BATCH) + 1} failed: ${res.status} ${text.slice(0, 200)}`)
      failed += batch.length
    } else {
      inserted += batch.length
      console.log(`  Inserted batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(toInsert.length / BATCH)} (${inserted} total)`)
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Failed: ${failed}`)

  // Verify total
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/books?select=id`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "count=exact",
      "Range-Unit": "items",
      Range: "0-0",
    },
  })
  const range = countRes.headers.get("content-range")
  console.log(`Total books in DB: ${range}`)
}

main().catch(console.error)
