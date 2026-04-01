export type ShelfType = "favorites" | "want_to_read" | "currently_reading" | "completed"

export interface ShelfEntry {
  bookId: string
  shelfType: ShelfType
  addedAt: string
  notes?: string
  priority?: number       // for want_to_read ordering (lower = higher priority)
  rating?: number         // 1–5 stars, completed books only
  completedAt?: string    // ISO string
  reflection?: string     // max 500 chars
  startedAt?: string      // ISO string
}

export const SHELF_LABELS: Record<ShelfType, { label: string; icon: string; description: string }> = {
  favorites:         { label: "Favorites",         icon: "Heart",    description: "Your personal literary canon" },
  want_to_read:      { label: "Want to Read",      icon: "Bookmark", description: "Your reading list" },
  currently_reading: { label: "Currently Reading", icon: "BookOpen", description: "In progress" },
  completed:         { label: "Completed",          icon: "Check",    description: "Books you've finished" },
}

const STORAGE_KEY = "tome-shelves"

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function loadAll(): Record<string, ShelfEntry> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, ShelfEntry>)
      : {}
  } catch {
    return {}
  }
}

function saveAll(entries: Record<string, ShelfEntry>): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {}
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function addToShelf(
  bookId: string,
  shelfType: ShelfType,
  meta?: Partial<Pick<ShelfEntry, "notes" | "priority">>
): ShelfEntry {
  const all = loadAll()
  const existing = all[bookId]
  const now = new Date().toISOString()

  const entry: ShelfEntry = {
    bookId,
    shelfType,
    addedAt: existing?.addedAt ?? now,
    notes: meta?.notes ?? existing?.notes,
    priority: shelfType === "want_to_read" ? (meta?.priority ?? existing?.priority) : undefined,
    rating: existing?.rating,
    completedAt:
      shelfType === "completed"
        ? (existing?.completedAt ?? now)
        : undefined,
    reflection: existing?.reflection,
    startedAt:
      shelfType === "currently_reading"
        ? (existing?.startedAt ?? now)
        : existing?.startedAt,
  }

  all[bookId] = entry
  saveAll(all)
  return entry
}

export function removeFromShelf(bookId: string): void {
  const all = loadAll()
  delete all[bookId]
  saveAll(all)
}

export function moveToShelf(bookId: string, shelfType: ShelfType): void {
  const all = loadAll()
  const existing = all[bookId]
  const now = new Date().toISOString()

  const entry: ShelfEntry = {
    bookId,
    shelfType,
    addedAt: existing?.addedAt ?? now,
    notes: existing?.notes,
    priority: shelfType === "want_to_read" ? existing?.priority : undefined,
    rating: existing?.rating,
    completedAt:
      shelfType === "completed"
        ? (existing?.completedAt ?? now)
        : undefined,
    reflection: existing?.reflection,
    startedAt:
      shelfType === "currently_reading"
        ? (existing?.startedAt ?? now)
        : existing?.startedAt,
  }

  all[bookId] = entry
  saveAll(all)
}

export function isOnShelf(bookId: string, shelfType: ShelfType): boolean {
  if (typeof window === "undefined") return false
  const all = loadAll()
  const entry = all[bookId]
  if (!entry) return false
  return entry.shelfType === shelfType
}

export function getShelfForBook(bookId: string): ShelfEntry | undefined {
  if (typeof window === "undefined") return undefined
  const all = loadAll()
  return all[bookId]
}

export function getShelf(shelfType: ShelfType): ShelfEntry[] {
  if (typeof window === "undefined") return []
  const all = loadAll()
  const entries = Object.values(all).filter((e) => e.shelfType === shelfType)

  if (shelfType === "want_to_read") {
    return entries.sort((a, b) => {
      const pa = a.priority ?? Infinity
      const pb = b.priority ?? Infinity
      return pa - pb
    })
  }

  if (shelfType === "completed") {
    return entries.sort(
      (a, b) =>
        new Date(b.completedAt ?? 0).getTime() -
        new Date(a.completedAt ?? 0).getTime()
    )
  }

  // favorites and currently_reading: sort by addedAt DESC
  return entries.sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  )
}

export function rateBook(bookId: string, rating: number): void {
  const clamped = Math.min(5, Math.max(1, Math.round(rating)))
  const all = loadAll()
  const existing = all[bookId]

  if (!existing) {
    // Auto-add to completed with rating
    const now = new Date().toISOString()
    all[bookId] = {
      bookId,
      shelfType: "completed",
      addedAt: now,
      completedAt: now,
      rating: clamped,
    }
  } else {
    all[bookId] = { ...existing, rating: clamped }
  }

  saveAll(all)
}

export function setReflection(bookId: string, reflection: string): void {
  const trimmed = reflection.slice(0, 500)
  const all = loadAll()
  const existing = all[bookId]

  if (!existing) {
    const now = new Date().toISOString()
    all[bookId] = {
      bookId,
      shelfType: "completed",
      addedAt: now,
      completedAt: now,
      reflection: trimmed,
    }
  } else {
    all[bookId] = { ...existing, reflection: trimmed }
  }

  saveAll(all)
}

export function reorderWantToRead(bookIds: string[]): void {
  const all = loadAll()

  bookIds.forEach((bookId, index) => {
    const entry = all[bookId]
    if (entry && entry.shelfType === "want_to_read") {
      all[bookId] = { ...entry, priority: index }
    }
  })

  saveAll(all)
}

export function getShelfCounts(): Record<ShelfType, number> {
  if (typeof window === "undefined") {
    return { favorites: 0, want_to_read: 0, currently_reading: 0, completed: 0 }
  }
  const all = loadAll()
  const counts: Record<ShelfType, number> = {
    favorites: 0,
    want_to_read: 0,
    currently_reading: 0,
    completed: 0,
  }
  for (const entry of Object.values(all)) {
    counts[entry.shelfType] = (counts[entry.shelfType] ?? 0) + 1
  }
  return counts
}

export function markBookCompleted(bookId: string): void {
  const all = loadAll()
  const existing = all[bookId]
  const now = new Date().toISOString()

  if (existing?.shelfType === "completed") {
    // Already completed — never downgrade
    return
  }

  const entry: ShelfEntry = {
    bookId,
    shelfType: "completed",
    addedAt: existing?.addedAt ?? now,
    notes: existing?.notes,
    rating: existing?.rating,
    reflection: existing?.reflection,
    startedAt: existing?.startedAt,
    completedAt: now,
  }

  all[bookId] = entry
  saveAll(all)
}

export function markBookStarted(bookId: string): void {
  const all = loadAll()
  const existing = all[bookId]
  const now = new Date().toISOString()

  // Never overwrite completed status
  if (existing?.shelfType === "completed") return

  // Only act if not on any shelf or on want_to_read
  if (existing && existing.shelfType === "currently_reading") return

  const entry: ShelfEntry = {
    bookId,
    shelfType: "currently_reading",
    addedAt: existing?.addedAt ?? now,
    notes: existing?.notes,
    startedAt: now,
  }

  all[bookId] = entry
  saveAll(all)
}

export function toggleFavorite(bookId: string): { isFavorite: boolean } {
  if (isOnShelf(bookId, "favorites")) {
    removeFromShelf(bookId)
    return { isFavorite: false }
  }
  addToShelf(bookId, "favorites")
  return { isFavorite: true }
}

export function isFavorite(bookId: string): boolean {
  return isOnShelf(bookId, "favorites")
}
