/**
 * Tome — Resumable Batch Calibre Ingestion
 *
 * Wraps the Calibre ingestion pipeline with JSON-based progress tracking.
 * Reads ingestion-progress.json and picks up where it left off.
 *
 * Run: npx ts-node --project scripts/tsconfig.json scripts/ingest-batch.ts
 * Options:
 *   --priority-only    Only process the 8 priority books
 *   --book=<bookId>    Process a single book by ID
 *   --reset            Clear progress and start fresh
 *   --retry-failed     Re-attempt previously failed books
 */

import * as fs from "fs"
import * as path from "path"
import {
  CalibreRow,
  PRIORITY_BOOK_IDS,
  ensureOutputDirs,
  extractBookId,
  findEpubPath,
  parseCalibreCSV,
  parseEpub,
  writeBookContent,
  writeGeneratedBooksTs,
} from "./ingest-lib"

// ── Progress file ──────────────────────────────────────────────────────

const PROGRESS_PATH = path.resolve(__dirname, "../ingestion-progress.json")

interface IngestionProgress {
  startedAt: string
  lastUpdatedAt: string
  totalBooks: number
  completed: string[]
  failed: Record<string, string>
  skipped: string[]
}

function loadProgress(): IngestionProgress | null {
  try {
    if (fs.existsSync(PROGRESS_PATH)) {
      return JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf-8"))
    }
  } catch (e) {
    console.warn("⚠ Could not read progress file, starting fresh")
  }
  return null
}

function saveProgress(progress: IngestionProgress): void {
  progress.lastUpdatedAt = new Date().toISOString()
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2), "utf-8")
}

function createFreshProgress(totalBooks: number): IngestionProgress {
  return {
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    totalBooks,
    completed: [],
    failed: {},
    skipped: [],
  }
}

// ── Main ───────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const priorityOnly = args.includes("--priority-only")
  const resetProgress = args.includes("--reset")
  const retryFailed = args.includes("--retry-failed")
  const singleBook = args.find(a => a.startsWith("--book="))?.split("=")[1]

  ensureOutputDirs()

  // Parse CSV
  console.log("📖 Reading CSV...")
  const seRows = parseCalibreCSV()
  console.log(`Found ${seRows.length} Standard Ebooks entries`)

  // Build work list
  const priorityRows: CalibreRow[] = []
  const remainingRows: CalibreRow[] = []

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

  // Load or create progress
  let progress: IngestionProgress

  if (resetProgress) {
    console.log("🔄 Resetting progress...")
    progress = createFreshProgress(total)
  } else {
    const existing = loadProgress()
    if (existing) {
      console.log(`📋 Resuming: ${existing.completed.length} done, ${Object.keys(existing.failed).length} failed, ${existing.skipped.length} skipped`)
      progress = existing
      progress.totalBooks = total

      // If retrying failed, move them back into the pool
      if (retryFailed && Object.keys(progress.failed).length > 0) {
        const failedCount = Object.keys(progress.failed).length
        console.log(`🔁 Retrying ${failedCount} previously failed books`)
        progress.failed = {}
      }
    } else {
      progress = createFreshProgress(total)
    }
  }

  const completedSet = new Set(progress.completed)
  const skippedSet = new Set(progress.skipped)
  const failedSet = new Set(Object.keys(progress.failed))

  // Determine what to process
  const pending = rowsToProcess.filter(row => {
    const bookId = extractBookId(row.identifiers)
    if (!bookId) return false
    if (completedSet.has(bookId)) return false
    if (skippedSet.has(bookId)) return false
    if (failedSet.has(bookId)) return false
    return true
  })

  console.log(`Processing ${pending.length} of ${total} books (${total - pending.length} already handled)\n`)

  if (pending.length === 0) {
    console.log("Nothing to do — all books already processed.")
    printSummary(progress)
    return
  }

  // Graceful shutdown on Ctrl+C
  let interrupted = false
  const onInterrupt = () => {
    if (interrupted) process.exit(1) // second Ctrl+C forces exit
    interrupted = true
    console.log("\n\n⏸  Interrupted — saving progress...")
    saveProgress(progress)
    printSummary(progress)
    process.exit(0)
  }
  process.on("SIGINT", onInterrupt)
  process.on("SIGTERM", onInterrupt)

  // Collect metadata for generated TS file
  const booksMetadata: Record<string, object> = {}

  let processedThisRun = 0

  for (let i = 0; i < pending.length; i++) {
    if (interrupted) break

    const row = pending[i]
    const bookId = extractBookId(row.identifiers)
    if (!bookId) continue

    const globalIdx = rowsToProcess.findIndex(r => extractBookId(r.identifiers) === bookId) + 1
    const label = `[${String(globalIdx).padStart(4)}/${total}]`

    // Find EPUB
    const epubPath = findEpubPath(row.cover)
    if (!epubPath || !fs.existsSync(epubPath)) {
      progress.skipped.push(bookId)
      process.stdout.write(`${label} ⊘ ${bookId} — EPUB not found, skipped\n`)
      saveProgress(progress)
      continue
    }

    // Parse EPUB
    const parsed = await parseEpub(epubPath)
    if (!parsed || parsed.chapters.length === 0) {
      progress.failed[bookId] = "EPUB parse failed or 0 chapters"
      process.stdout.write(`${label} ✗ ${bookId} — parse failed\n`)
      saveProgress(progress)
      continue
    }

    // Write content files
    const result = writeBookContent(bookId, row, parsed)
    booksMetadata[bookId] = result.metadata

    // Mark completed
    progress.completed.push(bookId)
    processedThisRun++

    // Save progress after each book
    saveProgress(progress)

    process.stdout.write(
      `${label} ✓ ${bookId} — ${result.chapterCount} chapters, ${result.totalWordCount.toLocaleString()} words\n`
    )
  }

  // Write generated books TypeScript file (with all completed books' metadata)
  if (Object.keys(booksMetadata).length > 0) {
    writeGeneratedBooksTs(booksMetadata)
  }

  // Final save
  saveProgress(progress)
  printSummary(progress, processedThisRun)
}

function printSummary(progress: IngestionProgress, thisRun?: number) {
  const failedCount = Object.keys(progress.failed).length
  console.log(`\n${"─".repeat(50)}`)
  if (thisRun !== undefined) {
    console.log(`✓ Processed this run: ${thisRun}`)
  }
  console.log(`✓ Total completed:   ${progress.completed.length}`)
  console.log(`⊘ Skipped (no EPUB): ${progress.skipped.length}`)
  console.log(`✗ Failed:            ${failedCount}`)
  console.log(`  Remaining:         ${progress.totalBooks - progress.completed.length - progress.skipped.length - failedCount}`)
  console.log(`  Progress file:     ingestion-progress.json`)

  if (failedCount > 0) {
    console.log(`\nFailed books:`)
    for (const [id, reason] of Object.entries(progress.failed)) {
      console.log(`  ${id}: ${reason}`)
    }
    console.log(`\nRe-run with --retry-failed to attempt these again.`)
  }
}

main().catch(err => {
  console.error("Fatal error:", err)
  process.exit(1)
})
