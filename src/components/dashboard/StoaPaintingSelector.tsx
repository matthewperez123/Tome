"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Palette, Check } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { PAINTINGS, type Painting } from "@/lib/paintings"
import { cn } from "@/lib/utils"

interface StoaPaintingSelectorProps {
  selectedId: string
  onSelect: (painting: Painting) => void
}

export function StoaPaintingSelector({ selectedId, onSelect }: StoaPaintingSelectorProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [focusIndex, setFocusIndex] = useState(-1)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  // Close on escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); return }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open])

  // Keyboard navigation inside grid
  const handleGridKeyDown = useCallback((e: React.KeyboardEvent) => {
    const cols = 3
    const total = PAINTINGS.length
    let next = focusIndex

    switch (e.key) {
      case "ArrowRight": next = Math.min(focusIndex + 1, total - 1); break
      case "ArrowLeft": next = Math.max(focusIndex - 1, 0); break
      case "ArrowDown": next = Math.min(focusIndex + cols, total - 1); break
      case "ArrowUp": next = Math.max(focusIndex - cols, 0); break
      case "Enter":
      case " ":
        e.preventDefault()
        if (focusIndex >= 0) {
          onSelect(PAINTINGS[focusIndex])
          setOpen(false)
        }
        return
      default: return
    }
    e.preventDefault()
    setFocusIndex(next)
  }, [focusIndex, onSelect])

  // Focus the correct thumbnail when focusIndex changes
  useEffect(() => {
    if (!open || focusIndex < 0) return
    const btn = gridRef.current?.children[focusIndex] as HTMLButtonElement | undefined
    btn?.focus()
  }, [focusIndex, open])

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => { setOpen(!open); setFocusIndex(-1) }}
        className={cn(
          "flex items-center justify-center size-9 rounded-full transition-all duration-200",
          "bg-black/40 backdrop-blur-sm text-white/80 hover:bg-black/60 hover:text-white",
          "border border-white/10 hover:border-white/20",
          "shadow-lg"
        )}
        aria-label="Change banner painting"
        aria-expanded={open}
      >
        <Palette className="size-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute top-full right-0 mt-2 z-50",
              "w-[280px] p-3 rounded-xl",
              "bg-[#1A1A1A]/95 backdrop-blur-xl border border-[#D4A04C]/15",
              "shadow-2xl shadow-black/40"
            )}
            role="listbox"
            aria-label="Select a painting"
          >
            <p className="text-[11px] text-[#B0A898] mb-2 px-0.5 font-medium tracking-wide uppercase">
              Choose painting
            </p>
            <div
              className="max-h-[320px] overflow-y-auto overscroll-contain rounded-lg stoa-scroll"
            >
            <div
              ref={gridRef}
              className="grid grid-cols-3 gap-1.5 p-0.5"
              onKeyDown={handleGridKeyDown}
            >
              {PAINTINGS.map((painting, i) => {
                const isSelected = painting.id === selectedId
                return (
                  <button
                    key={painting.id}
                    role="option"
                    aria-selected={isSelected}
                    aria-label={`${painting.title} by ${painting.artist}`}
                    tabIndex={open ? 0 : -1}
                    onClick={() => { onSelect(painting); setOpen(false) }}
                    onFocus={() => setFocusIndex(i)}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden transition-all duration-150",
                      "ring-1 ring-inset ring-white/5 hover:ring-[#D4A04C]/40",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A04C]/60",
                      isSelected && "ring-2 ring-[#D4A04C]/60"
                    )}
                  >
                    <Image
                      src={painting.src}
                      alt={painting.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Check className="size-4 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
