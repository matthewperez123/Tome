import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language, ReadingMode } from "@/types";

export interface Bookmark {
  id: string;
  bookId: string;
  bookTitle: string;
  chapterId: string;
  chapterTitle: string;
  paragraphId: string;
  paragraphText: string;
  language: string;
  note?: string;
  createdAt: string;
}

interface AppState {
  // Hearts
  hearts: number;
  maxHearts: number;
  loseHeart: () => void;
  refillHearts: () => void;

  // Streak
  currentStreak: number;
  setStreak: (n: number) => void;

  // XP
  totalXp: number;
  addXp: (amount: number) => void;

  // Coins
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;

  // Session
  activeLanguage: Language;
  setActiveLanguage: (lang: Language) => void;
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
  fontSize: number;
  setFontSize: (size: number) => void;

  // Daily goal
  dailyGoalChapters: number;
  chaptersCompletedToday: number;
  completeChapter: () => void;
  resetDailyProgress: () => void;

  // Daily challenge
  dailyChallengeStreak: number;
  lastChallengeDate: string | null;
  completeDailyChallenge: () => void;

  // Dark mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hearts: 5,
      maxHearts: 5,
      loseHeart: () =>
        set((s) => ({ hearts: Math.max(0, s.hearts - 1) })),
      refillHearts: () => set({ hearts: 5 }),

      currentStreak: 0,
      setStreak: (n) => set({ currentStreak: n }),

      totalXp: 0,
      addXp: (amount) =>
        set((s) => {
          const newXp = s.totalXp + amount;
          // Every 100 XP = 10 coins
          const oldHundreds = Math.floor(s.totalXp / 100);
          const newHundreds = Math.floor(newXp / 100);
          const coinGain = (newHundreds - oldHundreds) * 10;
          return {
            totalXp: newXp,
            coins: s.coins + coinGain,
          };
        }),

      coins: 0,
      addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
      spendCoins: (amount) => {
        const { coins } = get();
        if (coins < amount) return false;
        set({ coins: coins - amount });
        return true;
      },

      activeLanguage: "LATIN",
      setActiveLanguage: (lang) => set({ activeLanguage: lang }),
      readingMode: "side-by-side",
      setReadingMode: (mode) => set({ readingMode: mode }),
      fontSize: 18,
      setFontSize: (size) => set({ fontSize: size }),

      dailyGoalChapters: 3,
      chaptersCompletedToday: 0,
      completeChapter: () =>
        set((s) => ({
          chaptersCompletedToday: s.chaptersCompletedToday + 1,
        })),
      resetDailyProgress: () => set({ chaptersCompletedToday: 0 }),

      dailyChallengeStreak: 0,
      lastChallengeDate: null,
      completeDailyChallenge: () =>
        set((s) => {
          const today = new Date().toISOString().slice(0, 10);
          if (s.lastChallengeDate === today) return s;
          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .slice(0, 10);
          const streak =
            s.lastChallengeDate === yesterday
              ? s.dailyChallengeStreak + 1
              : 1;
          return {
            dailyChallengeStreak: streak,
            lastChallengeDate: today,
          };
        }),

      // Dark mode
      isDarkMode: false,
      toggleDarkMode: () =>
        set((s) => ({ isDarkMode: !s.isDarkMode })),

      // Bookmarks
      bookmarks: [],
      addBookmark: (bookmark) =>
        set((s) => ({ bookmarks: [...s.bookmarks, bookmark] })),
      removeBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.filter((b) => b.id !== id),
        })),
    }),
    {
      name: "codex-store",
    }
  )
);
