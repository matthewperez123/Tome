"use client"

import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, Check, Scroll } from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ReadingModeModalProps {
  bookTitle: string
  isOpen: boolean
  onSelect: (mode: 'guided' | 'free') => void
}

const guidedBullets = [
  "Earn Wisdom & Coins",
  "Unlock chapter Seals",
  "Streak credit",
  "Chapter progress saved",
]

const freeBullets = [
  "All chapters unlocked",
  "No quizzes",
  "No pressure",
]

export function ReadingModeModal({ bookTitle, isOpen, onSelect }: ReadingModeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Modal card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              className={cn(
                "relative w-full max-w-lg rounded-2xl shadow-2xl",
                "bg-white dark:bg-[#1a1a2e]",
                "border border-border/50",
                "p-6 sm:p-8"
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={springs.gentle}
            >
              {/* Header */}
              <div className="mb-6 text-center">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Choose Your Path
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  How would you like to read{" "}
                  <span className="font-medium italic text-foreground">{bookTitle}</span>?
                </p>
              </div>

              {/* Option cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Guided Mode */}
                <div
                  className={cn(
                    "flex flex-col rounded-xl border-2 p-5",
                    "border-[var(--color-indigo-400,#818cf8)]",
                    "bg-[var(--color-indigo-50,#eef2ff)] dark:bg-[var(--color-indigo-950,#1e1b4b)]/40"
                  )}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg",
                        "bg-[var(--color-indigo-100,#e0e7ff)] dark:bg-[var(--color-indigo-900,#312e81)]/60"
                      )}
                    >
                      <BookOpen className="size-5 text-[var(--color-indigo-600,#4f46e5)] dark:text-[var(--color-indigo-400,#818cf8)]" />
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        "bg-[var(--color-indigo-600,#4f46e5)] text-white"
                      )}
                    >
                      Recommended
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-foreground">
                    Guided Journey
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Read chapter by chapter. Take short trials after each chapter to earn Wisdom (XP),
                    unlock Seals, and keep your reading Flame alive.
                  </p>

                  <ul className="mt-4 flex flex-col gap-1.5">
                    {guidedBullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-xs text-foreground/80">
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-full",
                            "bg-[var(--color-indigo-600,#4f46e5)]"
                          )}
                        >
                          <Check className="size-2.5 text-white" strokeWidth={3} />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn(
                      "mt-5 w-full",
                      "bg-[var(--color-indigo-600,#4f46e5)] hover:bg-[var(--color-indigo-700,#4338ca)]",
                      "text-white"
                    )}
                    onClick={() => onSelect('guided')}
                  >
                    Begin the Journey
                  </Button>
                </div>

                {/* Free Mode */}
                <div
                  className={cn(
                    "flex flex-col rounded-xl border-2 p-5",
                    "border-[var(--color-amber-300,#fcd34d)] dark:border-[var(--color-amber-700,#b45309)]",
                    "bg-[var(--color-amber-50,#fffbeb)] dark:bg-[var(--color-amber-950,#451a03)]/30"
                  )}
                >
                  <div className="mb-3">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg",
                        "bg-[var(--color-amber-100,#fef3c7)] dark:bg-[var(--color-amber-900,#78350f)]/50"
                      )}
                    >
                      <Scroll className="size-5 text-[var(--color-amber-600,#d97706)] dark:text-[var(--color-amber-400,#fbbf24)]" />
                    </div>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-foreground">
                    Free Reading
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    All chapters unlocked. Read at your own pace, in any order, without quizzes or rewards.
                  </p>

                  <ul className="mt-4 flex flex-col gap-1.5">
                    {freeBullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-xs text-foreground/80">
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-full",
                            "bg-[var(--color-amber-500,#f59e0b)]"
                          )}
                        >
                          <Check className="size-2.5 text-white" strokeWidth={3} />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground/70 italic">
                    You can switch to Guided mode anytime in reader settings.
                  </p>

                  <Button
                    variant="outline"
                    className={cn(
                      "mt-auto pt-5 w-full",
                      "border-[var(--color-amber-400,#fbbf24)] dark:border-[var(--color-amber-700,#b45309)]",
                      "text-[var(--color-amber-700,#b45309)] dark:text-[var(--color-amber-300,#fcd34d)]",
                      "hover:bg-[var(--color-amber-100,#fef3c7)] dark:hover:bg-[var(--color-amber-900,#78350f)]/30"
                    )}
                    onClick={() => onSelect('free')}
                  >
                    Read Freely
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
