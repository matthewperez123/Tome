"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Crown, Medal, Trophy, Flame, Zap,
  BookOpen, Star, Users, Clock, Filter,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { AnimatedList } from "@/components/ui/animated-list"
import { BorderBeam } from "@/components/ui/border-beam"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────

type LeaderboardEntry = {
  id: string
  username: string
  weekly_xp: number
  streak: number
  current_book: string | null
}

type ActivityItem = {
  id: string
  username: string
  action_type: string
  description: string
  created_at: string
}

type BookClub = {
  id: string
  name: string
  description: string | null
  member_count: number
  cover_color: string
}

const ACTION_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  book_started: { icon: <BookOpen className="size-3.5" />, color: "var(--tome-sky)" },
  chapter_completed: { icon: <BookOpen className="size-3.5" />, color: "var(--tome-emerald)" },
  quiz_score: { icon: <Trophy className="size-3.5" />, color: "var(--tome-amber)" },
  achievement: { icon: <Star className="size-3.5" />, color: "var(--tome-violet)" },
  book_finished: { icon: <Star className="size-3.5" />, color: "var(--tome-fuchsia)" },
}

const RANK_ICONS = [
  <Crown key="1" className="size-4 text-[var(--tome-amber)]" />,
  <Medal key="2" className="size-4 text-[#C0C0C0]" />,
  <Medal key="3" className="size-4 text-[#CD7F32]" />,
]

// ── Page ───────────────────────────────────────

export default function SocialPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [clubs, setClubs] = useState<BookClub[]>([])
  const [activityFilter, setActivityFilter] = useState<"all" | "quiz" | "reading">("all")

  useEffect(() => {
    async function fetchData() {
      const [lb, act, cl] = await Promise.all([
        supabase.from("leaderboard").select("*").order("weekly_xp", { ascending: false }).limit(15),
        supabase.from("community_activity").select("*").order("created_at", { ascending: false }).limit(20),
        supabase.from("book_clubs").select("*").order("member_count", { ascending: false }),
      ])
      if (lb.data) setLeaderboard(lb.data as LeaderboardEntry[])
      if (act.data) setActivity(act.data as ActivityItem[])
      if (cl.data) setClubs(cl.data as BookClub[])
    }
    fetchData()

    // Real-time subscription for leaderboard updates
    const channel = supabase
      .channel("leaderboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leaderboard" }, () => {
        supabase.from("leaderboard").select("*").order("weekly_xp", { ascending: false }).limit(15)
          .then(({ data }) => { if (data) setLeaderboard(data as LeaderboardEntry[]) })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const filteredActivity = activityFilter === "all"
    ? activity
    : activityFilter === "quiz"
      ? activity.filter(a => a.action_type === "quiz_score")
      : activity.filter(a => ["book_started", "chapter_completed", "book_finished"].includes(a.action_type))

  return (
    <div className="p-4 md:p-6">
      <BlurFade delay={0.05} inView>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl" style={{ letterSpacing: "-0.02em" }}>
          Community
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          See how you compare and connect with fellow readers.
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

          {/* ── Leaderboard Tab ── */}
          <TabsContent value="leaderboard">
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">
                  Weekly XP rankings · Resets every Monday
                </p>
              </div>

              <div className="space-y-1.5">
                {leaderboard.map((entry, i) => {
                  const isCurrentUser = entry.username === "you"
                  return (
                    <BlurFade key={entry.id} delay={0.03 * i} inView>
                      <div
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors",
                          i < 3 && "bg-[var(--tome-surface-elevated)]",
                          isCurrentUser && "border-[var(--tome-accent)]/30"
                        )}
                      >
                        {isCurrentUser && <BorderBeam size={40} duration={8} />}

                        {/* Rank */}
                        <div className="flex size-8 shrink-0 items-center justify-center">
                          {i < 3 ? (
                            RANK_ICONS[i]
                          ) : (
                            <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                              {i + 1}
                            </span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div
                          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                          style={{
                            backgroundColor: `hsl(${(i * 37) % 360}, 60%, ${i < 3 ? "50%" : "65%"})`,
                          }}
                        >
                          {entry.username.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{entry.username}</p>
                          {entry.current_book && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              Reading: {entry.current_book}
                            </p>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="flex items-center gap-1 text-xs">
                            <Flame className={cn("size-3.5", entry.streak >= 7 ? "text-[var(--tome-coral)]" : "text-muted-foreground")} />
                            <span className="tabular-nums">{entry.streak}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="size-3.5 text-[var(--tome-accent)]" />
                            <NumberTicker
                              value={entry.weekly_xp}
                              className="text-sm font-semibold tabular-nums"
                            />
                          </div>
                        </div>
                      </div>
                    </BlurFade>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          {/* ── Activity Tab ── */}
          <TabsContent value="activity">
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="size-3.5 text-muted-foreground" />
                {(["all", "quiz", "reading"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActivityFilter(f)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors",
                      activityFilter === f
                        ? "bg-[var(--tome-accent)] text-white"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f === "all" ? "All" : f === "quiz" ? "Quizzes" : "Reading"}
                  </button>
                ))}
              </div>

              <div className="relative min-h-[300px] overflow-hidden">
                <AnimatedList delay={2000}>
                  {filteredActivity.map((item) => {
                    const actionInfo = ACTION_ICONS[item.action_type] ?? ACTION_ICONS.book_started
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                      >
                        <div
                          className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${actionInfo.color} 12%, transparent)`,
                            color: actionInfo.color,
                          }}
                        >
                          {actionInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs">
                            <span className="font-semibold">{item.username}</span>
                            <span className="text-muted-foreground"> · {item.description}</span>
                          </p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">
                            {formatTime(item.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </AnimatedList>
              </div>
            </div>
          </TabsContent>

          {/* ── Book Clubs Tab ── */}
          <TabsContent value="clubs">
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {clubs.map((club, i) => (
                <BlurFade key={club.id} delay={0.05 * i} inView>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={springs.interactive}
                    className="flex gap-4 rounded-xl border border-border bg-card p-4 cursor-pointer motion-reduce:hover:scale-100"
                  >
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: club.cover_color }}
                    >
                      <Users className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate">{club.name}</h3>
                      {club.description && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                          {club.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                        <Users className="size-3" />
                        <span>{club.member_count} members</span>
                      </div>
                    </div>
                  </motion.div>
                </BlurFade>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
