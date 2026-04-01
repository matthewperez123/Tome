import type { Bookmark, BookmarkColor } from "./types"

const STORAGE_KEY = "tome-bookmarks"
const MAX_BOOKMARKS = 500

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function loadAll(): Bookmark[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Bookmark[]) : []
  } catch {
    return []
  }
}

function saveAll(bookmarks: Bookmark[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  } catch {}
}

export function addBookmark(data: {
  bookId: string
  bookTitle: string
  authorName: string
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  paragraphIndex: number
  selectedText?: string
  note?: string
  color?: BookmarkColor
}): Bookmark {
  const now = new Date().toISOString()
  const bookmark: Bookmark = {
    id: generateId(),
    bookId: data.bookId,
    bookTitle: data.bookTitle,
    authorName: data.authorName,
    chapterId: data.chapterId,
    chapterNumber: data.chapterNumber,
    chapterTitle: data.chapterTitle,
    paragraphIndex: data.paragraphIndex,
    selectedText: data.selectedText ? data.selectedText.slice(0, 200) : undefined,
    note: data.note ? data.note.slice(0, 500) : undefined,
    color: data.color ?? "gold",
    createdAt: now,
    updatedAt: now,
  }

  let all = loadAll()
  all.push(bookmark)

  // Enforce 500 bookmark cap — drop oldest first
  if (all.length > MAX_BOOKMARKS) {
    all.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    all = all.slice(all.length - MAX_BOOKMARKS)
  }

  saveAll(all)
  return bookmark
}

export function removeBookmark(id: string): void {
  const all = loadAll().filter((b) => b.id !== id)
  saveAll(all)
}

export function updateBookmark(
  id: string,
  updates: { note?: string; color?: BookmarkColor }
): void {
  const all = loadAll()
  const index = all.findIndex((b) => b.id === id)
  if (index === -1) return

  all[index] = {
    ...all[index],
    note: updates.note !== undefined ? updates.note.slice(0, 500) : all[index].note,
    color: updates.color !== undefined ? updates.color : all[index].color,
    updatedAt: new Date().toISOString(),
  }
  saveAll(all)
}

export function getBookmarksByBook(bookId: string): Bookmark[] {
  return loadAll()
    .filter((b) => b.bookId === bookId)
    .sort((a, b) => {
      if (a.chapterNumber !== b.chapterNumber) {
        return a.chapterNumber - b.chapterNumber
      }
      return a.paragraphIndex - b.paragraphIndex
    })
}

export function getBookmarksByChapter(
  bookId: string,
  chapterNumber: number
): Bookmark[] {
  return loadAll()
    .filter((b) => b.bookId === bookId && b.chapterNumber === chapterNumber)
    .sort((a, b) => a.paragraphIndex - b.paragraphIndex)
}

export function getAllBookmarks(): Bookmark[] {
  return loadAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function searchBookmarks(query: string): Bookmark[] {
  if (!query.trim()) return getAllBookmarks()
  const lower = query.toLowerCase()
  return loadAll()
    .filter((b) => {
      const inText = b.selectedText?.toLowerCase().includes(lower) ?? false
      const inNote = b.note?.toLowerCase().includes(lower) ?? false
      return inText || inNote
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export function getBookmarkById(id: string): Bookmark | undefined {
  return loadAll().find((b) => b.id === id)
}

export function getBookmarkCounts(): Record<string, number> {
  const all = loadAll()
  const counts: Record<string, number> = {}
  for (const b of all) {
    counts[b.bookId] = (counts[b.bookId] ?? 0) + 1
  }
  return counts
}

export function hasBookmarkAtParagraph(
  bookId: string,
  chapterNumber: number,
  paragraphIndex: number
): Bookmark | undefined {
  return loadAll().find(
    (b) =>
      b.bookId === bookId &&
      b.chapterNumber === chapterNumber &&
      b.paragraphIndex === paragraphIndex
  )
}

export function exportBookmarks(format: "json" | "markdown" | "study-cards"): string {
  const bookmarks = getAllBookmarks()

  if (format === "json") {
    return JSON.stringify(bookmarks, null, 2)
  }

  if (format === "study-cards") {
    const cards = bookmarks
      .filter((b) => b.selectedText && b.note)
      .map((b) => ({
        front: b.selectedText!,
        back: b.note!,
        source: `${b.bookTitle} Ch ${b.chapterNumber}`,
      }))
    return JSON.stringify(cards, null, 2)
  }

  // markdown — grouped by book, then by chapter
  // Build: book title -> chapter key -> bookmarks[]
  const byBook = new Map<string, Map<string, Bookmark[]>>()

  for (const b of bookmarks) {
    if (!byBook.has(b.bookTitle)) {
      byBook.set(b.bookTitle, new Map())
    }
    const byChapter = byBook.get(b.bookTitle)!
    const chapterKey = `${b.chapterNumber}:${b.chapterTitle}`
    if (!byChapter.has(chapterKey)) {
      byChapter.set(chapterKey, [])
    }
    byChapter.get(chapterKey)!.push(b)
  }

  const sections: string[] = []

  for (const [bookTitle, byChapter] of byBook.entries()) {
    const lines: string[] = [`## ${bookTitle}`, ""]

    for (const [chapterKey, entries] of byChapter.entries()) {
      const [chapterNum, ...titleParts] = chapterKey.split(":")
      const chapterTitle = titleParts.join(":")
      lines.push(`### Chapter ${chapterNum}: ${chapterTitle}`, "")

      for (const b of entries) {
        if (b.selectedText) {
          lines.push(`> ${b.selectedText}`, "")
        }
        if (b.note) {
          lines.push(`**Note:** ${b.note}`, "")
        }
        lines.push("---", "")
      }
    }

    sections.push(lines.join("\n"))
  }

  return sections.join("\n")
}
