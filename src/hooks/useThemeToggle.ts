"use client"

import { useState, useEffect, useCallback } from "react"

export type Theme = "dark" | "light"

export function useThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("tome-theme") as Theme | null
    const prefers = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
    const initial = stored ?? prefers
    setTheme(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")
    document.documentElement.style.colorScheme = initial
    setMounted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("tome-theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
    document.documentElement.style.colorScheme = next
  }, [theme])

  return { theme, toggleTheme, mounted }
}
