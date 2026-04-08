"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Heart, Bookmark, BookOpen, Check, GripVertical,
  Star, Quote, ArrowRight, Clock,
} from "lucide-react"
import {
  getShelf,
  getShelfCounts,
  toggleFavorite,
  removeFromShelf,
  rateBook,
  setReflection,
  reorderWantToRead,
  SHELF_LABELS,
  type ShelfType,
  type ShelfEntry,
} from "@/lib/shelves/store"
import { getBook, getBooks } from "@/lib/content"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { getAllBookProgress } from "@/lib/book-progress"
import { CHARACTERS_BY_BOOK } from "@/data/character-avatars"
import { cn } from "@/lib/utils"

// ── Helpers ───────────────────────────────────────────────────────────────

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days  = Math.floor(diff / 86_400_000)
  if (days < 1)  return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7)  return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function completionLabel(iso?: string): string {
  if (!iso) return ""
  return `Finished ${new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
}

// ── Tiny cover wrapper ─────────────────────────────────────────────────────

function TinyCover({
  bookId,
  width = 40,
  height = 60,
}: {
  bookId: string
  width?: number
  height?: number
}) {
  const book     = getBook(bookId)
  if (!book) return <div className="rounded-sm bg-muted shrink-0" style={{ width, height }} />
  return (
    <div className="shrink-0" style={{ width, height }}>
      <ClassicsCover
        bookId={book.id}
        title={book.title}
        author={book.author}
        tradition={book.tradition}
        fallbackColors={book.coverColors}
        className="w-full h-full"
        showTomeWordmark={false}
      />
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────

function ProgressBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className={cn("h-1.5 rounded-full bg-muted overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-[#D4A04C] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ── Star rating ───────────────────────────────────────────────────────────

function StarRating({
  bookId,
  rating,
  onRate,
}: {
  bookId: string
  rating?: number
  onRate: (bookId: string, r: number) => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = hovered !== null ? star <= hovered : star <= (rating ?? 0)
        return (
          <motion.button
            key={star}
            whileTap={{ scale: 1.3 }}
            transition={{ type: "spring", stiffness: 500, damping: 15, delay: (star - 1) * 0.05 }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onRate(bookId, star)}
            className="p-0.5 transition-transform"
          >
            <Star
              className={cn(
                "size-4 transition-colors",
                filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/40"
              )}
            />
          </motion.button>
        )
      })}
    </div>
  )
}

// ── Tradition badge ───────────────────────────────────────────────────────

function TraditionBadge({ tradition }: { tradition: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground border border-border">
      {tradition}
    </span>
  )
}

// ── Character initials badge ──────────────────────────────────────────────

function CharacterBadge({ bookId }: { bookId: string }) {
  const chars = CHARACTERS_BY_BOOK[bookId]
  if (!chars || chars.length === 0) return null
  const char = chars[0]
  const initials = char.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
  return (
    <span
      className="inline-flex items-center justify-center size-5 rounded-full text-[9px] font-bold text-white"
      style={{ backgroundColor: char.accentColor ?? "#6366F1" }}
      title={`${char.name} unlocked`}
    >
      {initials}
    </span>
  )
}

// ── Tab definitions ───────────────────────────────────────────────────────

const TABS: { type: ShelfType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { type: "favorites",         label: "Favorites",        icon: Heart     },
  { type: "want_to_read",      label: "Want to Read",     icon: Bookmark  },
  { type: "currently_reading", label: "Reading",          icon: BookOpen  },
  { type: "completed",         label: "Completed",        icon: Check     },
]

// ── Main Page ─────────────────────────────────────────────────────────────

type SortFavorites = "date" | "title" | "tradition"

export default function ShelvesPage() {
  const [mounted,        setMounted]        = useState(false)
  const [activeTab,      setActiveTab]      = useState<ShelfType>("favorites")
  const [counts,         setCounts]         = useState<Record<ShelfType, number>>({
    favorites: 0, want_to_read: 0, currently_reading: 0, completed: 0,
  })
  const [favorites,      setFavorites]      = useState<ShelfEntry[]>([])
  const [wantToRead,     setWantToRead]     = useState<ShelfEntry[]>([])
  const [currentlyRead,  setCurrentlyRead]  = useState<ShelfEntry[]>([])
  const [completed,      setCompleted]      = useState<ShelfEntry[]>([])
  const [progress,       setProgress]       = useState<ReturnType<typeof getAllBookProgress>>({})
  const [sortFav,        setSortFav]        = useState<SortFavorites>("date")

  // ── Load ───────────────────────────────────────────────────────────────

  useEffect(() => {
    setFavorites(getShelf("favorites"))
    setWantToRead(getShelf("want_to_read"))
    setCurrentlyRead(getShelf("currently_reading"))
    setCompleted(getShelf("completed"))
    setCounts(getShelfCounts())
    setProgress(getAllBookProgress())
    setMounted(true)
  }, [])

  // Sorted favorites
  const sortedFavorites = useMemo(() => {
    const list = [...favorites]
    if (sortFav === "title") {
      list.sort((a, b) => {
        const ba = getBook(a.bookId)
        const bb = getBook(b.bookId)
        return (ba?.title ?? "").localeCompare(bb?.title ?? "")
      })
    } else if (sortFav === "tradition") {
      list.sort((a, b) => {
        const ba = getBook(a.bookId)
        const bb = getBook(b.bookId)
        return (ba?.tradition ?? "").localeCompare(bb?.tradition ?? "")
      })
    }
    // "date" = default order from store (addedAt DESC)
    return list
  }, [favorites, sortFav])

  // Currently reading — merge shelf entries + any book with progress
  const currentlyReadingEntries = useMemo(() => {
    if (!mounted) return []
    const shelfBookIds = new Set(currentlyRead.map((e) => e.bookId))
    const extraEntries: ShelfEntry[] = []
    for (const [bookId, prog] of Object.entries(progress)) {
      if (!shelfBookIds.has(bookId) && prog.currentChapterIndex > 0) {
        extraEntries.push({
          bookId,
          shelfType: "currently_reading",
          addedAt: prog.startedAt,
        })
      }
    }
    return [...currentlyRead, ...extraEntries]
  }, [mounted, currentlyRead, progress])

  // ── Handlers ──────────────────────────────────────────────────────────

  function handleToggleFavorite(bookId: string) {
    toggleFavorite(bookId)
    setFavorites(getShelf("favorites"))
    setCounts(getShelfCounts())
  }

  function handleRemoveFromWantToRead(bookId: string) {
    removeFromShelf(bookId)
    setWantToRead(getShelf("want_to_read"))
    setCounts(getShelfCounts())
  }

  function handleRate(bookId: string, rating: number) {
    rateBook(bookId, rating)
    setCompleted(getShelf("completed"))
  }

  // ── Tab rendering ─────────────────────────────────────────────────────

  function renderFavorites() {
    return (
      <div className="space-y-5">
        {/* Sort controls */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground italic">Your personal literary canon</p>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(["date", "title", "tradition"] as SortFavorites[]).map((s) => (
              <button
                key={s}
                onClick={() => setSortFav(s)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors capitalize",
                  sortFav === s
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "date" ? "Date Added" : s === "title" ? "Title" : "Tradition"}
              </button>
            ))}
          </div>
        </div>

        {sortedFavorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            subtitle="Tap the ♡ on any book to add it here."
          />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {sortedFavorites.map((entry) => {
              const book     = getBook(entry.bookId)
              if (!book) return null
              return (
                <div key={entry.bookId} className="relative group">
                  {/* Heart remove button */}
                  <button
                    onClick={() => handleToggleFavorite(entry.bookId)}
                    className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-black/50 text-rose-400 hover:text-rose-300 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from favorites"
                  >
                    <Heart className="size-3.5 fill-current" />
                  </button>

                  <Link href={`/book/${book.id}`} className="block">
                    <ClassicsCover
                      bookId={book.id}
                      title={book.title}
                      author={book.author}
                      tradition={book.tradition}
                      fallbackColors={book.coverColors}
                      className="w-full"
                      showTomeWordmark={false}
                    />
                    <p className="mt-1.5 text-xs font-medium leading-tight line-clamp-2 text-foreground">
                      {book.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{book.author}</p>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  function renderWantToRead() {
    return (
      <div className="space-y-3">
        {wantToRead.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="Your reading list is empty"
            subtitle="Browse the Library to discover your next book."
            action={<Link href="/library" className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">Browse Library</Link>}
          />
        ) : (
          <div className="space-y-2">
            {wantToRead.map((entry, idx) => {
              const book = getBook(entry.bookId)
              if (!book) return null
              const isFirst = idx === 0
              return (
                <div
                  key={entry.bookId}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/20 transition-colors"
                >
                  {/* Grip handle */}
                  <GripVertical className="size-4 text-muted-foreground/40 shrink-0 hidden sm:block cursor-grab" />

                  {/* Priority badge */}
                  <span
                    className={cn(
                      "shrink-0 min-w-[38px] text-center text-xs font-bold px-1.5 py-0.5 rounded-md",
                      isFirst
                        ? "bg-amber-400/20 text-amber-600 border border-amber-400/30"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isFirst ? "#1 Next" : `#${idx + 1}`}
                  </span>

                  {/* Cover */}
                  <TinyCover bookId={entry.bookId} width={36} height={54} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                    <TraditionBadge tradition={book.tradition} />
                  </div>

                  {/* Start reading */}
                  <Link
                    href={`/read/${book.id}`}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    Start
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  function renderCurrentlyReading() {
    return (
      <div className="space-y-3">
        {currentlyReadingEntries.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No books in progress"
            subtitle="Start reading from the Library."
            action={<Link href="/library" className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">Browse Library</Link>}
          />
        ) : (
          <div className="space-y-3">
            {currentlyReadingEntries.map((entry) => {
              const book     = getBook(entry.bookId)
              const prog     = progress[entry.bookId]
              if (!book) return null

              const chaptersDone  = prog?.completedChapterIndices.length ?? 0
              const totalChapters = book.chapters
              const lastRead      = prog?.lastReadAt ?? entry.addedAt

              return (
                <div
                  key={entry.bookId}
                  className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/20 transition-colors"
                >
                  {/* Cover */}
                  <div className="shrink-0 w-[80px] h-[120px]">
                    <ClassicsCover
                      bookId={book.id}
                      title={book.title}
                      author={book.author}
                      tradition={book.tradition}
                      fallbackColors={book.coverColors}
                      className="w-full h-full"
                      showTomeWordmark={false}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <p className="font-semibold leading-tight">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Chapter {chaptersDone + 1} / {totalChapters}</span>
                        <span>{Math.round((chaptersDone / totalChapters) * 100)}%</span>
                      </div>
                      <ProgressBar value={chaptersDone} max={totalChapters} />
                    </div>

                    {/* Last read */}
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      Last read {relativeDate(lastRead)}
                    </div>

                    {/* Continue button */}
                    <Link
                      href={`/read/${book.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent/50 transition-colors"
                    >
                      Continue Reading
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  function renderCompleted() {
    return (
      <div className="space-y-5">
        {completed.length === 0 ? (
          <EmptyState
            icon={Check}
            title="No completed books yet"
            subtitle="Finish your first book to see it here."
          />
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {completed.map((entry) => {
                const book     = getBook(entry.bookId)
                if (!book) return null

                return (
                  <div key={entry.bookId} className="space-y-2">
                    <Link href={`/book/${book.id}`} className="block relative">
                      <ClassicsCover
                        bookId={book.id}
                        title={book.title}
                        author={book.author}
                        tradition={book.tradition}
                        fallbackColors={book.coverColors}
                        className="w-full"
                        showTomeWordmark={false}
                      />
                      {/* Character badge */}
                      <div className="absolute bottom-1.5 left-1.5">
                        <CharacterBadge bookId={book.id} />
                      </div>
                      {/* Reflection indicator */}
                      {entry.reflection && (
                        <div className="absolute bottom-1.5 right-1.5">
                          <Quote className="size-3.5 text-white/70 drop-shadow" />
                        </div>
                      )}
                    </Link>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold leading-tight line-clamp-2">{book.title}</p>
                      {entry.completedAt && (
                        <p className="text-[10px] text-muted-foreground">{completionLabel(entry.completedAt)}</p>
                      )}
                      <StarRating
                        bookId={entry.bookId}
                        rating={entry.rating}
                        onRate={handleRate}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stats footer */}
            <div className="rounded-xl bg-muted/50 border border-border px-5 py-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Check className="size-4" />
              You&apos;ve completed{" "}
              <span className="font-bold text-foreground">{completed.length}</span>
              {" "}book{completed.length !== 1 ? "s" : ""}
            </div>
          </>
        )}
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Shelves</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your personal reading collection</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl overflow-x-auto">
          {TABS.map(({ type, label, icon: Icon }) => {
            const count = counts[type]
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-1 justify-center",
                  activeTab === type
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                <span>{label}</span>
                {mounted && count > 0 && (
                  <span className={cn(
                    "inline-flex items-center justify-center rounded-full text-[10px] font-semibold px-1.5 py-0.5 min-w-[18px] leading-none",
                    activeTab === type ? "bg-muted text-foreground" : "bg-background/60 text-muted-foreground"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {!mounted ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : activeTab === "favorites" ? (
          renderFavorites()
        ) : activeTab === "want_to_read" ? (
          renderWantToRead()
        ) : activeTab === "currently_reading" ? (
          renderCurrentlyReading()
        ) : (
          renderCompleted()
        )}

      </div>
    </div>
  )
}

// ── Empty state helper ────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: React.FC<{ className?: string }>
  title: string
  subtitle: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 rounded-xl border border-dashed border-border text-muted-foreground">
      <Icon className="size-12 opacity-30" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs opacity-70 text-center max-w-xs">{subtitle}</p>
      {action}
    </div>
  )
}
