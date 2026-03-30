"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"
import {
  type UserStats,
  type EconomyEvent,
  type EconomyResult,
  applyEvent,
  calculateHearts,
  calculateStreak,
  isDailyGoalMet,
  getLevel,
  createDefaultStats,
  MAX_HEARTS,
  HEART_REGEN_INTERVAL_MS,
} from "@/lib/economy"

// ── Context Types ──────────────────────────────

type EconomyContextValue = {
  stats: UserStats
  level: { level: number; xpInLevel: number; xpForNext: number }
  dailyGoalMet: boolean
  heartsRegenAt: Date | null
  dispatch: (event: EconomyEvent) => EconomyResult
  refreshHearts: () => void
}

const EconomyContext = createContext<EconomyContextValue | null>(null)

// ── Hook ───────────────────────────────────────

export function useEconomy() {
  const ctx = useContext(EconomyContext)
  if (!ctx) {
    throw new Error("useEconomy must be used within a TomeEconomyProvider")
  }
  return ctx
}

// ── Provider ───────────────────────────────────

const STORAGE_KEY = "tome-user-stats"

// Use a guest user ID until auth is implemented
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000"

export function TomeEconomyProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<UserStats>(() => {
    if (typeof window === "undefined") return createDefaultStats(GUEST_USER_ID)

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as UserStats
        // Regenerate hearts on load
        const { hearts } = calculateHearts(parsed.hearts, parsed.hearts_last_regen)
        return { ...parsed, hearts }
      }
    } catch {
      // ignore parse errors
    }

    return createDefaultStats(GUEST_USER_ID)
  })

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  }, [stats])

  // Check streak on load
  useEffect(() => {
    const goalMet = isDailyGoalMet(stats)
    const { streak, longestStreak, freezeUsed } = calculateStreak(
      stats.current_streak,
      stats.longest_streak,
      stats.last_active_date,
      goalMet,
      stats.streak_freeze_available
    )

    if (
      streak !== stats.current_streak ||
      longestStreak !== stats.longest_streak ||
      (freezeUsed && stats.streak_freeze_available)
    ) {
      setStats((s) => ({
        ...s,
        current_streak: streak,
        longest_streak: longestStreak,
        streak_freeze_available: freezeUsed ? false : s.streak_freeze_available,
        last_active_date: new Date().toISOString().slice(0, 10),
      }))
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Heart regeneration timer
  useEffect(() => {
    if (stats.hearts >= MAX_HEARTS) return

    const interval = setInterval(() => {
      setStats((s) => {
        const { hearts } = calculateHearts(s.hearts, s.hearts_last_regen)
        if (hearts !== s.hearts) {
          return { ...s, hearts, hearts_last_regen: new Date().toISOString() }
        }
        return s
      })
    }, 60000) // check every minute

    return () => clearInterval(interval)
  }, [stats.hearts])

  // Dispatch economy events
  const dispatch = useCallback((event: EconomyEvent): EconomyResult => {
    let result: EconomyResult = { stats, xpGained: 0, coinsGained: 0, notifications: [] }
    setStats((s) => {
      result = applyEvent(s, event)
      return result.stats
    })
    return result
  }, [stats])

  // Manual heart refresh
  const refreshHearts = useCallback(() => {
    setStats((s) => {
      const { hearts } = calculateHearts(s.hearts, s.hearts_last_regen)
      return { ...s, hearts }
    })
  }, [])

  // Derived values
  const level = useMemo(() => getLevel(stats.xp_total), [stats.xp_total])
  const dailyGoalMet = useMemo(() => isDailyGoalMet(stats), [stats])
  const heartsRegenAt = useMemo(() => {
    if (stats.hearts >= MAX_HEARTS) return null
    const lastRegen = new Date(stats.hearts_last_regen).getTime()
    return new Date(lastRegen + HEART_REGEN_INTERVAL_MS)
  }, [stats.hearts, stats.hearts_last_regen])

  const value = useMemo<EconomyContextValue>(
    () => ({ stats, level, dailyGoalMet, heartsRegenAt, dispatch, refreshHearts }),
    [stats, level, dailyGoalMet, heartsRegenAt, dispatch, refreshHearts]
  )

  return (
    <EconomyContext.Provider value={value}>
      {children}
    </EconomyContext.Provider>
  )
}
