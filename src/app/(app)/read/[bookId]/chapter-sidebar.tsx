"use client"

import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, Lock, CheckCircle2, FileText, ScrollText, BookMarked, FolderOpen, Folder } from "lucide-react"
import { motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { TomeChapter, TomePart } from "@/data/chapters"

// ── Chapter type classification (fallback for books without parts) ──

export type ChapterType = "front-matter" | "chapter" | "back-matter"

const FRONT_MATTER_KEYWORDS = [
  "preface", "introduction", "introductory", "foreword", "dedication",
  "prologue", "epigraph", "letter", "note to", "author's note",
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
  chapters: TomeChapter[]
  parts?: TomePart[]
  frontMatter?: TomeChapter[]
  backMatter?: TomeChapter[]
  currentChapter: number
  onSelect: (index: number) => void
  open: boolean
  onToggle: () => void
  lockedChapterIndices?: number[]
  completedChapterIndices?: number[]
}

// ── Chapter item button ──

function ChapterItem({
  chapter,
  chapterNumber,
  isActive,
  isLocked,
  isCompleted,
  onSelect,
}: {
  chapter: TomeChapter
  chapterNumber: number
  isActive: boolean
  isLocked: boolean
  isCompleted: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={() => !isLocked && onSelect()}
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
      ) : (
        <span
          className={cn(
            "size-4 shrink-0 flex items-center justify-center rounded text-[9px] tabular-nums",
            isActive
              ? "bg-foreground text-background font-semibold"
              : "bg-muted text-muted-foreground"
          )}
        >
          {chapterNumber}
        </span>
      )}
      <span className="truncate">{chapter.title}</span>
    </button>
  )
}

// ── Component ──

export function ChapterSidebar({
  bookTitle,
  chapters,
  parts = [],
  frontMatter = [],
  backMatter = [],
  currentChapter,
  onSelect,
  open,
  onToggle,
  lockedChapterIndices = [],
  completedChapterIndices = [],
}: ChapterSidebarProps) {
  const hasParts = parts.length > 0

  // Map file index (chapter.number) → array index for onSelect
  // The reader uses array indices internally, but chapters store file indices in .number
  function selectByFileIndex(fileIndex: number) {
    const arrIdx = chapters.findIndex(c => c.number === fileIndex)
    onSelect(arrIdx >= 0 ? arrIdx : 0)
  }

  // currentChapter from the reader is an array index — convert to file index for comparisons
  const activeFileIndex = chapters[currentChapter]?.number ?? currentChapter

  // Track which parts are expanded — auto-expand the one containing current chapter
  const currentPartId = chapters.find(c => c.number === activeFileIndex)?.partId
  const [expandedParts, setExpandedParts] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    if (currentPartId) initial.add(currentPartId)
    return initial
  })

  function togglePart(partId: string) {
    setExpandedParts(prev => {
      const next = new Set(prev)
      if (next.has(partId)) next.delete(partId)
      else next.add(partId)
      return next
    })
  }

  // Auto-expand when current chapter changes parts
  const activePartId = chapters.find(c => c.number === activeFileIndex)?.partId
  if (activePartId && !expandedParts.has(activePartId)) {
    setExpandedParts(prev => new Set(prev).add(activePartId))
  }

  // Helper: count total readable chapters (excluding part headers, front matter)
  const readableCount = chapters.length + backMatter.length

  // ── Parts-based rendering ──

  function renderPartsView() {
    return (
      <>
        {/* Front matter */}
        {frontMatter.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-1.5 px-2 mb-1">
              <ScrollText className="size-3 text-muted-foreground/60" />
              <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                Front Matter
              </span>
            </div>
            <div className="space-y-0.5 pl-1">
              {frontMatter.map((ch) => (
                <ChapterItem
                  key={ch.id}
                  chapter={ch}
                  chapterNumber={0}
                  isActive={ch.number === activeFileIndex}
                  isLocked={lockedChapterIndices.includes(ch.number)}
                  isCompleted={completedChapterIndices.includes(ch.number)}
                  onSelect={() => selectByFileIndex(ch.number)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Parts as collapsible folders */}
        {parts.map((part, partIdx) => {
          const partChapters = chapters.filter(c => c.partId === part.id)
          const isExpanded = expandedParts.has(part.id)
          const hasActiveChapter = partChapters.some(c => c.number === activeFileIndex)
          const completedInPart = partChapters.filter(c => completedChapterIndices.includes(c.number)).length

          return (
            <div key={part.id} className="mb-1">
              <button
                onClick={() => togglePart(part.id)}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors",
                  hasActiveChapter
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isExpanded
                  ? <FolderOpen className="size-3.5 shrink-0" />
                  : <Folder className="size-3.5 shrink-0" />
                }
                <span className="text-[11px] font-semibold truncate flex-1">{part.title}</span>
                <span className="text-[9px] text-muted-foreground/60 tabular-nums shrink-0">
                  {completedInPart > 0 && `${completedInPart}/`}{partChapters.length}
                </span>
                <ChevronDown className={cn(
                  "size-3 shrink-0 transition-transform duration-150",
                  !isExpanded && "-rotate-90"
                )} />
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-0.5 pl-3 border-l border-border/50 ml-[11px] mt-0.5 mb-1"
                >
                  {partChapters.map((ch, chIdx) => (
                    <ChapterItem
                      key={ch.id}
                      chapter={ch}
                      chapterNumber={chIdx + 1}
                      isActive={ch.number === activeFileIndex}
                      isLocked={lockedChapterIndices.includes(ch.number)}
                      isCompleted={completedChapterIndices.includes(ch.number)}
                      onSelect={() => selectByFileIndex(ch.number)}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          )
        })}

        {/* Chapters without a part (orphans — flat books partially rebuilt) */}
        {(() => {
          const orphans = chapters.filter(c => !c.partId)
          if (orphans.length === 0) return null
          return (
            <div className="mb-2">
              <div className="space-y-0.5">
                {orphans.map((ch, i) => (
                  <ChapterItem
                    key={ch.id}
                    chapter={ch}
                    chapterNumber={i + 1}
                    isActive={ch.number === activeFileIndex}
                    isLocked={lockedChapterIndices.includes(ch.number)}
                    isCompleted={completedChapterIndices.includes(ch.number)}
                    onSelect={() => selectByFileIndex(ch.number)}
                  />
                ))}
              </div>
            </div>
          )
        })()}

        {/* Back matter */}
        {backMatter.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-1.5 px-2 mb-1">
              <FileText className="size-3 text-muted-foreground/60" />
              <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                Back Matter
              </span>
            </div>
            <div className="space-y-0.5 pl-1">
              {backMatter.map((ch) => (
                <ChapterItem
                  key={ch.id}
                  chapter={ch}
                  chapterNumber={0}
                  isActive={ch.number === activeFileIndex}
                  isLocked={lockedChapterIndices.includes(ch.number)}
                  isCompleted={completedChapterIndices.includes(ch.number)}
                  onSelect={() => selectByFileIndex(ch.number)}
                />
              ))}
            </div>
          </div>
        )}
      </>
    )
  }

  // ── Flat fallback (no parts data) ──

  function renderFlatView() {
    const groups: { type: ChapterType; label: string; chapters: { index: number; title: string }[] }[] = []
    let currentGroup: (typeof groups)[number] | null = null

    chapters.forEach((ch) => {
      const type = classifyChapter(ch.title)
      if (!currentGroup || currentGroup.type !== type) {
        currentGroup = { type, label: getChapterTypeLabel(type), chapters: [] }
        groups.push(currentGroup)
      }
      currentGroup.chapters.push({ index: ch.number, title: ch.title })
    })

    const hasMultipleGroups = groups.length > 1

    return groups.map((group) => {
      const Icon = getChapterTypeIcon(group.type)
      return (
        <div key={`${group.type}-${group.chapters[0]?.index}`} className="mb-3">
          {hasMultipleGroups && (
            <div className="flex items-center gap-1.5 px-2 mb-1.5">
              <Icon className="size-3 text-muted-foreground/60" />
              <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                {group.label}
              </span>
            </div>
          )}
          <div className="space-y-0.5">
            {group.chapters.map(({ index: i, title }, chIdx) => {
              const ch = chapters.find(c => c.number === i)
              if (!ch) return null
              return (
                <ChapterItem
                  key={i}
                  chapter={ch}
                  chapterNumber={chIdx + 1}
                  isActive={i === activeFileIndex}
                  isLocked={lockedChapterIndices.includes(i)}
                  isCompleted={completedChapterIndices.includes(i)}
                  onSelect={() => selectByFileIndex(i)}
                />
              )
            })}
          </div>
        </div>
      )
    })
  }

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

          {/* Chapter list */}
          <nav className="flex-1 overflow-y-auto">
            {hasParts ? renderPartsView() : renderFlatView()}
          </nav>

          {/* Progress */}
          <div className="mt-3 border-t border-border pt-3 px-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>Progress</span>
              <span className="tabular-nums">
                {readableCount > 0 ? Math.round(((completedChapterIndices.length) / readableCount) * 100) : 0}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-foreground"
                animate={{
                  width: `${readableCount > 0 ? ((completedChapterIndices.length) / readableCount) * 100 : 0}%`,
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
