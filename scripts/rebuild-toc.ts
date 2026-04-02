/**
 * Tome — Rebuild TOC with hierarchical Parts structure
 *
 * Reads existing ch-*.json files, parses HTML semantic roles
 * (doc-part, doc-chapter, doc-preface, doc-epilogue), and rebuilds
 * meta.json with a proper parts hierarchy.
 *
 * Run: npx ts-node --project scripts/tsconfig.json scripts/rebuild-toc.ts --book=crime-and-punishment
 * Options:
 *   --book=<bookId>   Process a single book (required for now)
 *   --all             Process all books in public/content/
 *   --dry-run         Print new meta.json to stdout without writing
 */

import * as fs from "fs"
import * as path from "path"

const CONTENT_DIR = path.resolve(__dirname, "../public/content")

// ── Parse semantic role from HTML ──────────────────────────────────

interface ChapterFile {
  bookId: string
  chapterIndex: number
  title: string
  wordCount: number
  estimatedMinutes: number
  html: string
}

interface ParsedEntry {
  index: number
  title: string
  wordCount: number
  estimatedMinutes: number
  role: string        // doc-chapter, doc-part, doc-preface, doc-epilogue, etc.
  dataParent: string  // "part-1", "part-2", etc. from data-parent attr
}

function parseRole(html: string): { role: string; dataParent: string } {
  // Match the first <section ...> tag's attributes
  const sectionMatch = html.match(/<section[^>]*>/i)
  if (!sectionMatch) return { role: "unknown", dataParent: "" }

  const tag = sectionMatch[0]
  const roleMatch = tag.match(/role="([^"]+)"/)
  const parentMatch = tag.match(/data-parent="([^"]+)"/)

  return {
    role: roleMatch?.[1] ?? "unknown",
    dataParent: parentMatch?.[1] ?? "",
  }
}

// ── Roles that should be excluded from the reading flow ──────────

const EXCLUDED_ROLES = new Set([
  "doc-preface",
  "doc-colophon",
  "doc-toc",
  "doc-dedication",
  "doc-epigraph",
])

// Roles that are structural containers (not readable content)
const STRUCTURAL_ROLES = new Set([
  "doc-part",
  "doc-volume",
])

// Roles that are back-matter but contain real narrative
const BACK_MATTER_ROLES = new Set([
  "doc-epilogue",
  "doc-afterword",
  "doc-conclusion",
])

// Roles that are front-matter but contain real narrative
const FRONT_MATTER_NARRATIVE_ROLES = new Set([
  "doc-prologue",
  "doc-introduction",
])

// ── Build hierarchical TOC ────────────────────────────────────────

interface TocPart {
  id: string
  title: string
  chapterIndices: number[]
}

interface TocChapter {
  index: number
  title: string
  partId: string
  partTitle: string
  wordCount: number
  estimatedMinutes: number
  role: string
}

interface TocMeta {
  bookId: string
  title: string
  author: string
  totalWordCount: number
  totalMinutes: number
  parts: TocPart[]
  chapters: TocChapter[]
  frontMatter: { index: number; title: string; wordCount: number; estimatedMinutes: number; role: string }[]
  backMatter: { index: number; title: string; wordCount: number; estimatedMinutes: number; role: string }[]
}

function buildToc(bookDir: string): TocMeta | null {
  const oldMetaPath = path.join(bookDir, "meta.json")
  if (!fs.existsSync(oldMetaPath)) return null

  const oldMeta = JSON.parse(fs.readFileSync(oldMetaPath, "utf-8"))

  // Read all chapter files and parse roles
  const entries: ParsedEntry[] = []
  let i = 0
  while (true) {
    const chPath = path.join(bookDir, `ch-${i}.json`)
    if (!fs.existsSync(chPath)) break
    const ch: ChapterFile = JSON.parse(fs.readFileSync(chPath, "utf-8"))
    const { role, dataParent } = parseRole(ch.html)
    entries.push({
      index: i,
      title: ch.title,
      wordCount: ch.wordCount,
      estimatedMinutes: ch.estimatedMinutes,
      role,
      dataParent,
    })
    i++
  }

  if (entries.length === 0) return null

  // Separate entries by type
  const parts: TocPart[] = []
  const chapters: TocChapter[] = []
  const frontMatter: TocMeta["frontMatter"] = []
  const backMatter: TocMeta["backMatter"] = []

  // First pass: identify all parts
  let currentPartId = ""
  let currentPartTitle = ""

  for (const entry of entries) {
    if (STRUCTURAL_ROLES.has(entry.role)) {
      // This is a Part/Volume header
      currentPartId = entry.dataParent || entry.title.toLowerCase().replace(/\s+/g, "-")
      // Use a cleaner ID derived from the title
      const partNum = parts.length + 1
      currentPartId = `part-${partNum}`
      currentPartTitle = entry.title
      parts.push({
        id: currentPartId,
        title: entry.title,
        chapterIndices: [],
      })
    } else if (EXCLUDED_ROLES.has(entry.role)) {
      frontMatter.push({
        index: entry.index,
        title: entry.title,
        wordCount: entry.wordCount,
        estimatedMinutes: entry.estimatedMinutes,
        role: entry.role,
      })
    } else if (BACK_MATTER_ROLES.has(entry.role)) {
      backMatter.push({
        index: entry.index,
        title: entry.title,
        wordCount: entry.wordCount,
        estimatedMinutes: entry.estimatedMinutes,
        role: entry.role,
      })
    } else if (FRONT_MATTER_NARRATIVE_ROLES.has(entry.role)) {
      // Prologues etc. — treat as front matter but with content
      frontMatter.push({
        index: entry.index,
        title: entry.title,
        wordCount: entry.wordCount,
        estimatedMinutes: entry.estimatedMinutes,
        role: entry.role,
      })
    } else {
      // Regular chapter — use data-parent if available, else current part context
      let partId = ""
      let partTitle = ""

      if (entry.dataParent) {
        // Map data-parent="part-1" to our part
        const partNum = parseInt(entry.dataParent.replace(/\D/g, ""), 10)
        const matchedPart = parts[partNum - 1]
        if (matchedPart) {
          partId = matchedPart.id
          partTitle = matchedPart.title
        }
      }

      // Fallback: use the most recent part
      if (!partId && currentPartId) {
        partId = currentPartId
        partTitle = currentPartTitle
      }

      // Build display title: if chapter title is just a numeral, prefix with "Chapter"
      let displayTitle = entry.title
      if (/^[IVXLCDM]+$/i.test(displayTitle.trim())) {
        displayTitle = `Chapter ${displayTitle.trim()}`
      }

      chapters.push({
        index: entry.index,
        title: displayTitle,
        partId,
        partTitle,
        wordCount: entry.wordCount,
        estimatedMinutes: entry.estimatedMinutes,
        role: entry.role || "doc-chapter",
      })

      // Add to part's chapter list
      if (partId) {
        const part = parts.find(p => p.id === partId)
        if (part) part.chapterIndices.push(entry.index)
      }
    }
  }

  // For books with no parts (flat structure), chapters have no partId — that's fine
  // The UI falls back to flat display

  // Calculate totals from actual readable content only
  const allReadable = [...chapters, ...backMatter, ...frontMatter.filter(f => FRONT_MATTER_NARRATIVE_ROLES.has(f.role))]
  const totalWordCount = allReadable.reduce((s, c) => s + c.wordCount, 0)
  const totalMinutes = allReadable.reduce((s, c) => s + c.estimatedMinutes, 0)

  return {
    bookId: oldMeta.bookId,
    title: oldMeta.title,
    author: oldMeta.author,
    totalWordCount,
    totalMinutes,
    parts,
    chapters,
    frontMatter,
    backMatter,
  }
}

// ── Main ───────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes("--dry-run")
  const processAll = args.includes("--all")
  const singleBook = args.find(a => a.startsWith("--book="))?.split("=")[1]

  if (!singleBook && !processAll) {
    console.error("Usage: rebuild-toc.ts --book=<bookId> | --all [--dry-run]")
    process.exit(1)
  }

  const bookIds: string[] = []
  if (singleBook) {
    bookIds.push(singleBook)
  } else {
    // All books
    const dirs = fs.readdirSync(CONTENT_DIR).filter(d =>
      fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
    )
    bookIds.push(...dirs)
  }

  let processed = 0
  let withParts = 0
  let flat = 0

  for (const bookId of bookIds) {
    const bookDir = path.join(CONTENT_DIR, bookId)
    if (!fs.existsSync(bookDir)) {
      console.warn(`  ✗ ${bookId} — directory not found`)
      continue
    }

    const toc = buildToc(bookDir)
    if (!toc) {
      console.warn(`  ✗ ${bookId} — no chapter files`)
      continue
    }

    if (dryRun) {
      console.log(JSON.stringify(toc, null, 2))
    } else {
      fs.writeFileSync(path.join(bookDir, "meta.json"), JSON.stringify(toc, null, 2), "utf-8")
    }

    const hasParts = toc.parts.length > 0
    if (hasParts) withParts++; else flat++
    processed++

    const partInfo = hasParts ? `${toc.parts.length} parts, ` : ""
    const chInfo = `${toc.chapters.length} chapters`
    const fmInfo = toc.frontMatter.length > 0 ? `, ${toc.frontMatter.length} front-matter` : ""
    const bmInfo = toc.backMatter.length > 0 ? `, ${toc.backMatter.length} back-matter` : ""
    console.log(`  ✓ ${bookId} — ${partInfo}${chInfo}${fmInfo}${bmInfo}`)
  }

  console.log(`\n${"─".repeat(50)}`)
  console.log(`Processed: ${processed} books (${withParts} with parts, ${flat} flat)`)
  if (dryRun) console.log("(dry run — no files written)")
}

main()
