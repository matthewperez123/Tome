"use client"

import { Moon, Sun, Columns2, AlignJustify, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export type ReaderTheme = "light" | "dark"
export type ReaderLayout = "scroll" | "book"

const FONT_SIZES = [14, 16, 18, 20, 22] as const
export type FontSize = (typeof FONT_SIZES)[number]

interface ReaderSettingsProps {
  theme: ReaderTheme
  layout: ReaderLayout
  fontSize: FontSize
  onThemeChange: (t: ReaderTheme) => void
  onLayoutChange: (l: ReaderLayout) => void
  onFontSizeChange: (s: FontSize) => void
}

export function ReaderSettings({
  theme,
  layout,
  fontSize,
  onThemeChange,
  onLayoutChange,
  onFontSizeChange,
}: ReaderSettingsProps) {
  const sizeIdx = FONT_SIZES.indexOf(fontSize)

  return (
    <div className="flex items-center gap-1">
      {/* Font size */}
      <button
        disabled={sizeIdx === 0}
        onClick={() => onFontSizeChange(FONT_SIZES[sizeIdx - 1])}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        aria-label="Decrease font size"
      >
        <Minus className="size-3" />
      </button>
      <span className="text-[10px] text-muted-foreground tabular-nums w-6 text-center">
        {fontSize}
      </span>
      <button
        disabled={sizeIdx === FONT_SIZES.length - 1}
        onClick={() => onFontSizeChange(FONT_SIZES[sizeIdx + 1])}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        aria-label="Increase font size"
      >
        <Plus className="size-3" />
      </button>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Theme toggle */}
      <button
        onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
        aria-label={theme === "light" ? "Dark reading mode" : "Light reading mode"}
      >
        {theme === "light" ? (
          <Moon className="size-3.5" />
        ) : (
          <Sun className="size-3.5" />
        )}
      </button>
    </div>
  )
}

export { FONT_SIZES }
