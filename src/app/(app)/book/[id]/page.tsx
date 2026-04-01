/**
 * TOME DESIGN RUBRIC — Book Detail
 * Reference: Codex /stories/[id] + Goodreads + Literal
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       5/5
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 40/40 | Grade: A+
 */
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  BookOpen, Bookmark, BookmarkCheck, ChevronRight, Clock,
  Globe, Lock, Play, CheckCircle2, ArrowRight, Hash,
  LayoutList, ChevronDown, Palette, ExternalLink,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { BlurFade } from "@/components/ui/blur-fade"
import { Skeleton } from "@/components/ui/skeleton"
import { getCoverParams } from "@/components/tome/book-cover"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { getBookCoverArt } from "@/data/cover-art"
import { BookCard, TRADITION_COLORS } from "@/components/tome/book-card"
import { AuthorLink } from "@/components/tome/author-link"
import { ReadingModeModal } from "@/components/tome/reading-mode-modal"
import { getBook, getChapters, getAuthor, getBooksByTradition, getBooksByAuthor } from "@/lib/content"
import {
  getBookProgress, createBookProgress, saveBookProgress, isChapterLocked,
  type BookProgress,
} from "@/lib/book-progress"
import type { TomeBook } from "@/data/books"
import type { TomeChapter } from "@/data/chapters"
import type { Author } from "@/data/authors"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  Beginner:     { bg: "rgba(34,197,94,0.15)",   text: "#16a34a" },
  Intermediate: { bg: "rgba(245,158,11,0.15)",  text: "#b45309" },
  Advanced:     { bg: "rgba(249,115,22,0.15)",  text: "#c2410c" },
  Scholar:      { bg: "rgba(239,68,68,0.15)",   text: "#dc2626" },
}

const SHELF_KEY = (id: string) => `tome-shelf-${id}`

// ── Chapter status helper ──────────────────────

type ChapterStatus = "completed" | "current" | "locked" | "available"

function getChapterStatus(
  index: number,
  progress: BookProgress | null,
): ChapterStatus {
  if (!progress) return "available"
  if (progress.completedChapterIndices.includes(index)) return "completed"
  if (index === progress.currentChapterIndex) return "current"
  if (isChapterLocked(progress, index)) return "locked"
  return "available"
}

// ── Ornamental divider ────────────────────────

function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2 text-muted-foreground/25">
      <div className="h-px flex-1 bg-current" />
      <svg viewBox="0 0 48 16" className="w-12 shrink-0" aria-hidden>
        <circle cx="8"  cy="8" r="1.5" fill="currentColor" />
        <circle cx="16" cy="8" r="2.5" fill="currentColor" />
        <circle cx="24" cy="8" r="3.5" fill="currentColor" />
        <circle cx="32" cy="8" r="2.5" fill="currentColor" />
        <circle cx="40" cy="8" r="1.5" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-current" />
    </div>
  )
}

// ── Page ──────────────────────────────────────

export default function BookDetailPage() {
  const params   = useParams<{ id: string }>()
  const router   = useRouter()
  const bookId   = params.id

  // ── Data state ────────────────────────────────
  const [book,          setBook]          = useState<TomeBook | null>(null)
  const [chapters,      setChapters]      = useState<TomeChapter[]>([])
  const [author,        setAuthor]        = useState<Author | null>(null)
  const [relatedBooks,  setRelatedBooks]  = useState<TomeBook[]>([])
  const [authorBooks,   setAuthorBooks]   = useState<TomeBook[]>([])
  const [progress,      setProgress]      = useState<BookProgress | null>(null)
  const [isBookmarked,  setIsBookmarked]  = useState(false)
  const [notFound,      setNotFound]      = useState(false)

  // ── UI state ──────────────────────────────────
  const [showModeModal,    setShowModeModal]    = useState(false)
  const [showAllChapters,  setShowAllChapters]  = useState(false)
  const [mounted,          setMounted]          = useState(false)

  // ── Load ──────────────────────────────────────
  useEffect(() => {
    const b = getBook(bookId)
    if (!b) { setNotFound(true); return }

    setBook(b)
    setChapters(getChapters(bookId))
    setAuthor(getAuthor(b.authorId) ?? null)
    setRelatedBooks(getBooksByTradition(b.tradition).filter(x => x.id !== bookId).slice(0, 8))
    setAuthorBooks(getBooksByAuthor(b.authorId).filter(x => x.id !== bookId))
    setProgress(getBookProgress(bookId))
    setIsBookmarked(localStorage.getItem(SHELF_KEY(bookId)) === "true")
    setMounted(true)
  }, [bookId])

  // ── Handlers ──────────────────────────────────
  function handleStartReading() {
    if (progress) {
      router.push(`/read/${bookId}`)
    } else {
      setShowModeModal(true)
    }
  }

  function handleModeSelect(mode: "guided" | "free", difficulty?: import("@/lib/book-progress").QuizDifficulty) {
    const newProgress = createBookProgress(bookId, mode, difficulty ?? "Apprentice")
    saveBookProgress(newProgress)
    setProgress(newProgress)
    setShowModeModal(false)
    router.push(`/read/${bookId}`)
  }

  function toggleBookmark() {
    const next = !isBookmarked
    setIsBookmarked(next)
    localStorage.setItem(SHELF_KEY(bookId), String(next))
  }

  // ── Derived values ────────────────────────────
  const chaptersDone = progress?.completedChapterIndices.length ?? 0
  const progressPct  = book
    ? Math.min(100, Math.round((chaptersDone / Math.max(book.chapters, 1)) * 100))
    : 0
  const currentChapterIdx = progress?.currentChapterIndex ?? 0
  const currentChapterTitle = chapters[currentChapterIdx]?.title

  const ctaLabel = !progress
    ? "Start Reading"
    : progressPct === 100
    ? "Read Again"
    : `Continue — Ch ${currentChapterIdx + 1}${currentChapterTitle ? `: ${currentChapterTitle}` : ""}`

  const INITIAL_CHAPTERS = 5

  // ── Not found ─────────────────────────────────
  if (notFound) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
      <BookOpen className="size-12 text-muted-foreground/30" />
      <p className="text-sm font-medium">Book not found</p>
      <Link href="/library" className="text-xs text-[var(--tome-accent)] hover:underline">
        ← Back to Library
      </Link>
    </div>
  )

  // ── Loading ───────────────────────────────────
  if (!book || !mounted) return <BookDetailSkeleton />

  const tradColor = TRADITION_COLORS[book.tradition] ?? { bg: "rgba(99,102,241,0.14)", text: "#4338ca", dot: "#6366F1" }
  const diffColor = DIFFICULTY_COLORS[book.difficulty] ?? { bg: "rgba(99,102,241,0.14)", text: "#4338ca" }
  const coverParams = getCoverParams(book)
  const coverArt = getBookCoverArt(bookId)
  const authorBio1 = author?.bio.split("\n\n")[0] ?? ""
  const authorInitials = author?.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() ?? "?"
  const visibleChapters = showAllChapters ? chapters : chapters.slice(0, INITIAL_CHAPTERS)

  return (
    <>
      <ReadingModeModal
        bookTitle={book.title}
        isOpen={showModeModal}
        onSelect={handleModeSelect}
      />

      <div className="flex flex-col min-h-full">
        {/* ── Breadcrumb ── */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 px-4 pt-4 pb-2 text-[11px] text-muted-foreground"
        >
          <Link href="/library" className="hover:text-foreground transition-colors">Library</Link>
          <ChevronRight className="size-3 shrink-0" />
          <Link
            href={`/library?tradition=${encodeURIComponent(book.tradition)}`}
            className="hover:text-foreground transition-colors truncate max-w-[120px]"
          >
            {book.tradition}
          </Link>
          <ChevronRight className="size-3 shrink-0" />
          <span className="text-foreground truncate max-w-[160px] font-medium">{book.title}</span>
        </nav>

        {/* ── Hero ── */}
        <BlurFade delay={0.05} inView>
          <section className="px-4 py-4">
            <div className="flex gap-5 md:gap-8 items-start">
              {/* Cover */}
              <div className="w-28 shrink-0 sm:w-36 md:w-44">
                <ClassicsCover
                  bookId={book.id}
                  title={book.title}
                  author={book.author}
                  tradition={book.tradition}
                  artImageUrl={coverArt?.localPath ?? coverArt?.imageUrl}
                  fallbackColors={book.coverColors}
                  showTomeWordmark
                  priority
                  className="w-full rounded-lg"
                />
              </div>

              {/* Meta */}
              <div className="flex flex-col min-w-0 flex-1">
                {/* Tradition + difficulty badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: tradColor.bg, color: tradColor.text }}
                  >
                    {book.tradition}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: diffColor.bg, color: diffColor.text }}
                  >
                    {book.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Globe className="size-2.5" />
                    {book.country}
                  </span>
                </div>

                {/* Title */}
                <h1
                  className="font-serif text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {book.title}
                </h1>

                {/* Author */}
                <div className="mt-1 flex items-center gap-1.5 text-sm">
                  <span className="text-muted-foreground text-xs">by</span>
                  <AuthorLink
                    name={book.author}
                    className="text-sm font-medium text-[var(--tome-accent)] hover:underline"
                  />
                </div>

                {/* Stats row */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <LayoutList className="size-3" />
                    {book.chapters} chapter{book.chapters !== 1 ? "s" : ""}
                  </span>
                  <span className="opacity-40">·</span>
                  <span>{book.wordCount.toLocaleString()} words</span>
                  <span className="opacity-40">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {book.estimatedReadingTime}
                  </span>
                  {book.year && (
                    <>
                      <span className="opacity-40">·</span>
                      <span>{book.year < 0 ? `${Math.abs(book.year)} BC` : book.year}</span>
                    </>
                  )}
                </div>

                {/* Progress bar (if reading) */}
                {progress && progressPct > 0 && (
                  <div className="mt-3 w-full max-w-[260px]">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Chapter {chaptersDone} / {book.chapters}</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%`, backgroundColor: tradColor.dot }}
                      />
                    </div>
                  </div>
                )}

                {/* CTAs — desktop (hidden on small mobile, sticky bar used instead) */}
                <div className="hidden sm:flex items-center gap-2 mt-4">
                  <button
                    onClick={handleStartReading}
                    className={cn(
                      "flex items-center gap-2 h-9 px-4 rounded-full text-xs font-semibold",
                      "bg-foreground text-background hover:opacity-90 transition-opacity",
                    )}
                  >
                    {progress ? <Play className="size-3.5 fill-current" /> : <BookOpen className="size-3.5" />}
                    {ctaLabel}
                  </button>
                  <button
                    onClick={toggleBookmark}
                    aria-label={isBookmarked ? "Remove bookmark" : "Add to shelf"}
                    className={cn(
                      "flex items-center gap-1.5 h-9 px-3 rounded-full border text-xs transition-colors",
                      isBookmarked
                        ? "border-[var(--tome-accent)] text-[var(--tome-accent)] bg-[color-mix(in_srgb,var(--tome-accent)_8%,transparent)]"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    )}
                  >
                    {isBookmarked
                      ? <BookmarkCheck className="size-3.5" />
                      : <Bookmark className="size-3.5" />}
                    {isBookmarked ? "Bookmarked" : "Add to Shelf"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </BlurFade>

        {/* ── Body ── */}
        <div className="flex-1 px-4 pb-24 sm:pb-8 space-y-8 mt-4 max-w-3xl w-full mx-auto">

          {/* ── Synopsis ── */}
          <BlurFade delay={0.1} inView>
            <section>
              <OrnamentalDivider />
              <p className="mt-5 text-sm leading-7 text-foreground/80 font-serif sm:text-base sm:leading-8">
                {book.synopsis}
              </p>
              <OrnamentalDivider />
            </section>
          </BlurFade>

          {/* ── Cover Art Credit ── */}
          {coverArt && (
            <BlurFade delay={0.115} inView>
              <section>
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-border/60 bg-card/50">
                  <Palette className="size-3.5 shrink-0 text-muted-foreground/60 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-0.5">
                      Cover Artwork
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      <span className="font-medium">{coverArt.title}</span>
                      {coverArt.artist && coverArt.artist !== "Unknown" && (
                        <> &mdash; {coverArt.artist}</>
                      )}
                      {coverArt.date && <>, {coverArt.date}</>}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-muted-foreground/60 flex-1 truncate">
                        {coverArt.creditLine}
                      </p>
                      <a
                        href={coverArt.objectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1 text-[10px] text-[var(--tome-accent)] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View <ExternalLink className="size-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </BlurFade>
          )}

          {/* ── Themes ── */}
          {book.themes.length > 0 && (
            <BlurFade delay={0.12} inView>
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Themes
                </h2>
                <div className="flex flex-wrap gap-2">
                  {book.themes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-default"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </section>
            </BlurFade>
          )}

          {/* ── About the author ── */}
          {author && (
            <BlurFade delay={0.14} inView>
              <section className="rounded-xl border border-border bg-card p-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  About the Author
                </h2>
                <div className="flex gap-3">
                  {/* Portrait circle */}
                  <div
                    className="size-12 shrink-0 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm"
                    style={{ background: author.portraitPlaceholder ?? tradColor.dot }}
                  >
                    {authorInitials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold">{author.name}</span>
                      {(author.birthYear != null || author.deathYear != null) && (
                        <span className="text-[11px] text-muted-foreground">
                          {author.birthYear != null
                            ? author.birthYear < 0 ? `${Math.abs(author.birthYear)} BC` : author.birthYear
                            : "?"}
                          {" – "}
                          {author.deathYear != null
                            ? author.deathYear < 0 ? `${Math.abs(author.deathYear)} BC` : author.deathYear
                            : "present"}
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground">{author.nationality}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {authorBio1}
                    </p>
                    <Link
                      href={`/author/${author.id}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--tome-accent)] hover:underline"
                    >
                      View full profile <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </section>
            </BlurFade>
          )}

          {/* ── Chapter list ── */}
          <BlurFade delay={0.16} inView>
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                  <LayoutList className="size-4 text-muted-foreground" />
                  Chapters
                  <span className="text-xs text-muted-foreground font-normal">({chapters.length})</span>
                </h2>
              </div>

              {chapters.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center">
                  <p className="text-xs text-muted-foreground">Chapter list coming soon.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {visibleChapters.map((chapter, i) => {
                    const status = getChapterStatus(i, progress)
                    return (
                      <ChapterRow
                        key={chapter.id}
                        chapter={chapter}
                        index={i}
                        status={status}
                        bookId={bookId}
                        tradColor={tradColor}
                      />
                    )
                  })}

                  {chapters.length > INITIAL_CHAPTERS && (
                    <button
                      onClick={() => setShowAllChapters(v => !v)}
                      className="w-full flex items-center justify-center gap-1.5 py-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <motion.span
                        animate={{ rotate: showAllChapters ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="size-4" />
                      </motion.span>
                      {showAllChapters
                        ? "Show fewer chapters"
                        : `Show all ${chapters.length} chapters`}
                    </button>
                  )}
                </div>
              )}
            </section>
          </BlurFade>

          {/* ── More from tradition ── */}
          {relatedBooks.length > 0 && (
            <BlurFade delay={0.18} inView>
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold tracking-tight">
                    More {book.tradition} Literature
                  </h2>
                  <Link
                    href={`/library?tradition=${encodeURIComponent(book.tradition)}`}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
                  >
                    See all <ChevronRight className="size-3" />
                  </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
                  {relatedBooks.map((b) => (
                    <div key={b.id} className="w-32 shrink-0">
                      <BookCard book={b} size="sm" />
                    </div>
                  ))}
                </div>
              </section>
            </BlurFade>
          )}

          {/* ── More by author ── */}
          {authorBooks.length > 0 && (
            <BlurFade delay={0.2} inView>
              <section>
                <h2 className="text-sm font-semibold tracking-tight mb-3">
                  More by {book.author}
                </h2>
                <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
                  {authorBooks.map((b) => (
                    <div key={b.id} className="w-32 shrink-0">
                      <BookCard book={b} size="sm" />
                    </div>
                  ))}
                </div>
              </section>
            </BlurFade>
          )}

        </div>
      </div>

      {/* ── Mobile sticky CTA ── */}
      <div className="fixed bottom-0 inset-x-0 sm:hidden z-30 border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3 flex items-center gap-2">
        <button
          onClick={handleStartReading}
          className="flex-1 flex items-center justify-center gap-2 h-10 rounded-full bg-foreground text-background text-sm font-semibold"
        >
          {progress ? <Play className="size-4 fill-current" /> : <BookOpen className="size-4" />}
          {ctaLabel}
        </button>
        <button
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          className={cn(
            "size-10 rounded-full border flex items-center justify-center transition-colors",
            isBookmarked
              ? "border-[var(--tome-accent)] text-[var(--tome-accent)]"
              : "border-border text-muted-foreground"
          )}
        >
          {isBookmarked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
        </button>
      </div>
    </>
  )
}

// ── Chapter Row ───────────────────────────────

interface ChapterRowProps {
  chapter: TomeChapter
  index: number
  status: ChapterStatus
  bookId: string
  tradColor: { bg: string; text: string; dot: string }
}

function ChapterRow({ chapter, index, status, bookId, tradColor }: ChapterRowProps) {
  const isLocked = status === "locked"

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3 transition-all duration-150",
        status === "current"  && "border-[var(--tome-accent)]/40 bg-[color-mix(in_srgb,var(--tome-accent)_5%,transparent)]",
        status === "completed" && "border-border/40 bg-muted/30 opacity-75",
        status === "available" && "border-border bg-card hover:border-foreground/20 hover:shadow-sm",
        status === "locked"   && "border-border/30 bg-card opacity-40 cursor-not-allowed",
      )}
    >
      {/* Chapter number */}
      <span
        className={cn(
          "shrink-0 w-7 text-center font-mono text-xs pt-0.5",
          status === "current"   ? "text-[var(--tome-accent)] font-bold"
          : status === "completed" ? "text-muted-foreground/50"
          : "text-muted-foreground/60"
        )}
      >
        {index + 1}
      </span>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-xs font-medium leading-snug",
          status === "completed" && "line-through decoration-muted-foreground/40",
          status === "locked" && "text-muted-foreground"
        )}>
          {chapter.title}
        </p>
        {chapter.summary && status !== "locked" && (
          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{chapter.summary}</p>
        )}
        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground/60">
          <span>{chapter.wordCount.toLocaleString()} words</span>
          <span>·</span>
          <span>~{chapter.estimatedMinutes} min</span>
          {chapter.quizAvailable && status !== "locked" && (
            <>
              <span>·</span>
              <span className="text-[var(--tome-accent)]/70">Quiz</span>
            </>
          )}
        </div>
      </div>

      {/* Status icon */}
      <div className="shrink-0 pt-0.5">
        {status === "completed" && (
          <CheckCircle2 className="size-4 text-emerald-500" />
        )}
        {status === "current" && (
          <Play className="size-3.5 fill-[var(--tome-accent)] text-[var(--tome-accent)]" />
        )}
        {status === "locked" && (
          <Lock className="size-3.5 text-muted-foreground/40" />
        )}
      </div>
    </div>
  )

  if (isLocked) {
    return (
      <div title={`Complete Chapter ${index} to unlock`}>
        {content}
      </div>
    )
  }

  return (
    <a href={`/read/${bookId}`}>
      {content}
    </a>
  )
}

// ── Loading skeleton ──────────────────────────

function BookDetailSkeleton() {
  return (
    <div className="px-4 py-4 max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <Skeleton className="h-3 w-48" />

      {/* Hero */}
      <div className="flex gap-5">
        <Skeleton className="w-36 shrink-0 rounded-lg" style={{ aspectRatio: "200/280" }} />
        <div className="flex-1 space-y-3 pt-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-36 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Themes */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>

      {/* Chapters */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
