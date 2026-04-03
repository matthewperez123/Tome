"use client"

import { useMemo } from "react"
import { BOOKS, type TomeBook } from "@/data/books"
import { AUTHORS, type Author } from "@/data/authors"
import { useDebounce } from "@/lib/use-debounce"

// ── Types ────────────────────────────────────────────────────────────────────

export interface BookResult {
  book: TomeBook
  matchField: "title" | "author" | "synopsis" | "theme"
}

export interface AuthorResult {
  author: Author
  bookCount: number
}

export interface GenreResult {
  name: string
  bookCount: number
}

export interface TraditionResult {
  name: string
  bookCount: number
}

export interface SearchResults {
  books: BookResult[]
  authors: AuthorResult[]
  genres: GenreResult[]
  traditions: TraditionResult[]
  totalCount: number
}

const EMPTY: SearchResults = {
  books: [],
  authors: [],
  genres: [],
  traditions: [],
  totalCount: 0,
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query.trim(), 200)

  const results = useMemo((): SearchResults => {
    const q = debouncedQuery.toLowerCase()
    if (q.length < 2) return EMPTY

    // Books — match title, author, synopsis, themes
    const books: BookResult[] = []
    for (const book of BOOKS) {
      if (book.title.toLowerCase().includes(q)) {
        books.push({ book, matchField: "title" })
      } else if (book.author.toLowerCase().includes(q)) {
        books.push({ book, matchField: "author" })
      } else if (book.synopsis.toLowerCase().includes(q)) {
        books.push({ book, matchField: "synopsis" })
      } else if (book.themes.some((t) => t.toLowerCase().includes(q))) {
        books.push({ book, matchField: "theme" })
      }
    }
    // Sort: title matches first, then author, then rest
    books.sort((a, b) => {
      const order = { title: 0, author: 1, theme: 2, synopsis: 3 }
      return order[a.matchField] - order[b.matchField]
    })

    // Authors
    const authors: AuthorResult[] = AUTHORS.filter((a) =>
      a.name.toLowerCase().includes(q)
    ).map((author) => ({
      author,
      bookCount: BOOKS.filter((b) => b.authorId === author.id).length,
    }))

    // Genres — extract unique genres from all books
    const genreMap = new Map<string, number>()
    for (const book of BOOKS) {
      for (const g of book.genres) {
        genreMap.set(g, (genreMap.get(g) ?? 0) + 1)
      }
    }
    const genres: GenreResult[] = Array.from(genreMap.entries())
      .filter(([name]) => name.toLowerCase().includes(q))
      .map(([name, bookCount]) => ({ name, bookCount }))
      .sort((a, b) => b.bookCount - a.bookCount)

    // Traditions
    const traditionMap = new Map<string, number>()
    for (const book of BOOKS) {
      traditionMap.set(book.tradition, (traditionMap.get(book.tradition) ?? 0) + 1)
    }
    const traditions: TraditionResult[] = Array.from(traditionMap.entries())
      .filter(([name]) => name.toLowerCase().includes(q))
      .map(([name, bookCount]) => ({ name, bookCount }))
      .sort((a, b) => b.bookCount - a.bookCount)

    const totalCount =
      Math.min(books.length, 5) +
      Math.min(authors.length, 5) +
      Math.min(genres.length, 5) +
      Math.min(traditions.length, 5)

    return {
      books: books.slice(0, 5),
      authors: authors.slice(0, 5),
      genres: genres.slice(0, 5),
      traditions: traditions.slice(0, 5),
      totalCount,
    }
  }, [debouncedQuery])

  return { results, isSearching: debouncedQuery.length >= 2 }
}
