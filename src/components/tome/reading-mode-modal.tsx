"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, Check, Star, GraduationCap, Scroll, type LucideProps } from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuizDifficulty } from "@/lib/book-progress"

interface ReadingModeModalProps {
  bookTitle: string
  isOpen: boolean
  onSelect: (mode: 'guided' | 'free', difficulty?: QuizDifficulty) => void
}

type ReadingMode = 'guided' | 'free'

const DIFFICULTIES: {
  key: QuizDifficulty
  label: string
  subtitle: string
  icon: React.ComponentType<LucideProps>
  accent: string
  tag?: string
  xp: number
}[] = [
  {
    key: "Apprentice",
    label: "Apprentice",
    subtitle: "Plot & character questions",
    icon: Star,
    accent: "#22C55E",
    tag: "First read",
    xp: 5,
  },
  {
    key: "Scholar",
    label: "Scholar",
    subtitle: "Themes & literary devices",
    icon: BookOpen,
    accent: "#F59E0B",
    xp: 10,
  },
  {
    key: "Master",
    label: "Master",
    subtitle: "Critical analysis & context",
    icon: GraduationCap,
    accent: "#8B5CF6",
    tag: "Re-reads",
    xp: 15,
  },
]

export function ReadingModeModal({ bookTitle, isOpen, onSelect }: ReadingModeModalProps) {
  const [mode, setMode] = useState<ReadingMode>('guided')
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty>('Apprentice')

  function handleStart() {
    if (mode === 'guided') {
      onSelect('guided', selectedDifficulty)
    } else {
      onSelect('free')
    }
  }

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
                "relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden",
                "bg-white dark:bg-[#1a1a2e]",
                "border border-border/50",
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={springs.gentle}
            >
              <div className="p-6">
                {/* Header */}
                <div className="mb-5 text-center">
                  <h2 className="font-serif text-2xl font-bold text-ink">
                    Begin Reading
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    How would you like to read{" "}
                    <span className="font-medium italic text-foreground">{bookTitle}</span>?
                  </p>
                </div>

                {/* Mode toggle pills */}
                <div className="mb-5 flex gap-1 rounded-full bg-muted/50 p-1">
                  <button
                    onClick={() => setMode('guided')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                      mode === 'guided'
                        ? "bg-[#4F46E5] text-white shadow-sm"
                        : "bg-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <BookOpen className="size-3.5" />
                    Guided Journey
                  </button>
                  <button
                    onClick={() => setMode('free')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                      mode === 'free'
                        ? "bg-[#4F46E5] text-white shadow-sm"
                        : "bg-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Scroll className="size-3.5" />
                    Free Reading
                  </button>
                </div>

                {/* Difficulty cards (guided only) */}
                <AnimatePresence initial={false}>
                  {mode === 'guided' && (
                    <motion.div
                      key="difficulty-section"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={springs.gentle}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2.5 pb-4">
                        {DIFFICULTIES.map((d) => {
                          const selected = selectedDifficulty === d.key
                          const Icon = d.icon
                          return (
                            <motion.button
                              key={d.key}
                              onClick={() => setSelectedDifficulty(d.key)}
                              whileTap={{ scale: 0.98 }}
                              transition={springs.interactive}
                              className={cn(
                                "relative flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all",
                                "hover:shadow-sm",
                                selected
                                  ? "border-accent bg-accent/5"
                                  : "border-border bg-transparent"
                              )}
                            >
                              {/* Icon */}
                              <div
                                className="shrink-0 flex size-9 items-center justify-center rounded-lg"
                                style={{ background: `${d.accent}18` }}
                              >
                                <Icon className="size-4" style={{ color: d.accent }} />
                              </div>

                              {/* Label + subtitle */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-foreground">
                                    {d.label}
                                  </span>
                                  {d.tag && (
                                    <span
                                      className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                                      style={{ background: `${d.accent}18`, color: d.accent }}
                                    >
                                      {d.tag}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                                  {d.subtitle}
                                </p>
                              </div>

                              {/* XP badge */}
                              <span className="shrink-0 text-[10px] font-medium text-muted-foreground tabular-nums whitespace-nowrap">
                                +{d.xp} XP/Q
                              </span>

                              {/* Checkmark */}
                              {selected && (
                                <div
                                  className="shrink-0 flex size-5 items-center justify-center rounded-full"
                                  style={{ background: d.accent }}
                                >
                                  <Check className="size-3 text-white" strokeWidth={3} />
                                </div>
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Start button */}
                <Button
                  className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                  onClick={handleStart}
                >
                  Start Reading
                </Button>

                {/* Note */}
                <p className="mt-3 text-center text-[10px] text-muted-foreground/70 italic">
                  You can change mode anytime in reader settings.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
