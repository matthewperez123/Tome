/**
 * Tome — Calibre Library Ingestion Script
 *
 * Reads My books.csv, parses EPUBs already downloaded in the Calibre library,
 * and writes chapter content to public/content/[bookId]/ch-[n].json
 * and book covers to public/covers/[bookId].jpg
 *
 * Run: npx ts-node --project scripts/tsconfig.json scripts/ingest-calibre.ts
 * Options:
 *   --priority-only   Only process the 8 priority books
 *   --book=<bookId>   Process a single book by ID
 *   --skip-existing   Skip books that already have content files
 */

import * as fs from "fs"
import * as path from "path"
import {
  CalibreRow,
  CONTENT_DIR,
  PRIORITY_BOOK_IDS,
  ensureOutputDirs,
  extractBookId,
  findEpubPath,
  parseCalibreCSV,
  parseEpub,
  writeBookContent,
  writeGeneratedBooksTs,
} from "./ingest-lib"

// ── Main ───────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const priorityOnly = args.includes("--priority-only")
  const skipExisting = args.includes("--skip-existing")
  const singleBook = args.find(a => a.startsWith("--book="))?.split("=")[1]

  ensureOutputDirs()

  // Parse CSV
  console.log("📖 Reading CSV...")
  const seRows = parseCalibreCSV()
  console.log(`Found ${seRows.length} Standard Ebooks entries`)

  // Build priority list: priority 8 first, then the rest
  const priorityRows: CalibreRow[] = []
  const remainingRows: CalibreRow[] = []
  const booksMetadata: Record<string, object> = {}

  for (const row of seRows) {
    const bookId = extractBookId(row.identifiers)
    if (!bookId) continue
    if (singleBook && bookId !== singleBook) continue
    if (PRIORITY_BOOK_IDS.has(bookId)) {
      priorityRows.push(row)
    } else if (!priorityOnly) {
      remainingRows.push(row)
    }
  }

  const rowsToProcess = [...priorityRows, ...remainingRows]
  const total = rowsToProcess.length
  console.log(`Processing ${total} books (${priorityRows.length} priority first)\n`)

  let processed = 0
  let failed = 0
  let skipped = 0
  const errors: string[] = []

  for (let i = 0; i < rowsToProcess.length; i++) {
    const row = rowsToProcess[i]
    const bookId = extractBookId(row.identifiers)
    if (!bookId) continue

    const metaPath = path.join(CONTENT_DIR, bookId, "meta.json")

    // Skip if already processed
    if (skipExisting && fs.existsSync(metaPath)) {
      skipped++
      continue
    }

    const label = `[${String(i + 1).padStart(4)}/${total}]`

    // Find EPUB
    const epubPath = findEpubPath(row.cover)
    if (!epubPath || !fs.existsSync(epubPath)) {
      errors.push(`${bookId}: EPUB not found (cover: ${row.cover})`)
      failed++
      process.stdout.write(`${label} ✗ ${bookId} — EPUB not found\n`)
      continue
    }

    // Parse EPUB
    const parsed = await parseEpub(epubPath)
    if (!parsed || parsed.chapters.length === 0) {
      errors.push(`${bookId}: EPUB parse failed`)
      failed++
      process.stdout.write(`${label} ✗ ${bookId} — parse failed\n`)
      continue
    }

    // Write content files
    const result = writeBookContent(bookId, row, parsed)
    booksMetadata[bookId] = result.metadata

    processed++
    process.stdout.write(
      `${label} ✓ ${bookId} — ${result.chapterCount} chapters, ${result.totalWordCount.toLocaleString()} words\n`
    )
  }

  // Write generated books TypeScript file
  writeGeneratedBooksTs(booksMetadata)

  // Write error log
  if (errors.length > 0) {
    fs.writeFileSync(path.join(__dirname, "ingest-errors.log"), errors.join("\n"), "utf-8")
  }

  // Summary
  console.log(`\n${"─".repeat(50)}`)
  console.log(`✓ Books processed:   ${processed}`)
  console.log(`↩ Skipped (cached):  ${skipped}`)
  console.log(`✗ Failed:            ${failed}`)
  console.log(`  Content written to: public/content/`)
  console.log(`  Covers written to:  public/covers/`)
  console.log(`  Metadata written to: src/data/generated/books-from-calibre.ts`)
  if (errors.length > 0) {
    console.log(`  Error log: scripts/ingest-errors.log`)
  }
}

main().catch(err => {
  console.error("Fatal error:", err)
  process.exit(1)
})
