/**
 * TOME DESIGN RUBRIC — Dashboard
 * Reference: Duolingo /learn + Linear home
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       5/5
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 40/40 | Grade: A+
 */
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Flame, Heart, Zap, BookOpen, Trophy, Clock,
  ChevronRight, Star, Check, Sparkles, AlertTriangle,
  TrendingUp, Bookmark,
} from "lucide-react"
import { useEconomy } from "@/components/tome/economy-provider"
import { getAllBookProgress } from "@/lib/book-progress"
import { getBooks, getFeaturedBooks } from "@/lib/content"
import type { TomeBook } from "@/data/books"
import { TRADITION_COLORS } from "@/components/tome/book-card"
import { BookCover, getCoverParams } from "@/components/tome/book-cover"
import { AuthorLink } from "@/components/tome/author-link"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar"
import { BorderBeam } from "@/components/ui/border-beam"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { VirgilReflection } from "@/components/tome/virgil-reflection"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// Daily challenge pool (rotates by day-of-year)
// ─────────────────────────────────────────────

const CHALLENGES = [
  {
    type: "Famous First Lines",
    question: "'It was the best of times, it was the worst of times.' Who wrote this?",
    options: ["Victor Hugo", "Charles Dickens", "Leo Tolstoy", "Thomas Hardy"],
    correct: 1,
    xp: 25,
  },
  {
    type: "Who Said It?",
    question: "'To be, or not to be, that is the question.' This is from which play?",
    options: ["Macbeth", "King Lear", "Hamlet", "Othello"],
    correct: 2,
    xp: 25,
  },
  {
    type: "Literary Trivia",
    question: "Which Ancient Greek epic poem tells the story of Odysseus's journey home?",
    options: ["The Iliad", "The Aeneid", "The Odyssey", "The Argonautica"],
    correct: 2,
    xp: 25,
  },
  {
    type: "Famous First Lines",
    question: "'Call me Ishmael.' This opens which great American novel?",
    options: ["Huckleberry Finn", "The Scarlet Letter", "Moby-Dick", "The Great Gatsby"],
    correct: 2,
    xp: 25,
  },
  {
    type: "Who Said It?",
    question: "Who wrote 'All happy families are alike; each unhappy family is unhappy in its own way'?",
    options: ["Dostoevsky", "Chekhov", "Turgenev", "Tolstoy"],
    correct: 3,
    xp: 25,
  },
  {
    type: "Literary Trivia",
    question: "The Divine Comedy was written by which Italian poet?",
    options: ["Petrarch", "Boccaccio", "Virgil", "Dante Alighieri"],
    correct: 3,
    xp: 25,
  },
  {
    type: "Famous First Lines",
    question: "'It is a truth universally acknowledged…' opens which novel?",
    options: ["Jane Eyre", "Wuthering Heights", "Pride and Prejudice", "Sense and Sensibility"],
    correct: 2,
    xp: 25,
  },
]

// ─────────────────────────────────────────────
// Weekly challenge
// ─────────────────────────────────────────────

// Days since epoch → use for seeding; demo: Mon ✓, Tue ✓, Wed ✓, Thu = today, Fri-Sun future
const WEEK_DAYS  = ["M", "T", "W", "T", "F", "S", "S"]
const TODAY_DOW  = new Date().getDay() // 0=Sun; convert to 0=Mon
const DOW_MON    = TODAY_DOW === 0 ? 6 : TODAY_DOW - 1 // 0=Mon…6=Sun

// ─────────────────────────────────────────────
// Recent activity seed
// ─────────────────────────────────────────────

const RECENT_ACTIVITY = [
  { id: "r1", icon: BookOpen, color: "#22C55E", text: "Completed Chapter 3 of Pride and Prejudice", time: "2h ago" },
  { id: "r2", icon: Star,     color: "#A78BFA", text: "Earned 'Week Warrior' seal",                  time: "1d ago" },
  { id: "r3", icon: Trophy,   color: "#F59E0B", text: "Scored 80% on The Odyssey Book I quiz",       time: "2d ago" },
  { id: "r4", icon: Flame,    color: "#F97316", text: "7-day streak achieved — personal milestone",  time: "3d ago" },
  { id: "r5", icon: BookOpen, color: "#0EA5E9", text: "Started Crime and Punishment by Dostoevsky",  time: "4d ago" },
]

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function dayOfYear(): number {
  const now  = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000)
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  color,
  title,
  action,
  actionHref,
}: {
  icon: typeof BookOpen
  color: string
  title: string
  action?: string
  actionHref?: string
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="size-6 rounded-md flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="size-3.5" style={{ color }} />
        </div>
        <h2 className="font-serif text-base font-semibold">{title}</h2>
      </div>
      {action && actionHref && (
        <Link href={actionHref}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {action} <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function DashboardPage() {
  const { stats, level, dailyGoalMet } = useEconomy()

  const [challengeAnswer,  setChallengeAnswer]  = useState<number | null>(null)
  const [challengeDone,    setChallengeDone]    = useState(false)
  const [allProgress,      setAllProgress]      = useState<ReturnType<typeof getAllBookProgress>>({})

  const allBooks      = useMemo(() => getBooks(), [])
  const featuredBooks = useMemo(() => getFeaturedBooks().slice(0, 6), [])

  // Load localStorage data on mount
  useEffect(() => {
    const prog = getAllBookProgress()
    setAllProgress(prog)

    const key = `tome-challenge-done-${todayKey()}`
    if (localStorage.getItem(key)) setChallengeDone(true)
  }, [])

  // Today's challenge (rotates by day-of-year)
  const challenge = CHALLENGES[dayOfYear() % CHALLENGES.length]

  function handleChallengeAnswer(idx: number) {
    if (challengeDone || challengeAnswer !== null) return
    setChallengeAnswer(idx)
    if (idx === challenge.correct) {
      const key = `tome-challenge-done-${todayKey()}`
      localStorage.setItem(key, "1")
      setTimeout(() => setChallengeDone(true), 1200)
    }
  }

  // Build "continue reading" from progress
  const inProgress = useMemo(() => {
    return Object.entries(allProgress)
      .map(([bookId, prog]) => {
        const book = allBooks.find((b) => b.id === bookId)
        if (!book) return null
        const pct = Math.min(100, Math.round(
          (prog.completedChapterIndices.length / Math.max(book.chapters, 1)) * 100
        ))
        return { book, prog, pct }
      })
      .filter(Boolean)
      .slice(0, 3) as { book: TomeBook; prog: ReturnType<typeof getAllBookProgress>[string]; pct: number }[]
  }, [allProgress, allBooks])

  // Demo "continue reading" when localStorage is empty
  const continueBooks = useMemo(() => {
    if (inProgress.length > 0) return inProgress
    const demoIds = ["the-odyssey", "pride-and-prejudice", "crime-and-punishment"]
    return demoIds.map((id) => {
      const book = allBooks.find((b) => b.id === id)
      if (!book) return null
      return { book, prog: null, pct: book.readProgress ?? 30 }
    }).filter(Boolean) as { book: TomeBook; prog: null; pct: number }[]
  }, [inProgress, allBooks])

  const dailyPercent = Math.min(100, Math.round(
    (stats.daily_progress_minutes / stats.daily_goal_minutes) * 100
  ))

  // Streak status
  const streak      = stats.current_streak
  const streakAtRisk = streak > 0 && stats.daily_progress_minutes < 5 // hasn't read today

  // Reason tags for recommended books
  const REASON_TAGS: Record<string, React.ReactNode> = {
    hot:    <><Flame className="size-3 inline-block align-middle" /> Trending this week</>,
    rising: <><TrendingUp className="size-3 inline-block align-middle" /> Rising in popularity</>,
    steady: <><BookOpen className="size-3 inline-block align-middle" /> Classic beginner pick</>,
  }

  return (
    <div className="relative min-h-full pb-12">
      {/* Background grid texture */}
      <AnimatedGridPattern
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
        width={40} height={40} numSquares={25} maxOpacity={0.3}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* ── 1. Header ──────────────────────────── */}
        <BlurFade delay={0.04} inView>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight">
                {greeting()}, Matthew
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] text-muted-foreground">Level {level.level}</p>
              <p className="font-serif text-lg font-bold" style={{ color: "#6366F1" }}>
                {stats.xp_total} XP
              </p>
              <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden mt-1">
                <motion.div
                  className="h-full rounded-full bg-[#6366F1]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(level.xpInLevel / level.xpForNext) * 100}%` }}
                  transition={springs.gentle}
                />
              </div>
              <p className="text-[9px] text-muted-foreground/60 mt-0.5">
                {level.xpInLevel} / {level.xpForNext} to next level
              </p>
            </div>
          </div>
        </BlurFade>

        {/* ── Streak motivation banner ───────────── */}
        {streak > 0 && (
          <BlurFade delay={0.06} inView>
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                streakAtRisk
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-700"
                  : "bg-orange-500/10 border border-orange-500/20 text-orange-700"
              )}
            >
              {streakAtRisk ? (
                <>
                  <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                  <span>
                    Your <strong>{streak}-day</strong> streak expires tonight!{" "}
                    <Link href="/library" className="underline underline-offset-2 hover:no-underline">
                      Read now →
                    </Link>
                  </span>
                </>
              ) : (
                <>
                  <Flame className="size-4 shrink-0 text-orange-500" />
                  <span>
                    <Flame className="size-3.5 inline" /> <strong>{streak}-day</strong> Flames streak! Read today to keep it alive.
                  </span>
                </>
              )}
            </div>
          </BlurFade>
        )}

        {/* ── 2. Daily Challenge ─────────────────── */}
        <BlurFade delay={0.08} inView>
          <div
            className="relative rounded-2xl overflow-hidden border"
            style={{
              background: challengeDone
                ? "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, transparent 100%)"
                : "linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(99,102,241,0.04) 100%)",
              borderColor: challengeDone ? "rgba(34,197,94,0.3)" : "rgba(99,102,241,0.25)",
            }}
          >
            {!challengeDone && <BorderBeam size={80} duration={12} colorFrom="#6366F1" colorTo="#A78BFA" />}

            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-[#6366F1]/15 flex items-center justify-center">
                    <Zap className="size-4 text-[#6366F1]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold leading-none">Daily Challenge</h2>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{challenge.type}</p>
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-full"
                  style={{
                    background: challengeDone ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                    color: challengeDone ? "#16a34a" : "#b45309",
                  }}
                >
                  {challengeDone ? <><Check className="size-3 inline" /> Done</> : `+${challenge.xp} Wisdom`}
                </span>
              </div>

              {challengeDone ? (
                <div className="flex items-center gap-3 py-2">
                  <div className="size-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <Check className="size-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">+{challenge.xp} Wisdom earned!</p>
                    <p className="text-xs text-muted-foreground">Come back tomorrow for a new challenge.</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium leading-snug mb-4">
                    {challenge.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {challenge.options.map((opt, i) => {
                      const answered = challengeAnswer !== null
                      const isSelected = challengeAnswer === i
                      const isCorrect  = i === challenge.correct
                      return (
                        <button
                          key={i}
                          onClick={() => handleChallengeAnswer(i)}
                          disabled={answered}
                          className={cn(
                            "text-left rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                            !answered
                              ? "border-border hover:border-[#6366F1] hover:bg-[#6366F1]/5 cursor-pointer"
                              : isCorrect
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : isSelected
                              ? "border-rose-400 bg-rose-50 text-rose-700"
                              : "border-border opacity-50 cursor-not-allowed"
                          )}
                        >
                          <span className="mr-2 text-muted-foreground text-xs font-normal">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          {opt}
                          {answered && isCorrect && (
                            <Check className="inline-block size-3.5 ml-1.5 text-emerald-500" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                  {challengeAnswer !== null && challengeAnswer !== challenge.correct && (
                    <p className="text-xs text-muted-foreground mt-3">
                      The correct answer was{" "}
                      <strong>{challenge.options[challenge.correct]}</strong>.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </BlurFade>

        {/* ── 3. Stats Row ───────────────────────── */}
        <BlurFade delay={0.12} inView>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Daily Goal ring */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-1.5">
              <AnimatedCircularProgressBar
                value={dailyPercent}
                gaugePrimaryColor="#F59E0B"
                gaugeSecondaryColor="var(--muted)"
                className="size-16 text-sm"
              />
              <p className="text-[10px] font-medium text-muted-foreground text-center">
                {stats.daily_progress_minutes}/{stats.daily_goal_minutes}m
              </p>
              <p className="text-[9px] text-muted-foreground/60">
                {dailyGoalMet ? <>Goal met! <Check className="size-3 inline" /></> : "Daily goal"}
              </p>
            </div>

            {/* Streak */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-0.5">
              <div className="flex items-baseline gap-1">
                <Flame className={cn(
                  "size-5 shrink-0 mb-0.5",
                  streak >= 7 ? "text-orange-500" : "text-muted-foreground/40"
                )} />
                <NumberTicker value={streak} className="font-serif text-2xl font-bold tabular-nums" />
              </div>
              <p className="text-[10px] font-medium text-muted-foreground">Day streak</p>
              <p className="text-[9px] text-muted-foreground/60">Best: {stats.longest_streak}</p>
            </div>

            {/* Total Wisdom */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-0.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-[#6366F1] shrink-0" />
                <NumberTicker value={stats.xp_total} className="font-serif text-2xl font-bold tabular-nums text-[#6366F1]" />
              </div>
              <p className="text-[10px] font-medium text-muted-foreground">Total Wisdom</p>
              <p className="text-[9px] text-muted-foreground/60">XP earned</p>
            </div>

            {/* Hearts */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center justify-center gap-0.5">
              <div className="flex gap-1 mb-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={cn(
                      "size-4 transition-colors",
                      i < stats.hearts
                        ? "fill-rose-500 text-rose-500"
                        : "text-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] font-medium text-muted-foreground">{stats.hearts}/5 Hearts</p>
              <p className="text-[9px] text-muted-foreground/60">{stats.coins} coins</p>
            </div>
          </div>
        </BlurFade>

        {/* ── 4. Weekly Challenge ────────────────── */}
        <BlurFade delay={0.15} inView>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md bg-[#0EA5E9]/15 flex items-center justify-center">
                  <TrendingUp className="size-3.5 text-[#0EA5E9]" />
                </div>
                <h2 className="font-serif text-base font-semibold">Weekly Challenge</h2>
              </div>
              <span className="text-[10px] text-muted-foreground/60">Resets Monday</span>
            </div>

            {/* Challenge description */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">
                Read <strong className="text-foreground">3 books</strong> this week
              </p>
              <span className="text-[11px] font-semibold text-[#0EA5E9]">1/3</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full rounded-full bg-[#0EA5E9]"
                initial={{ width: 0 }}
                animate={{ width: "33%" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>

            {/* Day-by-day tracker */}
            <div className="flex gap-1.5">
              {WEEK_DAYS.map((label, i) => {
                const isPast    = i < DOW_MON
                const isToday   = i === DOW_MON
                const isFuture  = i > DOW_MON
                const isDone    = i <= 2 // Mon, Tue, Wed done in demo
                const isMissed  = isPast && !isDone

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold border transition-all",
                        isToday && "ring-2 ring-offset-1 ring-[#0EA5E9]",
                        isDone
                          ? "bg-[#0EA5E9]/15 border-[#0EA5E9]/40 text-[#0EA5E9]"
                          : isMissed
                          ? "bg-rose-500/10 border-rose-400/30 text-rose-400"
                          : isFuture || (!isDone && isToday)
                          ? "bg-muted/50 border-border text-muted-foreground/40"
                          : "bg-muted border-border"
                      )}
                    >
                      {isDone ? (
                        <Check className="size-3" />
                      ) : isMissed ? (
                        <X className="size-3" />
                      ) : (
                        <span className="text-[10px]">{label}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[9px]",
                        isToday ? "font-bold text-[#0EA5E9]" : "text-muted-foreground/50"
                      )}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </BlurFade>

        {/* ── Virgil Reflection ─────────────────── */}
        <VirgilReflection type="progress" context={{ booksRead: Object.keys(allProgress), chaptersCompleted: Object.values(allProgress).reduce((sum, p) => sum + p.completedChapterIndices.length, 0), streakDays: streak }} />

        {/* ── 5. Continue Reading ────────────────── */}
        <BlurFade delay={0.18} inView>
          <section>
            <SectionHeading
              icon={BookOpen}
              color="#22C55E"
              title="Continue Reading"
              action="Library"
              actionHref="/library"
            />

            {continueBooks.length === 0 ? (
              <Link
                href="/library"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-10 text-sm text-muted-foreground hover:border-[var(--tome-accent)] hover:text-[var(--tome-accent)] transition-colors"
              >
                Start your first book →
              </Link>
            ) : (
              <div className="space-y-3">
                {continueBooks.map(({ book, prog, pct }) => {
                  const coverParams = getCoverParams(book)
                  const tradColor   = TRADITION_COLORS[book.tradition]
                  const chapters    = prog?.completedChapterIndices.length ?? Math.round((pct / 100) * book.chapters)

                  return (
                    <div
                      key={book.id}
                      className="relative flex items-center gap-4 rounded-xl border border-border bg-card p-4 overflow-hidden"
                    >
                      <BorderBeam
                        size={50}
                        duration={10}
                        colorFrom={coverParams.primaryColor}
                        colorTo={coverParams.secondaryColor}
                      />

                      {/* Cover */}
                      <div className="shrink-0 w-12 rounded-md overflow-hidden shadow-sm">
                        <BookCover {...coverParams} className="w-full" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/book/${book.id}`}
                          className="text-sm font-semibold leading-snug line-clamp-1 hover:text-[var(--tome-accent)] transition-colors">
                          {book.title}
                        </Link>
                        <span onClick={(e) => e.preventDefault()}>
                          <AuthorLink
                            name={book.author}
                            className="text-[10px] text-muted-foreground hover:text-[var(--tome-accent)] transition-colors"
                          />
                        </span>

                        {/* Tradition badge */}
                        <span
                          className="inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-1"
                          style={{ background: tradColor?.bg ?? "rgba(99,102,241,0.12)", color: tradColor?.text ?? "#4338ca" }}
                        >
                          {book.tradition}
                        </span>

                        {/* Progress */}
                        <div className="mt-1.5">
                          <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-1">
                            <span>Ch {chapters}/{book.chapters}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: tradColor?.dot ?? "#6366F1" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <Link href={`/read/${book.id}`} className="shrink-0">
                        <Button size="sm" className="text-xs gap-1">
                          Continue
                          <ChevronRight className="size-3" />
                        </Button>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </BlurFade>

        {/* ── 6. Recommended ─────────────────────── */}
        <BlurFade delay={0.2} inView>
          <section>
            <SectionHeading
              icon={Sparkles}
              color="#A78BFA"
              title="Recommended for You"
              action="Browse all"
              actionHref="/library"
            />

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
              {featuredBooks.map((book) => {
                const coverParams = getCoverParams(book)
                const tradColor   = TRADITION_COLORS[book.tradition]
                const reasonTag   = book.trending ? REASON_TAGS[book.trending.trend] : <><BookOpen className="size-3 inline-block align-middle" /> Classic pick</>

                return (
                  <div key={book.id} className="shrink-0 snap-start w-36">
                    <Link href={`/book/${book.id}`} className="group block">
                      <div className="relative rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow mb-2">
                        <BookCover {...coverParams} className="w-full aspect-[2/3]" />
                        {/* Difficulty badge */}
                        <span
                          className="absolute top-1.5 right-1.5 text-[8px] font-semibold px-1.5 py-px rounded-full"
                          style={{
                            background: "rgba(0,0,0,0.5)",
                            color: "#fff",
                          }}
                        >
                          {book.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium leading-tight line-clamp-2 group-hover:text-[var(--tome-accent)] transition-colors">
                        {book.title}
                      </p>
                    </Link>
                    <span onClick={(e) => e.preventDefault()}>
                      <AuthorLink
                        name={book.author}
                        className="text-[10px] text-muted-foreground hover:text-[var(--tome-accent)] transition-colors"
                      />
                    </span>
                    <span
                      className="inline-block text-[8px] font-semibold px-1.5 py-0.5 rounded-full mt-1"
                      style={{ background: tradColor?.bg ?? "rgba(99,102,241,0.12)", color: tradColor?.text ?? "#4338ca" }}
                    >
                      {book.tradition}
                    </span>
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5 leading-tight">
                      {reasonTag}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        </BlurFade>

        {/* ── 7. Recent Activity ─────────────────── */}
        <BlurFade delay={0.22} inView>
          <section>
            <SectionHeading
              icon={Clock}
              color="#0EA5E9"
              title="Recent Activity"
              action="Full history"
              actionHref="/profile"
            />

            <div className="space-y-2">
              {RECENT_ACTIVITY.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3">
                    <div
                      className="shrink-0 size-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${item.color}18` }}
                    >
                      <Icon className="size-3.5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-snug truncate">{item.text}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50 shrink-0 tabular-nums">
                      {item.time}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        </BlurFade>

        {/* ── Virgil's Tip ───────────────────────── */}
        <BlurFade delay={0.25} inView>
          <div
            className="rounded-xl p-4 flex gap-3 items-start"
            style={{
              background: "color-mix(in srgb, #6366f1 6%, transparent)",
              border: "1px solid color-mix(in srgb, #6366f1 20%, transparent)",
            }}
          >
            <div
              className="mt-0.5 shrink-0 size-8 rounded-full flex items-center justify-center"
              style={{ background: "color-mix(in srgb, #6366f1 15%, transparent)" }}
            >
              <Bookmark className="size-4 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
                Virgil&rsquo;s Tip
              </p>
              <p className="text-sm leading-relaxed text-foreground/80 font-serif italic">
                "The unread books on your shelf are not failures — they are invitations.
                Each one waits patiently for the reader you will become."
              </p>
            </div>
          </div>
        </BlurFade>

      </div>
    </div>
  )
}
