"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import {
  BookProgress,
  ChapterQuizResult,
  QuizDifficulty,
  getBookProgress,
  saveBookProgress,
  createBookProgress,
  getAllBookProgress,
  recordChapterComplete,
  recordQuizResult,
  addReadingTime,
} from "@/lib/book-progress"

interface BookProgressContextValue {
  // Get progress for a specific book (null if never opened)
  getProgress: (bookId: string) => BookProgress | null
  // Initialize progress for a book with a chosen mode and difficulty
  startBook: (bookId: string, mode: 'guided' | 'free', difficulty?: QuizDifficulty) => BookProgress
  // Mark a chapter complete and save XP
  completeChapter: (bookId: string, chapterIndex: number, xpEarned: number) => void
  // Save a quiz result
  saveQuizResult: (bookId: string, result: ChapterQuizResult) => void
  // Add reading time in minutes
  addTime: (bookId: string, minutes: number) => void
  // Switch reading mode for a book
  setMode: (bookId: string, mode: 'guided' | 'free') => void
  // All progress records (for library page)
  allProgress: Record<string, BookProgress>
}

const BookProgressContext = createContext<BookProgressContextValue | null>(null)

export function BookProgressProvider({ children }: { children: React.ReactNode }) {
  const [allProgress, setAllProgress] = useState<Record<string, BookProgress>>({})

  useEffect(() => {
    setAllProgress(getAllBookProgress())
  }, [])

  const updateProgress = useCallback((progress: BookProgress) => {
    saveBookProgress(progress)
    setAllProgress(prev => ({ ...prev, [progress.bookId]: progress }))
  }, [])

  const getProgress = useCallback((bookId: string) => {
    return allProgress[bookId] ?? null
  }, [allProgress])

  const startBook = useCallback((
    bookId: string,
    mode: 'guided' | 'free',
    difficulty: QuizDifficulty = 'Apprentice'
  ) => {
    const existing = allProgress[bookId]
    if (existing) {
      const updated = { ...existing, readingMode: mode, difficulty }
      updateProgress(updated)
      return updated
    }
    const fresh = createBookProgress(bookId, mode, difficulty)
    updateProgress(fresh)
    return fresh
  }, [allProgress, updateProgress])

  const completeChapter = useCallback((bookId: string, chapterIndex: number, xpEarned: number) => {
    const progress = allProgress[bookId]
    if (!progress) return
    updateProgress(recordChapterComplete(progress, chapterIndex, xpEarned))
  }, [allProgress, updateProgress])

  const saveQuizResult = useCallback((bookId: string, result: ChapterQuizResult) => {
    const progress = allProgress[bookId]
    if (!progress) return
    updateProgress(recordQuizResult(progress, result))
  }, [allProgress, updateProgress])

  const addTime = useCallback((bookId: string, minutes: number) => {
    const progress = allProgress[bookId]
    if (!progress) return
    updateProgress(addReadingTime(progress, minutes))
  }, [allProgress, updateProgress])

  const setMode = useCallback((bookId: string, mode: 'guided' | 'free') => {
    const progress = allProgress[bookId]
    if (!progress) return
    updateProgress({ ...progress, readingMode: mode })
  }, [allProgress, updateProgress])

  return (
    <BookProgressContext.Provider
      value={{ getProgress, startBook, completeChapter, saveQuizResult, addTime, setMode, allProgress }}
    >
      {children}
    </BookProgressContext.Provider>
  )
}

export function useBookProgress() {
  const ctx = useContext(BookProgressContext)
  if (!ctx) throw new Error("useBookProgress must be used inside BookProgressProvider")
  return ctx
}
