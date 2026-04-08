// ── Annotation Bookmarks ──
// localStorage-backed bookmarking for Virgil annotations.

import type { AnnotationBookmark } from "@/lib/virgil/types"

const STORAGE_KEY = "tome:annotation-bookmarks"

function getAll(): AnnotationBookmark[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveAll(bookmarks: AnnotationBookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
}

export function getAnnotationBookmarks(): AnnotationBookmark[] {
  return getAll()
}

export function isAnnotationBookmarked(annotationId: string): boolean {
  return getAll().some((b) => b.annotationId === annotationId && b.type === "annotation")
}

export function toggleAnnotationBookmark(annotationId: string): boolean {
  const all = getAll()
  const existing = all.findIndex((b) => b.annotationId === annotationId && b.type === "annotation")

  if (existing >= 0) {
    all.splice(existing, 1)
    saveAll(all)
    return false // removed
  }

  all.push({
    id: `bm-${Date.now()}`,
    type: "annotation",
    annotationId,
    bookmarkedAt: new Date(),
  })
  saveAll(all)
  return true // added
}

export function toggleCrossRefBookmark(annotationId: string, crossRefIndex: number): boolean {
  const all = getAll()
  const existing = all.findIndex(
    (b) => b.annotationId === annotationId && b.type === "cross-reference" && b.crossReferenceIndex === crossRefIndex
  )

  if (existing >= 0) {
    all.splice(existing, 1)
    saveAll(all)
    return false
  }

  all.push({
    id: `bm-${Date.now()}`,
    type: "cross-reference",
    annotationId,
    crossReferenceIndex: crossRefIndex,
    bookmarkedAt: new Date(),
  })
  saveAll(all)
  return true
}
