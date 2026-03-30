"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { supabase, type Book } from "@/lib/supabase"
import { springs } from "@/lib/design-tokens"
import { getCoverParams } from "@/components/tome/book-cover"
import { Particles } from "@/components/ui/particles"
import { Skeleton } from "@/components/ui/skeleton"
import { ChapterSidebar } from "./chapter-sidebar"
import { HighlightMenu } from "./highlight-menu"
import { AnnotationSidebar } from "./annotation-sidebar"
import { ReaderSettings, type ReaderTheme, type ReaderLayout, type FontSize } from "./reader-settings"
import { WordTooltipProvider } from "./word-tooltip"
import { cn } from "@/lib/utils"

// ── Chapter type ──

type Chapter = {
  id: string
  title: string
  order: number
  content_html: string | null
}

const PLACEHOLDER_HTML = `<p>The dawn spread her fingertips of rose across the sky as the hero stood upon the shore, gazing out at the wine-dark sea that stretched endlessly before him.</p>
<p>In the great hall, the fire crackled and sent shadows dancing across the stone walls. The bard took up his lyre and began to sing of the deeds of men and gods.</p>
<p>The philosopher sat beneath the olive tree, his students gathered around him. He posed his question not to instruct, but to illuminate.</p>`

// ── Dark theme styles ──

const themeStyles: Record<ReaderTheme, { bg: string; text: string; muted: string; border: string }> = {
  light: { bg: "var(--tome-surface-elevated)", text: "rgba(0,0,0,0.85)", muted: "rgba(0,0,0,0.45)", border: "var(--border)" },
  dark: { bg: "#1C1914", text: "#E8DCC8", muted: "#8B7E6A", border: "#2A2520" },
}

export default function ReaderPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.bookId as string

  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [annotationOpen, setAnnotationOpen] = useState(false)
  const [theme, setTheme] = useState<ReaderTheme>("light")
  const [layout, setLayout] = useState<ReaderLayout>("single")
  const [fontSize, setFontSize] = useState<FontSize>(18)
  const contentRef = useRef<HTMLDivElement>(null)
  const sessionStartRef = useRef(Date.now())

  // Fetch book and chapters
  useEffect(() => {
    async function fetchBook() {
      const [bookRes, chaptersRes] = await Promise.all([
        supabase.from("books").select("*").eq("id", bookId).single(),
        supabase.from("chapters").select("id,title,order,content_html").eq("book_id", bookId).order("order"),
      ])
      if (bookRes.data) setBook(bookRes.data as Book)
      if (chaptersRes.data && chaptersRes.data.length > 0) {
        setChapters(chaptersRes.data as Chapter[])
      }
      setLoading(false)
    }
    fetchBook()
  }, [bookId])

  // Auto-save progress every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      if (book) {
        localStorage.setItem(
          `tome-progress-${bookId}`,
          JSON.stringify({
            currentChapter,
            percent: Math.round(((currentChapter + 1) / totalChapters) * 100),
            lastRead: new Date().toISOString(),
          })
        )
      }
    }, 30000)
    return () => clearInterval(timer)
  }, [book, bookId, currentChapter])

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

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        setCurrentChapter((c) => Math.min(c + 1, totalChapters - 1))
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        setCurrentChapter((c) => Math.max(c - 1, 0))
      } else if (e.key === "Escape") {
        router.back()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [router])

  const handleChapterSelect = useCallback((index: number) => {
    setCurrentChapter(index)
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  if (loading) return <ReaderSkeleton />
  if (!book) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Book not found.</p>
      </div>
    )
  }

  const coverParams = getCoverParams(book)
  const totalChapters = chapters.length || 1
  const chapter = chapters[currentChapter] ?? { id: "0", title: "Chapter 1", order: 1, content_html: PLACEHOLDER_HTML }
  const genreColor = coverParams.primaryColor
  const t = themeStyles[theme]
  const readingTimeRemaining = Math.round(
    ((totalChapters - currentChapter - 1) / totalChapters) *
      (book.reading_time_minutes ?? 60)
  )

  return (
    <WordTooltipProvider>
      <div className="relative flex h-[calc(100vh-3rem)] overflow-hidden">
        {/* Progress bar */}
        <div
          className="fixed inset-x-0 top-12 z-50 h-0.5 origin-left motion-reduce:transition-none"
          style={{
            background: `linear-gradient(90deg, ${genreColor}, ${coverParams.secondaryColor})`,
            transform: `scaleX(${(currentChapter + 1) / totalChapters})`,
            transition: "transform 0.5s var(--tome-ease-scholarly)",
          }}
        />

        {/* Chapter Sidebar */}
        <ChapterSidebar
          bookTitle={book.title}
          chapters={chapters.length > 0 ? chapters.map((c) => c.title) : ["Chapter 1"]}
          currentChapter={currentChapter}
          onSelect={handleChapterSelect}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Reader */}
        <div
          ref={contentRef}
          className="relative flex-1 overflow-y-auto transition-colors duration-[var(--tome-duration-normal)] motion-reduce:transition-none"
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
              background:
                theme === "dark"
                  ? "radial-gradient(ellipse at 50% 30%, rgba(234,179,8,0.02), transparent 70%)"
                  : "radial-gradient(ellipse at 50% 30%, rgba(14,165,233,0.03), transparent 70%)",
            }}
          />

          {/* Reader toolbar */}
          <div
            className="sticky top-0 z-20 flex items-center justify-between border-b px-4 py-1.5 backdrop-blur-sm"
            style={{ borderColor: t.border, backgroundColor: theme === "dark" ? "#1C1914E6" : "rgba(249,250,251,0.8)" }}
          >
            <p className="text-[10px] font-medium truncate max-w-[200px]" style={{ color: t.muted }}>
              {book.title} — {chapter.title}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setAnnotationOpen(!annotationOpen)}
                className="flex size-7 items-center justify-center rounded-md transition-colors hover:opacity-70"
                style={{ color: t.muted }}
                title="Annotations"
              >
                <MessageSquare className="size-3.5" />
              </button>
              <ReaderSettings
                theme={theme}
                layout={layout}
                fontSize={fontSize}
                onThemeChange={setTheme}
                onLayoutChange={setLayout}
                onFontSizeChange={setFontSize}
              />
            </div>
          </div>

          {/* Content */}
          <div
            className={cn(
              "relative z-10 mx-auto px-6 py-12 md:px-8 md:py-16",
              layout === "dual" ? "max-w-[960px]" : "max-w-[680px]"
            )}
          >
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
                  className={cn(
                    "mt-8 font-serif prose-reader",
                    layout === "dual" ? "columns-2 gap-12" : "",
                  )}
                  style={{
                    columnRule: layout === "dual" ? `1px solid ${t.border}` : undefined,
                    fontSize: `${fontSize}px`,
                    lineHeight: 1.8,
                    color: theme === "dark" ? "#E8DCC8E6" : "rgba(0,0,0,0.85)",
                  }}
                  data-reader-text
                  dangerouslySetInnerHTML={{ __html: chapter.content_html ?? PLACEHOLDER_HTML }}
                />

                {/* Chapter Navigation */}
                <div className="mt-16 flex items-center justify-between border-t pt-6" style={{ borderColor: t.border }}>
                  <button
                    disabled={currentChapter === 0}
                    onClick={() => handleChapterSelect(currentChapter - 1)}
                    className="text-xs transition-colors disabled:opacity-30 hover:opacity-70"
                    style={{ color: t.muted }}
                  >
                    Previous chapter
                  </button>
                  <span className="text-[10px] tabular-nums" style={{ color: t.muted }}>
                    {currentChapter + 1} / {totalChapters}
                  </span>
                  <button
                    disabled={currentChapter === totalChapters - 1}
                    onClick={() => handleChapterSelect(currentChapter + 1)}
                    className="text-xs transition-colors disabled:opacity-30 hover:opacity-70"
                    style={{ color: t.muted }}
                  >
                    Next chapter
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Reading Time Remaining */}
          <div
            className="sticky bottom-0 z-20 border-t px-6 py-2 text-center backdrop-blur-sm"
            style={{
              borderColor: t.border,
              backgroundColor: theme === "dark" ? "#1C1914CC" : "rgba(249,250,251,0.8)",
            }}
          >
            <p className="text-[10px] tabular-nums" style={{ color: t.muted }}>
              {readingTimeRemaining > 0 ? `~${readingTimeRemaining} min remaining` : "Final chapter"}
            </p>
          </div>
        </div>

        {/* Annotation Sidebar */}
        <AnnotationSidebar
          bookId={bookId}
          chapterIndex={currentChapter}
          open={annotationOpen}
          onClose={() => setAnnotationOpen(false)}
        />

        {/* Highlight Menu */}
        <HighlightMenu bookId={bookId} chapterIndex={currentChapter} />
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
