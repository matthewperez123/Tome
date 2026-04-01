"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReaderTheme, FontSize } from "@/app/(app)/read/[bookId]/reader-settings"

// ─── Public Types ────────────────────────────────────────────────────────────

export interface PaginatedReaderProps {
  pages: string[]            // pre-computed, one HTML string per page
  currentPage: number        // 0-indexed
  onPageChange: (page: number) => void
  onChapterEnd: () => void   // called when advancing past last page
  isPaginating: boolean      // show skeleton while paginator runs
  mode: "book"
  theme: ReaderTheme
  fontSize: number
  accentColor: string        // genre color for progress bar
  onToggleToolbar: () => void
}

// ─── Theme Map ───────────────────────────────────────────────────────────────

const themeMap = {
  light: {
    bg: "var(--tome-surface-elevated, #ffffff)",
    text: "rgba(0,0,0,0.85)",
    muted: "rgba(0,0,0,0.35)",
    border: "rgba(0,0,0,0.08)",
  },
  dark: {
    bg: "#1C1914",
    text: "#E8DCC8",
    muted: "#8B7E6A",
    border: "rgba(255,255,255,0.08)",
  },
}

// ─── Animation Variants ──────────────────────────────────────────────────────

const slideVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
}

const slideTransition = { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }

// ─── PageSkeleton ────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-3 pt-2">
      {[100, 98, 96, 100, 92, 87, 100, 95, 60].map((w, i) => (
        <div
          key={i}
          className="h-[1.4em] rounded bg-current animate-pulse"
          style={{ width: `${w}%`, opacity: 0.08 }}
        />
      ))}
    </div>
  )
}

// ─── ProgressStrip ───────────────────────────────────────────────────────────

interface ProgressStripProps {
  mode: "book"
  currentPage: number  // 0-indexed
  totalPages: number
  accentColor: string
  textColor: string
}

function ProgressStrip({ mode, currentPage, totalPages, accentColor, textColor }: ProgressStripProps) {
  const displayLeft  = currentPage + 1
  const displayRight = currentPage + 2
  const label = currentPage + 1 < totalPages
    ? `Pages ${displayLeft}–${displayRight} of ${totalPages}`
    : `Page ${displayLeft} of ${totalPages}`
  const pct = ((currentPage + 2) / Math.max(1, totalPages)) * 100

  return (
    <div className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-1 pb-3 pointer-events-none">
      <p className="text-[10px] tabular-nums" style={{ color: textColor }}>{label}</p>
      <div className="w-48 h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: `${accentColor}30` }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, pct)}%`, backgroundColor: accentColor }}
        />
      </div>
    </div>
  )
}

// ─── PaginatedReader ─────────────────────────────────────────────────────────

export function PaginatedReader({
  pages,
  currentPage,
  onPageChange,
  onChapterEnd,
  isPaginating,
  mode,
  theme,
  fontSize,
  accentColor,
  onToggleToolbar,
}: PaginatedReaderProps) {
  const t = themeMap[theme]
  const [direction, setDirection] = useState<1 | -1>(1)
  const pointerStartX = useRef<number | null>(null)

  const goNext = useCallback(() => {
    if (currentPage + 2 >= pages.length) {
      onChapterEnd()
    } else {
      setDirection(1)
      onPageChange(currentPage + 2)
    }
  }, [currentPage, pages.length, onChapterEnd, onPageChange])

  const goPrev = useCallback(() => {
    if (currentPage <= 0) return
    setDirection(-1)
    onPageChange(Math.max(0, currentPage - 2))
  }, [currentPage, onPageChange])

  // Keyboard navigation — capture phase to suppress parent handlers
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        e.stopPropagation()
        goNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        e.stopPropagation()
        goPrev()
      }
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [goNext, goPrev])

  // Click-zone handler
  function handleContainerClick(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button,a,select,input")) return
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width
    if (relX < 0.4) goPrev()
    else if (relX > 0.6) goNext()
    else onToggleToolbar()
  }

  // Pointer / swipe handlers
  function handlePointerDown(e: React.PointerEvent) {
    pointerStartX.current = e.clientX
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (pointerStartX.current === null) return
    const delta = e.clientX - pointerStartX.current
    pointerStartX.current = null
    if (Math.abs(delta) < 50) return
    if (delta < 0) goNext()
    else goPrev()
  }

  const PADDING_H = 48
  const PADDING_V = 40

  const contentStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    lineHeight: 1.8,
    color: t.text,
    overflow: "hidden",
    height: "100%",
  }

  const paperStyle = (side: "left" | "right"): React.CSSProperties => ({
    background: t.bg,
    padding: `${PADDING_V}px ${PADDING_H}px`,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    borderRadius: side === "left" ? "4px 0 0 4px" : "0 4px 4px 0",
  })

  // Page content renderer
  function renderPage(pageIndex: number) {
    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={pageIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          style={{
            position: "absolute",
            inset: 0,
            padding: `${PADDING_V}px ${PADDING_H}px`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isPaginating ? (
            <PageSkeleton />
          ) : (
            <div
              className="font-serif prose-reader flex-1"
              style={contentStyle}
              data-reader-text
              dangerouslySetInnerHTML={{ __html: pages[pageIndex] ?? "" }}
            />
          )}
          {/* Page number */}
          <div
            className="absolute bottom-3 inset-x-0 text-center text-[11px] pointer-events-none"
            style={{ color: t.muted }}
          >
            {pageIndex + 1}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // ── Book (dual-page spread) mode ───────────────────────────────────────────
  const leftIdx  = currentPage
  const rightIdx = currentPage + 1

  return (
      <div
        className="relative flex h-full w-full items-center justify-center select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleContainerClick}
        style={{ cursor: "default" }}
      >
        {/* Book spread container */}
        <div
          className="relative flex h-[calc(100%-72px)]"
          style={{
            boxShadow: theme === "dark"
              ? "0 8px 48px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)"
              : "0 8px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)",
            borderRadius: 4,
          }}
        >
          {/* Left page */}
          <div
            className="relative overflow-hidden"
            style={{ ...paperStyle("left"), width: "calc(min(45vw, 500px))", flexShrink: 0 }}
          >
            {renderPage(leftIdx)}
          </div>

          {/* Spine */}
          <div
            style={{
              width: 1,
              flexShrink: 0,
              background: theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
              boxShadow: theme === "dark"
                ? "-16px 0 32px rgba(0,0,0,0.3), 16px 0 32px rgba(0,0,0,0.3)"
                : "-16px 0 32px rgba(0,0,0,0.06), 16px 0 32px rgba(0,0,0,0.06)",
            }}
          />

          {/* Right page */}
          <div
            className="relative overflow-hidden"
            style={{ ...paperStyle("right"), width: "calc(min(45vw, 500px))", flexShrink: 0 }}
          >
            {renderPage(rightIdx)}
          </div>
        </div>

        <ProgressStrip
          mode="book"
          currentPage={currentPage}
          totalPages={pages.length}
          accentColor={accentColor}
          textColor={t.muted}
        />
      </div>
    )
}
