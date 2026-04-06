"use client"

import { useEffect, useReducer, useRef, useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, ChevronRight, RotateCcw, X, Trophy } from "lucide-react"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { Button } from "@/components/ui/button"
import { quizReducer, createQuizState, type Quiz, type Question } from "@/lib/quiz-engine"
import type { ChapterQuestion } from "@/lib/chapter-questions"
import type { Book } from "@/lib/supabase"
import { springs } from "@/lib/design-tokens"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type OverlayPhase = "celebration" | "quiz" | "results"

export interface ChapterQuizOverlayProps {
  book: Book
  chapterTitle: string
  chapterIndex: number
  questions: ChapterQuestion[]
  hearts: number
  isOpen: boolean
  onPass: (xpEarned: number, coinsEarned: number) => void
  onFail: () => void
  onClose: () => void
}

// ─────────────────────────────────────────────
// Helpers: ChapterQuestion → quiz-engine Question
// ─────────────────────────────────────────────

function mapToEngineQuestion(q: ChapterQuestion, quizId: string, order: number): Question {
  if (q.type === "true_false") {
    return {
      id: q.id,
      quiz_id: quizId,
      type: "true_false",
      prompt: q.text,
      options: ["True", "False"],
      correct_answer: q.correctBool ? "true" : "false",
      explanation: q.explanation,
      order,
    }
  }

  // multiple_choice and passage_id both map to multiple_choice
  const options = q.options ?? []
  const correctAnswer = options[q.correctIndex ?? 0] ?? options[0] ?? ""
  return {
    id: q.id,
    quiz_id: quizId,
    type: "multiple_choice",
    prompt: q.text,
    options,
    correct_answer: correctAnswer,
    explanation: q.explanation,
    order,
  }
}

function buildQuizObjects(
  book: Book,
  chapterTitle: string,
  chapterIndex: number,
  questions: ChapterQuestion[]
): { quiz: Quiz; engineQuestions: Question[] } {
  const quizId = `chapter-quiz-${book.id}-${chapterIndex}`
  const quiz: Quiz = {
    id: quizId,
    book_id: book.id,
    title: `${book.title} — ${chapterTitle}`,
    difficulty: book.difficulty,
  }
  const engineQuestions = questions.map((q, i) => mapToEngineQuestion(q, quizId, i))
  return { quiz, engineQuestions }
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

/** Animated "+N Wisdom" float-up badge */
function WisdomFloat({ amount, show }: { amount: number; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="wisdom-float"
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -48, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.9 }}
          transition={{ ...springs.interactive, duration: 0.6 }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <span className="text-emerald-600 font-bold text-xl drop-shadow-sm select-none">
            +{amount} Wisdom
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Hearts row */
function HeartsDisplay({
  current,
  max,
  pulse,
}: {
  current: number
  max: number
  pulse: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <motion.div
          key={i}
          animate={pulse && i === current ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-200 ${
              i < current
                ? "fill-rose-500 text-rose-500"
                : "fill-transparent text-stone-300"
            }`}
          />
        </motion.div>
      ))}
    </div>
  )
}

/** Progress dots */
function ProgressDots({ total, answered }: { total: number; answered: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            i < answered
              ? "bg-[var(--tome-accent)] scale-110"
              : i === answered
                ? "bg-[#444444] ring-2 ring-[var(--tome-accent)]/40"
                : "bg-[#444444]"
          }`}
        />
      ))}
    </div>
  )
}

/** Option button (A B C D / True / False) */
function OptionButton({
  label,
  text,
  state,
  disabled,
  onClick,
}: {
  label: string
  text: string
  state: "idle" | "correct" | "wrong" | "disabled"
  disabled: boolean
  onClick: () => void
}) {
  const stateClasses = {
    idle: "border-[#333333] bg-[#222222] text-foreground hover:border-[var(--tome-accent)]",
    correct: "border-[#5A9A5A] bg-[#1A2E1A] text-[#6EAA6E]",
    wrong: "border-[#A04444] bg-[#2E1A1A] text-[#C87272]",
    disabled: "border-[#333333] bg-[#1A1A1A] text-muted-foreground opacity-50",
  }

  const badgeClasses = {
    idle: "border-[#444444] bg-[#2A2A2A] text-[#B0A898]",
    correct: "border-[#5A9A5A] bg-[#1A2E1A] text-[#6EAA6E]",
    wrong: "border-[#A04444] bg-[#2E1A1A] text-[#C87272]",
    disabled: "border-[#333333] bg-[#1A1A1A] text-[#666666]",
  }

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${stateClasses[state]} ${disabled && state === "idle" ? stateClasses.disabled : ""} ${disabled ? "cursor-default" : ""}`}
    >
      <span
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${
          disabled && state === "idle" ? badgeClasses.disabled : badgeClasses[state]
        }`}
      >
        {label}
      </span>
      <span className="text-sm leading-snug">{text}</span>
    </motion.button>
  )
}

// ─────────────────────────────────────────────
// Phase: Celebration
// ─────────────────────────────────────────────

function CelebrationPhase({
  chapterTitle,
  onStart,
}: {
  chapterTitle: string
  onStart: () => void
}) {
  const confettiRef = useRef<ConfettiRef>(null)
  const [showWisdom, setShowWisdom] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      confettiRef.current?.fire({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.4 },
        colors: ["#4F46E5", "#F59E0B", "#EAB308", "#8B5CF6", "#22C55E"],
      })
      setShowWisdom(true)
    }, 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-6 relative">
      {/* Confetti canvas (fills overlay) */}
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none absolute inset-0 w-full h-full"
      />

      {/* Big celebration emoji */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springs.interactive, delay: 0.1 }}
        className="relative"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...springs.interactive, delay: 0.25 }}
          className="block"
        >
          <Trophy className="size-10 text-[#D4B37A]" />
        </motion.span>
        {/* Wisdom float anchored near the emoji */}
        <div className="absolute inset-0">
          <WisdomFloat amount={5} show={showWisdom} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="font-serif text-3xl font-bold text-ink tracking-tight">
          Chapter Complete!
        </h2>
        <p className="text-muted-foreground text-base">{chapterTitle}</p>
      </motion.div>

      {/* CTA button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Button
          onClick={onStart}
          className="bg-[var(--tome-accent)] hover:bg-[#E0C48A] text-[#111111] px-8 py-3 rounded-xl text-base font-semibold gap-2 shadow-lg shadow-black/20"
        >
          Start the Trial
          <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Phase: Quiz
// ─────────────────────────────────────────────

const OPTION_LABELS = ["A", "B", "C", "D"]

function QuizPhase({
  book,
  chapterTitle,
  quizState,
  maxHearts,
  onAnswer,
  onNext,
}: {
  book: Book
  chapterTitle: string
  quizState: ReturnType<typeof createQuizState>
  maxHearts: number
  onAnswer: (answer: string) => void
  onNext: () => void
}) {
  const { questions, currentIndex, hearts, results, status } = quizState
  const question = questions[currentIndex]
  if (!question) return null

  const answered = results[currentIndex] !== null
  const isCorrect = results[currentIndex] === "correct"
  const isWrong = results[currentIndex] === "wrong"
  const [showWisdom, setShowWisdom] = useState(false)
  const [heartPulse, setHeartPulse] = useState(false)
  const [shake, setShake] = useState(false)
  const selectedAnswer = quizState.answers[currentIndex]

  const handleAnswer = useCallback(
    (answer: string) => {
      if (answered) return
      onAnswer(answer)
    },
    [answered, onAnswer]
  )

  // React to answer result
  useEffect(() => {
    if (!answered) return
    if (isCorrect) {
      setShowWisdom(true)
      const t = setTimeout(() => setShowWisdom(false), 1200)
      return () => clearTimeout(t)
    }
    if (isWrong) {
      setShake(true)
      setHeartPulse(true)
      const t1 = setTimeout(() => setShake(false), 500)
      const t2 = setTimeout(() => setHeartPulse(false), 600)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [answered, isCorrect, isWrong])

  const isTrueFalse = question.type === "true_false"
  const options = isTrueFalse ? ["True", "False"] : question.options

  function getOptionState(opt: string): "idle" | "correct" | "wrong" | "disabled" {
    if (!answered) return "idle"
    const normalizedOpt = isTrueFalse ? opt.toLowerCase() : opt
    const normalizedCorrect = question.correct_answer.toLowerCase()
    const normalizedSelected = selectedAnswer?.toLowerCase() ?? ""
    if (normalizedOpt === normalizedCorrect) return "correct"
    if (normalizedOpt === normalizedSelected && normalizedOpt !== normalizedCorrect) return "wrong"
    return "disabled"
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground font-medium truncate max-w-[180px]">{book.title}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[180px]">{chapterTitle}</span>
        </div>
        <ProgressDots total={questions.length} answered={currentIndex + (answered ? 1 : 0)} />
        <HeartsDisplay current={hearts} max={maxHearts} pulse={heartPulse} />
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* Question card */}
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { opacity: 1, y: 0, x: 0 }}
            transition={shake ? { duration: 0.45 } : { duration: 0.3 }}
            className="rounded-2xl border-2 border-border bg-card p-6 space-y-5 shadow-sm transition-colors duration-300"
          >
            {/* Question meta */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Question {currentIndex + 1} of {questions.length}
              </span>
              {answered && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isCorrect
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {isCorrect ? "+10 Wisdom" : "Wrong — lost 1 heart"}
                </motion.span>
              )}
            </div>

            {/* Question text */}
            <div className="relative">
              <p className="text-ink text-lg leading-relaxed font-serif">{question.prompt}</p>
              <div className="absolute -right-2 -top-2">
                <WisdomFloat amount={10} show={showWisdom} />
              </div>
            </div>

            {/* Options */}
            <div
              className={`space-y-2.5 ${isTrueFalse ? "grid grid-cols-2 gap-3 space-y-0" : ""}`}
            >
              {options.map((opt, i) => {
                const label = isTrueFalse ? opt : OPTION_LABELS[i] ?? String(i + 1)
                const answerValue = isTrueFalse ? opt.toLowerCase() : opt
                return (
                  <OptionButton
                    key={opt}
                    label={label}
                    text={opt}
                    state={getOptionState(opt)}
                    disabled={answered}
                    onClick={() => handleAnswer(answerValue)}
                  />
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {answered && question.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.35 }}
                  className={`rounded-xl p-4 text-sm leading-relaxed border ${
                    isCorrect
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-rose-50 border-rose-200 text-rose-700"
                  }`}
                >
                  <span className="font-semibold mr-1">{isCorrect ? "Exactly." : "Not quite."}</span>
                  {question.explanation}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Next button */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="mt-4 flex justify-end"
              >
                <Button
                  onClick={onNext}
                  className="bg-[var(--tome-accent)] hover:bg-[#E0C48A] text-[#111111] px-6 py-2.5 rounded-xl font-semibold gap-2 shadow-lg shadow-black/20"
                >
                  {currentIndex < questions.length - 1 ? (
                    <>
                      Next Question
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      See Results
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Phase: Results
// ─────────────────────────────────────────────

function ResultsPhase({
  quizState,
  maxHearts,
  onPass,
  onRetry,
  onClose,
}: {
  quizState: ReturnType<typeof createQuizState>
  maxHearts: number
  onPass: (xp: number, coins: number) => void
  onRetry: () => void
  onClose: () => void
}) {
  const { questions, score, hearts, xpEarned, coinsEarned } = quizState
  const total = questions.length
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  const passed = percentage >= 60
  const confettiRef = useRef<ConfettiRef>(null)

  useEffect(() => {
    if (passed) {
      const t = setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 },
          colors: ["#D4B37A", "#6EAA6E", "#6E9AC8", "#C87272", "#E0C48A"],
        })
      }, 400)
      return () => clearTimeout(t)
    }
  }, [passed])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center relative">
      {passed && (
        <Confetti
          ref={confettiRef}
          manualstart
          className="pointer-events-none absolute inset-0 w-full h-full"
        />
      )}

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        {passed && <span className="block mb-2"><Trophy className="size-10 text-[#D4B37A] mx-auto" /></span>}
        <h2 className="font-serif text-3xl font-bold tracking-tight text-ink">
          {passed ? "Trial Passed!" : "Not quite..."}
        </h2>
        <p className="text-muted-foreground text-sm">
          {passed ? "Your knowledge grows stronger." : "Every scholar learns from difficulty."}
        </p>
      </motion.div>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springs.gentle, delay: 0.15 }}
        className={`rounded-2xl border-2 px-10 py-8 space-y-6 w-full max-w-sm bg-card shadow-sm ${
          passed ? "border-[var(--tome-accent)]/20" : "border-border"
        }`}
      >
        {/* Score fraction */}
        <div className="space-y-1">
          <div className="text-5xl font-bold text-ink">
            {score}
            <span className="text-2xl text-muted-foreground font-normal"> / {total}</span>
          </div>
          <div className="text-muted-foreground text-sm">
            {percentage}% correct
          </div>
        </div>

        {/* XP earned */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-emerald-600 text-xl font-bold">+{xpEarned}</span>
          <span className="text-muted-foreground text-sm">Wisdom earned</span>
        </div>

        {/* Hearts remaining */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-muted-foreground text-sm">Hearts:</span>
          <HeartsDisplay current={hearts} max={maxHearts} pulse={false} />
        </div>
      </motion.div>

      {/* Pass actions */}
      {passed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          className="space-y-3 w-full max-w-sm"
        >
          {/* Unlock badge */}
          <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-amber-300 bg-amber-50">
            <span className="text-amber-800 text-sm font-semibold">Next Chapter Unlocked!</span>
          </div>

          <Button
            onClick={() => onPass(xpEarned, coinsEarned)}
            className="w-full bg-[var(--tome-accent)] hover:bg-[#E0C48A] text-[#111111] py-3 rounded-xl text-base font-semibold gap-2 shadow-lg shadow-black/20"
          >
            Continue Reading
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* Fail actions */}
      {!passed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          className="space-y-4 w-full max-w-sm"
        >
          <Button
            onClick={onRetry}
            className="w-full bg-stone-200 hover:bg-stone-300 text-ink py-3 rounded-xl text-base font-semibold gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-ink text-sm underline underline-offset-2 transition-colors"
          >
            Switch to Free Mode
          </button>
        </motion.div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Quiz Controller — owns quiz state, keyed on attempt
// ─────────────────────────────────────────────

function QuizController({
  book,
  chapterTitle,
  chapterIndex,
  questions,
  hearts,
  onPhaseChange,
  onPass,
  onRetry,
  onClose,
  currentPhase,
}: {
  book: Book
  chapterTitle: string
  chapterIndex: number
  questions: ChapterQuestion[]
  hearts: number
  onPhaseChange: (phase: OverlayPhase) => void
  onPass: (xp: number, coins: number) => void
  onRetry: () => void
  onClose: () => void
  currentPhase: OverlayPhase
}) {
  const { quiz, engineQuestions } = buildQuizObjects(book, chapterTitle, chapterIndex, questions)
  const [quizState, dispatch] = useReducer(
    quizReducer,
    { quiz, engineQuestions, hearts },
    ({ quiz: q, engineQuestions: eqs, hearts: h }) => {
      const s = createQuizState(q, eqs, h)
      return { ...s, status: "active" as const }
    }
  )

  // Advance to results when quiz engine finishes
  useEffect(() => {
    if (
      currentPhase === "quiz" &&
      (quizState.status === "review" || quizState.status === "complete")
    ) {
      const t = setTimeout(() => onPhaseChange("results"), 300)
      return () => clearTimeout(t)
    }
  }, [currentPhase, quizState.status, onPhaseChange])

  const handleAnswer = useCallback((answer: string) => {
    dispatch({ type: "ANSWER", answer })
  }, [])

  const handleNext = useCallback(() => {
    if (quizState.status === "review" || quizState.status === "complete") {
      onPhaseChange("results")
    } else {
      dispatch({ type: "NEXT" })
    }
  }, [quizState.status, onPhaseChange])

  return (
    <AnimatePresence mode="wait">
      {currentPhase === "quiz" && (
        <motion.div
          key="quiz"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <QuizPhase
            book={book}
            chapterTitle={chapterTitle}
            quizState={quizState}
            maxHearts={hearts}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        </motion.div>
      )}

      {currentPhase === "results" && (
        <motion.div
          key="results"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <ResultsPhase
            quizState={quizState}
            maxHearts={hearts}
            onPass={onPass}
            onRetry={onRetry}
            onClose={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────
// Main Overlay Component
// ─────────────────────────────────────────────

export function ChapterQuizOverlay({
  book,
  chapterTitle,
  chapterIndex,
  questions,
  hearts,
  isOpen,
  onPass,
  onFail,
  onClose,
}: ChapterQuizOverlayProps) {
  const [phase, setPhase] = useState<OverlayPhase>("celebration")
  // quizAttempt increments on retry; keyed on QuizController to force full state reset
  const [quizAttempt, setQuizAttempt] = useState(0)

  // Reset phase when overlay opens
  useEffect(() => {
    if (isOpen) {
      setPhase("celebration")
      setQuizAttempt(0)
    }
  }, [isOpen])

  // Auto-advance from celebration to quiz after 1500ms
  useEffect(() => {
    if (phase !== "celebration") return
    const t = setTimeout(() => setPhase("quiz"), 1500)
    return () => clearTimeout(t)
  }, [phase])

  const handleRetry = useCallback(() => {
    setQuizAttempt((n) => n + 1)
    setPhase("quiz")
    onFail()
  }, [onFail])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chapter-quiz-overlay"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ ...springs.gentle, duration: 0.55 }}
          className="fixed inset-0 z-50 bg-background flex flex-col"
        >
          {/* Close button (only visible in quiz/results phase) */}
          <AnimatePresence>
            {phase !== "celebration" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Exit trial"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Phase content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Celebration phase */}
            <AnimatePresence mode="wait">
              {phase === "celebration" && (
                <motion.div
                  key="celebration"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col"
                >
                  <CelebrationPhase
                    chapterTitle={chapterTitle}
                    onStart={() => setPhase("quiz")}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quiz + Results — QuizController manages both, keyed on quizAttempt for clean resets */}
            {(phase === "quiz" || phase === "results") && (
              <QuizController
                key={quizAttempt}
                book={book}
                chapterTitle={chapterTitle}
                chapterIndex={chapterIndex}
                questions={questions}
                hearts={hearts}
                currentPhase={phase}
                onPhaseChange={setPhase}
                onPass={onPass}
                onRetry={handleRetry}
                onClose={onClose}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
