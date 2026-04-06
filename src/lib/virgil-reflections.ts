/**
 * Virgil Reflections — Contextual templated messages
 * No AI calls — these are smart string templates filled with user data.
 */

export type ReflectionType = "progress" | "suggestion" | "knowledge" | "study"

export interface ReflectionContext {
  bookTitle?: string
  bookId?: string
  chaptersCompleted?: number
  totalChapters?: number
  quizScore?: number
  quizTotal?: number
  correctCount?: number
  totalCount?: number
  achievementName?: string
  weakCategory?: string
  strongCategory?: string
  streakDays?: number
  booksRead?: string[]
  tradition?: string
  wisdomEarned?: number
  quizCount?: number
  suggestedBook?: string
  suggestedReason?: string
  daysSinceLastRead?: number
  chapterNumber?: number
}

// ── Template pools ───────────────────────────────

const PROGRESS_TEMPLATES = [
  (c: ReflectionContext) =>
    c.chaptersCompleted && c.totalChapters && c.bookTitle
      ? `You've completed ${c.chaptersCompleted} of ${c.totalChapters} chapters in ${c.bookTitle}. The journey is the point — but the destination isn't bad either.`
      : null,
  (c: ReflectionContext) =>
    c.chaptersCompleted && c.chaptersCompleted >= 3 && c.bookTitle
      ? `${c.chaptersCompleted} chapters this week. ${c.bookTitle} is beginning to reveal its architecture. The best books reward those who stay.`
      : null,
  (c: ReflectionContext) =>
    c.streakDays && c.streakDays >= 3
      ? `${c.streakDays} days without missing a reading. Odysseus wandered for ten years — you're ahead of schedule.`
      : null,
  (c: ReflectionContext) =>
    c.booksRead && c.booksRead.length >= 2
      ? `You've read across ${c.booksRead.length} books. That's more than most people read in a year. Keep going.`
      : null,
  (c: ReflectionContext) =>
    c.chaptersCompleted && c.chaptersCompleted >= 5 && c.bookTitle
      ? `You're past the halfway mark in ${c.bookTitle}. The second half of a great book always reads faster than the first.`
      : null,
]

const SUGGESTION_TEMPLATES = [
  (c: ReflectionContext) =>
    c.bookTitle && c.suggestedBook
      ? `If you're enjoying ${c.bookTitle}, you might try ${c.suggestedBook}. They share more than you'd expect.`
      : null,
  (c: ReflectionContext) =>
    c.tradition && c.suggestedBook
      ? `You've been reading ${c.tradition} literature. Have you considered ${c.suggestedBook}? A change in tradition sharpens the eye.`
      : null,
  (_c: ReflectionContext) =>
    `Dante wrote the Inferno with me as his guide. If you haven't read it yet — I can personally vouch for the tour.`,
  (c: ReflectionContext) =>
    c.bookTitle && c.suggestedBook && c.suggestedReason
      ? `You've been reading ${c.bookTitle}. The natural next step is ${c.suggestedBook} — ${c.suggestedReason}.`
      : null,
]

const KNOWLEDGE_TEMPLATES = [
  (c: ReflectionContext) =>
    c.correctCount != null && c.totalCount && c.bookTitle
      ? `You answered ${c.correctCount} of ${c.totalCount} questions correctly on ${c.bookTitle}. ${c.strongCategory ? `Your strongest category: ${c.strongCategory}.` : ""}`
      : null,
  (c: ReflectionContext) =>
    c.quizScore && c.quizScore >= 80
      ? `${c.quizScore}% on a Scholar-level quiz. That's not luck — that's comprehension.`
      : null,
  (c: ReflectionContext) =>
    c.wisdomEarned && c.quizCount
      ? `This week you've earned ${c.wisdomEarned} Wisdom across ${c.quizCount} quizzes. Your understanding is deepening.`
      : null,
  (c: ReflectionContext) =>
    c.quizScore && c.quizScore === 100 && c.bookTitle
      ? `Perfect score on ${c.bookTitle}. You understand these characters better than they understand themselves.`
      : null,
]

const STUDY_TEMPLATES = [
  (c: ReflectionContext) =>
    c.weakCategory && c.bookTitle
      ? `Your ${c.weakCategory} scores in ${c.bookTitle} are lower than your other categories. ${c.chapterNumber ? `Try re-reading Chapter ${c.chapterNumber} with the annotations visible.` : "Try reviewing the earlier chapters."}`
      : null,
  (_c: ReflectionContext) =>
    `You haven't attempted a quiz above Intermediate difficulty yet. When you're ready, Scholar-level questions test what you actually think, not just what you remember.`,
  (c: ReflectionContext) =>
    c.bookTitle && c.daysSinceLastRead && c.daysSinceLastRead >= 3
      ? `You've been reading ${c.bookTitle} for ${c.daysSinceLastRead} days without a quiz. A quick five questions will tell you what stuck.`
      : null,
  (_c: ReflectionContext) =>
    `Thematic analysis is where most readers struggle. Try asking me about themes before your next quiz — I can help you see the patterns.`,
]

const TEMPLATE_POOLS: Record<ReflectionType, ((c: ReflectionContext) => string | null)[]> = {
  progress: PROGRESS_TEMPLATES,
  suggestion: SUGGESTION_TEMPLATES,
  knowledge: KNOWLEDGE_TEMPLATES,
  study: STUDY_TEMPLATES,
}

// ── Generator ────────────────────────────────────

export function generateReflection(
  type: ReflectionType,
  context: ReflectionContext
): string | null {
  const pool = TEMPLATE_POOLS[type]
  if (!pool) return null

  // Shuffle pool deterministically based on current hour (so it changes daily)
  const hour = new Date().getHours()
  const shuffled = [...pool].sort((_, __) => Math.sin(hour * 31) - 0.5)

  for (const template of shuffled) {
    const result = template(context)
    if (result) return result
  }

  return null
}

// ── Session deduplication ────────────────────────

const SHOWN_KEY = "tome-virgil-reflections-shown"

export function hasBeenShown(hash: string): boolean {
  if (typeof window === "undefined") return false
  try {
    const shown = JSON.parse(sessionStorage.getItem(SHOWN_KEY) ?? "[]") as string[]
    return shown.includes(hash)
  } catch {
    return false
  }
}

export function markAsShown(hash: string): void {
  if (typeof window === "undefined") return
  try {
    const shown = JSON.parse(sessionStorage.getItem(SHOWN_KEY) ?? "[]") as string[]
    shown.push(hash)
    sessionStorage.setItem(SHOWN_KEY, JSON.stringify(shown))
  } catch {}
}

export function hashReflection(type: string, text: string): string {
  return `${type}:${text.slice(0, 40)}`
}
