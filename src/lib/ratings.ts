// ── Book Ratings ──
// Local-first rating storage. When Supabase auth is wired,
// this can be swapped to use the book_ratings table + view.

const STORAGE_KEY = "tome:book-ratings"

export interface BookRatingStats {
  averageRating: number
  ratingCount: number
}

function getAllRatings(): Record<string, number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveAllRatings(ratings: Record<string, number>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings))
}

export function getUserRating(bookId: string): number | null {
  const ratings = getAllRatings()
  return ratings[bookId] ?? null
}

export function setUserRating(bookId: string, rating: number): void {
  const ratings = getAllRatings()
  ratings[bookId] = rating
  saveAllRatings(ratings)
}

export function clearUserRating(bookId: string): void {
  const ratings = getAllRatings()
  delete ratings[bookId]
  saveAllRatings(ratings)
}

export function getBookRatingStats(bookId: string): BookRatingStats {
  // In local-first mode, "aggregate" is just the user's own rating
  const rating = getUserRating(bookId)
  if (rating) {
    return { averageRating: rating, ratingCount: 1 }
  }
  return { averageRating: 0, ratingCount: 0 }
}
