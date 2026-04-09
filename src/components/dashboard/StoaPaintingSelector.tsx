"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Palette, Check, Search, X } from "lucide-react"
import { PAINTINGS, type Painting } from "@/lib/paintings"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface StoaPaintingSelectorProps {
  selectedId: string
  onSelect: (painting: Painting) => void
}

export function StoaPaintingSelector({ selectedId, onSelect }: StoaPaintingSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const gridRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [focusIndex, setFocusIndex] = useState(-1)

  // Filter paintings by search query
  const filtered = useMemo(() => {
    if (!query.trim()) return PAINTINGS
    const q = query.toLowerCase()
    return PAINTINGS.filter(
      (p) => p.title.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q)
    )
  }, [query])

  // Reset search and focus when modal opens/closes
  useEffect(() => {
    if (open) {
      setQuery("")
      setFocusIndex(-1)
      // Focus the search input when modal opens
      requestAnimationFrame(() => searchRef.current?.focus())
    }
  }, [open])

  // Reset focus index when filter results change
  useEffect(() => {
    setFocusIndex(-1)
  }, [query])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open])

  // Keyboard navigation inside grid
  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const cols = 3
      const total = filtered.length
      if (total === 0) return
      let next = focusIndex

      switch (e.key) {
        case "ArrowRight":
          next = Math.min(focusIndex + 1, total - 1)
          break
        case "ArrowLeft":
          next = Math.max(focusIndex - 1, 0)
          break
        case "ArrowDown":
          next = Math.min(focusIndex + cols, total - 1)
          break
        case "ArrowUp":
          next = Math.max(focusIndex - cols, 0)
          break
        case "Enter":
        case " ":
          e.preventDefault()
          if (focusIndex >= 0 && focusIndex < total) {
            onSelect(filtered[focusIndex])
            setOpen(false)
          }
          return
        default:
          return
      }
      e.preventDefault()
      setFocusIndex(next)
    },
    [focusIndex, filtered, onSelect]
  )

  // Focus the correct thumbnail when focusIndex changes
  useEffect(() => {
    if (!open || focusIndex < 0) return
    const btn = gridRef.current?.children[focusIndex] as HTMLButtonElement | undefined
    btn?.focus()
  }, [focusIndex, open])

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center justify-center size-9 rounded-full transition-all duration-200",
          "bg-black/40 backdrop-blur-sm text-white/80 hover:bg-black/60 hover:text-white",
          "border border-white/10 hover:border-white/20",
          "shadow-lg"
        )}
        aria-label="Change banner painting"
        aria-haspopup="dialog"
      >
        <Palette className="size-4" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-label="Select a painting"
            aria-modal="true"
            className={cn(
              "relative z-10 w-full max-w-md rounded-xl",
              "bg-white dark:bg-[#1A1A1A]/95",
              "border border-stone-200 dark:border-[#D4A04C]/15",
              "shadow-2xl shadow-black/20 dark:shadow-black/40",
              "backdrop-blur-xl",
              "flex flex-col max-h-[80vh]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h2
                className={cn(
                  "text-xs font-semibold tracking-wide uppercase",
                  "text-stone-500 dark:text-[#B0A898]"
                )}
              >
                Choose painting
              </h2>
              <button
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-center size-7 rounded-md transition-colors",
                  "text-stone-400 hover:text-stone-600 hover:bg-stone-100",
                  "dark:text-white/40 dark:hover:text-white/70 dark:hover:bg-white/5"
                )}
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Search bar */}
            <div className="px-4 pb-3">
              <div className="relative">
                <Search
                  className={cn(
                    "absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none",
                    "text-stone-400 dark:text-white/30"
                  )}
                />
                <Input
                  ref={searchRef}
                  type="text"
                  placeholder="Search by title or artist..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={cn(
                    "pl-8 h-8 text-sm",
                    "bg-stone-50 border-stone-200 placeholder:text-stone-400",
                    "dark:bg-white/5 dark:border-white/10 dark:placeholder:text-white/30 dark:text-white"
                  )}
                />
              </div>
            </div>

            {/* Scrollable grid area */}
            <div
              className={cn(
                "flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-4",
                "scrollbar-thin",
                "scrollbar-thumb-stone-300 scrollbar-track-stone-100",
                "dark:scrollbar-thumb-white/15 dark:scrollbar-track-transparent"
              )}
              style={{ maxHeight: "60vh" }}
            >
              {filtered.length === 0 ? (
                <div
                  className={cn(
                    "flex items-center justify-center py-12 text-sm",
                    "text-stone-400 dark:text-white/30"
                  )}
                >
                  No paintings match your search
                </div>
              ) : (
                <div
                  ref={gridRef}
                  className="grid grid-cols-3 gap-2"
                  role="listbox"
                  aria-label="Paintings"
                  onKeyDown={handleGridKeyDown}
                >
                  {filtered.map((painting, i) => {
                    const isSelected = painting.id === selectedId
                    return (
                      <button
                        key={painting.id}
                        role="option"
                        aria-selected={isSelected}
                        aria-label={`${painting.title} by ${painting.artist}`}
                        tabIndex={0}
                        onClick={() => {
                          onSelect(painting)
                          setOpen(false)
                        }}
                        onFocus={() => setFocusIndex(i)}
                        className={cn(
                          "group relative aspect-square rounded-lg overflow-hidden transition-all duration-150",
                          "ring-1 ring-inset",
                          "ring-stone-200 hover:ring-[#D4A04C]/50",
                          "dark:ring-white/5 dark:hover:ring-[#D4A04C]/40",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A04C]/60",
                          isSelected && "ring-2 ring-[#D4A04C]/70 dark:ring-[#D4A04C]/60"
                        )}
                      >
                        <Image
                          src={painting.src}
                          alt={painting.title}
                          fill
                          className="object-cover"
                          sizes="120px"
                          unoptimized
                        />
                        {/* Hover tooltip with title */}
                        <div
                          className={cn(
                            "absolute inset-x-0 bottom-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
                            "bg-gradient-to-t from-black/70 to-transparent"
                          )}
                        >
                          <p className="text-[10px] text-white/90 leading-tight truncate font-medium">
                            {painting.title}
                          </p>
                          <p className="text-[9px] text-white/60 leading-tight truncate">
                            {painting.artist}
                          </p>
                        </div>
                        {/* Selected checkmark */}
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="flex items-center justify-center size-6 rounded-full bg-[#D4A04C] shadow-md">
                              <Check className="size-3.5 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
