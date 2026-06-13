"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { HorizontalTimeline } from "@/components/timelines/HorizontalTimeline"
import { AuthorDropdown } from "@/components/timelines/AuthorDropdown"
import {
  REGION_ORDER,
  TIMELINE_AUTHORS,
  getTimelinesByRegion,
  getTimelineAuthors,
} from "@/data/timelines"
import { BOOKS } from "@/data/books"
import type { TomeBook } from "@/data/books"

// ── Accordion persistence ───────────────────────────────────────────────────

const STORAGE_KEY = "tome-timelines-accordion"

interface AccordionState {
  regions: string[] // expanded region names
  timelines: string[] // expanded timeline ids
}

function loadAccordion(): AccordionState {
  if (typeof window === "undefined") return { regions: [], timelines: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AccordionState
  } catch {
    /* ignore */
  }
  return { regions: [], timelines: [] }
}

function saveAccordion(state: AccordionState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function TimelineSkeleton() {
  return (
    <div className="space-y-10 px-4 py-6 sm:px-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-80 mt-2" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <Skeleton className="h-6 w-56 mb-4" />
          <Skeleton className="h-5 w-48 mb-2 ml-6" />
          <Skeleton className="h-5 w-40 mb-2 ml-6" />
        </div>
      ))}
    </div>
  )
}

// ── Expand/collapse animation config ────────────────────────────────────────

const collapseTransition = { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }

// ── Page ─────────────────────────────────────────────────────────────────────

interface SelectedAuthor {
  authorId: string
  rect: DOMRect
}

export default function TimelinesPage() {
  const [mounted, setMounted] = useState(false)
  const [accordion, setAccordion] = useState<AccordionState>({
    regions: [],
    timelines: [],
  })
  const [selectedAuthor, setSelectedAuthor] = useState<SelectedAuthor | null>(
    null,
  )

  useEffect(() => {
    setAccordion(loadAccordion())
    setMounted(true)
  }, [])

  // Click-outside and Escape handlers for dropdown
  useEffect(() => {
    if (!selectedAuthor) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        !target.closest("[data-author-dropdown]") &&
        !target.closest("[data-author-button]")
      ) {
        setSelectedAuthor(null)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedAuthor(null)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [selectedAuthor])

  const regionData = useMemo(() => getTimelinesByRegion(), [])

  const toggleRegion = useCallback((region: string) => {
    setAccordion((prev) => {
      const regions = prev.regions.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...prev.regions, region]
      const next = { ...prev, regions }
      saveAccordion(next)
      return next
    })
  }, [])

  const toggleTimeline = useCallback((timelineId: string) => {
    setAccordion((prev) => {
      const timelines = prev.timelines.includes(timelineId)
        ? prev.timelines.filter((t) => t !== timelineId)
        : [...prev.timelines, timelineId]
      const next = { ...prev, timelines }
      saveAccordion(next)
      return next
    })
  }, [])

  const handleAuthorClick = useCallback(
    (authorId: string, rect: DOMRect) => {
      setSelectedAuthor((prev) =>
        prev?.authorId === authorId ? null : { authorId, rect },
      )
    },
    [],
  )

  const selectedData = useMemo(() => {
    if (!selectedAuthor) return null
    const author = TIMELINE_AUTHORS.find(
      (a) => a.id === selectedAuthor.authorId,
    )
    if (!author) return null
    const books = author.linkedBookIds
      .map((id) => BOOKS.find((b) => b.id === id))
      .filter(Boolean) as TomeBook[]
    return { author, books }
  }, [selectedAuthor])

  if (!mounted) return <TimelineSkeleton />

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6" style={{ ["--accent" as string]: "var(--indigo-default)" }}>
      {/* Header — Timeline owns the Catalogue / tyrian accent (chrome only) */}
      <div className="relative pl-3">
        <span
          aria-hidden
          className="absolute left-0 top-1 bottom-1 w-1 rounded-full"
          style={{ background: "var(--indigo-default)" }}
        />
        <h1 className="font-[var(--font-display)] text-3xl font-bold text-foreground">
          Timelines
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The canon, charted through time.
        </p>
      </div>

      {/* Region accordions — Level 1 */}
      {REGION_ORDER.map((region) => {
        const timelines = regionData[region]
        if (!timelines || timelines.length === 0) return null
        const regionExpanded = accordion.regions.includes(region)

        return (
          <section key={region}>
            {/* Region header — Level 1 toggle */}
            <button
              onClick={() => toggleRegion(region)}
              className="flex items-center gap-2 w-full text-left group mb-2 rounded-lg px-2 py-1 -mx-2 transition-colors hover:bg-[color-mix(in_srgb,var(--indigo-default)_7%,transparent)]"
            >
              <ChevronRight
                className={`size-4 transition-transform duration-200 ${
                  regionExpanded ? "rotate-90" : ""
                }`}
                style={{ color: "var(--indigo-default)" }}
              />
              <h2 className="font-[var(--font-display)] text-xl font-bold text-foreground">
                {region}
              </h2>
              <span className="chip-accent ml-1 text-[10px]" style={{ ["--accent" as string]: "var(--indigo-default)" }}>
                {timelines.length}{" "}
                {timelines.length === 1 ? "tradition" : "traditions"}
              </span>
            </button>

            {/* Level 1 content — list of tradition/genre toggles */}
            <AnimatePresence initial={false}>
              {regionExpanded && (
                <motion.div
                  key={`region-${region}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={collapseTransition}
                  className="overflow-hidden"
                >
                  <div className="pl-6 space-y-1">
                    {timelines.map((timeline) => {
                      const authors = getTimelineAuthors(timeline.id)
                      if (authors.length === 0) return null
                      const timelineExpanded = accordion.timelines.includes(
                        timeline.id,
                      )

                      return (
                        <div key={timeline.id}>
                          {/* Level 2 toggle — tradition/genre name */}
                          <button
                            onClick={() => toggleTimeline(timeline.id)}
                            className="flex items-center gap-2 w-full text-left py-1.5 group"
                          >
                            <div
                              className="w-1 h-4 rounded-full shrink-0"
                              style={{
                                backgroundColor: timeline.accentColor,
                              }}
                            />
                            <ChevronRight
                              className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                                timelineExpanded ? "rotate-90" : ""
                              }`}
                            />
                            <span className="font-[var(--font-display)] text-sm font-semibold text-foreground">
                              {timeline.tradition}
                            </span>
                            <span
                              className="rounded-full px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-medium"
                              style={{
                                backgroundColor: `${timeline.accentColor}18`,
                                color: timeline.accentColor,
                              }}
                            >
                              {timeline.traditionType}
                            </span>
                            <span className="text-[11px] text-muted-foreground ml-auto">
                              {authors.length} author
                              {authors.length !== 1 ? "s" : ""}
                            </span>
                          </button>

                          {/* Level 2 content — the actual timeline strip */}
                          <AnimatePresence initial={false}>
                            {timelineExpanded && (
                              <motion.div
                                key={`tl-${timeline.id}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={collapseTransition}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 pt-1 pb-2">
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {timeline.description}
                                  </p>
                                  <HorizontalTimeline
                                    timeline={timeline}
                                    authors={authors}
                                    selectedAuthorId={
                                      selectedAuthor?.authorId ?? null
                                    }
                                    onAuthorClick={handleAuthorClick}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )
      })}

      {/* Author dropdown */}
      <AnimatePresence>
        {selectedData && selectedAuthor && (
          <AuthorDropdown
            key={selectedData.author.id}
            author={selectedData.author}
            books={selectedData.books}
            anchorRect={selectedAuthor.rect}
            onClose={() => setSelectedAuthor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
