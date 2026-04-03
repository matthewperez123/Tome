"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, User, Tag, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SearchResults } from "@/hooks/useSearch"

// ── Highlight helper ────────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-100/60 text-amber-900 rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ── Types ────────────────────────────────────────────────────────────────────

interface SearchDropdownProps {
  results: SearchResults
  query: string
  isOpen: boolean
  onClose: () => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function SearchDropdown({ results, query, isOpen, onClose }: SearchDropdownProps) {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const [focusIdx, setFocusIdx] = useState(-1)

  // Build flat list of all navigable items
  const items = useCallback(() => {
    const list: { type: string; id: string; route: string }[] = []
    for (const r of results.books) list.push({ type: "book", id: r.book.id, route: `/book/${r.book.id}` })
    for (const r of results.authors) list.push({ type: "author", id: r.author.id, route: `/author/${r.author.id}` })
    for (const r of results.genres) list.push({ type: "genre", id: r.name, route: `/library?genre=${encodeURIComponent(r.name)}` })
    for (const r of results.traditions) list.push({ type: "tradition", id: r.name, route: `/library?tradition=${encodeURIComponent(r.name)}` })
    return list
  }, [results])

  // Reset focus when results change
  useEffect(() => setFocusIdx(-1), [results])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      const list = items()
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setFocusIdx((i) => Math.min(i + 1, list.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setFocusIdx((i) => Math.max(i - 1, -1))
      } else if (e.key === "Enter" && focusIdx >= 0 && focusIdx < list.length) {
        e.preventDefault()
        router.push(list[focusIdx].route)
        onClose()
      } else if (e.key === "Escape" || e.key === "Tab") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, focusIdx, items, router, onClose])

  // Click outside
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen, onClose])

  function navigate(route: string) {
    router.push(route)
    onClose()
  }

  let flatIdx = -1
  const hasResults = results.totalCount > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 right-0 z-50 mt-1 min-w-[320px] max-w-[480px] rounded-2xl border border-border bg-popover shadow-lg overflow-hidden"
        >
          <div className="max-h-[420px] overflow-y-auto">
            {!hasResults ? (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
              </div>
            ) : (
              <>
                {/* Books */}
                {results.books.length > 0 && (
                  <div>
                    <div className="sticky top-0 flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground font-medium bg-muted/50">
                      <BookOpen className="size-3.5" />
                      Books
                    </div>
                    {results.books.map((r) => {
                      flatIdx++
                      const idx = flatIdx
                      return (
                        <button
                          key={r.book.id}
                          onClick={() => navigate(`/book/${r.book.id}`)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 flex items-start gap-3 border-b border-border/50 last:border-0 transition-colors",
                            idx === focusIdx ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              <Highlight text={r.book.title} query={query} />
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              <Highlight text={r.book.author} query={query} />
                            </p>
                          </div>
                          {r.book.genres[0] && (
                            <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600">
                              {r.book.genres[0]}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Authors */}
                {results.authors.length > 0 && (
                  <div>
                    <div className="sticky top-0 flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground font-medium bg-muted/50">
                      <User className="size-3.5" />
                      Authors
                    </div>
                    {results.authors.map((r) => {
                      flatIdx++
                      const idx = flatIdx
                      return (
                        <button
                          key={r.author.id}
                          onClick={() => navigate(`/author/${r.author.id}`)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 flex items-center justify-between border-b border-border/50 last:border-0 transition-colors",
                            idx === focusIdx ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <p className="text-sm font-medium">
                            <Highlight text={r.author.name} query={query} />
                          </p>
                          <span className="text-xs text-muted-foreground">{r.bookCount} books</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Genres */}
                {results.genres.length > 0 && (
                  <div>
                    <div className="sticky top-0 flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground font-medium bg-muted/50">
                      <Tag className="size-3.5" />
                      Genres
                    </div>
                    {results.genres.map((r) => {
                      flatIdx++
                      const idx = flatIdx
                      return (
                        <button
                          key={r.name}
                          onClick={() => navigate(`/library?genre=${encodeURIComponent(r.name)}`)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 flex items-center justify-between border-b border-border/50 last:border-0 transition-colors",
                            idx === focusIdx ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <p className="text-sm font-medium">
                            <Highlight text={r.name} query={query} />
                          </p>
                          <span className="text-xs text-muted-foreground">{r.bookCount} books</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Traditions */}
                {results.traditions.length > 0 && (
                  <div>
                    <div className="sticky top-0 flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground font-medium bg-muted/50">
                      <Landmark className="size-3.5" />
                      Traditions
                    </div>
                    {results.traditions.map((r) => {
                      flatIdx++
                      const idx = flatIdx
                      return (
                        <button
                          key={r.name}
                          onClick={() => navigate(`/library?tradition=${encodeURIComponent(r.name)}`)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 flex items-center justify-between border-b border-border/50 last:border-0 transition-colors",
                            idx === focusIdx ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <p className="text-sm font-medium">
                            <Highlight text={r.name} query={query} />
                          </p>
                          <span className="text-xs text-muted-foreground">{r.bookCount} books</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
