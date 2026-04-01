import { BOOKS, type TomeBook } from "@/data/books"
import { CHAPTERS, type TomeChapter } from "@/data/chapters"
import { AUTHORS, getAuthorById, getAuthorByName, getAuthorsByEra, getAuthorsByTradition, type Author } from "@/data/authors"

export type TomeAuthor = Author

// Get all books, optionally filtered
export function getBooks(filters?: {
  tradition?: string
  era?: string
  difficulty?: string
}): TomeBook[] {
  let result = [...BOOKS]
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
  return BOOKS.find(b => b.id === id)
}

// Get chapters for a book
export function getChapters(bookId: string): TomeChapter[] {
  return CHAPTERS.filter(c => c.bookId === bookId).sort((a, b) => a.number - b.number)
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
  return BOOKS.filter(b => b.authorId === authorId)
}

// Get books by tradition
export function getBooksByTradition(tradition: string): TomeBook[] {
  return BOOKS.filter(b => b.tradition === tradition)
}

// Get featured books
export function getFeaturedBooks(): TomeBook[] {
  return BOOKS.filter(b => b.featured)
}

// Get trending books, sorted by readers desc
export function getTrendingBooks(): TomeBook[] {
  return BOOKS
    .filter(b => b.trending)
    .sort((a, b) => (b.trending?.readers ?? 0) - (a.trending?.readers ?? 0))
}

// Search books by title or author
export function searchBooks(query: string): TomeBook[] {
  const q = query.toLowerCase().trim()
  if (!q) return BOOKS
  return BOOKS.filter(
    b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.synopsis.toLowerCase().includes(q) ||
      b.themes.some(t => t.toLowerCase().includes(q))
  )
}

// Re-export for convenience
export { type TomeBook, type TomeChapter }
export { getAuthorByName, getAuthorsByEra, getAuthorsByTradition }
