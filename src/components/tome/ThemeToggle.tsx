"use client"

import { Sun, Moon } from "lucide-react"
import { useThemeToggle } from "@/hooks/useThemeToggle"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useThemeToggle()

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center size-8 rounded-full transition-colors",
        "text-muted-foreground hover:text-foreground hover:bg-accent",
        className
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  )
}
