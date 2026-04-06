/**
 * Virgil Suggestions — Simple rule-based book recommendation
 * No AI needed. Rules based on reading history and tradition patterns.
 */

import type { BookProgress } from "@/lib/book-progress"
import { getAllBookProgress } from "@/lib/book-progress"

interface Suggestion {
  bookTitle: string
  bookId: string
  reason: string
}

// ── Tier 1 fallback suggestions ──────────────────

const TIER_1_SUGGESTIONS: Suggestion[] = [
  { bookId: "the-odyssey", bookTitle: "The Odyssey", reason: "the foundation of Western storytelling" },
  { bookId: "the-inferno", bookTitle: "Inferno", reason: "Virgil himself is the guide" },
  { bookId: "pride-and-prejudice", bookTitle: "Pride and Prejudice", reason: "the most re-read novel in the English language" },
  { bookId: "meditations", bookTitle: "Meditations", reason: "a Roman emperor's private journal on how to live" },
  { bookId: "frankenstein", bookTitle: "Frankenstein", reason: "the first science fiction novel, and still the best" },
  { bookId: "hamlet", bookTitle: "Hamlet", reason: "Shakespeare at his most psychologically complex" },
  { bookId: "crime-and-punishment", bookTitle: "Crime and Punishment", reason: "the greatest novel about guilt ever written" },
]

// ── Tradition pairings ───────────────────────────

const TRADITION_PAIRS: Record<string, string[]> = {
  "Ancient Greek": ["Roman", "Renaissance"],
  "Roman": ["Ancient Greek", "Enlightenment"],
  "Medieval European": ["Renaissance", "Romantic"],
  "Renaissance": ["Enlightenment", "Ancient Greek"],
  "Enlightenment": ["Victorian", "American"],
  "Victorian": ["Modernist", "Romantic"],
  "Russian": ["French", "Modernist"],
  "French": ["Russian", "Victorian"],
  "American": ["Victorian", "Modernist"],
  "Modernist": ["Russian", "American"],
  "Eastern": ["Ancient Greek", "Enlightenment"],
}

// ── Special connections ──────────────────────────

const SPECIAL_FOLLOWS: Record<string, Suggestion> = {
  "the-odyssey": { bookId: "the-inferno", bookTitle: "Inferno", reason: "Virgil wrote it — and he's the guide through Hell" },
  "the-iliad": { bookId: "the-odyssey", bookTitle: "The Odyssey", reason: "the sequel to the Trojan War" },
  "the-inferno": { bookId: "the-aeneid", bookTitle: "The Aeneid", reason: "Virgil's own epic, the source of Dante's reverence" },
  "pride-and-prejudice": { bookId: "jane-eyre", bookTitle: "Jane Eyre", reason: "a fiercer heroine in a darker world" },
  "frankenstein": { bookId: "dracula", bookTitle: "Dracula", reason: "the other pillar of Gothic horror" },
  "crime-and-punishment": { bookId: "anna-karenina", bookTitle: "Anna Karenina", reason: "the other peak of Russian psychological fiction" },
  "hamlet": { bookId: "macbeth", bookTitle: "Macbeth", reason: "Shakespeare's other great study of ambition and conscience" },
  "meditations": { bookId: "the-republic", bookTitle: "The Republic", reason: "from personal ethics to political philosophy" },
}

// ── Main suggestion function ─────────────────────

export function getSuggestion(
  currentBookId?: string,
  currentTradition?: string
): Suggestion | null {
  const allProgress = getAllBookProgress()
  const readBookIds = new Set(Object.keys(allProgress))

  // Rule 1: Special follow-up if just finished a specific book
  if (currentBookId && SPECIAL_FOLLOWS[currentBookId]) {
    const follow = SPECIAL_FOLLOWS[currentBookId]
    if (!readBookIds.has(follow.bookId)) return follow
  }

  // Rule 2: If reading one tradition, suggest a paired tradition
  if (currentTradition && TRADITION_PAIRS[currentTradition]) {
    const pairedTraditions = TRADITION_PAIRS[currentTradition]
    for (const tier1 of TIER_1_SUGGESTIONS) {
      if (!readBookIds.has(tier1.bookId)) {
        // We'd need tradition data here — for now, use the fallback
        return tier1
      }
    }
  }

  // Rule 3: Always suggest Inferno if not started (the Virgil connection)
  if (!readBookIds.has("the-inferno")) {
    return {
      bookId: "the-inferno",
      bookTitle: "Inferno",
      reason: "Virgil himself is the guide through Hell",
    }
  }

  // Rule 4: Fallback — first unread Tier 1 book
  for (const suggestion of TIER_1_SUGGESTIONS) {
    if (!readBookIds.has(suggestion.bookId)) return suggestion
  }

  return null
}

// ── Build reflection context from progress ───────

export function buildDashboardContext(
  allProgress: Record<string, BookProgress>
): {
  booksRead: string[]
  totalChapters: number
  totalQuizzes: number
  totalWisdom: number
  streakDays: number
  currentBookId?: string
  currentBookTitle?: string
} {
  const entries = Object.entries(allProgress)
  const booksRead = entries.map(([id]) => id)
  let totalChapters = 0
  let totalQuizzes = 0
  let totalWisdom = 0
  let latestBook: { id: string; lastRead: string } | null = null

  for (const [id, progress] of entries) {
    totalChapters += progress.completedChapterIndices.length
    totalQuizzes += progress.quizResults.length
    totalWisdom += progress.totalXpEarned
    if (!latestBook || progress.lastReadAt > latestBook.lastRead) {
      latestBook = { id, lastRead: progress.lastReadAt }
    }
  }

  // Rough streak calculation from localStorage
  let streakDays = 0
  if (typeof window !== "undefined") {
    try {
      const streakRaw = localStorage.getItem("tome-streak")
      if (streakRaw) {
        const streak = JSON.parse(streakRaw)
        streakDays = streak.current ?? 0
      }
    } catch {}
  }

  return {
    booksRead,
    totalChapters,
    totalQuizzes,
    totalWisdom,
    streakDays,
    currentBookId: latestBook?.id,
  }
}
