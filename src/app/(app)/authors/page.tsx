"use client"

import { useMemo, useState, useCallback } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { AUTHORS } from "@/data/authors"
import { BlurFade } from "@/components/ui/blur-fade"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

// ── Page Component ─────────────────────────────

export default function AuthorsPage() {
  const [search, setSearch] = useState("")
  const [eraFilter, setEraFilter] = useState("")
  const [nationalityFilter, setNationalityFilter] = useState("")
  const [selectedTraditions, setSelectedTraditions] = useState<Set<string>>(new Set())

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
    return AUTHORS.filter((a) => {
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
  }, [debouncedSearch, eraFilter, selectedTraditions, nationalityFilter])

  const allTraditions = useMemo(() => {
    const tradSet = new Set<string>()
    AUTHORS.forEach((a) => a.traditions.forEach((t) => tradSet.add(t)))
    return TRADITIONS.filter((t) => tradSet.has(t))
  }, [])

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
          <select
            value={eraFilter}
            onChange={(e) => setEraFilter(e.target.value)}
            className="w-full h-7 rounded-md border border-border bg-background px-2 text-xs outline-none focus:border-[var(--tome-accent)]"
          >
            {ERAS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {/* Nationality */}
        <div className="mb-5">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Nationality
          </label>
          <select
            value={nationalityFilter}
            onChange={(e) => setNationalityFilter(e.target.value)}
            className="w-full h-7 rounded-md border border-border bg-background px-2 text-xs outline-none focus:border-[var(--tome-accent)]"
          >
            {NATIONALITIES.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
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

            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search authors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 pl-8 text-xs bg-transparent border-transparent focus-visible:border-[var(--tome-accent)]"
              />
            </div>
          </div>
        </div>

        {/* Author Grid */}
        <div className="p-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-muted-foreground">No authors match your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-xs text-[var(--tome-accent)] hover:underline"
              >
                Clear filters
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
