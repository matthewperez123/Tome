import { BOOKS, type TomeBook } from "@/data/books"
import { CALIBRE_BOOKS } from "@/data/generated/books-from-calibre"
import { CHAPTERS, type TomeChapter, type TomePart } from "@/data/chapters"
import { AUTHORS, getAuthorById, getAuthorByName, getAuthorsByEra, getAuthorsByTradition, type Author } from "@/data/authors"

export type TomeAuthor = Author

// Merge handcrafted + Calibre books, deduplicating by id.
// Handcrafted entries win (richer metadata: trending, themes, etc.)
const ALL_BOOKS: TomeBook[] = (() => {
  const seen = new Set<string>()
  const merged: TomeBook[] = []
  for (const b of BOOKS) {
    seen.add(b.id)
    merged.push(b)
  }
  for (const b of CALIBRE_BOOKS) {
    if (!seen.has(b.id)) {
      seen.add(b.id)
      merged.push(b)
    }
  }
  return merged
})()

// Get all books, optionally filtered
export function getBooks(filters?: {
  tradition?: string
  era?: string
  difficulty?: string
}): TomeBook[] {
  let result = [...ALL_BOOKS]
  if (filters?.tradition) {
    result = result.filter(b => b.tradition === filters.tradition)
  }
  if (filters?.era) {
    result = result.filter(b => b.era.toLowerCase() === filters.era!.toLowerCase())
  }
  if (filters?.difficulty) {
    result = result.filter(b => b.difficulty.toLowerCase() === filters.difficulty!.toLowerCase())
  }
  return result
}

// Get a single book by ID
export function getBook(id: string): TomeBook | undefined {
  return ALL_BOOKS.find(b => b.id === id)
}

// Get chapters for a book (hardcoded data only — fast, synchronous)
export function getChapters(bookId: string): TomeChapter[] {
  return CHAPTERS.filter(c => c.bookId === bookId).sort((a, b) => a.number - b.number)
}

/** Result from fetching a book's content metadata */
export interface BookContentData {
  chapters: TomeChapter[]
  parts: TomePart[]
  frontMatter: TomeChapter[]
  backMatter: TomeChapter[]
}

// Fetch full book content metadata from static meta.json.
// Returns chapters enriched with partId/partTitle, plus parts array for hierarchy.
// Always prefers meta.json (has parts hierarchy) over hardcoded chapters.
export async function getBookContentData(bookId: string): Promise<BookContentData> {
  const empty: BookContentData = { chapters: [], parts: [], frontMatter: [], backMatter: [] }

  // 1. Fetch from static meta.json (rebuilt by scripts/rebuild-toc.ts)
  try {
    const res = await fetch(`/content/${bookId}/meta.json`)
    if (!res.ok) return empty
    const meta = await res.json()

    // Parse parts
    const parts: TomePart[] = (meta.parts ?? []).map((p: { id: string; title: string; chapterIndices: number[] }) => ({
      id: p.id,
      title: p.title,
      chapterIndices: p.chapterIndices,
    }))

    // Helper to map a raw chapter entry to TomeChapter
    const toChapter = (ch: { index: number; title: string; wordCount: number; estimatedMinutes: number; partId?: string; partTitle?: string; role?: string }) => ({
      id: `${bookId}-ch-${ch.index}`,
      bookId,
      number: ch.index,
      title: ch.title,
      wordCount: ch.wordCount ?? 0,
      estimatedMinutes: ch.estimatedMinutes ?? 0,
      summary: "",
      quizAvailable: false,
      partId: ch.partId ?? undefined,
      partTitle: ch.partTitle ?? undefined,
      role: ch.role ?? "doc-chapter",
    })

    const chapters = (meta.chapters ?? []).map(toChapter)
    const frontMatter = (meta.frontMatter ?? []).map(toChapter)
    const backMatter = (meta.backMatter ?? []).map(toChapter)

    if (chapters.length > 0) return { chapters, parts, frontMatter, backMatter }
  } catch {
    // fall through to hardcoded
  }

  // 2. Fall back to hardcoded chapters (no meta.json or empty)
  const hardcoded = getChapters(bookId)
  if (hardcoded.length > 0) {
    return { chapters: hardcoded, parts: [], frontMatter: [], backMatter: [] }
  }

  return empty
}

// Convenience: get just the chapters (for backward compatibility)
export async function getChaptersFromContent(bookId: string): Promise<TomeChapter[]> {
  const data = await getBookContentData(bookId)
  // Return chapters + back-matter (epilogues are readable content)
  return [...data.chapters, ...data.backMatter]
}

// Get author by ID (delegates to authors.ts helper)
export function getAuthor(id: string): TomeAuthor | undefined {
  return getAuthorById(id)
}

// Get all authors, optionally filtered
export function getAuthors(filters?: {
  era?: string
  tradition?: string
  nationality?: string
}): TomeAuthor[] {
  let result = [...AUTHORS]
  if (filters?.era) {
    result = result.filter(a => a.era.toLowerCase() === filters.era!.toLowerCase())
  }
  if (filters?.tradition) {
    result = result.filter(a =>
      a.traditions.some(t => t.toLowerCase() === filters.tradition!.toLowerCase())
    )
  }
  if (filters?.nationality) {
    result = result.filter(a =>
      a.nationality.toLowerCase().includes(filters.nationality!.toLowerCase())
    )
  }
  return result
}

// Get books by author ID
export function getBooksByAuthor(authorId: string): TomeBook[] {
  return ALL_BOOKS.filter(b => b.authorId === authorId)
}

// Get books by tradition
export function getBooksByTradition(tradition: string): TomeBook[] {
  return ALL_BOOKS.filter(b => b.tradition === tradition)
}

// Get featured books
export function getFeaturedBooks(): TomeBook[] {
  return ALL_BOOKS.filter(b => b.featured)
}

// Get trending books, sorted by readers desc
export function getTrendingBooks(): TomeBook[] {
  return ALL_BOOKS
    .filter(b => b.trending)
    .sort((a, b) => (b.trending?.readers ?? 0) - (a.trending?.readers ?? 0))
}

// Search books by title or author
export function searchBooks(query: string): TomeBook[] {
  const q = query.toLowerCase().trim()
  if (!q) return ALL_BOOKS
  return ALL_BOOKS.filter(
    b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.synopsis.toLowerCase().includes(q) ||
      b.themes.some(t => t.toLowerCase().includes(q))
  )
}

// Re-export for convenience
export { type TomeBook, type TomeChapter, type TomePart }
export { getAuthorByName, getAuthorsByEra, getAuthorsByTradition }
