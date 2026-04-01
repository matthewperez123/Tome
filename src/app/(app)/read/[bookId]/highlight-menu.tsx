"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, BookOpen } from "lucide-react"
import { toast } from "sonner"
import { springs } from "@/lib/design-tokens"

// ── Bookmark types & helpers ─────────────────────────────────────────────────

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

function saveColorBookmark(params: {
  bookId: string
  bookTitle: string
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  paragraphIndex: number
  selectedText: string
  color: BookmarkColor
}) {
  if (typeof window === "undefined") return
  try {
    const all: StoredBookmark[] = JSON.parse(localStorage.getItem("tome-bookmarks") ?? "[]")
    const bm: StoredBookmark = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      ...params,
      selectedText: params.selectedText.slice(0, 200),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    all.unshift(bm)
    if (all.length > 500) all.splice(500)
    localStorage.setItem("tome-bookmarks", JSON.stringify(all))
  } catch {}
}

// ── Props ────────────────────────────────────────────────────────────────────

interface HighlightMenuProps {
  bookId: string
  bookTitle: string
  chapterId: string
  chapterIndex: number
  chapterTitle: string
  onBookmarkAdded?: () => void
}

type MenuPosition = { x: number; y: number } | null

// ── Component ────────────────────────────────────────────────────────────────

export function HighlightMenu({
  bookId,
  bookTitle,
  chapterId,
  chapterIndex,
  chapterTitle,
  onBookmarkAdded,
}: HighlightMenuProps) {
  const [position, setPosition] = useState<MenuPosition>(null)
  const [selectedText, setSelectedText] = useState("")

  const handleSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setPosition(null)
      setSelectedText("")
      return
    }

    const text = selection.toString().trim()
    if (text.length < 3) return

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    setSelectedText(text)
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    })
  }, [])

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection)
    document.addEventListener("touchend", handleSelection)

    return () => {
      document.removeEventListener("mouseup", handleSelection)
      document.removeEventListener("touchend", handleSelection)
    }
  }, [handleSelection])

  const handleAnnotate = useCallback(() => {
    if (!selectedText) return
    // Save annotation — would use supabase when auth is ready
    const annotations = JSON.parse(
      localStorage.getItem(`tome-annotations-${bookId}`) ?? "[]"
    )
    annotations.push({
      text: selectedText,
      chapter: chapterIndex,
      timestamp: new Date().toISOString(),
      type: "highlight",
    })
    localStorage.setItem(
      `tome-annotations-${bookId}`,
      JSON.stringify(annotations)
    )
    window.getSelection()?.removeAllRanges()
    setPosition(null)
  }, [selectedText, bookId, chapterIndex])

  const handleColorBookmark = useCallback(
    (color: BookmarkColor) => {
      if (!selectedText) return
      saveColorBookmark({
        bookId,
        bookTitle,
        chapterId,
        chapterNumber: chapterIndex,
        chapterTitle,
        paragraphIndex: 0,
        selectedText,
        color,
      })
      window.getSelection()?.removeAllRanges()
      setPosition(null)
      toast("Bookmark saved", { duration: 2000 })
      onBookmarkAdded?.()
    },
    [selectedText, bookId, bookTitle, chapterId, chapterIndex, chapterTitle, onBookmarkAdded]
  )

  return (
    <AnimatePresence>
      {position && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={springs.interactive}
          className="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-[var(--tome-surface-spotlight)] p-1 shadow-lg"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <MenuButton
            icon={<MessageSquare className="size-3.5" />}
            label="Annotate"
            onClick={handleAnnotate}
          />
          <MenuButton
            icon={<BookOpen className="size-3.5" />}
            label="Define"
            onClick={() => {
              window.getSelection()?.removeAllRanges()
              setPosition(null)
            }}
          />
          <div className="h-4 w-px bg-white/20 mx-0.5" />
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorBookmark(color)}
              className="size-[22px] rounded-full border-2 border-white/30 transition-transform hover:scale-110 active:scale-95"
              style={{ backgroundColor: COLOR_HEX[color] }}
              title={`Bookmark (${color})`}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
