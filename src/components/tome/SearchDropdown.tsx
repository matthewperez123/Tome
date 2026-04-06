"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, User, Tag, Landmark, MessageSquareQuote, UserCircle, SearchX } from "lucide-react"
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
      <mark className="bg-[var(--gold-default)]/20 text-[var(--gold-default)] rounded-sm px-0.5">
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
    for (const r of results.characters) list.push({ type: "character", id: r.character.name, route: `/book/${r.character.bookId}` })
    for (const r of results.quotes) list.push({ type: "quote", id: r.quote.text.slice(0, 20), route: r.quote.bookId ? `/book/${r.quote.bookId}` : "#" })
    for (const r of results.genres) list.push({ type: "genre", id: r.name, route: `/library?genre=${encodeURIComponent(r.name)}` })
    for (const r of results.traditions) list.push({ type: "tradition", id: r.name, route: `/library?tradition=${encodeURIComponent(r.name)}` })
    return list
  }, [results])

  useEffect(() => setFocusIdx(-1), [results])

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
                <SearchX className="size-5 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
              </div>
            ) : (
              <>
                {/* Books */}
                {results.books.length > 0 && (
                  <div>
                    <SectionHeader icon={<BookOpen className="size-3" />} label="Books" />
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
                          <BookOpen className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate"><Highlight text={r.book.title} query={query} /></p>
                            <p className="text-xs text-muted-foreground truncate"><Highlight text={r.book.author} query={query} /> &middot; {r.book.tradition}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Authors */}
                {results.authors.length > 0 && (
                  <div>
                    <SectionHeader icon={<User className="size-3" />} label="Authors" />
                    {results.authors.map((r) => {
                      flatIdx++
                      const idx = flatIdx
                      return (
                        <button
                          key={r.author.id}
                          onClick={() => navigate(`/author/${r.author.id}`)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 flex items-center gap-3 border-b border-border/50 last:border-0 transition-colors",
                            idx === focusIdx ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <User className="size-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium"><Highlight text={r.author.name} query={query} /></p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">{r.bookCount} books</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Characters */}
                {results.characters.length > 0 && (
                  <div>
                    <SectionHeader icon={<UserCircle className="size-3" />} label="Characters" />
                    {results.characters.map((r) => {
                      flatIdx++
                      const idx = flatIdx
                      return (
                        <button
                          key={r.character.name}
                          onClick={() => navigate(`/book/${r.character.bookId}`)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 flex items-start gap-3 border-b border-border/50 last:border-0 transition-colors",
                            idx === focusIdx ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <UserCircle className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">
                              <Highlight text={r.character.name} query={query} />
                              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-border text-muted-foreground">{r.character.role}</span>
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{r.character.bookTitle} &middot; {r.character.description.slice(0, 50)}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Quotes */}
                {results.quotes.length > 0 && (
                  <div>
                    <SectionHeader icon={<MessageSquareQuote className="size-3" />} label="Quotes" />
                    {results.quotes.map((r, i) => {
                      flatIdx++
                      const idx = flatIdx
                      return (
                        <button
                          key={i}
                          onClick={() => r.quote.bookId ? navigate(`/book/${r.quote.bookId}`) : undefined}
                          className={cn(
                            "w-full text-left px-4 py-2.5 flex items-start gap-3 border-b border-border/50 last:border-0 transition-colors",
                            idx === focusIdx ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <MessageSquareQuote className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm italic text-foreground/80 line-clamp-2">&ldquo;<Highlight text={r.quote.text.slice(0, 80)} query={query} />&rdquo;</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{r.quote.attribution}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Genres */}
                {results.genres.length > 0 && (
                  <div>
                    <SectionHeader icon={<Tag className="size-3" />} label="Genres" />
                    {results.genres.map((r) => {
                      flatIdx++
                      const idx = flatIdx
                      return (
                        <button
                          key={r.name}
                          onClick={() => navigate(`/library?genre=${encodeURIComponent(r.name)}`)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 flex items-center gap-3 border-b border-border/50 last:border-0 transition-colors",
                            idx === focusIdx ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <Tag className="size-4 text-muted-foreground shrink-0" />
                          <p className="text-sm font-medium flex-1"><Highlight text={r.name} query={query} /></p>
                          <span className="text-xs text-muted-foreground">{r.bookCount} books</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Traditions */}
                {results.traditions.length > 0 && (
                  <div>
                    <SectionHeader icon={<Landmark className="size-3" />} label="Traditions" />
                    {results.traditions.map((r) => {
                      flatIdx++
                      const idx = flatIdx
                      return (
                        <button
                          key={r.name}
                          onClick={() => navigate(`/library?tradition=${encodeURIComponent(r.name)}`)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 flex items-center gap-3 border-b border-border/50 last:border-0 transition-colors",
                            idx === focusIdx ? "bg-accent" : "hover:bg-accent/50"
                          )}
                        >
                          <Landmark className="size-4 text-muted-foreground shrink-0" />
                          <p className="text-sm font-medium flex-1"><Highlight text={r.name} query={query} /></p>
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

// ── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="sticky top-0 flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-medium bg-card">
      {icon}
      {label}
    </div>
  )
}
