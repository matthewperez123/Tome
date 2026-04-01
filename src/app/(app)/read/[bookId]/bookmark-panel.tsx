"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ── Types ────────────────────────────────────────────────────────────────────

type BookmarkColor = "gold" | "blue" | "green" | "purple" | "coral"

const COLOR_HEX: Record<BookmarkColor, string> = {
  gold:   "#EAB308",
  blue:   "#3B82F6",
  green:  "#22C55E",
  purple: "#8B5CF6",
  coral:  "#F97316",
}

const COLORS: BookmarkColor[] = ["gold", "blue", "green", "purple", "coral"]

interface StoredBookmark {
  id: string
  bookId: string
  bookTitle: string
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  paragraphIndex: number
  selectedText: string
  color: BookmarkColor
  createdAt: string
  updatedAt: string
}

// ── Relative time helper ─────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

// ── Props ────────────────────────────────────────────────────────────────────

interface BookmarkPanelProps {
  bookId: string
  bookTitle: string
  isOpen: boolean
  onClose: () => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function BookmarkPanel({ bookId, bookTitle, isOpen, onClose }: BookmarkPanelProps) {
  const [bookmarks, setBookmarks] = useState<StoredBookmark[]>([])
  const [activeColor, setActiveColor] = useState<BookmarkColor | "all">("all")
  const [sort, setSort] = useState<"date" | "chapter">("date")

  // Load bookmarks from localStorage whenever the panel opens
  useEffect(() => {
    if (!isOpen) return
    try {
      const all: StoredBookmark[] = JSON.parse(localStorage.getItem("tome-bookmarks") ?? "[]")
      setBookmarks(all.filter((b) => b.bookId === bookId))
    } catch {
      setBookmarks([])
    }
  }, [isOpen, bookId])

  function deleteBookmark(id: string) {
    try {
      const all: StoredBookmark[] = JSON.parse(localStorage.getItem("tome-bookmarks") ?? "[]")
      const updated = all.filter((b) => b.id !== id)
      localStorage.setItem("tome-bookmarks", JSON.stringify(updated))
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    } catch {}
  }

  // Filter + sort
  const filtered = bookmarks
    .filter((b) => activeColor === "all" || b.color === activeColor)
    .sort((a, b) => {
      if (sort === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return a.chapterNumber - b.chapterNumber
    })

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="bm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/40 sm:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Desktop: right slide-in panel */}
      <div
        className={cn(
          "fixed right-0 top-12 bottom-0 z-30 w-[340px] flex-col hidden sm:flex",
          "border-l border-border bg-[var(--tome-surface-elevated)] shadow-xl",
          "transition-transform duration-300 ease-[var(--tome-ease-scholarly)]"
        )}
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
        aria-hidden={!isOpen}
      >
        <PanelContents
          bookmarks={filtered}
          allCount={bookmarks.length}
          activeColor={activeColor}
          sort={sort}
          onColorChange={setActiveColor}
          onSortChange={setSort}
          onDelete={deleteBookmark}
          bookId={bookId}
          onClose={onClose}
        />
      </div>

      {/* Mobile: bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="bm-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed bottom-0 inset-x-0 z-30 flex flex-col sm:hidden rounded-t-2xl border-t border-border bg-[var(--tome-surface-elevated)] shadow-2xl"
            style={{ maxHeight: "70vh" }}
          >
            <PanelContents
              bookmarks={filtered}
              allCount={bookmarks.length}
              activeColor={activeColor}
              sort={sort}
              onColorChange={setActiveColor}
              onSortChange={setSort}
              onDelete={deleteBookmark}
              bookId={bookId}
              onClose={onClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Inner panel contents (shared between desktop + mobile) ───────────────────

function PanelContents({
  bookmarks,
  allCount,
  activeColor,
  sort,
  onColorChange,
  onSortChange,
  onDelete,
  bookId,
  onClose,
}: {
  bookmarks: StoredBookmark[]
  allCount: number
  activeColor: BookmarkColor | "all"
  sort: "date" | "chapter"
  onColorChange: (c: BookmarkColor | "all") => void
  onSortChange: (s: "date" | "chapter") => void
  onDelete: (id: string) => void
  bookId: string
  onClose: () => void
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
        <span className="text-xs font-semibold">
          Bookmarks
          <span className="ml-1 text-muted-foreground font-normal">· {allCount}</span>
        </span>
        <button
          onClick={onClose}
          className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-accent/50"
          aria-label="Close bookmarks"
        >
          <X className="size-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Color filter row */}
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2 shrink-0 overflow-x-auto">
        <button
          onClick={() => onColorChange("all")}
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors",
            activeColor === "all"
              ? "bg-foreground text-background"
              : "bg-accent/50 text-muted-foreground hover:bg-accent"
          )}
        >
          All
        </button>
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={cn(
              "flex size-5 items-center justify-center rounded-full border-2 transition-all",
              activeColor === color
                ? "ring-2 ring-offset-1 border-transparent"
                : "border-transparent hover:scale-110"
            )}
            style={{
              backgroundColor: COLOR_HEX[color],
              ...(activeColor === color ? { outline: `2px solid ${COLOR_HEX[color]}`, outlineOffset: "2px" } : {}),
            }}
            title={color}
            aria-label={`Filter by ${color}`}
          />
        ))}

        {/* Sort toggles — pushed to right */}
        <div className="ml-auto flex items-center gap-1">
          {(["date", "chapter"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize transition-colors",
                sort === s
                  ? "bg-foreground text-background"
                  : "bg-accent/50 text-muted-foreground hover:bg-accent"
              )}
            >
              {s === "date" ? "Date" : "Chapter"}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmark list */}
      <div className="flex-1 overflow-y-auto py-2">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-3 py-12">
            <p className="text-xs text-muted-foreground leading-relaxed">
              No bookmarks yet in this book. Select any passage and choose a color to save it.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1 px-3">
            {bookmarks.map((bm) => (
              <li key={bm.id}>
                <Link
                  href={`/read/${bookId}`}
                  className="group flex items-stretch gap-2.5 rounded-lg border border-border/50 bg-card/40 px-3 py-2.5 transition-colors hover:bg-card hover:border-border"
                >
                  {/* Color bar */}
                  <div
                    className="w-0.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLOR_HEX[bm.color] }}
                  />

                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-[10px] text-muted-foreground">
                      Ch {bm.chapterNumber + 1}: {bm.chapterTitle}
                    </span>
                    <p className="text-xs italic line-clamp-2 text-foreground/80">
                      "{bm.selectedText}"
                    </p>
                    <span className="text-[9px] text-muted-foreground/60 mt-0.5">
                      {relativeTime(bm.createdAt)}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onDelete(bm.id)
                    }}
                    className="self-start mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete bookmark"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
