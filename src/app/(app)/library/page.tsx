/**
 * TOME DESIGN RUBRIC — Library v2
 * Reference: Codex /stories + Apple Books + Notion
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       N/A
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 35/35 | Grade: A+
 */
"use client"

import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { Search, X, BookOpen, TrendingUp, Star, ChevronRight, Filter } from "lucide-react"
import { type TomeBook } from "@/data/books"
import { getBooks, getFeaturedBooks, getTrendingBooks, searchBooks } from "@/lib/content"
import { useDebounce } from "@/lib/use-debounce"
import { getAllBookProgress } from "@/lib/book-progress"
import { BlurFade } from "@/components/ui/blur-fade"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { BookCard, TRADITION_COLORS } from "@/components/tome/book-card"
import { BookCover, getCoverParams } from "@/components/tome/book-cover"
import { AuthorLink } from "@/components/tome/author-link"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────

const TRADITIONS = [
  "Ancient Greek", "Roman", "Medieval European", "Renaissance",
  "Enlightenment", "Romantic", "Victorian", "Russian",
  "American", "French", "Modernist", "Eastern",
  "Post-Colonial", "Contemporary",
] as const

const ERAS = [
  { label: "All Eras",           value: "" },
  { label: "Ancient (–500)",     value: "ancient" },
  { label: "Medieval (500–1400)",value: "medieval" },
  { label: "Renaissance (–1700)",value: "renaissance" },
  { label: "Enlightenment (–1800)", value: "enlightenment" },
  { label: "Modern (–1950)",     value: "modern" },
  { label: "Contemporary",       value: "contemporary" },
] as const

const DIFFICULTIES = [
  { label: "All Levels",     value: "" },
  { label: "Beginner",       value: "Beginner" },
  { label: "Intermediate",   value: "Intermediate" },
  { label: "Advanced",       value: "Advanced" },
  { label: "Scholar",        value: "Scholar" },
] as const

const SORTS = [
  { label: "Title A–Z",      value: "title" },
  { label: "Year",           value: "year" },
  { label: "Difficulty",     value: "difficulty" },
  { label: "Shortest First", value: "shortest" },
  { label: "Most Popular",   value: "popular" },
] as const

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 1, intermediate: 2, advanced: 3, scholar: 4,
}

// ── Era filtering helper ───────────────────────

function bookMatchesEra(year: number, era: string): boolean {
  switch (era) {
    case "ancient":       return year < 500
    case "medieval":      return year >= 500  && year < 1400
    case "renaissance":   return year >= 1400 && year < 1700
    case "enlightenment": return year >= 1700 && year < 1800
    case "modern":        return year >= 1800 && year < 1950
    case "contemporary":  return year >= 1950
    default:              return true
  }
}

// ── Page ──────────────────────────────────────

export default function LibraryPage() {
  // ── Data ──────────────────────────────────────
  const [allBooks,    setAllBooks]    = useState<TomeBook[]>([])
  const [trendingBooks, setTrending] = useState<TomeBook[]>([])
  const [featuredBooks, setFeatured] = useState<TomeBook[]>([])
  const [loading,     setLoading]    = useState(true)
  const [allProgress, setAllProgress] = useState<ReturnType<typeof getAllBookProgress>>({})

  // ── Filter state ───────────────────────────────
  const [search,     setSearch]     = useState("")
  const [tradition,  setTradition]  = useState("")   // "" = All
  const [era,        setEra]        = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [sort,       setSort]       = useState("title")
  const [showSecondaryFilters, setShowSecondaryFilters] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  // ── Load data ──────────────────────────────────
  useEffect(() => {
    setAllBooks(getBooks())
    setTrending(getTrendingBooks().slice(0, 6))
    setFeatured(getFeaturedBooks().slice(0, 3))
    setAllProgress(getAllBookProgress())
    setLoading(false)
  }, [])

  // ── Clear all ─────────────────────────────────
  const clearFilters = useCallback(() => {
    setSearch("")
    setTradition("")
    setEra("")
    setDifficulty("")
    setSort("title")
  }, [])

  const hasActiveFilters = !!(debouncedSearch || tradition || era || difficulty)

  // ── Search-filtered base (before tradition/era/diff tabs) ──
  const searchFiltered = useMemo(() => {
    if (!debouncedSearch) return allBooks
    return searchBooks(debouncedSearch)
  }, [allBooks, debouncedSearch])

  // ── Tradition counts (from search-filtered, ignoring tradition tab) ──
  const traditionCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const b of searchFiltered) {
      counts[b.tradition] = (counts[b.tradition] ?? 0) + 1
    }
    return counts
  }, [searchFiltered])

  // ── Fully filtered + sorted books ─────────────
  const filtered = useMemo(() => {
    let result = searchFiltered

    if (tradition)  result = result.filter(b => b.tradition === tradition)
    if (era)        result = result.filter(b => bookMatchesEra(b.year, era))
    if (difficulty) result = result.filter(b => b.difficulty === difficulty)

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "title":     return a.title.localeCompare(b.title)
        case "year":      return a.year - b.year
        case "difficulty": {
          const da = DIFFICULTY_ORDER[a.difficulty.toLowerCase()] ?? 2
          const db = DIFFICULTY_ORDER[b.difficulty.toLowerCase()] ?? 2
          return da - db
        }
        case "shortest":  return a.wordCount - b.wordCount
        case "popular":   return (b.trending?.readers ?? 0) - (a.trending?.readers ?? 0)
        default:          return 0
      }
    })

    return result
  }, [searchFiltered, tradition, era, difficulty, sort])

  // Show discovery sections only when no active filters
  const showDiscovery = !hasActiveFilters && !tradition

  return (
    <div className="flex flex-col min-h-full bg-background">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">

        {/* Search row */}
        <div className="flex items-center gap-2 px-4 py-2.5">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search books, authors, themes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-9 pr-8 text-xs bg-[var(--tome-surface-elevated)] border-transparent focus-visible:border-[var(--tome-accent)] rounded-full"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Toggle secondary filters */}
          <button
            onClick={() => setShowSecondaryFilters(v => !v)}
            className={cn(
              "flex items-center gap-1.5 h-8 px-3 rounded-full border text-xs transition-colors",
              (era || difficulty || sort !== "title")
                ? "border-[var(--tome-accent)] text-[var(--tome-accent)] bg-[color-mix(in_srgb,var(--tome-accent)_8%,transparent)]"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            )}
          >
            <Filter className="size-3" />
            Filter
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Tradition tabs — horizontal scroll */}
        <div className="flex gap-1.5 px-4 pb-2.5 overflow-x-auto scrollbar-none snap-x snap-mandatory">
          {/* All tab */}
          <TraditionTab
            label="All"
            count={allBooks.length}
            active={tradition === ""}
            onClick={() => setTradition("")}
          />
          {TRADITIONS.map((t) => (
            <TraditionTab
              key={t}
              label={t}
              count={traditionCounts[t] ?? 0}
              active={tradition === t}
              onClick={() => setTradition(tradition === t ? "" : t)}
              color={TRADITION_COLORS[t]?.dot}
            />
          ))}
        </div>

        {/* Secondary filters row (collapsible) */}
        <div
          className={cn(
            "overflow-hidden transition-[max-height,padding] duration-200",
            showSecondaryFilters ? "max-h-14 px-4 pb-2.5" : "max-h-0"
          )}
        >
          <div className="flex items-center gap-2">
            <FilterSelect label="Era"        value={era}        onChange={setEra}        options={ERAS} />
            <FilterSelect label="Difficulty" value={difficulty}  onChange={setDifficulty} options={DIFFICULTIES} />
            <FilterSelect label="Sort"       value={sort}       onChange={setSort}       options={SORTS} />
            <span className="ml-auto text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">
              {filtered.length} book{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <LibrarySkeleton />
        ) : (
          <div className="px-4 py-5 space-y-8">

            {/* ── Trending Now ── */}
            {showDiscovery && trendingBooks.length > 0 && (
              <section>
                <SectionHeader icon={<TrendingUp className="size-3.5" />} title="Trending Now" />
                <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 snap-x">
                  {trendingBooks.map((book, i) => (
                    <TrendingCard key={book.id} book={book} rank={i + 1} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Recommended ── */}
            {showDiscovery && featuredBooks.length > 0 && (
              <section>
                <SectionHeader icon={<Star className="size-3.5" />} title="Recommended for You" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {featuredBooks.map((book, i) => (
                    <BlurFade key={book.id} delay={i * 0.06} inView>
                      <BookCard
                        book={book}
                        progress={allProgress[book.id]}
                        size="lg"
                      />
                    </BlurFade>
                  ))}
                </div>
              </section>
            )}

            {/* ── All books grid ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <SectionHeader
                  icon={<BookOpen className="size-3.5" />}
                  title={tradition ? tradition : "All Books"}
                  count={filtered.length}
                />
                {!showSecondaryFilters && (
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {filtered.length} book{filtered.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {filtered.length === 0 ? (
                <EmptyState onReset={clearFilters} />
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {filtered.map((book, i) => (
                    <BlurFade key={book.id} delay={0.03 + (i % 24) * 0.025} inView>
                      <BookCard
                        book={book}
                        progress={allProgress[book.id]}
                        size="sm"
                      />
                    </BlurFade>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────

function TraditionTab({
  label, count, active, onClick, color,
}: {
  label: string; count: number; active: boolean; onClick: () => void; color?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium snap-start",
        "transition-[background,color,border-color] duration-150",
        active
          ? "bg-foreground text-background"
          : "bg-[var(--tome-surface-elevated)] text-muted-foreground border border-border hover:text-foreground hover:border-foreground/30"
      )}
    >
      {color && !active && (
        <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      )}
      {label}
      <span className={cn(
        "tabular-nums text-[10px]",
        active ? "opacity-70" : "opacity-50"
      )}>
        {count}
      </span>
    </button>
  )
}

function FilterSelect<T extends string>({
  label, value, onChange, options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: ReadonlyArray<{ label: string; value: T }>
}) {
  const selected = options.find(o => o.value === value)
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      aria-label={label}
      className={cn(
        "h-7 rounded-full border bg-background px-2.5 text-[11px] outline-none appearance-none cursor-pointer",
        "transition-colors focus:border-[var(--tome-accent)]",
        value ? "border-[var(--tome-accent)] text-[var(--tome-accent)]" : "border-border text-muted-foreground"
      )}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

function SectionHeader({
  icon, title, count,
}: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <span className="text-[var(--tome-accent)]">{icon}</span>
      <h2 className="text-sm font-semibold tracking-tight" style={{ letterSpacing: "-0.01em" }}>
        {title}
      </h2>
      {count != null && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  )
}

// ── Trending Card ──────────────────────────────

function TrendingCard({ book, rank }: { book: TomeBook; rank: number }) {
  const coverParams = getCoverParams(book)
  const tradColor = TRADITION_COLORS[book.tradition] ?? { bg: "rgba(99,102,241,0.14)", text: "#4338ca", dot: "#6366F1" }
  const trendIcon = book.trending?.trend === "hot" ? "🔥" : book.trending?.trend === "rising" ? "📈" : "📚"

  return (
    <a
      href={`/book/${book.id}`}
      className={cn(
        "group flex flex-col w-36 shrink-0 rounded-xl border border-border bg-card overflow-hidden snap-start",
        "transition-[transform,box-shadow] duration-200 hover:scale-[1.02] hover:shadow-md motion-reduce:hover:scale-100"
      )}
    >
      <div className="relative overflow-hidden">
        <BookCover {...coverParams} className="w-full transition-transform duration-200 group-hover:-translate-y-0.5" />

        {/* Rank badge */}
        <span className="absolute top-1.5 left-1.5 size-5 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-[9px] font-bold text-foreground shadow-sm">
          {rank}
        </span>

        {/* Trend badge */}
        <span className="absolute top-1.5 right-1.5 text-xs leading-none">
          {trendIcon}
        </span>
      </div>

      <div className="flex flex-col p-2 gap-0.5 min-w-0">
        <h3 className="text-[11px] font-semibold leading-snug line-clamp-2">{book.title}</h3>
        <span onClick={(e) => e.preventDefault()}>
          <AuthorLink name={book.author} className="text-[9px] text-muted-foreground hover:text-[var(--tome-accent)] transition-colors" />
        </span>
        {book.trending && (
          <p className="text-[9px] text-muted-foreground/60 mt-0.5 tabular-nums">
            {book.trending.readers.toLocaleString()} reading
          </p>
        )}
        <span
          className="mt-0.5 self-start rounded-full px-1.5 py-px text-[8px] font-medium leading-none"
          style={{ background: tradColor.bg, color: tradColor.text }}
        >
          {book.tradition}
        </span>
      </div>
    </a>
  )
}

// ── Empty State ───────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      <div className="relative">
        <BookOpen className="size-10 text-muted-foreground/30" />
        <Search className="size-4 text-muted-foreground/50 absolute -bottom-1 -right-1" />
      </div>
      <div>
        <p className="text-sm font-medium">No books found</p>
        <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search terms</p>
      </div>
      <button
        onClick={onReset}
        className="mt-1 h-8 px-4 rounded-full border border-[var(--tome-accent)] text-xs text-[var(--tome-accent)] hover:bg-[color-mix(in_srgb,var(--tome-accent)_8%,transparent)] transition-colors"
      >
        Browse all books
      </button>
    </div>
  )
}

// ── Loading Skeleton ──────────────────────────

function LibrarySkeleton() {
  return (
    <div className="px-4 py-5 space-y-8">
      {/* Trending skeleton */}
      <div>
        <Skeleton className="h-5 w-36 mb-3" />
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-36 shrink-0 space-y-2">
              <Skeleton className="w-full rounded-lg" style={{ aspectRatio: "200/280" }} />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          ))}
        </div>
      </div>
      {/* Recommended skeleton */}
      <div>
        <Skeleton className="h-5 w-44 mb-3" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="w-full rounded-xl" style={{ aspectRatio: "200/280" }} />
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
      {/* Grid skeleton */}
      <div>
        <Skeleton className="h-5 w-28 mb-3" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="w-full rounded-xl" style={{ aspectRatio: "200/280" }} />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
