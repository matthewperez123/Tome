"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import Link from "next/link"
import { Search, Users2 } from "lucide-react"
import { AUTHORS } from "@/data/authors"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { BlurFade } from "@/components/ui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/tome/SearchBar"
import { FilterDropdown } from "@/components/tome/FilterDropdown"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/lib/use-debounce"

// ── Constants ──────────────────────────────────

const TRADITION_COLORS: Record<string, string> = {
  "Ancient Greek": "#0EA5E9",
  Roman: "#EF4444",
  "Medieval European": "#F59E0B",
  Renaissance: "#EAB308",
  Enlightenment: "#06B6D4",
  Romantic: "#F43F5E",
  Victorian: "#A855F7",
  Russian: "#3B82F6",
  American: "#6366F1",
  French: "#F97316",
  Modernist: "#14B8A6",
  "Post-Colonial": "#10B981",
  Eastern: "#FB923C",
  Contemporary: "#8B5CF6",
  Scandinavian: "#64748B",
  Germanic: "#6B7280",
  "World Literature": "#9CA3AF",
}

const TRADITIONS = Object.keys(TRADITION_COLORS) as string[]

const ERAS = [
  { label: "All Eras", value: "" },
  { label: "Ancient", value: "Ancient" },
  { label: "Medieval", value: "Medieval" },
  { label: "Renaissance", value: "Renaissance" },
  { label: "Enlightenment", value: "Enlightenment" },
  { label: "Modern", value: "Modern" },
  { label: "Contemporary", value: "Contemporary" },
] as const

const NATIONALITIES = [
  { label: "All", value: "" },
  { label: "Greek", value: "Greek" },
  { label: "Roman", value: "Roman" },
  { label: "English", value: "English" },
  { label: "French", value: "French" },
  { label: "Russian", value: "Russian" },
  { label: "American", value: "American" },
  { label: "Irish", value: "Irish" },
  { label: "Spanish", value: "Spanish" },
  { label: "Italian", value: "Italian" },
  { label: "Persian", value: "Persian" },
  { label: "German", value: "German" },
  { label: "Czech", value: "Czech" },
] as const

// ── Helpers ────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function getPrimaryTradition(traditions: string[]): string {
  return traditions[0] ?? "Contemporary"
}

// ── Supabase-derived author type ───────────────

interface DerivedAuthor {
  id: string
  name: string
  nationality: string
  era: string
  traditions: string[]
  birthYear: number | null
  deathYear: number | null
  notableWorks: string[]
  worksInLibrary?: string[]
}

function deriveAuthorsFromBooks(books: Array<{ author: string; tradition: string; id: string }>): DerivedAuthor[] {
  const map = new Map<string, DerivedAuthor>()
  for (const book of books) {
    const authorId = book.author.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
    const existing = map.get(authorId)
    if (existing) {
      if (!existing.traditions.includes(book.tradition)) existing.traditions.push(book.tradition)
      existing.worksInLibrary = existing.worksInLibrary ?? []
      existing.worksInLibrary.push(book.id)
    } else {
      map.set(authorId, {
        id: authorId,
        name: book.author,
        nationality: "",
        era: "",
        traditions: [book.tradition],
        birthYear: null,
        deathYear: null,
        notableWorks: [],
        worksInLibrary: [book.id],
      })
    }
  }
  return [...map.values()]
}

// ── Page Component ─────────────────────────────

export default function AuthorsPage() {
  const [search, setSearch] = useState("")
  const [eraFilter, setEraFilter] = useState("")
  const [nationalityFilter, setNationalityFilter] = useState("")
  const [selectedTraditions, setSelectedTraditions] = useState<Set<string>>(new Set())
  const [supabaseAuthors, setSupabaseAuthors] = useState<DerivedAuthor[]>([])
  const [loadingSupabase, setLoadingSupabase] = useState(true)

  useEffect(() => {
    async function fetchAuthors() {
      try {
        const { data } = await supabase
          .from("books")
          .select("id, author, tradition")
        if (data && data.length > 0) {
          setSupabaseAuthors(deriveAuthorsFromBooks(data as Array<{ author: string; tradition: string; id: string }>))
        }
      } catch {
        // fall through to static AUTHORS
      } finally {
        setLoadingSupabase(false)
      }
    }
    fetchAuthors()
  }, [])

  // Merge: use static AUTHORS as base, supplement with Supabase-derived if available
  const authors = useMemo(() => {
    if (supabaseAuthors.length === 0) return AUTHORS
    const staticIds = new Set(AUTHORS.map(a => a.id))
    const extra = supabaseAuthors.filter(a => !staticIds.has(a.id))
    return [...AUTHORS, ...extra] as typeof AUTHORS
  }, [supabaseAuthors])

  const debouncedSearch = useDebounce(search, 300)

  const toggleTradition = useCallback((t: string) => {
    setSelectedTraditions((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }, [])

  const clearFilters = useCallback(() => {
    setSearch("")
    setEraFilter("")
    setNationalityFilter("")
    setSelectedTraditions(new Set())
  }, [])

  const hasActiveFilters =
    debouncedSearch || eraFilter || nationalityFilter || selectedTraditions.size > 0

  const filtered = useMemo(() => {
    return authors.filter((a) => {
      const matchSearch =
        !debouncedSearch ||
        a.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        a.nationality.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchEra = !eraFilter || a.era === eraFilter
      const matchTradition =
        selectedTraditions.size === 0 || a.traditions.some((t) => selectedTraditions.has(t))
      const matchNationality = !nationalityFilter || a.nationality === nationalityFilter
      return matchSearch && matchEra && matchTradition && matchNationality
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [debouncedSearch, eraFilter, selectedTraditions, nationalityFilter, authors])

  const allTraditions = useMemo(() => {
    const tradSet = new Set<string>()
    authors.forEach((a) => a.traditions.forEach((t) => tradSet.add(t)))
    return TRADITIONS.filter((t) => tradSet.has(t))
  }, [authors])

  return (
    <div className="flex flex-col md:flex-row gap-0 min-h-full">
      {/* ── Filter Sidebar ── */}
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
            value={eraFilter}
            onChange={setEraFilter}
            options={ERAS}
            className="w-full rounded-md"
          />
        </div>

        {/* Nationality */}
        <div className="mb-5">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Nationality
          </label>
          <FilterDropdown
            label="Nationality"
            value={nationalityFilter}
            onChange={setNationalityFilter}
            options={NATIONALITIES}
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
                  style={{ backgroundColor: TRADITION_COLORS[t] }}
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
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex flex-col min-w-0 mr-auto">
              <h1 className="text-sm font-serif font-semibold leading-none tracking-tight">
                Authors
              </h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {filtered.length} authors across {allTraditions.length} traditions
              </p>
            </div>

            <SearchBar
              placeholder="Search authors…"
              value={search}
              onChange={setSearch}
              className="w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Author Grid */}
        <div className="p-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <div className="relative">
                <Users2 className="size-10 text-muted-foreground/30" />
                <Search className="size-4 text-muted-foreground/50 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <p className="text-sm font-medium">No authors found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search terms</p>
              </div>
              <button
                onClick={clearFilters}
                className="mt-1 h-8 px-4 rounded-full border border-[var(--tome-accent)] text-xs text-[var(--tome-accent)] hover:bg-[color-mix(in_srgb,var(--tome-accent)_8%,transparent)] transition-colors"
              >
                Browse all authors
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((author, i) => {
                const primaryTradition = getPrimaryTradition(author.traditions)
                const color = TRADITION_COLORS[primaryTradition] ?? "#6366F1"
                const lifeSpan =
                  author.birthYear != null
                    ? author.deathYear != null
                      ? `${author.birthYear} – ${author.deathYear}`
                      : `b. ${author.birthYear}`
                    : null

                return (
                  <BlurFade key={author.id} delay={0.03 + (i % 30) * 0.02} inView>
                    <Link
                      href={`/author/${author.id}`}
                      className={cn(
                        "group flex flex-col items-center text-center gap-2 rounded-xl border border-border bg-card p-3",
                        "transition-[transform,box-shadow] duration-[var(--tome-duration-fast)] ease-[var(--tome-ease-scholarly)]",
                        "hover:scale-[1.02] hover:shadow-md motion-reduce:hover:scale-100"
                      )}
                    >
                      {/* Portrait Circle */}
                      <div
                        className="flex size-14 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
                        style={{
                          backgroundColor: `${color}33`,
                          borderColor: color,
                          color,
                        }}
                      >
                        {getInitials(author.name)}
                      </div>

                      {/* Name */}
                      <p className="text-sm font-medium leading-snug line-clamp-2 w-full">
                        {author.name}
                      </p>

                      {/* Life Span */}
                      {lifeSpan && (
                        <p className="text-[10px] text-muted-foreground -mt-1">{lifeSpan}</p>
                      )}

                      {/* Tradition Badge */}
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-none"
                        style={{
                          backgroundColor: `${color}20`,
                          color,
                        }}
                      >
                        {primaryTradition}
                      </span>

                      {/* Nationality + Era */}
                      <p className="text-[10px] text-muted-foreground -mt-1 truncate w-full">
                        {author.nationality} · {author.era}
                      </p>

                      {/* Works count */}
                      <p className="text-[10px] text-muted-foreground/60">
                        {(author.worksInLibrary?.length ?? 0) > 0
                          ? `${author.worksInLibrary!.length} in library`
                          : `${author.notableWorks.length} works`}
                      </p>
                    </Link>
                  </BlurFade>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
