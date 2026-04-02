"use client"

import { Moon, Sun, Minus, Plus } from "lucide-react"

export type ReaderTheme = "light" | "dark"

const SCROLL_FONT_SIZES = [14, 16, 18, 20, 22] as const
const FONT_SIZES = SCROLL_FONT_SIZES
export type FontSize = number

interface ReaderSettingsProps {
  theme: ReaderTheme
  fontSize: FontSize
  onThemeChange: (t: ReaderTheme) => void
  onFontSizeChange: (s: FontSize) => void
}

export function ReaderSettings({
  theme,
  fontSize,
  onThemeChange,
  onFontSizeChange,
}: ReaderSettingsProps) {
  const sizes = SCROLL_FONT_SIZES
  const sizeIdx = sizes.indexOf(fontSize as (typeof sizes)[number])
  const effectiveIdx = sizeIdx >= 0 ? sizeIdx : sizes.reduce((best, s, i) =>
    Math.abs(s - fontSize) < Math.abs(sizes[best] - fontSize) ? i : best, 0)

  return (
    <div className="flex items-center gap-1">
      {/* Font size */}
      <button
        disabled={effectiveIdx === 0}
        onClick={() => onFontSizeChange(sizes[effectiveIdx - 1])}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        aria-label="Decrease font size"
      >
        <Minus className="size-3" />
      </button>
      <span className="text-[10px] text-muted-foreground tabular-nums w-6 text-center">
        {fontSize}
      </span>
      <button
        disabled={effectiveIdx === sizes.length - 1}
        onClick={() => onFontSizeChange(sizes[effectiveIdx + 1])}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        aria-label="Increase font size"
      >
        <Plus className="size-3" />
      </button>

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

export { FONT_SIZES, SCROLL_FONT_SIZES }

/** Default font size */
export const DEFAULT_FONT_SIZE: Record<string, number> = {
  scroll: 18,
}
