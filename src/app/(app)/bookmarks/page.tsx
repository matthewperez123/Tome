"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BookOpen, Download, Search, Filter, Pencil, Trash2, ArrowRight, X, ChevronDown, ChevronRight } from "lucide-react"
import {
  getAllBookmarks,
  getBookmarksByBook,
  searchBookmarks,
  exportBookmarks,
  getBookmarkCounts,
  removeBookmark,
  updateBookmark,
} from "@/lib/bookmarks/store"
import { BOOKMARK_COLORS, COLOR_ORDER, type Bookmark, type BookmarkColor } from "@/lib/bookmarks/types"
import { getBooks } from "@/lib/content"
import { cn } from "@/lib/utils"

// ── Helpers ───────────────────────────────────────────────────────────────

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  < 1)   return "just now"
  if (mins  < 60)  return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  if (days  < 30)  return `${days}d ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ── Inline edit field ─────────────────────────────────────────────────────

function InlineNoteEditor({
  bookmarkId,
  initialNote,
  onSave,
  onCancel,
}: {
  bookmarkId: string
  initialNote: string
  onSave: (id: string, note: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState(initialNote)
  return (
    <div className="mt-2 space-y-1.5">
      <textarea
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={500}
        rows={3}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        placeholder="Add a note…"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(bookmarkId, value)}
          className="px-2.5 py-1 rounded-md text-xs bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          Save
        </button>
      </div>
    </div>
  )
}

// ── Confirm delete ────────────────────────────────────────────────────────

function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-destructive">
      Delete?
      <button
        onClick={onConfirm}
        className="underline font-medium hover:opacity-80"
      >
        Yes
      </button>
      <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
        No
      </button>
    </span>
  )
}

// ── Bookmark card ─────────────────────────────────────────────────────────

function BookmarkCard({
  bookmark,
  showBook,
  onDelete,
  onNoteUpdated,
}: {
  bookmark: Bookmark
  showBook: boolean
  onDelete: (id: string) => void
  onNoteUpdated: (id: string, note: string) => void
}) {
  const [editing,  setEditing]  = useState(false)
  const [deleting, setDeleting] = useState(false)
  const color = BOOKMARK_COLORS[bookmark.color]

  function handleSaveNote(id: string, note: string) {
    updateBookmark(id, { note })
    onNoteUpdated(id, note)
    setEditing(false)
  }

  return (
    <div
      className="relative flex gap-3 rounded-lg border border-border bg-card p-3.5 hover:bg-accent/20 transition-colors"
      style={{ borderLeft: `3px solid ${color.hex}` }}
    >
      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Book label (shown in "All" view) */}
        {showBook && (
          <p className="text-xs font-medium text-muted-foreground truncate">
            {bookmark.bookTitle}
          </p>
        )}

        {/* Chapter */}
        <p className="text-[11px] text-muted-foreground">
          Ch. {bookmark.chapterNumber} — {bookmark.chapterTitle}
        </p>

        {/* Selected text */}
        {bookmark.selectedText && (
          <p className="text-sm italic text-foreground/80 leading-relaxed line-clamp-2">
            "{bookmark.selectedText}"
          </p>
        )}

        {/* Note */}
        {!editing && bookmark.note && (
          <p className="text-sm text-foreground leading-relaxed">{bookmark.note}</p>
        )}

        {/* Inline editor */}
        {editing && (
          <InlineNoteEditor
            bookmarkId={bookmark.id}
            initialNote={bookmark.note ?? ""}
            onSave={handleSaveNote}
            onCancel={() => setEditing(false)}
          />
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            {/* Color chip */}
            <span
              className="inline-block size-2 rounded-full shrink-0"
              style={{ backgroundColor: color.hex }}
              title={color.label}
            />
            <span className="text-[11px] text-muted-foreground">{relativeTime(bookmark.createdAt)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {deleting ? (
              <DeleteConfirm
                onConfirm={() => onDelete(bookmark.id)}
                onCancel={() => setDeleting(false)}
              />
            ) : (
              <>
                <button
                  onClick={() => { setEditing(true); setDeleting(false) }}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Edit note"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => setDeleting(true)}
                  className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="size-3.5" />
                </button>
                <Link
                  href={`/read/${bookmark.bookId}`}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Jump to book"
                >
                  <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Book accordion section ────────────────────────────────────────────────

function BookAccordion({
  bookId,
  bookTitle,
  bookmarks,
  coverColors,
  tradition,
  onDelete,
  onNoteUpdated,
}: {
  bookId: string
  bookTitle: string
  bookmarks: Bookmark[]
  coverColors?: { primary: string; secondary: string; accent: string }
  tradition?: string
  onDelete: (id: string) => void
  onNoteUpdated: (id: string, note: string) => void
}) {
  const [open, setOpen] = useState(true)
  const accent = coverColors?.primary ?? "#1E3A5F"

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-card hover:bg-accent/30 transition-colors text-left"
      >
        {/* Tiny cover swatch */}
        <div
          className="shrink-0 rounded-sm"
          style={{
            width: 28,
            height: 42,
            background: `linear-gradient(160deg, ${coverColors?.secondary ?? "#0F2744"} 0%, ${accent} 100%)`,
          }}
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{bookTitle}</p>
          {tradition && (
            <p className="text-[11px] text-muted-foreground">{tradition}</p>
          )}
        </div>

        <span className="shrink-0 inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 min-w-[26px]">
          {bookmarks.length}
        </span>

        {open
          ? <ChevronDown className="size-4 text-muted-foreground shrink-0" />
          : <ChevronRight className="size-4 text-muted-foreground shrink-0" />
        }
      </button>

      {/* Cards */}
      {open && (
        <div className="p-3 space-y-2 bg-background">
          {bookmarks.map((bm) => (
            <BookmarkCard
              key={bm.id}
              bookmark={bm}
              showBook={false}
              onDelete={onDelete}
              onNoteUpdated={onNoteUpdated}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────

type ViewMode = "by-book" | "all"

export default function BookmarksPage() {
  const [mounted,         setMounted]         = useState(false)
  const [bookmarks,       setBookmarks]       = useState<Bookmark[]>([])
  const [viewMode,        setViewMode]        = useState<ViewMode>("by-book")
  const [filterBookId,    setFilterBookId]    = useState<string>("all")
  const [filterColor,     setFilterColor]     = useState<BookmarkColor | "all">("all")
  const [searchQuery,     setSearchQuery]     = useState("")
  const [exportMenuOpen,  setExportMenuOpen]  = useState(false)

  // Load on mount
  useEffect(() => {
    setBookmarks(getAllBookmarks())
    setMounted(true)
  }, [])

  // All books that have bookmarks
  const booksWithBookmarks = useMemo(() => {
    const allBooks = getBooks()
    const counts   = mounted ? getBookmarkCounts() : {}
    return allBooks.filter((b) => (counts[b.id] ?? 0) > 0)
  }, [mounted, bookmarks]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filtered list
  const filtered = useMemo(() => {
    let list = bookmarks

    if (filterBookId !== "all")  list = list.filter((b) => b.bookId === filterBookId)
    if (filterColor  !== "all")  list = list.filter((b) => b.color  === filterColor)
    if (searchQuery.trim())      list = searchBookmarks(searchQuery).filter(
      (b) =>
        (filterBookId === "all" || b.bookId === filterBookId) &&
        (filterColor  === "all" || b.color  === filterColor)
    )

    return list
  }, [bookmarks, filterBookId, filterColor, searchQuery])

  // Grouped by book (for By Book view)
  const byBook = useMemo(() => {
    const map = new Map<string, Bookmark[]>()
    for (const bm of filtered) {
      if (!map.has(bm.bookId)) map.set(bm.bookId, [])
      map.get(bm.bookId)!.push(bm)
    }
    return map
  }, [filtered])

  const allBooks = useMemo(() => getBooks(), [])

  // ── Handlers ──────────────────────────────────────────────────────────

  function handleDelete(id: string) {
    removeBookmark(id)
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }

  function handleNoteUpdated(id: string, note: string) {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, note, updatedAt: new Date().toISOString() } : b))
    )
  }

  function handleExport(format: "markdown" | "json" | "study-cards") {
    const content  = exportBookmarks(format)
    const ext      = format === "json" ? "json" : format === "study-cards" ? "csv" : "md"
    const mime     = format === "json" ? "application/json" : "text/plain"
    const filename = `tome-bookmarks-${new Date().toISOString().slice(0, 10)}.${ext}`
    downloadFile(content, filename, mime)
    setExportMenuOpen(false)
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Bookmarks</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mounted ? (
                <>
                  <span className="font-semibold text-foreground">{bookmarks.length}</span>
                  {" "}saved passage{bookmarks.length !== 1 ? "s" : ""}
                </>
              ) : (
                "Loading…"
              )}
            </p>
          </div>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent/30 transition-colors"
            >
              <Download className="size-4" />
              Export
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
            {exportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setExportMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
                  {(["markdown", "json", "study-cards"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleExport(fmt)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent/50 transition-colors capitalize"
                    >
                      {fmt === "study-cards" ? "Study Cards (CSV)" : fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filters row */}
        <div className="space-y-3">
          {/* Book + search row */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterBookId}
              onChange={(e) => setFilterBookId(e.target.value)}
              className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All books</option>
              {booksWithBookmarks.map((b) => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search passages & notes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Color filter dots */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="size-3.5 text-muted-foreground shrink-0" />
            <button
              onClick={() => setFilterColor("all")}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                filterColor === "all"
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
              )}
            >
              All
            </button>
            {COLOR_ORDER.map((c) => {
              const colorDef = BOOKMARK_COLORS[c]
              const active   = filterColor === c
              return (
                <button
                  key={c}
                  onClick={() => setFilterColor(c)}
                  title={`${colorDef.label} — ${colorDef.description}`}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                    active
                      ? "border-foreground/60 bg-card"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: colorDef.hex }}
                  />
                  {active && colorDef.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
          {(["by-book", "all"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode === "by-book" ? "By Book" : "All"}
            </button>
          ))}
        </div>

        {/* Content */}
        {!mounted ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-xl border border-dashed border-border text-muted-foreground">
            <BookOpen className="size-12 opacity-30" />
            {bookmarks.length === 0 ? (
              <>
                <p className="text-sm font-medium">No bookmarks yet</p>
                <p className="text-xs opacity-70 text-center max-w-xs">
                  As you read, select any passage to save it here.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">No bookmarks match your filters</p>
                <button
                  onClick={() => { setFilterBookId("all"); setFilterColor("all"); setSearchQuery("") }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        ) : viewMode === "by-book" ? (
          /* By Book — accordion */
          <div className="space-y-3">
            {Array.from(byBook.entries()).map(([bookId, bms]) => {
              const book = allBooks.find((b) => b.id === bookId)
              return (
                <BookAccordion
                  key={bookId}
                  bookId={bookId}
                  bookTitle={bms[0].bookTitle}
                  bookmarks={bms}
                  coverColors={book?.coverColors}
                  tradition={book?.tradition}
                  onDelete={handleDelete}
                  onNoteUpdated={handleNoteUpdated}
                />
              )
            })}
          </div>
        ) : (
          /* All — chronological list */
          <div className="space-y-2">
            {filtered.map((bm) => (
              <BookmarkCard
                key={bm.id}
                bookmark={bm}
                showBook={true}
                onDelete={handleDelete}
                onNoteUpdated={handleNoteUpdated}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
