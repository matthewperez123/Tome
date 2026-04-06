"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, ArrowRight, Clock, ChevronRight } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { getAllBookProgress, type BookProgress } from "@/lib/book-progress"
import { getBook } from "@/lib/content"
import type { TomeBook } from "@/data/books"

interface ReadingEntry {
  book: TomeBook
  progress: BookProgress
}

export default function ReadingPage() {
  const [entries, setEntries] = useState<ReadingEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const allProgress = getAllBookProgress()
    const items: ReadingEntry[] = []
    for (const [bookId, progress] of Object.entries(allProgress)) {
      const book = getBook(bookId)
      if (book) items.push({ book, progress })
    }
    items.sort((a, b) => new Date(b.progress.lastReadAt).getTime() - new Date(a.progress.lastReadAt).getTime())
    setEntries(items)
    setLoading(false)
  }, [])

  const hasBooks = entries.length > 0

  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2.5">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-[var(--gold-default)]" />
          <h1 className="text-sm font-serif font-semibold leading-none tracking-tight">Reading</h1>
          {hasBooks && (
            <p className="text-[10px] text-muted-foreground ml-auto">{entries.length} {entries.length === 1 ? "book" : "books"} in progress</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : !hasBooks ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <BlurFade delay={0.1} inView>
              <div className="text-center max-w-md">
                <BookOpen className="size-12 text-[var(--gold-default)] mx-auto mb-4" />
                <h2 className="font-serif text-xl font-bold text-foreground mb-2">No books in progress</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Browse the library and start reading. Your progress will appear here.
                </p>
                <Link
                  href="/library"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--gold-default)] text-[var(--primary-foreground)] font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <BookOpen className="size-4" />
                  Browse Library
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </BlurFade>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const pct = Math.round((entry.progress.completedChapterIndices.length / Math.max(entry.book.chapters, 1)) * 100)
              const lastRead = new Date(entry.progress.lastReadAt)
              const daysAgo = Math.floor((Date.now() - lastRead.getTime()) / 86400000)
              const timeLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`

              return (
                <BlurFade key={entry.book.id} delay={0.03 + i * 0.02} inView>
                  <Link
                    href={`/read/${entry.book.id}`}
                    className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-[var(--gold-default)]/40 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{entry.book.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{entry.book.author}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-[var(--gold-default)]" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{pct}%</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                        <span>Ch {entry.progress.completedChapterIndices.length}/{entry.book.chapters}</span>
                        <span>&middot;</span>
                        <Clock className="size-3" />
                        <span>{timeLabel}</span>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-[var(--gold-default)] transition-colors shrink-0" />
                  </Link>
                </BlurFade>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
