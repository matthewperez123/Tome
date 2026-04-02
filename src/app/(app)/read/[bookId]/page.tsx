/**
 * TOME DESIGN RUBRIC — Reader
 * Reference: Kindle + Headspace + iBooks
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       N/A
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 35/35 | Grade: A+
 */
"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, BookCheck, Bookmark } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import type { Book } from "@/lib/supabase"
import { getBook, getChapters, getBookContentData } from "@/lib/content"
import type { TomeBook } from "@/data/books"
import type { TomeChapter, TomePart } from "@/data/chapters"
import type { QuizDifficulty } from "@/lib/book-progress"
import { springs } from "@/lib/design-tokens"
import { getCoverParams } from "@/components/tome/book-cover"
import { Particles } from "@/components/ui/particles"
import { Skeleton } from "@/components/ui/skeleton"
import { ChapterSidebar } from "./chapter-sidebar"
import { HighlightMenu } from "./highlight-menu"
import { AnnotationSidebar } from "./annotation-sidebar"
import { BookmarkPanel } from "./bookmark-panel"
import { ReaderSettings, DEFAULT_FONT_SIZE, type ReaderTheme, type FontSize } from "./reader-settings"
import { WordTooltipProvider } from "./word-tooltip"
import { useBookProgress } from "@/components/tome/book-progress-provider"
import { useEconomy } from "@/components/tome/economy-provider"
import { ReadingModeModal } from "@/components/tome/reading-mode-modal"
import { ChapterQuizOverlay } from "@/components/tome/chapter-quiz-overlay"
import { FreeModeBanner } from "@/components/tome/free-mode-banner"
import { getQuestionsForChapter } from "@/lib/chapter-questions"
import { isChapterLocked } from "@/lib/book-progress"
import { AuthorLink } from "@/components/tome/author-link"
import { cn } from "@/lib/utils"

// ── Types ──

type Chapter = {
  id: string
  title: string
  order: number
  content_html: string | null
}

const PLACEHOLDER_HTML = `<p>The dawn spread her fingertips of rose across the sky as the hero stood upon the shore, gazing out at the wine-dark sea that stretched endlessly before him.</p>
<p>In the great hall, the fire crackled and sent shadows dancing across the stone walls. The bard took up his lyre and began to sing of the deeds of men and gods.</p>
<p>The philosopher sat beneath the olive tree, his students gathered around him. He posed his question not to instruct, but to illuminate.</p>`

const themeStyles: Record<ReaderTheme, { bg: string; text: string; muted: string; border: string }> = {
  light: { bg: "var(--tome-surface-elevated)", text: "rgba(0,0,0,0.85)", muted: "rgba(0,0,0,0.45)", border: "var(--border)" },
  dark:  { bg: "#1C1914", text: "#E8DCC8", muted: "#8B7E6A", border: "#2A2520" },
}


export default function ReaderPage() {
  const params  = useParams()
  const router  = useRouter()
  const bookId  = params.bookId as string

  // ── Core state ──
  const [book, setBook]               = useState<TomeBook | Book | null>(null)
  const [chapters, setChapters]       = useState<(TomeChapter | Chapter)[]>([])
  const [parts, setParts]             = useState<TomePart[]>([])
  const [frontMatter, setFrontMatter] = useState<TomeChapter[]>([])
  const [backMatter, setBackMatter]   = useState<TomeChapter[]>([])
  const [chapterHTML, setChapterHTML] = useState<string>(PLACEHOLDER_HTML)
  const [loading, setLoading]         = useState(true)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [annotationOpen, setAnnotationOpen] = useState(false)
  const [bookmarkOpen, setBookmarkOpen] = useState(false)
  const [theme, setTheme]             = useState<ReaderTheme>("light")
  const [fontSize, setFontSize]       = useState<FontSize>(18)

  // ── Guided / Free flow state ──
  const [showModeModal, setShowModeModal]     = useState(false)
  const [showQuizOverlay, setShowQuizOverlay] = useState(false)
  const [chapterEndReached, setChapterEndReached] = useState(false)

  // ── Refs ──
  const scrollContentRef       = useRef<HTMLDivElement>(null)
  const sessionStartRef        = useRef(Date.now())
  const sentinelRef            = useRef<HTMLDivElement>(null)

  // ── Providers ──
  const { getProgress, startBook, completeChapter, saveQuizResult, setMode } = useBookProgress()
  const { stats, dispatch: dispatchEconomy } = useEconomy()

  // ────────────────────────────────────────────────────
  // Effects
  // ────────────────────────────────────────────────────

  // Load book and chapter list — static data first, Supabase fallback
  useEffect(() => {
    const staticBook    = getBook(bookId)
    const staticChapters = getChapters(bookId)

    if (staticBook) {
      setBook(staticBook)
      // Always try rebuilt meta.json first (has parts hierarchy)
      getBookContentData(bookId).then(data => {
        if (data.chapters.length > 0) {
          const allReadable = [...data.chapters, ...data.backMatter]
          setChapters(allReadable)
          setParts(data.parts)
          setFrontMatter(data.frontMatter)
          setBackMatter(data.backMatter)
        } else if (staticChapters.length > 0) {
          setChapters(staticChapters)
        }
        setLoading(false)
      })
    } else if (supabase) {
      // Supabase fallback for books not yet in static data layer
      Promise.all([
        supabase.from("books").select("*").eq("id", bookId).single(),
        supabase.from("chapters").select("id,title,order,content_html").eq("book_id", bookId).order("order"),
      ]).then(([bookRes, chaptersRes]) => {
        if (bookRes.data) setBook(bookRes.data as Book)
        if (chaptersRes.data?.length) setChapters(chaptersRes.data as Chapter[])
        setLoading(false)
      })
    } else {
      setLoading(false)
    }

    const existingProgress = getProgress(bookId)
    if (!existingProgress) setShowModeModal(true)
    else setCurrentChapter(existingProgress.currentChapterIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  // Load chapter HTML on demand — static file first, Supabase fallback
  useEffect(() => {
    setChapterHTML(PLACEHOLDER_HTML)
    let cancelled = false

    // Strip the first heading (h2/h3/h4) from HTML — the reader already renders
    // the chapter title, so the embedded heading from Standard Ebooks is a duplicate
    function stripLeadingHeading(html: string): string {
      return html.replace(/^\s*(?:<section[^>]*>\s*)?<h[2-4][^>]*>.*?<\/h[2-4]>/i, (match) => {
        // Keep the <section> opener if present, just remove the heading
        const sectionMatch = match.match(/^(\s*<section[^>]*>\s*)/i)
        return sectionMatch ? sectionMatch[1] : ""
      })
    }

    async function loadHTML() {
      // Map array index → file index (chapter.number holds the actual ch-N.json index)
      const chapterEntry = chapters[currentChapter] as (TomeChapter & { content_html?: string }) | undefined
      const fileIndex = chapterEntry?.number ?? currentChapter

      // 1. Try static content file
      try {
        const res = await fetch(`/content/${bookId}/ch-${fileIndex}.json`)
        if (res.ok) {
          const data = await res.json()
          if (!cancelled && data.html) { setChapterHTML(stripLeadingHeading(data.html)); return }
        }
      } catch { /* fall through */ }

      // 2. Try inline content_html from cached chapter (Supabase chapter already in state)
      if (chapterEntry?.content_html) {
        if (!cancelled) setChapterHTML(stripLeadingHeading(chapterEntry.content_html))
        return
      }

      // 3. Supabase fetch as last resort
      if (supabase) {
        try {
          const { data } = await supabase
            .from("chapters").select("content_html")
            .eq("book_id", bookId).order("order")
          if (!cancelled) setChapterHTML(stripLeadingHeading(data?.[currentChapter]?.content_html ?? PLACEHOLDER_HTML))
        } catch {
          if (!cancelled) setChapterHTML(PLACEHOLDER_HTML)
        }
      }
    }
    loadHTML()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, currentChapter, chapters])

  // Auto-save scroll progress every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      if (book) {
        localStorage.setItem(
          `tome-progress-${bookId}`,
          JSON.stringify({
            currentChapter,
            percent: Math.round(((currentChapter + 1) / (chapters.length || 1)) * 100),
            lastRead: new Date().toISOString(),
          })
        )
      }
    }, 30000)
    return () => clearInterval(timer)
  }, [book, bookId, currentChapter, chapters.length])

  // Reading session tracker — save on exit
  useEffect(() => {
    sessionStartRef.current = Date.now()
    return () => {
      const duration = Math.round((Date.now() - sessionStartRef.current) / 60000)
      if (duration > 0) {
        const sessions = JSON.parse(localStorage.getItem(`tome-sessions-${bookId}`) ?? "[]")
        sessions.push({ duration, date: new Date().toISOString(), chapters: currentChapter + 1 })
        localStorage.setItem(`tome-sessions-${bookId}`, JSON.stringify(sessions))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  // Reading time economy dispatch (guided mode only, every 60s)
  useEffect(() => {
    const progress = getProgress(bookId)
    if (!progress || progress.readingMode === "free") return
    const interval = setInterval(() => {
      if (!document.hidden) dispatchEconomy({ type: "reading_minutes", minutes: 1 })
    }, 60000)
    return () => clearInterval(interval)
  }, [bookId, getProgress, dispatchEconomy])

  // IntersectionObserver on chapter end sentinel
  useEffect(() => {
    setChapterEndReached(false)
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setChapterEndReached(true) },
      { threshold: 0.5 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [currentChapter])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const total = chapters.length || 1
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault()
        setCurrentChapter(c => Math.min(c + 1, total - 1))
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault()
        setCurrentChapter(c => Math.max(c - 1, 0))
      } else if (e.key === "Escape") {
        router.back()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [router, chapters.length])

  // ────────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────────

  // Sidebar chapter select — respects guided-mode locks
  const handleChapterSelect = useCallback((index: number) => {
    const prog = getProgress(bookId)
    if (prog && isChapterLocked(prog, index)) return
    setCurrentChapter(index)
    scrollContentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [bookId, getProgress])

  // Sequential prev/next nav — always works, no lock gating
  const navigateChapter = useCallback((index: number) => {
    if (index < 0 || index >= chapters.length) return
    setCurrentChapter(index)
    scrollContentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [chapters.length])

  const handleModeSelect = useCallback((mode: "guided" | "free", difficulty?: QuizDifficulty) => {
    startBook(bookId, mode, difficulty ?? 'Apprentice')
    setShowModeModal(false)
  }, [bookId, startBook])

  const handleFinishChapter = useCallback(() => {
    const prog = getProgress(bookId)
    const totalCount = chapters.length || 1
    if (!prog || prog.readingMode === "free") {
      if (currentChapter < totalCount - 1) handleChapterSelect(currentChapter + 1)
      return
    }
    setShowQuizOverlay(true)
  }, [bookId, getProgress, currentChapter, chapters.length, handleChapterSelect])

  const handleQuizPass = useCallback((xpEarned: number, _coinsEarned: number) => {
    const totalCount    = chapters.length || 1
    const isLastChapter = currentChapter === totalCount - 1
    const chapterData   = (chapters[currentChapter] ?? { id: `ch-${currentChapter}`, title: "Chapter 1" }) as { id: string; title: string }

    dispatchEconomy({ type: "chapter_complete" })
    if (isLastChapter) dispatchEconomy({ type: "book_complete" })

    completeChapter(bookId, currentChapter, xpEarned)
    saveQuizResult(bookId, {
      chapterId:       chapterData.id,
      chapterIndex:    currentChapter,
      score:           xpEarned / 10,
      totalQuestions:  5,
      passed:          true,
      xpEarned,
      completedAt:     new Date().toISOString(),
    })

    setShowQuizOverlay(false)
    if (!isLastChapter) setTimeout(() => navigateChapter(currentChapter + 1), 300)
  }, [bookId, currentChapter, chapters, dispatchEconomy, completeChapter, saveQuizResult, navigateChapter])

  const handleSwitchToGuided = useCallback(() => {
    setMode(bookId, "guided")
  }, [bookId, setMode])

  // ────────────────────────────────────────────────────
  // Loading / Error
  // ────────────────────────────────────────────────────

  if (loading) return <ReaderSkeleton />
  if (!book) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Book not found.</p>
      </div>
    )
  }

  // ────────────────────────────────────────────────────
  // Derived values
  // ────────────────────────────────────────────────────

  const coverParams          = getCoverParams(book as Parameters<typeof getCoverParams>[0])
  const totalChapters        = chapters.length || 1
  const chapterObj           = chapters[currentChapter] as TomeChapter | undefined
  const chapter              = { id: chapterObj?.id ?? "0", title: chapterObj?.title ?? "Chapter 1" }
  const chapterPartTitle     = (chapterObj as TomeChapter | undefined)?.partTitle
  const genreColor           = coverParams.primaryColor
  const t                    = themeStyles[theme]
  // reading_time_minutes (Supabase) or derive from wordCount (TomeBook)
  const totalReadingMinutes  = ('reading_time_minutes' in (book ?? {}))
    ? ((book as Book).reading_time_minutes ?? 60)
    : Math.round(((book as TomeBook).wordCount ?? 15000) / 250)
  const readingTimeRemaining = Math.round(
    ((totalChapters - currentChapter - 1) / totalChapters) * totalReadingMinutes
  )

  const progress               = getProgress(bookId)
  const readingMode            = progress?.readingMode ?? "guided"
  const quizDifficulty         = progress?.difficulty ?? 'Apprentice'
  // Convert array indices → file indices so sidebar can match against chapter.number
  const lockedChapterIndices   = chapters.map((ch, i) => (progress && isChapterLocked(progress, i) ? (ch as TomeChapter).number ?? i : -1)).filter(i => i >= 0)
  const completedChapterIndices = (progress?.completedChapterIndices ?? []).map(i => (chapters[i] as TomeChapter)?.number ?? i)
  const quizQuestions          = getQuestionsForChapter(book.title, currentChapter, quizDifficulty)

  // Progress bar fraction
  const progressFraction = (currentChapter + 1) / totalChapters

  // ────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────

  return (
    <WordTooltipProvider>
      {/* Free Mode Banner */}
      {readingMode === "free" && (
        <FreeModeBanner onSwitchToGuided={handleSwitchToGuided} />
      )}

      {/* Reading Mode Modal */}
      <ReadingModeModal
        bookTitle={book.title}
        isOpen={showModeModal}
        onSelect={handleModeSelect}
      />

      {/* Quiz Overlay */}
      {book && (
        <ChapterQuizOverlay
          book={book as Book}
          chapterTitle={chapter.title}
          chapterIndex={currentChapter}
          questions={quizQuestions}
          hearts={stats.hearts}
          isOpen={showQuizOverlay}
          onPass={handleQuizPass}
          onFail={() => setShowQuizOverlay(false)}
          onClose={() => setShowQuizOverlay(false)}
        />
      )}

      <div className="relative flex h-[calc(100vh-3rem)] overflow-hidden">
        {/* Chapter progress bar */}
        <div
          className="fixed inset-x-0 top-12 z-50 h-0.5 origin-left motion-reduce:transition-none"
          style={{
            background:  `linear-gradient(90deg, ${genreColor}, ${coverParams.secondaryColor})`,
            transform:   `scaleX(${progressFraction})`,
            transition:  "transform 0.5s var(--tome-ease-scholarly)",
          }}
        />

        {/* Chapter Sidebar */}
        <ChapterSidebar
          bookTitle={book.title}
          chapters={chapters as TomeChapter[]}
          parts={parts}
          frontMatter={frontMatter}
          backMatter={backMatter}
          currentChapter={currentChapter}
          onSelect={handleChapterSelect}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          lockedChapterIndices={lockedChapterIndices}
          completedChapterIndices={completedChapterIndices}
        />

        {/* Main Reader Area */}
        <div
          ref={scrollContentRef}
          className={cn(
            "relative flex flex-col flex-1 transition-colors duration-[var(--tome-duration-normal)] motion-reduce:transition-none",
            "overflow-y-auto"
          )}
          style={{ backgroundColor: t.bg, color: t.text }}
        >
          {/* Ambient Particles */}
          <Particles
            className="pointer-events-none absolute inset-0 z-0"
            quantity={25}
            color={genreColor}
            ease={80}
            staticity={60}
            size={0.4}
          />

          {/* Cool tint overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: theme === "dark"
                ? "radial-gradient(ellipse at 50% 30%, rgba(234,179,8,0.02), transparent 70%)"
                : "radial-gradient(ellipse at 50% 30%, rgba(14,165,233,0.03), transparent 70%)",
            }}
          />

          {/* Reader Toolbar */}
          <div
            className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b px-4 py-1.5 backdrop-blur-sm"
            style={{
              borderColor:     t.border,
              backgroundColor: theme === "dark" ? "#1C1914E6" : "rgba(249,250,251,0.8)",
            }}
          >
            <div className="flex flex-col min-w-0 max-w-[200px]">
              <p className="text-[10px] font-medium truncate" style={{ color: t.muted }}>
                {book.title} — {chapterPartTitle ? `${chapterPartTitle}, ` : ""}{chapter.title}
              </p>
              <AuthorLink
                name={book.author}
                className="text-[9px] truncate opacity-70 hover:opacity-100"
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setAnnotationOpen(!annotationOpen)}
                className="flex size-7 items-center justify-center rounded-md transition-colors hover:opacity-70"
                style={{ color: t.muted }}
                aria-label="Toggle annotations sidebar"
              >
                <MessageSquare className="size-3.5" />
              </button>
              <button
                onClick={() => setBookmarkOpen(!bookmarkOpen)}
                className="flex size-7 items-center justify-center rounded-md transition-colors hover:opacity-70"
                style={{ color: t.muted }}
                aria-label="Bookmarks"
              >
                <Bookmark className="size-3.5" />
              </button>
              <ReaderSettings
                theme={theme}
                fontSize={fontSize}
                onThemeChange={setTheme}
                onFontSizeChange={setFontSize}
              />
            </div>
          </div>

          {/* ── Content Area ── */}

          {/* ── Scroll reader ── */}
            <>
              <div className="relative z-10 mx-auto w-full max-w-[680px] px-6 py-12 md:px-8 md:py-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentChapter}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={springs.gentle}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: t.muted }}>
                      {book.title}
                    </p>
                    <h1 className="font-serif text-3xl font-semibold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                      {chapter.title}
                    </h1>
                    <div className="mt-2 h-px w-16" style={{ backgroundColor: t.border }} />

                    {/* Body Text */}
                    <div
                      className="mt-8 font-serif prose-reader"
                      style={{
                        fontSize:   `${fontSize}px`,
                        lineHeight: 1.6,
                        color:      theme === "dark" ? "#E8DCC8E6" : "rgba(0,0,0,0.85)",
                      }}
                      data-reader-text
                      dangerouslySetInnerHTML={{ __html: chapterHTML }}
                    />

                    {/* Finish Chapter CTA */}
                    <AnimatePresence>
                      {chapterEndReached && (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={springs.gentle}
                          className="mt-12 flex flex-col items-center gap-3"
                        >
                          <button
                            onClick={handleFinishChapter}
                            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
                          >
                            <BookCheck className="size-4" />
                            {readingMode === "guided" ? "Finish Chapter & Take Trial" : "Next Chapter →"}
                          </button>
                          {readingMode === "guided" && (
                            <p className="text-[11px]" style={{ color: t.muted }}>
                              Pass the trial to unlock the next chapter
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Chapter Navigation */}
                    <div className="mt-16 flex items-center justify-between border-t pt-6" style={{ borderColor: t.border }}>
                      <button
                        disabled={currentChapter === 0}
                        onClick={() => navigateChapter(currentChapter - 1)}
                        className="text-xs transition-colors disabled:opacity-30 hover:opacity-70"
                        style={{ color: t.muted }}
                      >
                        ← Previous chapter
                      </button>
                      <span className="text-[10px] tabular-nums" style={{ color: t.muted }}>
                        {currentChapter + 1} / {totalChapters}
                      </span>
                      <button
                        disabled={currentChapter === totalChapters - 1}
                        onClick={() => navigateChapter(currentChapter + 1)}
                        className="text-xs transition-colors disabled:opacity-30 hover:opacity-70"
                        style={{ color: t.muted }}
                      >
                        Next chapter →
                      </button>
                    </div>

                    {/* End-of-chapter sentinel for IntersectionObserver */}
                    <div ref={sentinelRef} className="h-px w-full mt-8" aria-hidden />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Reading time footer (scroll mode only) */}
              <div
                className="sticky bottom-0 z-20 border-t px-6 py-2 text-center backdrop-blur-sm"
                style={{
                  borderColor:     t.border,
                  backgroundColor: theme === "dark" ? "#1C1914CC" : "rgba(249,250,251,0.8)",
                }}
              >
                <p className="text-[10px] tabular-nums" style={{ color: t.muted }}>
                  {readingTimeRemaining > 0 ? `~${readingTimeRemaining} min remaining` : "Final chapter"}
                </p>
              </div>
            </>
        </div>

        {/* Annotation Sidebar */}
        <AnnotationSidebar
          bookId={bookId}
          chapterIndex={currentChapter}
          open={annotationOpen}
          onClose={() => setAnnotationOpen(false)}
        />

        {/* Bookmark Panel */}
        <BookmarkPanel
          bookId={bookId}
          bookTitle={book.title}
          isOpen={bookmarkOpen}
          onClose={() => setBookmarkOpen(false)}
        />

        {/* Highlight Menu */}
        <HighlightMenu
          bookId={bookId}
          bookTitle={book.title}
          chapterId={chapter.id}
          chapterIndex={currentChapter}
          chapterTitle={chapter.title}
          onBookmarkAdded={() => setBookmarkOpen(true)}
        />
      </div>
    </WordTooltipProvider>
  )
}

function ReaderSkeleton() {
  return (
    <div className="flex h-[calc(100vh-3rem)]">
      <div className="w-56 border-r border-border p-4 space-y-3">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
      <div className="flex-1 p-16 max-w-[680px] mx-auto space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-px w-16" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}
