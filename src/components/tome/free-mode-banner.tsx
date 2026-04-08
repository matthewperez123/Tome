"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { springs } from "@/lib/design-tokens"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface FreeModebannerProps {
  onSwitchToGuided: () => void
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function FreeModeBanner({ onSwitchToGuided }: FreeModebannerProps) {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ ...springs.gentle, duration: 0.3 }}
      className="
        w-full h-11 flex items-center justify-between px-4
        border-b border-amber-200 dark:border-amber-800/60
        bg-amber-50 dark:bg-amber-900/20
      "
    >
      {/* Left: icon + message */}
      <div className="flex items-center gap-2 min-w-0">
        <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <span className="text-amber-800 dark:text-amber-300 text-xs font-medium truncate">
          Free Mode — you won&apos;t earn Wisdom or unlock Seals in this session
        </span>
      </div>

      {/* Right: switch button */}
      <button
        onClick={onSwitchToGuided}
        className="
          ml-4 flex-shrink-0 text-[#D4A04C]
          text-xs font-semibold whitespace-nowrap
          hover:underline underline-offset-2 transition-colors
          hover:text-[#C8A046]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A04C]/40 rounded
        "
      >
        Switch to Guided &rarr;
      </button>
    </motion.div>
  )
}
