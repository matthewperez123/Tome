/**
 * @deprecated Use `useTheme` from "next-themes" instead.
 * This hook is kept for backwards compatibility but should not be used in new code.
 */
"use client"

import { useTheme } from "next-themes"

export type Theme = "dark" | "light"

export function useThemeToggle() {
  const { theme, setTheme } = useTheme()

  return {
    theme: (theme ?? "dark") as Theme,
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    mounted: true,
  }
}
