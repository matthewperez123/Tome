"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { supabase, type Book } from "@/lib/supabase"
import { useDebounce } from "@/lib/use-debounce"
import { BlurFade } from "@/components/ui/blur-fade"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookCover, getCoverParams } from "@/components/tome/book-cover"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────

const TRADITIONS = [
  "Ancient Greek", "Roman", "Medieval European", "Renaissance",
  "Enlightenment", "Romantic", "Victorian", "Russian",
  "American", "French", "Modernist", "Post-Colonial",
  "Eastern", "Contemporary",
] as const

const ERAS = [
  { label: "All Eras", value: "" },
  { label: "Ancient (before 500)", value: "ancient" },
  { label: "Medieval (500–1400)", value: "medieval" },
  { label: "Renaissance (1400–1700)", value: "renaissance" },
  { label: "Enlightenment (1700–1800)", value: "enlightenment" },
  { label: "Modern (1800–1950)", value: "modern" },
  { label: "Contemporary (1950+)", value: "contemporary" },
] as const

const SORTS = [
  { label: "Title A–Z", value: "title" },
  { label: "Year", value: "year" },
  { label: "Difficulty", value: "difficulty" },
  { label: "Shortest", value: "reading_time" },
] as const

const DIFFICULTY_ORDER = { beginner: 1, intermediate: 2, advanced: 3 }

const traditionColors: Record<string, string> = {
  "Ancient Greek": "var(--tome-sky)",
  Roman: "var(--tome-red)",
  "Medieval European": "var(--tome-amber)",
  Renaissance: "var(--tome-gold)",
  Enlightenment: "var(--tome-cyan)",
  Romantic: "var(--tome-rose)",
  Victorian: "var(--tome-purple)",
  Russian: "var(--tome-blue)",
  American: "var(--tome-indigo)",
  French: "var(--tome-coral)",
  Modernist: "var(--tome-teal)",
  "Post-Colonial": "var(--tome-emerald)",
  Eastern: "var(--tome-orange)",
  Contemporary: "var(--tome-violet)",
}

// ── Page Component ─────────────────────────────

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedTraditions, setSelectedTraditions] = useState<Set<string>>(new Set())
  const [era, setEra] = useState("")
  const [sort, setSort] = useState("title")
  const [showFilters, setShowFilters] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("title")

      if (!error && data) {
        setBooks(data as Book[])
      }
      setLoading(false)
    }
    fetchBooks()
  }, [])

  const toggleTradition = useCallback((t: string) => {
    setSelectedTraditions((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedTraditions(new Set())
    setEra("")
    setSearch("")
    setSort("title")
  }, [])

  const hasActiveFilters = selectedTraditions.size > 0 || era || debouncedSearch

  const filtered = useMemo(() => {
    let result = [...books]

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      )
    }

    if (selectedTraditions.size > 0) {
      result = result.filter((b) => selectedTraditions.has(b.tradition))
    }

    if (era) {
      result = result.filter((b) => {
        const y = b.year
        if (!y) return false
        switch (era) {
          case "ancient": return y < 500
          case "medieval": return y >= 500 && y < 1400
          case "renaissance": return y >= 1400 && y < 1700
          case "enlightenment": return y >= 1700 && y < 1800
          case "modern": return y >= 1800 && y < 1950
          case "contemporary": return y >= 1950
          default: return true
        }
      })
    }

    result.sort((a, b) => {
      switch (sort) {
        case "title":
          return a.title.localeCompare(b.title)
        case "year":
          return (a.year ?? 0) - (b.year ?? 0)
        case "difficulty": {
          const da = DIFFICULTY_ORDER[(a.difficulty ?? "intermediate") as keyof typeof DIFFICULTY_ORDER] ?? 2
          const db = DIFFICULTY_ORDER[(b.difficulty ?? "intermediate") as keyof typeof DIFFICULTY_ORDER] ?? 2
          return da - db
        }
        case "reading_time":
          return (a.reading_time_minutes ?? 0) - (b.reading_time_minutes ?? 0)
        default:
          return 0
      }
    })

    return result
  }, [books, debouncedSearch, selectedTraditions, era, sort])

  const featured = filtered[0]
  const gridBooks = filtered.slice(1)

  return (
    <div className="flex flex-col md:flex-row gap-0 min-h-full">
      {/* ── Filter Sidebar ── */}
      <aside
        className={cn(
          "shrink-0 border-r border-border bg-[var(--tome-surface-elevated)] transition-[width,padding] duration-[var(--tome-duration-fast)] overflow-hidden",
          showFilters ? "w-64 p-4" : "w-0 p-0 md:w-56 md:p-4"
        )}
      >
        <div className="min-w-[200px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Era */}
          <div className="mb-5">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Era
            </label>
            <select
              value={era}
              onChange={(e) => setEra(e.target.value)}
              className="w-full h-7 rounded-md border border-border bg-background px-2 text-xs outline-none focus:border-[var(--tome-accent)]"
            >
              {ERAS.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="mb-5">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Sort by
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full h-7 rounded-md border border-border bg-background px-2 text-xs outline-none focus:border-[var(--tome-accent)]"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Traditions */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Traditions
            </label>
            <div className="space-y-1">
              {TRADITIONS.map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 py-0.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedTraditions.has(t)}
                    onChange={() => toggleTradition(t)}
                    className="size-3 rounded border-border accent-[var(--tome-accent)]"
                  />
                  <span
                    className="size-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: traditionColors[t] }}
                  />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2.5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <X className="size-4" /> : <SlidersHorizontal className="size-4" />}
          </Button>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search books or authors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 pl-8 text-xs bg-transparent border-transparent focus-visible:border-[var(--tome-accent)]"
            />
          </div>

          <span className="text-xs text-muted-foreground tabular-nums">
            {filtered.length} books
          </span>
        </div>

        <div className="p-4">
          {loading ? (
            <LoadingSkeleton />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-muted-foreground">No books match your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-xs text-[var(--tome-accent)] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured Book */}
              {featured && (
                <BlurFade delay={0.1} inView>
                  <FeaturedCard book={featured} />
                </BlurFade>
              )}

              {/* Book Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {gridBooks.map((book, i) => (
                  <BlurFade key={book.id} delay={0.05 + (i % 20) * 0.03} inView>
                    <BookCard book={book} />
                  </BlurFade>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Featured Card ──────────────────────────────

function FeaturedCard({ book }: { book: Book }) {
  const coverParams = getCoverParams(book)

  return (
    <div className="group relative flex gap-5 rounded-xl border border-border bg-card p-4 transition-shadow duration-[var(--tome-duration-fast)] hover:shadow-sm overflow-hidden">
      <div className="w-24 shrink-0 sm:w-32">
        <BookCover {...coverParams} className="w-full shadow-sm" />
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <Badge
          variant="outline"
          className="w-fit text-[10px] mb-2"
          style={{
            borderColor: traditionColors[book.tradition] ?? "var(--border)",
            color: traditionColors[book.tradition],
          }}
        >
          {book.tradition}
        </Badge>
        <h3 className="text-base font-semibold tracking-tight truncate" style={{ letterSpacing: "-0.015em" }}>
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
        {book.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 hidden sm:block">
            {book.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
          {book.year && <span>{book.year < 0 ? `${Math.abs(book.year)} BC` : book.year}</span>}
          {book.reading_time_minutes && (
            <>
              <span>·</span>
              <span>{book.reading_time_minutes < 60 ? `${book.reading_time_minutes} min` : `${Math.round(book.reading_time_minutes / 60)}h`}</span>
            </>
          )}
          {book.difficulty && (
            <>
              <span>·</span>
              <span className="capitalize">{book.difficulty}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Book Card ──────────────────────────────────

function BookCard({ book }: { book: Book }) {
  const coverParams = getCoverParams(book)
  const available = book.content_available

  const Wrapper = available ? "a" : "div"
  const linkProps = available ? { href: `/read/${book.id}` } : {}

  return (
    <Wrapper
      {...linkProps}
      className={cn(
        "group flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-[transform,box-shadow] duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] hover:scale-[1.02] hover:shadow-sm motion-reduce:hover:scale-100",
        !available && "opacity-75"
      )}
    >
      <div className="relative p-2 pb-0">
        <BookCover {...coverParams} className="w-full" />
        {!available && (
          <div className="absolute inset-x-2 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-2.5 pt-2 min-w-0">
        <h3 className="text-xs font-medium leading-snug truncate">{book.title}</h3>
        <p className="text-[10px] text-muted-foreground truncate">{book.author}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium"
            style={{
              backgroundColor: `color-mix(in srgb, ${traditionColors[book.tradition] ?? "#6366F1"} 12%, transparent)`,
              color: traditionColors[book.tradition] ?? "var(--tome-accent)",
            }}
          >
            {book.tradition}
          </span>
        </div>
        {book.reading_time_minutes && (
          <p className="text-[9px] text-muted-foreground/60 mt-0.5">
            {book.reading_time_minutes < 60
              ? `${book.reading_time_minutes} min`
              : `${Math.round(book.reading_time_minutes / 60)}h read`}
          </p>
        )}
        {!available && (
          <p className="text-[9px] text-muted-foreground/40 mt-0.5 italic">Coming soon</p>
        )}
      </div>
    </Wrapper>
  )
}

// ── Loading Skeleton ───────────────────────────

function LoadingSkeleton() {
  return (
    <div>
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-full rounded-lg" style={{ aspectRatio: "200/280" }} />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
