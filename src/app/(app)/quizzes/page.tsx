"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Target, ChevronRight, BookOpen, ArrowRight, Check } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { getAllBookProgress, type BookProgress } from "@/lib/book-progress"
import { getBook } from "@/lib/content"
import type { TomeBook } from "@/data/books"

// Books with quiz content available
const QUIZ_BOOKS = [
  { key: "the-iliad", name: "The Iliad", chapters: [0, 1, 2, 3, 4] },
  { key: "the-odyssey", name: "The Odyssey", chapters: [0, 1, 2, 3, 4] },
  { key: "the-inferno", name: "Inferno", chapters: [0, 1, 2, 3] },
  { key: "hamlet", name: "Hamlet", chapters: [0, 1, 2, 3] },
  { key: "pride-and-prejudice", name: "Pride and Prejudice", chapters: [0, 1, 2] },
  { key: "crime-and-punishment", name: "Crime and Punishment", chapters: [0, 1, 2] },
]

interface QuizEntry {
  book: TomeBook
  bookKey: string
  chaptersWithQuiz: number[]
  progress: BookProgress | null
  completedQuizzes: number
}

export default function QuizzesPage() {
  const [entries, setEntries] = useState<QuizEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const allProgress = getAllBookProgress()
    const items: QuizEntry[] = []
    for (const qb of QUIZ_BOOKS) {
      const book = getBook(qb.key)
      if (!book) continue
      const progress = allProgress[qb.key] ?? null
      const completedQuizzes = progress?.quizResults?.length ?? 0
      items.push({ book, bookKey: qb.key, chaptersWithQuiz: qb.chapters, progress, completedQuizzes })
    }
    setEntries(items)
    setLoading(false)
  }, [])

  const inProgress = entries.filter(e => e.progress && e.completedQuizzes > 0 && e.completedQuizzes < e.chaptersWithQuiz.length)

  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-[var(--gold-default)]" />
          <h1 className="text-sm font-serif font-semibold leading-none tracking-tight">Quizzes</h1>
          <p className="text-[10px] text-muted-foreground ml-auto">{QUIZ_BOOKS.length} books with quizzes</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* In-progress quizzes */}
        {inProgress.length > 0 && (
          <BlurFade delay={0.1} inView>
            <section>
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Continue where you left off</h2>
              <div className="space-y-2">
                {inProgress.map((entry) => (
                  <QuizCard key={entry.bookKey} entry={entry} highlighted />
                ))}
              </div>
            </section>
          </BlurFade>
        )}

        {/* All quizzes */}
        <BlurFade delay={0.2} inView>
          <section>
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">All quizzes</h2>
            <div className="space-y-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                ))
              ) : (
                entries.map((entry, i) => (
                  <BlurFade key={entry.bookKey} delay={0.03 + i * 0.02} inView>
                    <QuizCard entry={entry} />
                  </BlurFade>
                ))
              )}
            </div>
          </section>
        </BlurFade>

        {/* Browse more */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground mb-2">Start reading a book to unlock its chapter quizzes</p>
          <Link href="/library" className="inline-flex items-center gap-1.5 text-sm text-[var(--gold-default)] hover:opacity-80 transition-opacity">
            Browse Library <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function QuizCard({ entry, highlighted }: { entry: QuizEntry; highlighted?: boolean }) {
  const totalQuizzes = entry.chaptersWithQuiz.length
  const completed = entry.completedQuizzes
  const pct = Math.round((completed / totalQuizzes) * 100)
  const isComplete = completed >= totalQuizzes
  const hasStarted = completed > 0

  return (
    <Link
      href={`/read/${entry.bookKey}`}
      className={`flex items-center gap-4 rounded-lg border p-4 transition-colors group ${
        highlighted ? "border-[var(--gold-default)]/40 bg-[var(--gold-default)]/5" : "border-border bg-card hover:border-[var(--gold-default)]/30"
      }`}
    >
      <div className="size-10 rounded-lg bg-[var(--indigo-muted)] flex items-center justify-center shrink-0">
        <Target className="size-5 text-[var(--indigo-default)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{entry.book.title}</p>
        <p className="text-xs text-muted-foreground">{entry.book.author} &middot; {totalQuizzes} chapter quizzes</p>
        <div className="flex items-center gap-2 mt-1.5">
          {isComplete ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--green-default)]">
              <Check className="size-3" /> Completed &middot; {completed}/{totalQuizzes}
            </span>
          ) : hasStarted ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--amber-default)]">
              In progress &middot; {completed}/{totalQuizzes}
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground">Not started</span>
          )}
        </div>
      </div>
      <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-[var(--gold-default)] transition-colors shrink-0" />
    </Link>
  )
}
