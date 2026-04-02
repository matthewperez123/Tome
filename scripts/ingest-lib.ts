/**
 * Tome — Shared Calibre Ingestion Library
 *
 * Shared constants, classifiers, and parsing functions used by
 * both ingest-calibre.ts and ingest-batch.ts.
 */

import * as fs from "fs"
import * as path from "path"
import { parse } from "papaparse"
import { EPub } from "epub2"

// ── Config ──────────────────────────────────────────────────────────

export const CSV_PATH = "/Users/matthewperez/Calibre Library/calibre/My books (983)/My books.csv"
export const PUBLIC_DIR = path.resolve(__dirname, "../public")
export const CONTENT_DIR = path.join(PUBLIC_DIR, "content")
export const COVERS_DIR = path.join(PUBLIC_DIR, "covers")

export const PRIORITY_BOOK_IDS = new Set([
  "the-odyssey",
  "the-iliad",
  "pride-and-prejudice",
  "the-divine-comedy",
  "crime-and-punishment",
  "the-great-gatsby",
  "frankenstein",
  "beowulf",
])

// Items to skip from EPUB spine by ID/href patterns
export const SKIP_SPINE_PATTERNS = [
  "titlepage",
  "halftitle",
  "colophon",
  "imprint",
  "dedication",
  "epigraph",
  "uncopyright",
  "loi",
  "lot",
  "contributors",
  "bibliography",
  "further-reading",
  "endnotes",
]

// ── Types ───────────────────────────────────────────────────────────

export interface CalibreRow {
  author_sort: string
  authors: string
  comments: string
  cover: string
  timestamp: string
  formats: string
  isbn: string
  id: string
  identifiers: string
  languages: string
  library_name: string
  pubdate: string
  publisher: string
  rating: string
  series: string
  series_index: string
  size: string
  tags: string
  title: string
  title_sort: string
  uuid: string
}

export interface ParsedChapter {
  index: number
  title: string
  html: string
  wordCount: number
  estimatedMinutes: number
}

export interface ParsedBook {
  title: string
  author: string
  chapters: ParsedChapter[]
  totalWordCount: number
  totalMinutes: number
}

// ── Tradition classifier ─────────────────────────────────────────────

const TRADITION_KEYWORDS: [string[], string][] = [
  [["greek mythology", "ancient greece", "greek drama", "greek tragedy", "homer", "classical greek", "ancient greek"], "Ancient Greek"],
  [["rome", "roman", "latin literature", "cicero", "virgil", "ovid", "livy", "seneca"], "Roman"],
  [["medieval", "arthurian", "chaucer", "middle ages", "dante", "medieval english"], "Medieval European"],
  [["shakespeare", "renaissance english", "elizabethan", "jacobean"], "Renaissance"],
  [["enlightenment", "voltaire", "swift", "defoe", "18th century fiction", "age of reason"], "Enlightenment"],
  [["victorian", "19th century english", "dickens", "england -- fiction", "british fiction", "jane austen", "bronte"], "Victorian"],
  [["russia", "russian fiction", "russian literature", "dostoevsky", "tolstoy", "chekhov", "turgenev"], "Russian"],
  [["france", "french fiction", "french literature", "balzac", "flaubert", "zola", "hugo", "dumas"], "French"],
  [["america", "american fiction", "american literature", "united states", "twain", "melville", "hawthorne", "james"], "American"],
  [["germany", "german fiction", "german literature", "austria", "kafka", "goethe", "schiller", "rilke"], "Germanic"],
  [["modern", "modernist", "stream of consciousness", "20th century", "woolf", "joyce", "faulkner"], "Modernist"],
  [["japan", "china", "india", "persia", "arabic", "eastern", "buddhism", "hindu"], "Eastern"],
  [["philosophy", "ethics", "political theory", "metaphysics", "epistemology", "plato", "aristotle"], "Philosophy"],
  [["detective", "mystery", "crime fiction", "thriller"], "Mystery & Crime"],
  [["science fiction", "fantasy", "speculative fiction"], "Speculative"],
  [["children", "young adult", "fairy tale"], "Children's Literature"],
  [["christianity", "religion", "theology", "spiritual"], "Religious"],
]

export function classifyTradition(tags: string, authors: string): string {
  const text = `${tags} ${authors}`.toLowerCase()
  for (const [keywords, tradition] of TRADITION_KEYWORDS) {
    if (keywords.some(k => text.includes(k))) return tradition
  }
  return "World Literature"
}

// ── Era classifier ────────────────────────────────────────────────────

export function classifyEra(year: number): string {
  if (year < 500) return "Ancient"
  if (year < 1400) return "Medieval"
  if (year < 1700) return "Renaissance"
  if (year < 1800) return "Enlightenment"
  if (year < 1920) return "Modern"
  return "Contemporary"
}

// ── Difficulty classifier ─────────────────────────────────────────────

export function classifyDifficulty(tags: string, title: string): string {
  const text = `${tags} ${title}`.toLowerCase()
  if (text.includes("philosophy") || text.includes("political theory") || text.includes("economics")) return "Scholar"
  if (text.includes("children") || text.includes("young adult") || text.includes("fable")) return "Beginner"
  if (text.includes("modernist") || text.includes("stream of consciousness") || text.includes("experimental")) return "Advanced"
  return "Intermediate"
}

// ── slugify ────────────────────────────────────────────────────────────

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ── Extract bookId from Standard Ebooks URL ────────────────────────────

export function extractBookId(identifiers: string): string | null {
  const match = identifiers.match(/url:https:\/\/standardebooks\.org\/ebooks\/([^,\s"]+)/)
  if (!match) return null
  const slug = match[1].replace(/\/$/, "")
  const parts = slug.split("/")
  if (parts.length >= 2) return parts[1]
  return parts[0]
}

// ── Find EPUB file in a Calibre book folder ────────────────────────────

export function findEpubPath(coverPath: string): string | null {
  const dir = path.dirname(coverPath)
  try {
    const files = fs.readdirSync(dir)
    const epub = files.find(f => f.endsWith(".epub"))
    return epub ? path.join(dir, epub) : null
  } catch {
    return null
  }
}

// ── HTML cleaning ──────────────────────────────────────────────────────

export function cleanHTML(raw: string): string {
  if (!raw) return ""

  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  let html = bodyMatch ? bodyMatch[1] : raw

  html = html.replace(/<nav[\s\S]*?<\/nav>/gi, "")
  html = html.replace(/<figure[\s\S]*?<\/figure>/gi, "")
  html = html.replace(/<aside[\s\S]*?<\/aside>/gi, "")
  html = html.replace(/<header[\s\S]*?<\/header>/gi, "")
  html = html.replace(/<footer[\s\S]*?<\/footer>/gi, "")
  html = html.replace(/<section[^>]*epub:type="[^"]*(?:copyright|colophon|toc|landmarks)[^"]*"[\s\S]*?<\/section>/gi, "")

  html = html.replace(/\s(?:class|id|epub:type|xml:lang|lang|xmlns\S*)="[^"]*"/g, "")
  html = html.replace(/<br\s*\/>/g, "<br>")
  html = html.replace(/<p>\s*<\/p>/g, "")
  html = html.replace(/<p>\s*<br\s*>\s*<\/p>/g, "")
  html = html.replace(/>\s{2,}</g, "> <")

  return html.trim()
}

// ── Count words in HTML ────────────────────────────────────────────────

export function countWords(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  return text.split(" ").filter(Boolean).length
}

// ── Parse EPUB → chapters ──────────────────────────────────────────────

export async function parseEpub(epubPath: string): Promise<ParsedBook | null> {
  return new Promise((resolve) => {
    let epub: EPub
    try {
      epub = new EPub(epubPath)
    } catch (e) {
      resolve(null)
      return
    }

    epub.on("error", () => resolve(null))

    epub.on("end", () => {
      const contentItems = epub.flow.filter(item => {
        const id = (item.id || "").toLowerCase()
        return !SKIP_SPINE_PATTERNS.some(pattern => id.includes(pattern))
      })

      if (contentItems.length === 0) {
        resolve(null)
        return
      }

      let remaining = contentItems.length
      const chapters: ParsedChapter[] = new Array(contentItems.length)

      contentItems.forEach((item, idx) => {
        epub.getChapterRaw(item.id, (err: Error | null, raw: string) => {
          if (err || !raw) {
            chapters[idx] = {
              index: idx,
              title: item.title || `Chapter ${idx + 1}`,
              html: "",
              wordCount: 0,
              estimatedMinutes: 0,
            }
          } else {
            const html = cleanHTML(raw)
            const wordCount = countWords(html)
            chapters[idx] = {
              index: idx,
              title: item.title || `Chapter ${idx + 1}`,
              html,
              wordCount,
              estimatedMinutes: Math.max(1, Math.round(wordCount / 250)),
            }
          }

          remaining--
          if (remaining === 0) {
            const totalWordCount = chapters.reduce((s, c) => s + c.wordCount, 0)
            const totalMinutes = chapters.reduce((s, c) => s + c.estimatedMinutes, 0)
            resolve({
              title: epub.metadata?.title || "",
              author: epub.metadata?.creator || "",
              chapters,
              totalWordCount,
              totalMinutes,
            })
          }
        })
      })
    })

    epub.parse()
  })
}

// ── Cover color palette (by tradition) ────────────────────────────────

export const TRADITION_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  "Ancient Greek":        { primary: "#1E40AF", secondary: "#3B82F6", accent: "#F59E0B" },
  "Roman":                { primary: "#991B1B", secondary: "#DC2626", accent: "#F59E0B" },
  "Medieval European":    { primary: "#7C3AED", secondary: "#A855F7", accent: "#F59E0B" },
  "Renaissance":          { primary: "#065F46", secondary: "#059669", accent: "#D97706" },
  "Enlightenment":        { primary: "#1E3A5F", secondary: "#3B82F6", accent: "#E2E8F0" },
  "Victorian":            { primary: "#4C1D95", secondary: "#7C3AED", accent: "#D4A574" },
  "Russian":              { primary: "#7F1D1D", secondary: "#991B1B", accent: "#F5F5F4" },
  "French":               { primary: "#1F2937", secondary: "#374151", accent: "#D97706" },
  "American":             { primary: "#1E3A5F", secondary: "#2563EB", accent: "#DC2626" },
  "Germanic":             { primary: "#1F2937", secondary: "#374151", accent: "#6B7280" },
  "Modernist":            { primary: "#111827", secondary: "#1F2937", accent: "#6366F1" },
  "Eastern":              { primary: "#78350F", secondary: "#D97706", accent: "#FEF3C7" },
  "Philosophy":           { primary: "#1E3A5F", secondary: "#1D4ED8", accent: "#F8FAFC" },
  "Mystery & Crime":      { primary: "#1C1917", secondary: "#292524", accent: "#DC2626" },
  "Speculative":          { primary: "#0F172A", secondary: "#1E293B", accent: "#818CF8" },
  "Children's Literature":{ primary: "#065F46", secondary: "#10B981", accent: "#FDE68A" },
  "Religious":            { primary: "#451A03", secondary: "#78350F", accent: "#FEF3C7" },
  "World Literature":     { primary: "#1F2937", secondary: "#374151", accent: "#9CA3AF" },
}

// ── Write book content to disk ────────────────────────────────────────

export interface WriteBookResult {
  bookId: string
  metadata: object
  chapterCount: number
  totalWordCount: number
}

export function writeBookContent(
  bookId: string,
  row: CalibreRow,
  parsed: ParsedBook,
): WriteBookResult {
  const bookContentDir = path.join(CONTENT_DIR, bookId)
  fs.mkdirSync(bookContentDir, { recursive: true })

  const chapterMeta: object[] = []
  for (const ch of parsed.chapters) {
    const chFile = path.join(bookContentDir, `ch-${ch.index}.json`)
    fs.writeFileSync(chFile, JSON.stringify({
      bookId,
      chapterIndex: ch.index,
      title: ch.title,
      wordCount: ch.wordCount,
      estimatedMinutes: ch.estimatedMinutes,
      html: ch.html,
    }), "utf-8")
    chapterMeta.push({
      index: ch.index,
      title: ch.title,
      wordCount: ch.wordCount,
      estimatedMinutes: ch.estimatedMinutes,
    })
  }

  const metaPath = path.join(bookContentDir, "meta.json")
  fs.writeFileSync(metaPath, JSON.stringify({
    bookId,
    title: row.title,
    author: row.authors,
    chapterCount: parsed.chapters.length,
    totalWordCount: parsed.totalWordCount,
    totalMinutes: parsed.totalMinutes,
    chapters: chapterMeta,
  }, null, 2), "utf-8")

  // Copy cover
  const coverDest = path.join(COVERS_DIR, `${bookId}.jpg`)
  if (!fs.existsSync(coverDest) && row.cover && fs.existsSync(row.cover)) {
    fs.copyFileSync(row.cover, coverDest)
  }

  // Build metadata object
  const year = new Date(row.pubdate).getFullYear() || 0
  const tradition = classifyTradition(row.tags, row.authors)
  const era = classifyEra(year)
  const difficulty = classifyDifficulty(row.tags, row.title)
  const colors = TRADITION_COLORS[tradition] ?? TRADITION_COLORS["World Literature"]
  const seUrl = row.identifiers.match(/url:(https:\/\/standardebooks\.org\/ebooks\/[^\s,"]+)/)?.[1] ?? ""

  const metadata = {
    id: bookId,
    title: row.title,
    author: row.authors,
    authorId: slugify(row.authors),
    year,
    tradition,
    era,
    genres: row.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
    difficulty,
    chapters: parsed.chapters.length,
    estimatedReadingTime: `~${Math.round(parsed.totalMinutes / 60)}h`,
    wordCount: parsed.totalWordCount,
    synopsis: row.comments || "",
    themes: [],
    country: "",
    coverColors: colors,
    featured: PRIORITY_BOOK_IDS.has(bookId),
    standardEbooksUrl: seUrl,
    coverImagePath: `/covers/${bookId}.jpg`,
    source: "standard-ebooks",
  }

  return {
    bookId,
    metadata,
    chapterCount: parsed.chapters.length,
    totalWordCount: parsed.totalWordCount,
  }
}

// ── Parse Calibre CSV → Standard Ebooks rows ──────────────────────────

export function parseCalibreCSV(): CalibreRow[] {
  const csvContent = fs.readFileSync(CSV_PATH, "utf-8")
  const result = parse<CalibreRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  if (result.errors.length > 0) {
    console.warn("CSV parse warnings:", result.errors.slice(0, 3))
  }

  return result.data.filter(row =>
    row.identifiers && row.identifiers.includes("standardebooks.org")
  )
}

// ── Write generated books TypeScript file ──────────────────────────────

export function writeGeneratedBooksTs(booksMetadata: Record<string, object>): void {
  const generatedDir = path.resolve(__dirname, "../src/data/generated")
  fs.mkdirSync(generatedDir, { recursive: true })

  const booksTs = `// AUTO-GENERATED by scripts/ingest-calibre.ts — do not edit by hand
// Re-run: npx ts-node --project scripts/tsconfig.json scripts/ingest-calibre.ts

import type { TomeBook } from "@/data/books"

export const CALIBRE_BOOKS: TomeBook[] = ${JSON.stringify(Object.values(booksMetadata), null, 2)} as const
`
  fs.writeFileSync(path.join(generatedDir, "books-from-calibre.ts"), booksTs, "utf-8")
}

// ── Ensure output directories exist ────────────────────────────────────

export function ensureOutputDirs(): void {
  fs.mkdirSync(CONTENT_DIR, { recursive: true })
  fs.mkdirSync(COVERS_DIR, { recursive: true })
}
