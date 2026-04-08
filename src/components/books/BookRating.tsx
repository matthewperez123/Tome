"use client"

import { useState, useEffect, useCallback } from "react"
import { Star } from "lucide-react"
import { motion } from "framer-motion"
import {
  getUserRating,
  setUserRating,
  clearUserRating,
  getBookRatingStats,
  type BookRatingStats,
} from "@/lib/ratings"
import { cn } from "@/lib/utils"

const GOLD = "#D4A04C"
const STAR_COUNT = 5

interface BookRatingProps {
  bookId: string
  className?: string
}

export function BookRating({ bookId, className }: BookRatingProps) {
  const [userRating, setUserRatingState] = useState<number | null>(null)
  const [stats, setStats] = useState<BookRatingStats>({ averageRating: 0, ratingCount: 0 })
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setUserRatingState(getUserRating(bookId))
    setStats(getBookRatingStats(bookId))
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
    setMounted(true)
  }, [bookId])

  const handleClick = useCallback((starIndex: number) => {
    const newRating = starIndex + 1
    if (userRating === newRating) {
      // Click same star to clear
      clearUserRating(bookId)
      setUserRatingState(null)
      setStats({ averageRating: 0, ratingCount: 0 })
    } else {
      // Set rating optimistically
      setUserRating(bookId, newRating)
      setUserRatingState(newRating)
      setStats({ averageRating: newRating, ratingCount: 1 })
    }
  }, [bookId, userRating])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, starIndex: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      const next = Math.min(starIndex + 1, STAR_COUNT - 1)
      const btn = (e.currentTarget.parentElement?.children[next] as HTMLElement)
      btn?.focus()
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      const prev = Math.max(starIndex - 1, 0)
      const btn = (e.currentTarget.parentElement?.children[prev] as HTMLElement)
      btn?.focus()
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick(starIndex)
    }
  }, [handleClick])

  // Determine fill level: hover takes priority over rating
  const displayRating = hoverIndex !== null ? hoverIndex + 1 : (userRating ?? 0)

  if (!mounted) {
    // Skeleton
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <div key={i} className="size-7 rounded bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Stars */}
      <div
        className="flex items-center gap-0.5"
        role="radiogroup"
        aria-label="Rate this book"
        onMouseLeave={() => setHoverIndex(null)}
      >
        {Array.from({ length: STAR_COUNT }).map((_, i) => {
          const filled = i < displayRating
          const isCurrentRating = userRating === i + 1

          return (
            <motion.button
              key={i}
              role="radio"
              aria-checked={isCurrentRating}
              aria-label={`${i + 1} star${i !== 0 ? "s" : ""}`}
              tabIndex={i === 0 || isCurrentRating ? 0 : -1}
              onClick={() => handleClick(i)}
              onMouseEnter={() => setHoverIndex(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.15 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "flex items-center justify-center p-1 rounded-sm",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A04C]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                // Min 44px touch target
                "min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
              )}
            >
              <Star
                className={cn(
                  "size-6 sm:size-5 transition-all duration-150",
                  filled
                    ? "fill-[#D4A04C] text-[#D4A04C]"
                    : "fill-transparent text-[#D4A04C]/30"
                )}
              />
            </motion.button>
          )
        })}
      </div>

      {/* Aggregate / info text */}
      <div className="text-[11px] text-muted-foreground leading-tight">
        {stats.ratingCount > 0 ? (
          <>
            <span>{stats.averageRating.toFixed(1)} average · {stats.ratingCount} rating{stats.ratingCount !== 1 ? "s" : ""}</span>
            {userRating && (
              <span className="block mt-0.5" style={{ color: GOLD }}>
                Your rating: {userRating} star{userRating !== 1 ? "s" : ""}
              </span>
            )}
          </>
        ) : (
          <span>Be the first to rate this</span>
        )}
      </div>
    </div>
  )
}
