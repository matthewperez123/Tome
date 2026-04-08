"use client"

import { BookOpen, ChevronLeft, ChevronRight, Lock, CheckCircle2, FileText, ScrollText, BookMarked } from "lucide-react"
import { motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

// ── Chapter type classification ──

export type ChapterType = "front-matter" | "chapter" | "back-matter"

const FRONT_MATTER_KEYWORDS = [
  "preface", "introduction", "introductory", "foreword", "dedication",
  "prologue", "epigraph", "letter", "note to", "author's note",
  "translator's", "dramatis personae", "the story", "frontispiece",
  "acknowledgment", "our raison",
]

const BACK_MATTER_KEYWORDS = [
  "epilogue", "afterword", "appendix", "conclusion", "postscript",
  "notes", "endnotes", "glossary", "bibliography", "colophon",
  "three notes",
]

export function classifyChapter(title: string): ChapterType {
  const lower = title.toLowerCase().trim()
  if (FRONT_MATTER_KEYWORDS.some(kw => lower.startsWith(kw) || lower.includes(kw))) return "front-matter"
  if (BACK_MATTER_KEYWORDS.some(kw => lower.startsWith(kw) || lower.includes(kw))) return "back-matter"
  return "chapter"
}

function getChapterTypeIcon(type: ChapterType) {
  switch (type) {
    case "front-matter": return ScrollText
    case "chapter": return BookOpen
    case "back-matter": return FileText
  }
}

function getChapterTypeLabel(type: ChapterType): string {
  switch (type) {
    case "front-matter": return "Front Matter"
    case "chapter": return "Chapters"
    case "back-matter": return "Back Matter"
  }
}

// ── Types ──

interface ChapterSidebarProps {
  bookTitle: string
  chapters: string[]
  currentChapter: number
  onSelect: (index: number) => void
  open: boolean
  onToggle: () => void
  lockedChapterIndices?: number[]
  completedChapterIndices?: number[]
}

// ── Component ──

export function ChapterSidebar({
  bookTitle,
  chapters,
  currentChapter,
  onSelect,
  open,
  onToggle,
  lockedChapterIndices = [],
  completedChapterIndices = [],
}: ChapterSidebarProps) {
  // Classify all chapters into contiguous groups
  const groups: { type: ChapterType; label: string; chapters: { index: number; title: string }[] }[] = []
  let currentGroup: (typeof groups)[number] | null = null

  chapters.forEach((title, i) => {
    const type = classifyChapter(title)
    if (!currentGroup || currentGroup.type !== type) {
      currentGroup = { type, label: getChapterTypeLabel(type), chapters: [] }
      groups.push(currentGroup)
    }
    currentGroup.chapters.push({ index: i, title })
  })

  const hasMultipleGroups = groups.length > 1

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
        aria-label={open ? "Collapse chapter sidebar" : "Expand chapter sidebar"}
        className="absolute top-3 right-0 z-10 flex size-6 items-center justify-center rounded-l-md border border-r-0 border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
        style={{ right: open ? "0" : "auto", left: open ? "auto" : "2px" }}
      >
        {open ? <ChevronLeft className="size-3" /> : <ChevronRight className="size-3" />}
      </button>

      {open && (
        <div className="flex h-full min-w-[220px] flex-col p-3">
          {/* Book title */}
          <div className="flex items-center gap-2 mb-4 px-1">
            <BookMarked className="size-3.5 shrink-0 text-muted-foreground" />
            <p className="text-xs font-medium truncate">{bookTitle}</p>
          </div>

          {/* Chapter list with type groups */}
          <nav className="flex-1 overflow-y-auto">
            {groups.map((group) => {
              const Icon = getChapterTypeIcon(group.type)
              return (
                <div key={`${group.type}-${group.chapters[0]?.index}`} className="mb-3">
                  {/* Group header — only show if multiple groups exist */}
                  {hasMultipleGroups && (
                    <div className="flex items-center gap-1.5 px-2 mb-1.5">
                      <Icon className="size-3 text-muted-foreground/60" />
                      <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                        {group.label}
                      </span>
                    </div>
                  )}

                  {/* Chapter items */}
                  <div className="space-y-0.5">
                    {group.chapters.map(({ index: i, title }) => {
                      const isActive = i === currentChapter
                      const isLocked = lockedChapterIndices.includes(i)
                      const isCompleted = completedChapterIndices.includes(i)

                      return (
                        <button
                          key={i}
                          onClick={() => !isLocked && onSelect(i)}
                          aria-disabled={isLocked ? "true" : undefined}
                          title={isLocked ? "Complete the previous chapter's trial to unlock" : undefined}
                          className={cn(
                            "relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-[color,opacity] duration-[var(--tome-duration-fast)]",
                            isActive
                              ? "text-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground hover:opacity-70",
                            isLocked && "pointer-events-none opacity-40"
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
                          {isLocked ? (
                            <Lock className="size-3 shrink-0" />
                          ) : isCompleted && !isActive ? (
                            <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
                          ) : group.type !== "chapter" ? (
                            <Icon
                              className={cn(
                                "size-3 shrink-0",
                                isActive ? "text-foreground" : "text-muted-foreground"
                              )}
                            />
                          ) : (
                            <span
                              className={cn(
                                "size-4 shrink-0 flex items-center justify-center rounded text-[9px] tabular-nums",
                                isActive
                                  ? "bg-foreground text-background font-semibold"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {group.chapters.findIndex(c => c.index === i) + 1}
                            </span>
                          )}
                          <span className="truncate">{title}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
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
