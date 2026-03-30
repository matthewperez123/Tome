"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bookmark, MessageSquare, BookOpen } from "lucide-react"
import { springs } from "@/lib/design-tokens"

interface HighlightMenuProps {
  bookId: string
  chapterIndex: number
}

type MenuPosition = { x: number; y: number } | null

export function HighlightMenu({ bookId, chapterIndex }: HighlightMenuProps) {
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

  const handleBookmark = useCallback(() => {
    if (!selectedText) return
    const bookmarks = JSON.parse(
      localStorage.getItem(`tome-bookmarks-${bookId}`) ?? "[]"
    )
    bookmarks.push({
      text: selectedText.slice(0, 100),
      chapter: chapterIndex,
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem(
      `tome-bookmarks-${bookId}`,
      JSON.stringify(bookmarks)
    )
    window.getSelection()?.removeAllRanges()
    setPosition(null)
  }, [selectedText, bookId, chapterIndex])

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
          <MenuButton
            icon={<Bookmark className="size-3.5" />}
            label="Bookmark"
            onClick={handleBookmark}
          />
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
