"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Sparkles, Flame, BookOpen, Bookmark, ChevronRight,
  Trophy, Target, Share2, BarChart2, LogOut,
  Check, Lock, Zap, BookMarked, Pencil,
} from "lucide-react"
import { getAllBookProgress } from "@/lib/book-progress"
import { getBooks } from "@/lib/content"
import { TRADITION_COLORS } from "@/components/tome/book-card"
import { BookCover, getCoverParams } from "@/components/tome/book-cover"
import { AuthorLink } from "@/components/tome/author-link"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/tome/avatar/UserAvatar"
import { getCurrentAvatar, getSelectedCharacterId } from "@/lib/avatar-state"
import type { BookCharacter } from "@/data/character-avatars"
import { CHARACTER_MAP, RARITY_COLORS } from "@/data/character-avatars"
import { AvatarPickerModal } from "@/components/tome/avatar/AvatarPickerModal"

// ── Level system ───────────────────────────────

const LEVELS = [
  { level: 1, title: "Novice",     minXp: 0    },
  { level: 2, title: "Apprentice", minXp: 300  },
  { level: 3, title: "Scholar",    minXp: 700  },
  { level: 4, title: "Sage",       minXp: 1500 },
  { level: 5, title: "Luminary",   minXp: 3000 },
]

function getLevelInfo(xp: number) {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.minXp) current = l
    else break
  }
  const next = LEVELS[LEVELS.indexOf(current) + 1]
  const progressXp = xp - current.minXp
  const rangeXp    = next ? next.minXp - current.minXp : 1000
  const pct        = Math.min(100, Math.round((progressXp / rangeXp) * 100))
  return { current, next, progressXp, rangeXp, pct }
}

// ── Demo seed data ─────────────────────────────

const DEMO_XP        = 1285
const DEMO_STREAK    = 12
const DEMO_BEST      = 19
const DEMO_JOIN_DATE = "January 2025"

const WEEKLY_XP = [45, 80, 30, 120, 95, 60, 40] // Mon–Sun
const DAYS_LABEL = ["M", "T", "W", "T", "F", "S", "S"]
const DAILY_GOAL = 80

// 12-week heatmap: 0 = none, 1 = light, 2 = medium, 3 = heavy
const HEATMAP: number[][] = [
  [0,0,1,0,2,1,0],
  [1,2,0,1,3,2,1],
  [0,1,2,3,2,1,0],
  [0,0,0,1,2,3,2],
  [1,2,3,3,2,1,0],
  [0,1,2,3,3,2,1],
  [1,1,0,2,3,3,2],
  [0,0,1,2,3,3,2],
  [0,1,1,2,3,2,1],
  [1,2,2,3,3,2,1],
  [2,3,3,2,3,3,2],
  [1,2,3,3,2,3,3],
]

const TRADITION_PROGRESS = [
  { tradition: "Ancient Greek", done: 8,  total: 24 },
  { tradition: "Victorian",     done: 5,  total: 15 },
  { tradition: "Modernist",     done: 3,  total: 10 },
  { tradition: "Russian",       done: 2,  total: 8  },
  { tradition: "Enlightenment", done: 1,  total: 5  },
]

const ACHIEVEMENTS_EARNED = 7
const ACHIEVEMENTS_TOTAL  = 21
const ACHIEVEMENT_BADGES = [
  { id: "first-book",   icon: BookOpen,  name: "First Page",   color: "#0EA5E9" },
  { id: "3-day-streak", icon: Flame,     name: "On Fire",      color: "#F97316" },
  { id: "scholar",      icon: Zap,       name: "Fast Scholar", color: "#F59E0B" },
  { id: "greek",        icon: BookMarked,name: "Hellenic",     color: "#0EA5E9" },
  { id: "5-chapters",   icon: Bookmark,  name: "Deep Reader",  color: "#8B5CF6" },
  { id: "night-owl",    icon: Sparkles,  name: "Night Owl",    color: "#6366F1" },
  { id: "quiz-ace",     icon: Trophy,    name: "Quiz Ace",     color: "#F59E0B" },
]

const CHALLENGES = [
  {
    id: "monthly-books",
    label: "Read 5 books this month",
    icon: BookOpen,
    done: 1, total: 5,
    color: "#0EA5E9",
  },
  {
    id: "all-traditions",
    label: "Complete a book in every tradition",
    icon: Trophy,
    done: 2, total: 14,
    color: "#F59E0B",
  },
  {
    id: "streak-7",
    label: "7-day reading streak",
    icon: Flame,
    done: 7, total: 7,
    color: "#F97316",
  },
]

const READING_QUOTES = [
  { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "I am not afraid of storms, for I am learning how to sail my ship.", author: "Louisa May Alcott" },
  { text: "It is a truth universally acknowledged…", author: "Jane Austen" },
  { text: "All that is gold does not glitter.", author: "J.R.R. Tolkien" },
]

// Demo bookshelf: use IDs from books.ts
const SHELF_IN_PROGRESS = [
  { bookId: "the-odyssey",        pct: 62, lastRead: "2 days ago" },
  { bookId: "crime-and-punishment", pct: 28, lastRead: "1 week ago" },
  { bookId: "hamlet",             pct: 45, lastRead: "3 days ago" },
  { bookId: "pride-and-prejudice",pct: 80, lastRead: "Yesterday" },
  { bookId: "the-great-gatsby",   pct: 15, lastRead: "10 days ago" },
]
const SHELF_COMPLETED = [
  { bookId: "the-iliad",          completedOn: "Mar 2025" },
  { bookId: "meditations",        completedOn: "Feb 2025" },
  { bookId: "frankenstein",       completedOn: "Jan 2025" },
]

// ── Helpers ────────────────────────────────────

function heatColor(v: number): string {
  if (v === 0) return "var(--tome-surface-recessed, #e5e7eb)"
  if (v === 1) return "rgba(99,102,241,0.25)"
  if (v === 2) return "rgba(99,102,241,0.55)"
  return "rgba(99,102,241,0.90)"
}

function OrnamentalDivider({ color }: { color: string }) {
  return (
    <div className="relative flex items-center my-5" aria-hidden>
      <div className="flex-1 h-px bg-border" />
      <div className="mx-3 shrink-0">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill={color} />
        </svg>
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

// ── Main Page ──────────────────────────────────

export default function ProfilePage() {
  const [allProgress, setAllProgress]   = useState<ReturnType<typeof getAllBookProgress>>({})
  const [shelfTab,    setShelfTab]       = useState<"progress" | "completed">("progress")
  const [settingMode, setSettingMode]    = useState<"guided" | "free">("guided")
  const [settingGoal, setSettingGoal]    = useState(20)
  const [settingTheme,setSettingTheme]   = useState("default")
  const [shareOpen,   setShareOpen]      = useState(false)
  const [avatarCharacter, setAvatarCharacter] = useState<BookCharacter | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const refreshAvatar = () => setAvatarCharacter(getCurrentAvatar())

  useEffect(() => {
    setAllProgress(getAllBookProgress())
    refreshAvatar()
  }, [])

  const displayCharacter = avatarCharacter ?? CHARACTER_MAP["virgil"]

  const allBooks = useMemo(() => getBooks(), [])

  // Compute stats from live progress, fall back to demo seed
  const totalXp = useMemo(() => {
    const live = Object.values(allProgress).reduce((s, p) => s + p.totalXpEarned, 0)
    return live > 0 ? live : DEMO_XP
  }, [allProgress])

  const totalChapters = useMemo(() => {
    const live = Object.values(allProgress).reduce((s, p) => s + p.completedChapterIndices.length, 0)
    return live > 0 ? live : 23
  }, [allProgress])

  const booksStarted = useMemo(() => {
    const live = Object.keys(allProgress).length
    return live > 0 ? live : 4
  }, [allProgress])

  const levelInfo = getLevelInfo(totalXp)
  const accentColor = "#6366F1"
  const quoteIdx = Math.floor(Date.now() / 86_400_000) % READING_QUOTES.length
  const quote    = READING_QUOTES[quoteIdx]

  // Build bookshelf book data
  const shelfInProgress = SHELF_IN_PROGRESS.map(({ bookId, pct, lastRead }) => ({
    book: allBooks.find((b) => b.id === bookId),
    pct, lastRead,
  })).filter((x) => x.book != null) as { book: NonNullable<typeof allBooks[0]>; pct: number; lastRead: string }[]

  const shelfCompleted = SHELF_COMPLETED.map(({ bookId, completedOn }) => ({
    book: allBooks.find((b) => b.id === bookId),
    completedOn,
  })).filter((x) => x.book != null) as { book: NonNullable<typeof allBooks[0]>; completedOn: string }[]

  const maxWeeklyXp = Math.max(...WEEKLY_XP, DAILY_GOAL)

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-12">

        {/* ── 1. Profile Header ─────────────────── */}
        <BlurFade delay={0.05} inView>
          <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0 flex flex-col items-center gap-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPickerOpen(true)}
                className="cursor-pointer outline-none"
              >
                {displayCharacter && (
                  <UserAvatar
                    character={displayCharacter}
                    size="lg"
                    showRarityRing={true}
                  />
                )}
              </motion.button>
              {displayCharacter && (
                <>
                  <span className="text-sm font-semibold text-foreground text-center max-w-[120px] truncate leading-tight">
                    {displayCharacter.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground text-center max-w-[120px] truncate leading-tight">
                    {displayCharacter.bookTitle}
                  </span>
                  <span
                    className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none"
                    style={{
                      color: RARITY_COLORS[displayCharacter.rarity].text,
                      backgroundColor: RARITY_COLORS[displayCharacter.rarity].bg,
                      border: `1px solid ${RARITY_COLORS[displayCharacter.rarity].border}`,
                    }}
                  >
                    {displayCharacter.rarity}
                  </span>
                </>
              )}
              <button
                onClick={() => setPickerOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                <Pencil className="size-3" />
                Change Avatar
              </button>
              {/* Level badge */}
              <div
                className="rounded-full px-2 py-0.5 text-[10px] font-bold leading-tight"
                style={{ background: accentColor, color: "#fff" }}
              >
                Lv {levelInfo.current.level}
              </div>
            </div>

            {/* Avatar picker modal */}
            <AvatarPickerModal
              open={pickerOpen}
              onOpenChange={setPickerOpen}
              onAvatarChanged={refreshAvatar}
            />

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="font-serif text-3xl font-bold tracking-tight">Matthew</h1>
              <p className="text-sm text-muted-foreground mt-0.5">reader@tome.app</p>
              <p className="text-sm font-medium mt-1" style={{ color: accentColor }}>
                {levelInfo.current.title}
              </p>

              {/* XP bar */}
              <div className="mt-3 max-w-xs mx-auto sm:mx-0">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>{levelInfo.progressXp.toLocaleString()} / {levelInfo.rangeXp.toLocaleString()} XP</span>
                  {levelInfo.next && (
                    <span>→ {levelInfo.next.title}</span>
                  )}
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: accentColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${levelInfo.pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground/60 mt-2">Member since {DEMO_JOIN_DATE}</p>
            </div>
          </section>
        </BlurFade>

        {/* ── 2. Stats Row ──────────────────────── */}
        <BlurFade delay={0.1} inView>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Wisdom",      value: totalXp.toLocaleString(),       icon: Sparkles, color: "#F59E0B", sub: "XP" },
              { label: "Day Streak",         value: DEMO_STREAK,                    icon: Flame,    color: "#F97316", sub: `Best: ${DEMO_BEST}` },
              { label: "Books Started",      value: booksStarted,                   icon: BookOpen, color: "#0EA5E9", sub: "in library" },
              { label: "Chapters Done",      value: totalChapters,                  icon: Bookmark, color: "#8B5CF6", sub: "completed" },
            ].map(({ label, value, icon: Icon, color, sub }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0" style={{ color }} />
                  <span className="text-[11px] text-muted-foreground truncate">{label}</span>
                </div>
                <p className="font-serif text-2xl font-bold tracking-tight" style={{ color }}>
                  {value}
                </p>
                <p className="text-[10px] text-muted-foreground/60">{sub}</p>
              </div>
            ))}
          </div>
        </BlurFade>

        {/* ── 3. Weekly Activity Chart ──────────── */}
        <BlurFade delay={0.12} inView>
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-1">This Week</h2>
            <OrnamentalDivider color={accentColor} />

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-end gap-2 h-28 relative">
                {/* Goal reference line */}
                <div
                  className="absolute left-0 right-0 border-t border-dashed"
                  style={{
                    bottom: `${(DAILY_GOAL / maxWeeklyXp) * 100}%`,
                    borderColor: `${accentColor}44`,
                  }}
                >
                  <span
                    className="absolute right-0 -top-4 text-[9px] font-medium px-1"
                    style={{ color: `${accentColor}99` }}
                  >
                    Goal
                  </span>
                </div>

                {WEEKLY_XP.map((xp, i) => {
                  const pct   = (xp / maxWeeklyXp) * 100
                  const isToday = i === 4 // Friday demo
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      {xp > 0 && (
                        <span className="text-[9px] text-muted-foreground">{xp}</span>
                      )}
                      <div className="w-full rounded-t-sm overflow-hidden" style={{ height: "80px" }}>
                        <motion.div
                          className="w-full rounded-t-sm mt-auto"
                          style={{
                            backgroundColor: isToday ? accentColor : `${accentColor}66`,
                            marginTop: `${100 - pct}%`,
                            height: `${pct}%`,
                          }}
                          initial={{ scaleY: 0, originY: 1 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                      <span
                        className={cn("text-[10px]", isToday ? "font-bold" : "text-muted-foreground/60")}
                        style={isToday ? { color: accentColor } : {}}
                      >
                        {DAYS_LABEL[i]}
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="text-[11px] text-muted-foreground/60 mt-3 text-right">
                Daily goal: {DAILY_GOAL} XP
              </p>
            </div>
          </section>
        </BlurFade>

        {/* ── 4. Streak Calendar ────────────────── */}
        <BlurFade delay={0.14} inView>
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-semibold tracking-tight">Reading Streak</h2>
              <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#F97316" }}>
                <Flame className="size-4" />
                {DEMO_STREAK} days
              </div>
            </div>
            <OrnamentalDivider color={accentColor} />

            <div className="rounded-xl border border-border bg-card p-5">
              {/* Grid: 12 cols (weeks) × 7 rows (days) */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {HEATMAP.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((v, di) => (
                      <div
                        key={di}
                        className="size-3 rounded-[2px] shrink-0"
                        style={{ backgroundColor: heatColor(v) }}
                        title={v === 0 ? "No activity" : v === 1 ? "Light" : v === 2 ? "Active" : "Heavy"}
                      />
                    ))}
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-1.5 mt-3 text-[10px] text-muted-foreground/60">
                <span>Less</span>
                {[0, 1, 2, 3].map((v) => (
                  <div key={v} className="size-3 rounded-[2px]" style={{ backgroundColor: heatColor(v) }} />
                ))}
                <span>More</span>
              </div>
            </div>
          </section>
        </BlurFade>

        {/* ── 5. Tradition Progress ─────────────── */}
        <BlurFade delay={0.16} inView>
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-1">
              Progress by Tradition
            </h2>
            <OrnamentalDivider color={accentColor} />

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              {TRADITION_PROGRESS.map(({ tradition, done, total }) => {
                const pct   = Math.round((done / total) * 100)
                const tcolor = TRADITION_COLORS[tradition]?.dot ?? accentColor
                return (
                  <div key={tradition}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium">{tradition}</span>
                      <span className="text-muted-foreground">
                        {done} / {total} chapters
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: tcolor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </BlurFade>

        {/* ── 6. Achievements ───────────────────── */}
        <BlurFade delay={0.18} inView>
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-semibold tracking-tight">Achievements</h2>
              <Link
                href="/achievements"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all <ChevronRight className="size-3" />
              </Link>
            </div>
            <OrnamentalDivider color={accentColor} />

            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground mb-4">
                <span className="font-semibold text-foreground">{ACHIEVEMENTS_EARNED}</span> of{" "}
                {ACHIEVEMENTS_TOTAL} earned
              </p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {ACHIEVEMENT_BADGES.map(({ id, icon: Icon, name, color }) => (
                  <div key={id} className="shrink-0 flex flex-col items-center gap-1.5 group">
                    <div
                      className="size-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `${color}20`,
                        border: `1.5px solid ${color}55`,
                      }}
                      title={name}
                    >
                      <Icon className="size-5" style={{ color }} />
                    </div>
                    <span className="text-[9px] text-muted-foreground text-center w-12 leading-tight truncate">
                      {name}
                    </span>
                  </div>
                ))}
                {/* Locked placeholder */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`lock-${i}`} className="shrink-0 flex flex-col items-center gap-1.5 opacity-30">
                    <div className="size-12 rounded-full flex items-center justify-center bg-muted border border-border">
                      <Lock className="size-4 text-muted-foreground" />
                    </div>
                    <span className="text-[9px] text-muted-foreground text-center">???</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </BlurFade>

        {/* ── 7. Challenges ─────────────────────── */}
        <BlurFade delay={0.2} inView>
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-semibold tracking-tight">Challenges</h2>
              <span className="text-[11px] text-muted-foreground/60">This period</span>
            </div>
            <OrnamentalDivider color={accentColor} />

            <div className="space-y-3">
              {CHALLENGES.map(({ id, label, icon: Icon, done, total, color }) => {
                const pct       = Math.round((done / total) * 100)
                const completed = done >= total
                return (
                  <div
                    key={id}
                    className="rounded-xl border border-border bg-card p-4 flex items-start gap-3"
                  >
                    <div
                      className="mt-0.5 shrink-0 size-8 rounded-full flex items-center justify-center"
                      style={{ background: `${color}20` }}
                    >
                      <Icon className="size-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <p className="text-sm font-medium leading-tight">{label}</p>
                        {completed ? (
                          <span
                            className="flex items-center gap-0.5 text-[10px] font-semibold shrink-0"
                            style={{ color: "#22C55E" }}
                          >
                            <Check className="size-3" /> Complete
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground shrink-0">
                            {done}/{total}
                          </span>
                        )}
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: completed ? "#22C55E" : color }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </BlurFade>

        {/* ── 8. Bookshelf ──────────────────────── */}
        <BlurFade delay={0.22} inView>
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-1">My Bookshelf</h2>
            <OrnamentalDivider color={accentColor} />

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-muted p-1 mb-4 w-fit">
              {(["progress", "completed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setShelfTab(tab)}
                  className={cn(
                    "rounded-md px-4 py-1.5 text-xs font-medium transition-colors",
                    shelfTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === "progress" ? "In Progress" : "Completed"}
                </button>
              ))}
            </div>

            {shelfTab === "progress" && (
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
                {shelfInProgress.map(({ book, pct, lastRead }) => {
                  const coverParams  = getCoverParams(book)
                  const tradColor    = TRADITION_COLORS[book.tradition]
                  return (
                    <div key={book.id} className="shrink-0 snap-start w-32">
                      <Link href={`/book/${book.id}`} className="group block">
                        <div className="relative rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow mb-2">
                          <BookCover
                            {...coverParams}
                            className="w-full aspect-[2/3]"
                          />
                          {/* Progress overlay */}
                          <div
                            className="absolute bottom-0 left-0 right-0 h-1"
                            style={{ background: "rgba(0,0,0,0.3)" }}
                          >
                            <div
                              className="h-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: tradColor?.dot ?? accentColor,
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-[11px] font-medium leading-tight line-clamp-2 group-hover:text-[color:var(--tome-accent)] transition-colors mb-0.5">
                          {book.title}
                        </p>
                      </Link>
                      <span onClick={(e) => e.preventDefault()}>
                        <AuthorLink
                          name={book.author}
                          className="text-[10px] text-muted-foreground hover:text-[var(--tome-accent)] transition-colors"
                        />
                      </span>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">{pct}% · {lastRead}</p>
                    </div>
                  )
                })}
              </div>
            )}

            {shelfTab === "completed" && (
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
                {shelfCompleted.map(({ book, completedOn }) => {
                  const coverParams = getCoverParams(book)
                  return (
                    <div key={book.id} className="shrink-0 snap-start w-32">
                      <Link href={`/book/${book.id}`} className="group block">
                        <div className="relative rounded-lg overflow-hidden shadow-sm mb-2">
                          <BookCover
                            {...coverParams}
                            className="w-full aspect-[2/3]"
                          />
                          {/* Checkmark overlay */}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="size-8 rounded-full bg-emerald-500/90 flex items-center justify-center">
                              <Check className="size-4 text-white" />
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] font-medium leading-tight line-clamp-2 group-hover:text-[color:var(--tome-accent)] transition-colors mb-0.5">
                          {book.title}
                        </p>
                      </Link>
                      <span onClick={(e) => e.preventDefault()}>
                        <AuthorLink
                          name={book.author}
                          className="text-[10px] text-muted-foreground hover:text-[var(--tome-accent)] transition-colors"
                        />
                      </span>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">✓ {completedOn}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </BlurFade>

        {/* ── 9. Analytics Link ─────────────────── */}
        <BlurFade delay={0.24} inView>
          <Link
            href="/profile/stats"
            className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div
                className="size-9 rounded-full flex items-center justify-center"
                style={{ background: `${accentColor}18` }}
              >
                <BarChart2 className="size-4.5" style={{ color: accentColor }} />
              </div>
              <div>
                <p className="text-sm font-semibold">Reading Analytics</p>
                <p className="text-[11px] text-muted-foreground">Charts, speed stats, milestones</p>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </BlurFade>

        {/* ── 10. Shareable Progress Card ───────── */}
        <BlurFade delay={0.26} inView>
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-semibold tracking-tight">Share Your Journey</h2>
            </div>
            <OrnamentalDivider color={accentColor} />

            {/* The card itself */}
            <div
              id="tome-share-card"
              className="relative rounded-2xl overflow-hidden p-6 sm:p-8"
              style={{
                background: `linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)`,
                border: "1px solid rgba(99,102,241,0.4)",
              }}
            >
              {/* Dot texture */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
                aria-hidden
              />

              <div className="relative">
                {/* Branding */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="size-7 rounded-full bg-white/15 flex items-center justify-center">
                    <BookOpen className="size-4 text-white" />
                  </div>
                  <span className="font-serif font-bold text-white text-lg tracking-tight">Tome</span>
                </div>

                {/* User name */}
                <p className="font-serif text-white text-2xl font-bold mb-1">Matthew</p>
                <p className="text-indigo-300 text-sm mb-6">
                  {levelInfo.current.title} · Level {levelInfo.current.level}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Wisdom", value: totalXp.toLocaleString() + " XP", icon: Sparkles },
                    { label: "Streak",  value: `${DEMO_STREAK} days`,           icon: Flame },
                    { label: "Books",   value: `${booksStarted}`,               icon: BookOpen },
                    { label: "Chapters",value: `${totalChapters}`,              icon: Bookmark },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl bg-white/10 px-3 py-2.5">
                      <Icon className="size-3.5 text-indigo-300 mb-1" />
                      <p className="text-white text-sm font-bold">{value}</p>
                      <p className="text-indigo-300 text-[10px]">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="border-l-2 border-indigo-400/50 pl-4 mb-4">
                  <p className="font-serif italic text-indigo-100 text-sm leading-relaxed">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <cite className="text-indigo-300/70 text-[11px] not-italic">— {quote.author}</cite>
                </blockquote>

                <p className="text-indigo-400 text-[11px]">tome.app</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText("https://tome.app/profile/matthew")
                  }
                  setShareOpen(true)
                  setTimeout(() => setShareOpen(false), 2000)
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors",
                  shareOpen
                    ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                    : "hover:bg-muted"
                )}
              >
                {shareOpen ? <Check className="size-4" /> : <Share2 className="size-4" />}
                {shareOpen ? "Copied!" : "Copy Link"}
              </button>
              <button
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                title="Download coming soon"
              >
                <Target className="size-4" />
                Download
              </button>
            </div>
          </section>
        </BlurFade>

        {/* ── 11. Settings ──────────────────────── */}
        <BlurFade delay={0.28} inView>
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-1">Settings</h2>
            <OrnamentalDivider color={accentColor} />

            <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">

              {/* Daily Goal */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium">Daily Reading Goal</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {settingGoal === 10 ? "Casual" : settingGoal === 20 ? "Regular" : settingGoal === 30 ? "Ambitious" : "Intense"} · {settingGoal} min / day
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: "Casual",   val: 10  },
                    { label: "Regular",  val: 20  },
                    { label: "Ambitious",val: 30  },
                    { label: "Intense",  val: 60  },
                  ].map(({ label, val }) => (
                    <button
                      key={val}
                      onClick={() => setSettingGoal(val)}
                      className={cn(
                        "flex-1 rounded-lg border py-2 text-[11px] font-medium transition-colors",
                        settingGoal === val
                          ? "border-[var(--tome-accent)] text-[var(--tome-accent)] bg-[var(--tome-accent)]/10"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Mode */}
              <div className="px-5 py-4">
                <p className="text-sm font-medium mb-3">Default Reading Mode</p>
                <div className="flex gap-2">
                  {(["guided", "free"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSettingMode(mode)}
                      className={cn(
                        "flex-1 rounded-lg border py-2.5 text-sm font-medium capitalize transition-colors",
                        settingMode === mode
                          ? "border-[var(--tome-accent)] text-[var(--tome-accent)] bg-[var(--tome-accent)]/10"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      {mode === "guided" ? "🎯 Guided" : "📖 Free Read"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div className="px-5 py-4">
                <p className="text-sm font-medium mb-3">Reading Theme</p>
                <div className="flex gap-2">
                  {[
                    { label: "Default",       val: "default",  swatch: "#ffffff" },
                    { label: "Parchment",     val: "parchment",swatch: "#fef3c7" },
                    { label: "Night Scholar", val: "night",    swatch: "#111827" },
                  ].map(({ label, val, swatch }) => (
                    <button
                      key={val}
                      onClick={() => setSettingTheme(val)}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-1.5 rounded-lg border py-2.5 text-[11px] font-medium transition-colors",
                        settingTheme === val
                          ? "border-[var(--tome-accent)] text-[var(--tome-accent)]"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      <div
                        className="size-5 rounded-full border border-border/50"
                        style={{ background: swatch }}
                      />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign out */}
              <div className="px-5 py-4">
                <button className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors">
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </section>
        </BlurFade>

      </div>
    </div>
  )
}
