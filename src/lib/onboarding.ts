// ── Tome Onboarding State ──
// Persists user's onboarding selections to localStorage.

export interface OnboardingData {
  userType: "reader" | "teacher" | null
  teacherSubject: string | null
  teacherLevel: string | null
  teacherClassSize: string | null
  intent: string | null
  traditions: string[]
  dailyGoalMinutes: number
  completedAt: string | null
}

const STORAGE_KEY = "tome-onboarding"

const DEFAULT_DATA: OnboardingData = {
  userType: null,
  teacherSubject: null,
  teacherLevel: null,
  teacherClassSize: null,
  intent: null,
  traditions: [],
  dailyGoalMinutes: 15,
  completedAt: null,
}

export function getOnboardingData(): OnboardingData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_DATA, ...parsed }
    }
  } catch {}
  return { ...DEFAULT_DATA }
}

export function saveOnboardingData(data: Partial<OnboardingData>): void {
  try {
    const current = getOnboardingData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }))
  } catch {}
}

export function completeOnboarding(): void {
  saveOnboardingData({ completedAt: new Date().toISOString() })
}

export function isOnboardingComplete(): boolean {
  try {
    const data = getOnboardingData()
    return data.completedAt !== null
  } catch {
    return false
  }
}
