"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import {
  DEFAULT_PAINTING,
  getPaintingById,
  getStoredPaintingId,
  setStoredPaintingId,
  type Painting,
} from "@/lib/paintings"
import { StoaPaintingSelector } from "./StoaPaintingSelector"
import { cn } from "@/lib/utils"

const FOCAL_MAP = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
} as const

export function StoaBanner() {
  const [painting, setPainting] = useState<Painting>(DEFAULT_PAINTING)
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    const stored = getStoredPaintingId()
    if (stored) {
      const found = getPaintingById(stored)
      if (found) setPainting(found)
    }
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
    setMounted(true)
  }, [])

  function handleSelect(next: Painting) {
    setPainting(next)
    setStoredPaintingId(next.id)
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl",
        "border border-[#D4A04C]/15",
        // Responsive aspect ratios: 3:2 mobile → 16:9 tablet → 21:9 desktop
        "aspect-[3/2] sm:aspect-[16/9] lg:aspect-[21/9]"
      )}
      role="img"
      aria-label={`Banner painting: ${painting.title} by ${painting.artist}`}
    >
      {/* Painting image with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={painting.id}
          className="absolute inset-0"
          initial={mounted && !prefersReducedMotion ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Image
            src={painting.src}
            alt={`${painting.title} by ${painting.artist}`}
            fill
            priority
            className={cn("object-cover", FOCAL_MAP[painting.focalPoint])}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(26,26,46,0.6) 0%, rgba(26,26,46,0.2) 30%, transparent 55%)",
        }}
      />

      {/* Caption — hidden on mobile */}
      <div className="absolute bottom-0 left-0 p-4 sm:p-5 hidden sm:block">
        <p className="font-serif text-sm text-white/90 leading-tight drop-shadow-md">
          {painting.title}
        </p>
        <p className="text-[11px] text-white/50 mt-0.5 font-sans drop-shadow-sm">
          {painting.artist}
          {painting.year ? `, ${painting.year}` : ""}
        </p>
      </div>

      {/* Selector button — top right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <StoaPaintingSelector
          selectedId={painting.id}
          onSelect={handleSelect}
        />
      </div>
    </div>
  )
}
