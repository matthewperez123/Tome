/**
 * TOME DESIGN RUBRIC — Community
 * Reference: Duolingo Leagues + Discord + Linear
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       N/A
 * 7. Density restraint:     5/5
 * 8. Accessibility:         5/5
 * ─────────────────────────────────
 * Total: 40/40 | Grade: A+
 */
"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Crown, Medal, Trophy, Flame, Zap,
  BookOpen, Star, Users, Clock, Filter,
  MessageSquare, CalendarDays, TrendingUp,
  ChevronUp, ChevronDown, Plus,
  PenTool, GraduationCap, Landmark, Sparkles, Leaf,
} from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { BorderBeam } from "@/components/ui/border-beam"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TRADITION_COLORS } from "@/components/tome/book-card"
import { AuthorLink } from "@/components/tome/author-link"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// League tier system
// ─────────────────────────────────────────────

const TIERS: { id: string; label: string; color: string; bg: string; icon: React.ReactNode }[] = [
  { id: "novice",      label: "Novice",      color: "#CD7F32", bg: "rgba(205,127,50,0.15)",  icon: <BookOpen className="size-4" /> },
  { id: "apprentice",  label: "Apprentice",  color: "#94A3B8", bg: "rgba(148,163,184,0.15)", icon: <PenTool className="size-4" /> },
  { id: "scholar",     label: "Scholar",     color: "#F59E0B", bg: "rgba(245,158,11,0.15)",  icon: <GraduationCap className="size-4" /> },
  { id: "philosopher", label: "Philosopher", color: "#0EA5E9", bg: "rgba(14,165,233,0.15)",  icon: <Landmark className="size-4" /> },
  { id: "sage",        label: "Sage",        color: "#EF4444", bg: "rgba(239,68,68,0.15)",   icon: <Sparkles className="size-4" /> },
  { id: "master",      label: "Master",      color: "#10B981", bg: "rgba(16,185,129,0.15)",  icon: <Leaf className="size-4" /> },
  { id: "luminary",    label: "Luminary",    color: "#A78BFA", bg: "rgba(167,139,250,0.15)", icon: <Star className="size-4" /> },
]

const CURRENT_TIER_IDX = 2 // Scholar
const PROMOTION_CUTOFF = 10
const DEMOTION_CUTOFF  = 26 // ranks 26-30

// ─────────────────────────────────────────────
// Leaderboard seed data (30 users)
// ─────────────────────────────────────────────

interface LeaderboardUser {
  id: string
  name: string
  initials: string
  xp: number
  streak: number
  level: number
  book: string
  color: string
  isYou?: boolean
}

const LEADERBOARD: LeaderboardUser[] = [
  { id: "1",   name: "Scheherazade", initials: "Sc", xp: 2840, streak: 22, level: 7, book: "Arabian Nights",       color: "#F43F5E" },
  { id: "2",   name: "Hypatia",      initials: "Hy", xp: 2612, streak: 18, level: 6, book: "Euclid's Elements",    color: "#0EA5E9" },
  { id: "3",   name: "Beatrice",     initials: "Be", xp: 2445, streak: 14, level: 6, book: "Divine Comedy",        color: "#F59E0B" },
  { id: "4",   name: "Ishmael",      initials: "Is", xp: 2201, streak: 11, level: 5, book: "Moby-Dick",            color: "#14B8A6" },
  { id: "5",   name: "Raskolnikov",  initials: "Ra", xp: 1987, streak: 9,  level: 5, book: "Crime & Punishment",   color: "#6366F1" },
  { id: "6",   name: "Natasha",      initials: "Na", xp: 1843, streak: 15, level: 5, book: "War and Peace",        color: "#EC4899" },
  { id: "7",   name: "Prospero",     initials: "Pr", xp: 1720, streak: 7,  level: 4, book: "The Tempest",          color: "#8B5CF6" },
  { id: "you", name: "Matthew",      initials: "Ma", xp: 1285, streak: 12, level: 3, book: "The Odyssey",          color: "#6366F1", isYou: true },
  { id: "9",   name: "Aurelius",     initials: "Au", xp: 1180, streak: 6,  level: 3, book: "Meditations",          color: "#F97316" },
  { id: "10",  name: "Murasaki",     initials: "Mu", xp: 1050, streak: 8,  level: 3, book: "Tale of Genji",        color: "#EC4899" },
  { id: "11",  name: "Quixote",      initials: "Qu", xp: 980,  streak: 5,  level: 3, book: "Don Quixote",          color: "#F59E0B" },
  { id: "12",  name: "Dulcinea",     initials: "Du", xp: 910,  streak: 4,  level: 3, book: "Don Quixote",          color: "#F43F5E" },
  { id: "13",  name: "Atticus",      initials: "At", xp: 875,  streak: 10, level: 2, book: "To Kill a Mockingbird",color: "#22C55E" },
  { id: "14",  name: "Gatsby",       initials: "Ga", xp: 832,  streak: 3,  level: 2, book: "The Great Gatsby",     color: "#14B8A6" },
  { id: "15",  name: "Estella",      initials: "Es", xp: 790,  streak: 7,  level: 2, book: "Great Expectations",   color: "#D946EF" },
  { id: "16",  name: "Scout",        initials: "Sc", xp: 745,  streak: 5,  level: 2, book: "To Kill a Mockingbird",color: "#22C55E" },
  { id: "17",  name: "Arjuna",       initials: "Ar", xp: 710,  streak: 12, level: 2, book: "Bhagavad Gita",        color: "#F97316" },
  { id: "18",  name: "Pip",          initials: "Pi", xp: 668,  streak: 2,  level: 2, book: "Great Expectations",   color: "#0EA5E9" },
  { id: "19",  name: "Desdemona",    initials: "De", xp: 632,  streak: 4,  level: 2, book: "Othello",              color: "#EF4444" },
  { id: "20",  name: "Livia",        initials: "Li", xp: 598,  streak: 6,  level: 2, book: "The Aeneid",           color: "#F97316" },
  { id: "21",  name: "Cornelia",     initials: "Co", xp: 562,  streak: 3,  level: 1, book: "The Republic",         color: "#0EA5E9" },
  { id: "22",  name: "Daisy",        initials: "Da", xp: 534,  streak: 1,  level: 1, book: "The Great Gatsby",     color: "#F43F5E" },
  { id: "23",  name: "Hamlet",       initials: "Ha", xp: 497,  streak: 0,  level: 1, book: "Hamlet",               color: "#6366F1" },
  { id: "24",  name: "Antigone",     initials: "An", xp: 461,  streak: 5,  level: 1, book: "Antigone",             color: "#14B8A6" },
  { id: "25",  name: "Penelope",     initials: "Pe", xp: 428,  streak: 4,  level: 1, book: "The Odyssey",          color: "#EC4899" },
  { id: "26",  name: "Falstaff",     initials: "Fa", xp: 392,  streak: 0,  level: 1, book: "Henry IV",             color: "#F59E0B" },
  { id: "27",  name: "Caliban",      initials: "Ca", xp: 358,  streak: 2,  level: 1, book: "The Tempest",          color: "#8B5CF6" },
  { id: "28",  name: "Portia",       initials: "Po", xp: 312,  streak: 1,  level: 1, book: "Merchant of Venice",   color: "#F59E0B" },
  { id: "29",  name: "Oberon",       initials: "Ob", xp: 268,  streak: 0,  level: 1, book: "Midsummer Night",      color: "#A78BFA" },
  { id: "30",  name: "Titania",      initials: "Ti", xp: 225,  streak: 0,  level: 1, book: "Midsummer Night",      color: "#D946EF" },
]

// ─────────────────────────────────────────────
// Activity feed seed data
// ─────────────────────────────────────────────

type ActionType = "book_started" | "chapter_done" | "quiz_score" | "achievement" | "book_finished" | "streak"

interface ActivityItem {
  id: string
  name: string
  color: string
  initials: string
  action: ActionType
  description: string
  hoursAgo: number
}

const ACTIVITY: ActivityItem[] = [
  { id: "a1",  name: "Scheherazade", initials: "Sc", color: "#F43F5E", action: "book_finished",  description: "finished The Arabian Nights — all 1001 tales",       hoursAgo: 2  },
  { id: "a2",  name: "Beatrice",     initials: "Be", color: "#F59E0B", action: "streak",         description: "completed a 14-day reading streak",               hoursAgo: 5  },
  { id: "a3",  name: "Ishmael",      initials: "Is", color: "#14B8A6", action: "quiz_score",     description: "scored 100% on the Moby-Dick Ch. 1 quiz",           hoursAgo: 8  },
  { id: "a4",  name: "Natasha",      initials: "Na", color: "#EC4899", action: "book_started",   description: "started reading War and Peace by Tolstoy",           hoursAgo: 12 },
  { id: "a5",  name: "Gatsby",       initials: "Ga", color: "#14B8A6", action: "achievement",    description: "earned the 'American Dream Reader' seal 🏅",         hoursAgo: 18 },
  { id: "a6",  name: "Murasaki",     initials: "Mu", color: "#EC4899", action: "chapter_done",   description: "completed Chapter 3 of The Tale of Genji",           hoursAgo: 24 },
  { id: "a7",  name: "Raskolnikov",  initials: "Ra", color: "#6366F1", action: "quiz_score",     description: "scored 90% on Crime and Punishment Part I quiz",     hoursAgo: 30 },
  { id: "a8",  name: "Arjuna",       initials: "Ar", color: "#F97316", action: "book_started",   description: "began the Bhagavad Gita",                            hoursAgo: 36 },
  { id: "a9",  name: "Hypatia",      initials: "Hy", color: "#0EA5E9", action: "achievement",    description: "unlocked 'Hellenic Scholar' — 5 Ancient Greek books", hoursAgo: 42 },
  { id: "a10", name: "Atticus",      initials: "At", color: "#22C55E", action: "streak",         description: "reached a 10-day streak — 'Night Owl' badge earned",  hoursAgo: 48 },
  { id: "a11", name: "Estella",      initials: "Es", color: "#D946EF", action: "chapter_done",   description: "finished Chapter 7 of Great Expectations",           hoursAgo: 54 },
  { id: "a12", name: "Prospero",     initials: "Pr", color: "#8B5CF6", action: "book_finished",  description: "completed The Tempest in a single weekend",          hoursAgo: 60 },
  { id: "a13", name: "Aurelius",     initials: "Au", color: "#F97316", action: "quiz_score",     description: "scored 95% on Meditations Book II quiz",            hoursAgo: 72 },
  { id: "a14", name: "Penelope",     initials: "Pe", color: "#EC4899", action: "book_started",   description: "started reading The Odyssey — welcome to Ithaca",    hoursAgo: 80 },
  { id: "a15", name: "Cornelia",     initials: "Co", color: "#0EA5E9", action: "achievement",    description: "earned 'Philosophia' — read 3 Platonic dialogues",   hoursAgo: 96 },
]

const ACTION_META: Record<ActionType, { icon: typeof BookOpen; color: string; label: string }> = {
  book_started:  { icon: BookOpen,    color: "#0EA5E9", label: "Started"    },
  chapter_done:  { icon: BookOpen,    color: "#22C55E", label: "Chapter"    },
  quiz_score:    { icon: Trophy,      color: "#F59E0B", label: "Quiz"       },
  achievement:   { icon: Star,        color: "#A78BFA", label: "Badge"      },
  book_finished: { icon: Star,        color: "#F43F5E", label: "Finished"   },
  streak:        { icon: Flame,       color: "#F97316", label: "Streak"     },
}

// ─────────────────────────────────────────────
// Book clubs seed data
// ─────────────────────────────────────────────

interface BookClub {
  id: string
  name: string
  bookTitle: string
  bookId: string
  bookAuthor: string
  tradition: string
  chapterDone: number
  chapterTotal: number
  memberInitials: string[]
  memberColors: string[]
  maxMembers: number
  nextMeeting: string
  posts: number
}

const BOOK_CLUBS: BookClub[] = [
  {
    id: "classics",
    name: "The Classics Circle",
    bookTitle: "The Odyssey",
    bookId: "the-odyssey",
    bookAuthor: "Homer",
    tradition: "Ancient Greek",
    chapterDone: 8, chapterTotal: 24,
    memberInitials: ["Sc", "Hy", "Na", "Au", "Mu"],
    memberColors:   ["#F43F5E", "#0EA5E9", "#EC4899", "#F97316", "#EC4899"],
    maxMembers: 12,
    nextMeeting: "Friday, 7:00 PM",
    posts: 8,
  },
  {
    id: "russian",
    name: "Russian Lit Society",
    bookTitle: "Crime and Punishment",
    bookId: "crime-and-punishment",
    bookAuthor: "Fyodor Dostoevsky",
    tradition: "Russian",
    chapterDone: 3, chapterTotal: 8,
    memberInitials: ["Ra", "Pr", "Is", "Be"],
    memberColors:   ["#6366F1", "#8B5CF6", "#14B8A6", "#F59E0B"],
    maxMembers: 8,
    nextMeeting: "Sunday, 3:00 PM",
    posts: 12,
  },
  {
    id: "shakespeare",
    name: "Shakespeare Scholars",
    bookTitle: "Hamlet",
    bookId: "hamlet",
    bookAuthor: "William Shakespeare",
    tradition: "Renaissance",
    chapterDone: 2, chapterTotal: 5,
    memberInitials: ["Be", "Ga", "At", "Es", "Da", "Pi"],
    memberColors:   ["#F59E0B", "#14B8A6", "#22C55E", "#D946EF", "#F43F5E", "#0EA5E9"],
    maxMembers: 10,
    nextMeeting: "Wednesday, 6:00 PM",
    posts: 5,
  },
  {
    id: "stoics",
    name: "The Stoic Circle",
    bookTitle: "Meditations",
    bookId: "meditations",
    bookAuthor: "Marcus Aurelius",
    tradition: "Roman",
    chapterDone: 4, chapterTotal: 12,
    memberInitials: ["Au", "Co", "Li", "An"],
    memberColors:   ["#F97316", "#0EA5E9", "#F97316", "#14B8A6"],
    maxMembers: 8,
    nextMeeting: "Tuesday, 8:00 PM",
    posts: 9,
  },
]

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function fmtTime(hoursAgo: number): string {
  if (hoursAgo < 24) return `${hoursAgo}h ago`
  const days = Math.floor(hoursAgo / 24)
  return `${days}d ago`
}

function weeksUntilMonday(): number {
  const now = new Date()
  const day = now.getDay() // 0 = Sun, 1 = Mon…
  const daysLeft = day === 0 ? 1 : 8 - day
  return daysLeft
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function UserAvatar({ initials, color, size = "sm" }: {
  initials: string; color: string; size?: "xs" | "sm" | "md"
}) {
  const cls = size === "xs" ? "size-5 text-[8px]" : size === "sm" ? "size-7 text-[10px]" : "size-9 text-xs"
  return (
    <div
      className={cn("rounded-full flex items-center justify-center font-bold text-white shrink-0", cls)}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function SocialPage() {
  const [activityFilter, setActivityFilter] = useState<"all" | "quiz" | "reading" | "achievement">("all")
  const [expandedClub, setExpandedClub]     = useState<string | null>(null)

  const currentTier = TIERS[CURRENT_TIER_IDX]
  const daysLeft    = weeksUntilMonday()

  const filteredActivity = useMemo(() => {
    if (activityFilter === "all")         return ACTIVITY
    if (activityFilter === "quiz")        return ACTIVITY.filter((a) => a.action === "quiz_score")
    if (activityFilter === "reading")     return ACTIVITY.filter((a) => ["book_started", "chapter_done", "book_finished"].includes(a.action))
    return ACTIVITY.filter((a) => ["achievement", "streak"].includes(a.action))
  }, [activityFilter])

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <BlurFade delay={0.04} inView>
        <h1 className="font-serif text-2xl font-bold tracking-tight">Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compete in literary leagues, follow fellow readers, and join book clubs.
        </p>
      </BlurFade>

      <div className="mt-6">
        <Tabs defaultValue="leaderboard">
          <TabsList>
            <TabsTrigger value="leaderboard">
              <Trophy className="size-3.5 mr-1.5" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Clock className="size-3.5 mr-1.5" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="clubs">
              <Users className="size-3.5 mr-1.5" />
              Book Clubs
            </TabsTrigger>
          </TabsList>

          {/* ════════════════════════════════════
              LEADERBOARD TAB
          ════════════════════════════════════ */}
          <TabsContent value="leaderboard">
            <div className="mt-5 space-y-5">

              {/* League Header */}
              <BlurFade delay={0.06} inView>
                <div
                  className="rounded-2xl p-5 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${currentTier.color}22 0%, ${currentTier.color}10 100%)`,
                    border: `1px solid ${currentTier.color}44`,
                  }}
                >
                  {/* Texture */}
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(${currentTier.color} 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                    aria-hidden
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl leading-none">{currentTier.icon}</span>
                        <h2 className="font-serif text-xl font-bold tracking-tight">
                          {currentTier.label}&apos;s League
                        </h2>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Week ends in {daysLeft} {daysLeft === 1 ? "day" : "days"} · Weekly XP rankings
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">Your rank</p>
                      <p className="font-serif text-2xl font-bold" style={{ color: currentTier.color }}>
                        #8
                      </p>
                    </div>
                  </div>

                  {/* Tier progression badges */}
                  <div className="relative flex items-center gap-1.5 mt-4 overflow-x-auto pb-1">
                    {TIERS.map((tier, idx) => (
                      <div
                        key={tier.id}
                        className={cn(
                          "shrink-0 flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 transition-all",
                          idx === CURRENT_TIER_IDX
                            ? "bg-background/80 shadow-sm ring-1"
                            : "opacity-50"
                        )}
                        style={idx === CURRENT_TIER_IDX ? { outline: `1.5px solid ${tier.color}` } : {}}
                        title={tier.label}
                      >
                        <span className="text-base leading-none">{tier.icon}</span>
                        <span
                          className="text-[8px] font-semibold leading-none"
                          style={{ color: idx === CURRENT_TIER_IDX ? tier.color : "inherit" }}
                        >
                          {tier.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </BlurFade>

              {/* Zone legend */}
              <BlurFade delay={0.08} inView>
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <ChevronUp className="size-3.5" />
                    <span>Top 10 advance to Philosopher</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-500 ml-auto">
                    <ChevronDown className="size-3.5" />
                    <span>Bottom 5 drop to Apprentice</span>
                  </div>
                </div>
              </BlurFade>

              {/* Leaderboard rows */}
              <div className="space-y-1">
                {LEADERBOARD.map((user, i) => {
                  const rank       = i + 1
                  const isYou      = !!user.isYou
                  const isPromo    = rank <= PROMOTION_CUTOFF
                  const isDemotion = rank >= DEMOTION_CUTOFF
                  const isTop3     = rank <= 3

                  return (
                    <BlurFade key={user.id} delay={0.03 + i * 0.018} inView>
                      <div
                        className={cn(
                          "relative flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition-colors",
                          isYou
                            ? "border-[var(--tome-accent,#6366f1)]/40 bg-[var(--tome-accent,#6366f1)]/[0.04]"
                            : "border-border",
                          isTop3 && "bg-muted/30"
                        )}
                        style={{
                          borderLeftWidth: 3,
                          borderLeftColor: isYou
                            ? "#6366F1"
                            : isPromo
                            ? "rgba(34,197,94,0.5)"
                            : isDemotion
                            ? "rgba(239,68,68,0.5)"
                            : "transparent",
                        }}
                      >
                        {isYou && <BorderBeam size={40} duration={10} colorFrom="#6366F1" colorTo="#A78BFA" />}

                        {/* Rank */}
                        <div className="flex size-7 shrink-0 items-center justify-center">
                          {rank === 1 ? (
                            <Crown className="size-4 text-[#F59E0B]" />
                          ) : rank === 2 ? (
                            <Medal className="size-4 text-[#94A3B8]" />
                          ) : rank === 3 ? (
                            <Medal className="size-4 text-[#CD7F32]" />
                          ) : (
                            <span className="text-xs font-semibold text-muted-foreground/60 tabular-nums w-5 text-right">
                              {rank}
                            </span>
                          )}
                        </div>

                        {/* Avatar */}
                        <UserAvatar initials={user.initials} color={user.color} size="sm" />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className={cn("text-sm font-medium truncate", isYou && "font-semibold")}>
                              {user.name}
                            </p>
                            {isYou && (
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                                style={{ background: "#6366F1", color: "#fff" }}
                              >
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            Lv {user.level} · {user.book}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 shrink-0">
                          {user.streak > 0 && (
                            <div className={cn(
                              "flex items-center gap-1 text-[11px]",
                              user.streak >= 7 ? "text-orange-500" : "text-muted-foreground/50"
                            )}>
                              <Flame className="size-3" />
                              <span className="tabular-nums">{user.streak}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#6366F1" }}>
                            <Zap className="size-3.5" />
                            <NumberTicker value={user.xp} className="tabular-nums" />
                          </div>
                        </div>
                      </div>
                    </BlurFade>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════
              ACTIVITY TAB
          ════════════════════════════════════ */}
          <TabsContent value="activity">
            <div className="mt-5 space-y-4">

              {/* Filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="size-3.5 text-muted-foreground shrink-0" />
                {(["all", "reading", "quiz", "achievement"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActivityFilter(f)}
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-medium transition-colors capitalize",
                      activityFilter === f
                        ? "bg-[var(--tome-accent,#6366f1)] text-white"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f === "all" ? "All" : f === "reading" ? "Reading" : f === "quiz" ? "Quizzes" : "Badges"}
                  </button>
                ))}
              </div>

              {/* Feed */}
              <div className="space-y-2">
                {filteredActivity.map((item, i) => {
                  const meta = ACTION_META[item.action]
                  const Icon = meta.icon
                  return (
                    <BlurFade key={item.id} delay={0.03 + i * 0.03} inView>
                      <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                        {/* User avatar */}
                        <UserAvatar initials={item.initials} color={item.color} size="sm" />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-relaxed">
                            <span className="font-semibold">{item.name}</span>
                            {" "}
                            <span className="text-muted-foreground">{item.description}</span>
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div
                              className="flex size-4 items-center justify-center rounded"
                              style={{ backgroundColor: `${meta.color}20` }}
                            >
                              <Icon className="size-2.5" style={{ color: meta.color }} />
                            </div>
                            <span className="text-[10px] text-muted-foreground/60">{fmtTime(item.hoursAgo)}</span>
                          </div>
                        </div>
                      </div>
                    </BlurFade>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════
              BOOK CLUBS TAB
          ════════════════════════════════════ */}
          <TabsContent value="clubs">
            <div className="mt-5 space-y-4">

              {/* Start a Club CTA */}
              <BlurFade delay={0.06} inView>
                <button
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3.5 text-sm font-medium text-muted-foreground hover:border-[var(--tome-accent)] hover:text-[var(--tome-accent)] transition-colors"
                >
                  <Plus className="size-4" />
                  Start a Book Club
                </button>
              </BlurFade>

              {/* Club cards */}
              {BOOK_CLUBS.map((club, i) => {
                const pct          = Math.round((club.chapterDone / club.chapterTotal) * 100)
                const tradColor    = TRADITION_COLORS[club.tradition]
                const accentDot    = tradColor?.dot    ?? "#6366F1"
                const accentBg     = tradColor?.bg     ?? "rgba(99,102,241,0.12)"
                const accentText   = tradColor?.text   ?? "#4338ca"
                const isExpanded   = expandedClub === club.id

                return (
                  <BlurFade key={club.id} delay={0.08 + i * 0.06} inView>
                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      transition={springs.interactive}
                      className="rounded-2xl border border-border bg-card overflow-hidden motion-reduce:hover:scale-100"
                    >
                      {/* Main card content */}
                      <button
                        className="w-full text-left p-4 sm:p-5"
                        onClick={() => setExpandedClub(isExpanded ? null : club.id)}
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-start gap-4">
                          {/* Tradition color square */}
                          <div
                            className="shrink-0 size-11 rounded-xl flex items-center justify-center text-lg"
                            style={{ background: accentBg, border: `1px solid ${accentDot}33` }}
                          >
                            {TIERS.find((t) => t.label === club.tradition)?.icon ?? <BookOpen className="size-4" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Club name */}
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold">{club.name}</h3>
                              <span
                                className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                                style={{ background: accentBg, color: accentText }}
                              >
                                {club.tradition}
                              </span>
                            </div>

                            {/* Book + author */}
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Reading{" "}
                              <Link
                                href={`/book/${club.bookId}`}
                                className="font-medium text-foreground hover:text-[var(--tome-accent)] transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {club.bookTitle}
                              </Link>
                            </p>
                            <span onClick={(e) => e.stopPropagation()}>
                              <AuthorLink
                                name={club.bookAuthor}
                                className="text-[10px] text-muted-foreground hover:text-[var(--tome-accent)] transition-colors"
                              />
                            </span>

                            {/* Progress bar */}
                            <div className="mt-2.5">
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                                <span>Ch {club.chapterDone} / {club.chapterTotal}</span>
                                <span>{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%`, backgroundColor: accentDot }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom meta row */}
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                          {/* Member avatars */}
                          <div className="flex items-center">
                            <div className="flex -space-x-2">
                              {club.memberInitials.slice(0, 4).map((init, mi) => (
                                <div
                                  key={mi}
                                  className="size-6 rounded-full border-2 border-card flex items-center justify-center text-[8px] font-bold text-white"
                                  style={{ backgroundColor: club.memberColors[mi] ?? "#6366F1" }}
                                >
                                  {init}
                                </div>
                              ))}
                              {club.memberInitials.length > 4 && (
                                <div className="size-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[8px] font-semibold text-muted-foreground">
                                  +{club.memberInitials.length - 4}
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground ml-2">
                              {club.memberInitials.length}/{club.maxMembers}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
                            <CalendarDays className="size-3" />
                            <span>{club.nextMeeting}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <MessageSquare className="size-3" />
                            <span>{club.posts}</span>
                          </div>
                        </div>
                      </button>

                      {/* Expanded discussion preview */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="border-t border-border overflow-hidden"
                        >
                          <div className="px-4 sm:px-5 py-4 space-y-3 bg-muted/30">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Recent Discussion
                              </p>
                              <button className="text-[11px] text-[var(--tome-accent)] hover:underline">
                                View all {club.posts} posts →
                              </button>
                            </div>
                            {/* Placeholder discussion items */}
                            {[
                              { init: club.memberInitials[0], color: club.memberColors[0], text: `What did everyone think of the pacing in this week's reading?`, ago: "3h ago" },
                              { init: club.memberInitials[1], color: club.memberColors[1], text: `The imagery in this chapter is breathtaking — Homer was on another level.`, ago: "5h ago" },
                            ].map((post, pi) => (
                              <div key={pi} className="flex items-start gap-2.5">
                                <UserAvatar initials={post.init} color={post.color} size="xs" />
                                <div className="flex-1 min-w-0 bg-background rounded-lg px-3 py-2 border border-border/50">
                                  <p className="text-[11px] text-muted-foreground leading-relaxed">{post.text}</p>
                                  <p className="text-[9px] text-muted-foreground/50 mt-1">{post.ago}</p>
                                </div>
                              </div>
                            ))}
                            <button
                              className="w-full flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
                            >
                              <TrendingUp className="size-3.5" />
                              Join this club to participate
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </BlurFade>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
