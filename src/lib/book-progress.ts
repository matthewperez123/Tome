// Book progress tracking — localStorage-backed, Supabase-ready later

export interface ChapterQuizResult {
  chapterId: string
  chapterIndex: number
  score: number
  totalQuestions: number
  passed: boolean
  xpEarned: number
  completedAt: string
}

export interface BookProgress {
  bookId: string
  readingMode: 'guided' | 'free'
  currentChapterIndex: number
  completedChapterIndices: number[]
  quizResults: ChapterQuizResult[]
  totalXpEarned: number
  readingTimeMinutes: number
  startedAt: string
  lastReadAt: string
}

const progressKey = (bookId: string) => `tome-book-progress-${bookId}`

export function getBookProgress(bookId: string): BookProgress | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(progressKey(bookId))
    return raw ? (JSON.parse(raw) as BookProgress) : null
  } catch {
    return null
  }
}

export function saveBookProgress(progress: BookProgress): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(progressKey(progress.bookId), JSON.stringify(progress))
  } catch {}
}

export function createBookProgress(bookId: string, mode: 'guided' | 'free'): BookProgress {
  return {
    bookId,
    readingMode: mode,
    currentChapterIndex: 0,
    completedChapterIndices: [],
    quizResults: [],
    totalXpEarned: 0,
    readingTimeMinutes: 0,
    startedAt: new Date().toISOString(),
    lastReadAt: new Date().toISOString(),
  }
}

export function getAllBookProgress(): Record<string, BookProgress> {
  if (typeof window === 'undefined') return {}
  const result: Record<string, BookProgress> = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('tome-book-progress-')) {
        const bookId = key.replace('tome-book-progress-', '')
        const progress = getBookProgress(bookId)
        if (progress) result[bookId] = progress
      }
    }
  } catch {}
  return result
}

/** In Guided mode, chapter N is locked unless chapter N-1 is in completedChapterIndices */
export function isChapterLocked(progress: BookProgress, chapterIndex: number): boolean {
  if (progress.readingMode === 'free') return false
  if (chapterIndex === 0) return false
  return !progress.completedChapterIndices.includes(chapterIndex - 1)
}

export function recordChapterComplete(
  progress: BookProgress,
  chapterIndex: number,
  xpEarned: number
): BookProgress {
  const alreadyDone = progress.completedChapterIndices.includes(chapterIndex)
  return {
    ...progress,
    completedChapterIndices: alreadyDone
      ? progress.completedChapterIndices
      : [...progress.completedChapterIndices, chapterIndex],
    totalXpEarned: progress.totalXpEarned + (alreadyDone ? 0 : xpEarned),
    currentChapterIndex: chapterIndex + 1,
    lastReadAt: new Date().toISOString(),
  }
}

export function recordQuizResult(
  progress: BookProgress,
  result: ChapterQuizResult
): BookProgress {
  return {
    ...progress,
    quizResults: [...progress.quizResults, result],
    lastReadAt: new Date().toISOString(),
  }
}

export function addReadingTime(progress: BookProgress, minutes: number): BookProgress {
  return {
    ...progress,
    readingTimeMinutes: progress.readingTimeMinutes + minutes,
    lastReadAt: new Date().toISOString(),
  }
}
