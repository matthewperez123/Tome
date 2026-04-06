"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { BookOpen, TrendingUp, Star, Search, Flame } from "lucide-react"
import { type TomeBook } from "@/data/books"
import { getBooks, getFeaturedBooks, getTrendingBooks, searchBooks } from "@/lib/content"
import { supabase, mapToTomeBook } from "@/lib/supabase"
import { useDebounce } from "@/lib/use-debounce"
import { getAllBookProgress } from "@/lib/book-progress"
import { BlurFade } from "@/components/ui/blur-fade"
import { Skeleton } from "@/components/ui/skeleton"
import { BookCard, TRADITION_COLORS } from "@/components/tome/book-card"
import { BookCover, getCoverParams } from "@/components/tome/book-cover"
import { AuthorLink } from "@/components/tome/author-link"
import { SearchBar } from "@/components/tome/SearchBar"
import { FilterDropdown } from "@/components/tome/FilterDropdown"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────

const TRADITIONS = [
  "Ancient Greek", "Roman", "Medieval European", "Renaissance",
  "Enlightenment", "Romantic", "Victorian", "Russian",
  "American", "French", "Modernist", "Eastern",
  "Post-Colonial", "Contemporary", "Scandinavian", "Germanic",
  "World Literature",
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
  const [selectedTraditions, setSelectedTraditions] = useState<Set<string>>(new Set())
  const [era,        setEra]        = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [sort,       setSort]       = useState("title")

  const debouncedSearch = useDebounce(search, 300)

  // ── Load data ──────────────────────────────────
  useEffect(() => {
    async function loadBooks() {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .order("title", { ascending: true })

        if (error) throw error

        const mapped = (data ?? []).map(mapToTomeBook)
        setAllBooks(mapped)
        setFeatured(mapped.filter((b) => b.featured).slice(0, 3))
        setTrending(getTrendingBooks().slice(0, 6))
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local data:", err)
        setAllBooks(getBooks())
        setTrending(getTrendingBooks().slice(0, 6))
        setFeatured(getFeaturedBooks().slice(0, 3))
      }
      setAllProgress(getAllBookProgress())
      setLoading(false)
    }
    loadBooks()
  }, [])

  // ── Tradition toggle (multi-select, matches /authors) ──
  const toggleTradition = useCallback((t: string) => {
    setSelectedTraditions((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }, [])

  // ── Clear all ─────────────────────────────────
  const clearFilters = useCallback(() => {
    setSearch("")
    setSelectedTraditions(new Set())
    setEra("")
    setDifficulty("")
    setSort("title")
  }, [])

  const hasActiveFilters = !!(debouncedSearch || selectedTraditions.size > 0 || era || difficulty)

  // ── All traditions present in the library ──
  const allTraditions = useMemo(() => {
    const tradSet = new Set<string>()
    allBooks.forEach((b) => tradSet.add(b.tradition))
    return (TRADITIONS as readonly string[]).filter((t) => tradSet.has(t))
  }, [allBooks])

  // ── Fully filtered + sorted books ─────────────
  const filtered = useMemo(() => {
    let result = allBooks

    if (debouncedSearch) result = searchBooks(debouncedSearch)
    if (selectedTraditions.size > 0) result = result.filter(b => selectedTraditions.has(b.tradition))
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
  }, [allBooks, debouncedSearch, selectedTraditions, era, difficulty, sort])

  // Show discovery sections only when no active filters
  const showDiscovery = !hasActiveFilters

  return (
    <div className="flex flex-col md:flex-row gap-0 min-h-full">
      {/* ── Filter Sidebar — mirrors /authors exactly ── */}
      <aside className="hidden md:block shrink-0 w-56 border-r border-border bg-[var(--tome-surface-elevated)] p-4">
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
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Era</label>
          <FilterDropdown
            label="Era"
            value={era}
            onChange={setEra}
            options={ERAS}
            className="w-full rounded-md"
          />
        </div>

        {/* Difficulty */}
        <div className="mb-5">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Difficulty
          </label>
          <FilterDropdown
            label="Difficulty"
            value={difficulty}
            onChange={setDifficulty}
            options={DIFFICULTIES}
            className="w-full rounded-md"
          />
        </div>

        {/* Sort */}
        <div className="mb-5">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Sort By
          </label>
          <FilterDropdown
            label="Sort"
            value={sort}
            onChange={setSort}
            options={SORTS}
            className="w-full rounded-md"
          />
        </div>

        {/* Traditions */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Traditions
          </label>
          <div className="space-y-1">
            {allTraditions.map((t) => (
              <label key={t} className="flex items-center gap-2 py-0.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedTraditions.has(t)}
                  onChange={() => toggleTradition(t)}
                  className="size-3 rounded border-border accent-[var(--tome-accent)]"
                />
                <span
                  className="size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: TRADITION_COLORS[t]?.dot }}
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {t}
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Sticky Header — identical structure to /authors */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col min-w-0 mr-auto">
              <h1 className="text-sm font-serif font-semibold leading-none tracking-tight">
                Library
              </h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {filtered.length} book{filtered.length !== 1 ? "s" : ""} across {allTraditions.length} traditions
              </p>
            </div>

            <SearchBar
              placeholder="Search books, authors, themes…"
              value={search}
              onChange={setSearch}
              className="w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <LibrarySkeleton />
          ) : (
            <div className="space-y-8">

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
              {filtered.length === 0 ? (
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
                    onClick={clearFilters}
                    className="mt-1 h-8 px-4 rounded-full border border-[var(--tome-accent)] text-xs text-[var(--tome-accent)] hover:bg-[color-mix(in_srgb,var(--tome-accent)_8%,transparent)] transition-colors"
                  >
                    Browse all books
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5">
                  {filtered.map((book, i) => (
                    <BlurFade key={book.id} delay={0.03 + (i % 30) * 0.02} inView>
                      <BookCard
                        book={book}
                        progress={allProgress[book.id]}
                        size="sm"
                      />
                    </BlurFade>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────

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
  const trendIcon = book.trending?.trend === "hot" ? <Flame className="size-3.5" /> : book.trending?.trend === "rising" ? <TrendingUp className="size-3.5" /> : <BookOpen className="size-3.5" />

  return (
    <a
      href={`/book/${book.id}`}
      className={cn(
        "group flex flex-col w-36 shrink-0 rounded-xl border border-border bg-card overflow-hidden snap-start",
        "transition-[transform,box-shadow] duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)] hover:scale-[1.02] hover:shadow-md motion-reduce:hover:scale-100"
      )}
    >
      <div className="relative overflow-hidden">
        <BookCover {...coverParams} className="w-full transition-transform duration-[var(--tome-duration-fast)] group-hover:-translate-y-0.5" />

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

// ── Loading Skeleton ──────────────────────────

function LibrarySkeleton() {
  return (
    <div className="space-y-8">
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
      {/* Grid skeleton */}
      <div>
        <Skeleton className="h-5 w-28 mb-3" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5">
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
