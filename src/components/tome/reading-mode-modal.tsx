"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, Check, Scroll, Star, GraduationCap, ChevronLeft, type LucideProps } from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuizDifficulty } from "@/lib/book-progress"

interface ReadingModeModalProps {
  bookTitle: string
  isOpen: boolean
  onSelect: (mode: 'guided' | 'free', difficulty?: QuizDifficulty) => void
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

type Step = 'mode' | 'difficulty'

const DIFFICULTIES: {
  key: QuizDifficulty
  label: string
  subtitle: string
  description: string
  icon: React.ComponentType<LucideProps>
  accent: string
  accentBg: string
  accentBorder: string
  tag?: string
  xp: number
}[] = [
  {
    key: "Apprentice",
    label: "Apprentice",
    subtitle: "Questions on plot, characters & events",
    description: "Perfect for a first read. Questions focus on what happened, who did what, and where scenes take place.",
    icon: Star,
    accent: "#22C55E",
    accentBg: "rgba(34,197,94,0.08)",
    accentBorder: "rgba(34,197,94,0.4)",
    tag: "Recommended for first read",
    xp: 5,
  },
  {
    key: "Scholar",
    label: "Scholar",
    subtitle: "Themes, motives & literary devices",
    description: "For readers who want to go deeper. Questions probe character motivations, vocabulary, and thematic meaning.",
    icon: BookOpen,
    accent: "#F59E0B",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.4)",
    xp: 10,
  },
  {
    key: "Master",
    label: "Master",
    subtitle: "Critical analysis & historical context",
    description: "Built for literature students and re-readers. Questions demand synthesis, outside knowledge, and cross-textual analysis.",
    icon: GraduationCap,
    accent: "#8B5CF6",
    accentBg: "rgba(139,92,246,0.08)",
    accentBorder: "rgba(139,92,246,0.4)",
    tag: "For re-reads & lit students",
    xp: 15,
  },
]

export function ReadingModeModal({ bookTitle, isOpen, onSelect }: ReadingModeModalProps) {
  const [step, setStep] = useState<Step>('mode')
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty>('Apprentice')

  function handleFreeRead() {
    setStep('mode')
    onSelect('free')
  }

  function handleGuidedChoose() {
    setStep('difficulty')
  }

  function handleBeginGuided() {
    setStep('mode')
    onSelect('guided', selectedDifficulty)
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
                "relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden",
                "bg-white dark:bg-[#1a1a2e]",
                "border border-border/50",
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={springs.gentle}
            >
              <AnimatePresence mode="wait" initial={false}>
                {step === 'mode' ? (
                  <motion.div
                    key="step-mode"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={springs.gentle}
                    className="p-6 sm:p-8"
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
                          onClick={handleGuidedChoose}
                        >
                          Choose Difficulty →
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
                          onClick={handleFreeRead}
                        >
                          Read Freely
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-difficulty"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={springs.gentle}
                    className="p-6 sm:p-8"
                  >
                    {/* Back + header */}
                    <div className="mb-6">
                      <button
                        onClick={() => setStep('mode')}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
                      >
                        <ChevronLeft className="size-3.5" />
                        Back
                      </button>
                      <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
                        Choose Your Difficulty
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        This sets the style of quiz questions after each chapter.
                      </p>
                    </div>

                    {/* Difficulty cards */}
                    <div className="flex flex-col gap-3">
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
                              "relative text-left rounded-xl border-2 p-4 transition-all",
                              "hover:shadow-sm"
                            )}
                            style={{
                              borderColor: selected ? d.accent : `${d.accent}40`,
                              background: selected ? d.accentBg : "transparent",
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="shrink-0 flex size-9 items-center justify-center rounded-lg mt-0.5"
                                style={{ background: `${d.accent}20` }}
                              >
                                <Icon className="size-4.5" style={{ color: d.accent }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-foreground">{d.label}</span>
                                  {d.tag && (
                                    <span
                                      className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                                      style={{ background: `${d.accent}20`, color: d.accent }}
                                    >
                                      {d.tag}
                                    </span>
                                  )}
                                  <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
                                    +{d.xp} Wisdom/Q
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                                  {selected ? d.description : d.subtitle}
                                </p>
                              </div>
                            </div>

                            {/* Selected indicator */}
                            {selected && (
                              <div
                                className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full"
                                style={{ background: d.accent }}
                              >
                                <Check className="size-3 text-white" strokeWidth={3} />
                              </div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* Note + Begin button */}
                    <p className="mt-4 text-[10px] text-muted-foreground/70 italic text-center">
                      You can change difficulty anytime in reader settings.
                    </p>

                    <Button
                      className="mt-4 w-full bg-[var(--color-indigo-600,#4f46e5)] hover:bg-[var(--color-indigo-700,#4338ca)] text-white"
                      onClick={handleBeginGuided}
                    >
                      Begin Reading
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
