"use client"

import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

interface ChapterSidebarProps {
  bookTitle: string
  chapters: string[]
  currentChapter: number
  onSelect: (index: number) => void
  open: boolean
  onToggle: () => void
}

export function ChapterSidebar({
  bookTitle,
  chapters,
  currentChapter,
  onSelect,
  open,
  onToggle,
}: ChapterSidebarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 border-r border-border bg-background transition-[width] duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] overflow-hidden",
        open ? "w-56" : "w-0 md:w-10"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-3 right-0 z-10 flex size-6 items-center justify-center rounded-l-md border border-r-0 border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
        style={{ right: open ? "0" : "auto", left: open ? "auto" : "2px" }}
      >
        {open ? (
          <ChevronLeft className="size-3" />
        ) : (
          <ChevronRight className="size-3" />
        )}
      </button>

      {open && (
        <div className="flex h-full min-w-[220px] flex-col p-3">
          {/* Book title */}
          <div className="flex items-center gap-2 mb-4 px-1">
            <BookOpen className="size-3.5 shrink-0 text-muted-foreground" />
            <p className="text-xs font-medium truncate">{bookTitle}</p>
          </div>

          {/* Chapter list */}
          <nav className="flex-1 overflow-y-auto space-y-0.5">
            {chapters.map((chapter, i) => {
              const isActive = i === currentChapter
              return (
                <button
                  key={i}
                  onClick={() => onSelect(i)}
                  className={cn(
                    "relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-[color,opacity] duration-[var(--tome-duration-fast)]",
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:opacity-70"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="chapter-indicator"
                      className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-foreground"
                      transition={springs.interactive}
                    />
                  )}
                  <span
                    className={cn(
                      "size-4 shrink-0 flex items-center justify-center rounded text-[9px] tabular-nums",
                      isActive
                        ? "bg-foreground text-background font-semibold"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate">{chapter}</span>
                </button>
              )
            })}
          </nav>

          {/* Progress */}
          <div className="mt-3 border-t border-border pt-3 px-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>Progress</span>
              <span className="tabular-nums">
                {Math.round(((currentChapter + 1) / chapters.length) * 100)}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-foreground"
                animate={{
                  width: `${((currentChapter + 1) / chapters.length) * 100}%`,
                }}
                transition={springs.gentle}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
