"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Flame, Heart, Zap, BookOpen, Trophy, Clock,
  ChevronRight, Star,
} from "lucide-react"
import { useEconomy } from "@/components/tome/economy-provider"
import { supabase, type Book } from "@/lib/supabase"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar"
import { AnimatedList } from "@/components/ui/animated-list"
import { BorderBeam } from "@/components/ui/border-beam"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { BookCover, getCoverParams } from "@/components/tome/book-cover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── Activity Feed Types ────────────────────────

type Activity = {
  id: string
  icon: React.ReactNode
  text: string
  time: string
  color: string
}

const SAMPLE_ACTIVITIES: Activity[] = [
  { id: "1", icon: <BookOpen className="size-3.5" />, text: "Read 3 chapters of Pride and Prejudice", time: "2h ago", color: "var(--tome-emerald)" },
  { id: "2", icon: <Trophy className="size-3.5" />, text: "Quiz score: 9/10 on The Odyssey", time: "5h ago", color: "var(--tome-amber)" },
  { id: "3", icon: <Flame className="size-3.5" />, text: "7-day streak achieved!", time: "1d ago", color: "var(--tome-coral)" },
  { id: "4", icon: <Star className="size-3.5" />, text: "Finished The Metamorphosis", time: "2d ago", color: "var(--tome-violet)" },
  { id: "5", icon: <BookOpen className="size-3.5" />, text: "Started Crime and Punishment", time: "3d ago", color: "var(--tome-blue)" },
]

export default function DashboardPage() {
  const { stats, level, dailyGoalMet } = useEconomy()
  const [suggestedBook, setSuggestedBook] = useState<Book | null>(null)
  const [currentBook, setCurrentBook] = useState<Book | null>(null)

  // Fetch a suggested book and a "currently reading" book
  useEffect(() => {
    async function fetchBooks() {
      const { data: suggested } = await supabase
        .from("books")
        .select("*")
        .eq("content_available", true)
        .limit(1)
        .order("title")

      const { data: current } = await supabase
        .from("books")
        .select("*")
        .eq("content_available", true)
        .eq("tradition", "Victorian")
        .limit(1)

      if (suggested?.[0]) setSuggestedBook(suggested[0] as Book)
      if (current?.[0]) setCurrentBook(current[0] as Book)
    }
    fetchBooks()
  }, [])

  const dailyPercent = Math.min(
    100,
    Math.round((stats.daily_progress_minutes / stats.daily_goal_minutes) * 100)
  )

  return (
    <div className="relative min-h-full p-4 md:p-6">
      {/* Background Grid */}
      <AnimatedGridPattern
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
        width={40}
        height={40}
        numSquares={30}
        maxOpacity={0.3}
      />

      <div className="relative z-10">
        <BlurFade delay={0.05} inView>
          <h1
            className="text-xl font-semibold tracking-tight md:text-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Level {level.level} · {stats.xp_total} XP
          </p>
        </BlurFade>

        {/* ── Bento Grid ── */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">

          {/* Daily Goal Ring */}
          <BlurFade delay={0.1} inView>
            <BentoCard className="col-span-1 flex flex-col items-center justify-center py-5">
              <AnimatedCircularProgressBar
                value={dailyPercent}
                gaugePrimaryColor="var(--tome-amber)"
                gaugeSecondaryColor="var(--tome-surface-recessed)"
                className="size-20 text-base"
              />
              <p className="mt-2 text-[10px] font-medium text-muted-foreground">
                {stats.daily_progress_minutes}/{stats.daily_goal_minutes} min
              </p>
              <p className="text-[9px] text-muted-foreground/60">
                {dailyGoalMet ? "Goal met!" : "Daily goal"}
              </p>
            </BentoCard>
          </BlurFade>

          {/* Streak */}
          <BlurFade delay={0.15} inView>
            <BentoCard className="col-span-1 flex flex-col items-center justify-center py-5">
              <div className="flex items-baseline gap-1">
                <NumberTicker value={stats.current_streak} className="text-3xl font-bold" />
                {stats.current_streak >= 7 && <span className="text-lg">🔥</span>}
              </div>
              <p className="mt-1 text-[10px] font-medium text-muted-foreground">
                Day streak
              </p>
              <p className="text-[9px] text-muted-foreground/60">
                Best: {stats.longest_streak}
              </p>
            </BentoCard>
          </BlurFade>

          {/* XP */}
          <BlurFade delay={0.2} inView>
            <BentoCard className="col-span-1 flex flex-col items-center justify-center py-5">
              <div className="flex items-center gap-1.5">
                <Zap className="size-4 text-[var(--tome-accent)]" />
                <NumberTicker value={stats.xp_total} className="text-2xl font-bold" />
              </div>
              <p className="mt-1 text-[10px] font-medium text-muted-foreground">
                Total XP
              </p>
              {/* XP progress to next level */}
              <div className="mt-1.5 h-1 w-16 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[var(--tome-accent)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(level.xpInLevel / level.xpForNext) * 100}%` }}
                  transition={springs.gentle}
                />
              </div>
            </BentoCard>
          </BlurFade>

          {/* Hearts */}
          <BlurFade delay={0.25} inView>
            <BentoCard className="col-span-1 flex flex-col items-center justify-center py-5">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={cn(
                      "size-5 transition-colors",
                      i < stats.hearts
                        ? "fill-[var(--tome-red)] text-[var(--tome-red)]"
                        : "text-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
              <p className="mt-2 text-[10px] font-medium text-muted-foreground">
                {stats.hearts}/5 Hearts
              </p>
              <p className="text-[9px] text-muted-foreground/60">
                {stats.coins} coins
              </p>
            </BentoCard>
          </BlurFade>

          {/* Currently Reading — wide card */}
          {currentBook && (
            <BlurFade delay={0.3} inView>
              <BentoCard className="col-span-2 relative overflow-hidden">
                <BorderBeam
                  size={60}
                  duration={10}
                  colorFrom={getCoverParams(currentBook).primaryColor}
                  colorTo={getCoverParams(currentBook).secondaryColor}
                />
                <div className="flex gap-4">
                  <div className="w-16 shrink-0">
                    <BookCover {...getCoverParams(currentBook)} className="w-full" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Currently reading
                    </p>
                    <h3 className="text-sm font-semibold truncate mt-0.5">
                      {currentBook.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">{currentBook.author}</p>

                    {/* Progress bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: getCoverParams(currentBook).primaryColor }}
                          initial={{ width: 0 }}
                          animate={{ width: "35%" }}
                          transition={springs.gentle}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground tabular-nums">35%</span>
                    </div>

                    <Link href={`/read/${currentBook.id}`}>
                      <Button size="xs" className="mt-2 text-[10px]">
                        Continue Reading
                        <ChevronRight className="size-3 ml-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </BentoCard>
            </BlurFade>
          )}

          {/* Activity Feed — tall card */}
          <BlurFade delay={0.35} inView>
            <BentoCard className="col-span-2 md:row-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="size-3.5 text-muted-foreground" />
                <h3 className="text-xs font-medium">Recent Activity</h3>
              </div>
              <div className="relative h-48 overflow-hidden">
                <AnimatedList delay={3000}>
                  {SAMPLE_ACTIVITIES.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-2.5 rounded-md border border-border bg-[var(--tome-surface-elevated)] p-2.5"
                    >
                      <div
                        className="flex size-6 shrink-0 items-center justify-center rounded-md"
                        style={{ backgroundColor: `color-mix(in srgb, ${activity.color} 12%, transparent)`, color: activity.color }}
                      >
                        {activity.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium truncate">{activity.text}</p>
                        <p className="text-[9px] text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </AnimatedList>
              </div>
            </BentoCard>
          </BlurFade>

          {/* Suggested Next Book */}
          {suggestedBook && (
            <BlurFade delay={0.4} inView>
              <BentoCard className="col-span-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Suggested for you
                </p>
                <div className="flex gap-3">
                  <div className="w-14 shrink-0">
                    <BookCover {...getCoverParams(suggestedBook)} className="w-full" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="text-sm font-semibold truncate">{suggestedBook.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{suggestedBook.author}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {suggestedBook.tradition} · {suggestedBook.difficulty}
                    </p>
                    <Link href={`/read/${suggestedBook.id}`}>
                      <Button variant="ghost" size="xs" className="mt-1.5 text-[10px]">
                        Start Reading
                      </Button>
                    </Link>
                  </div>
                </div>
              </BentoCard>
            </BlurFade>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Bento Card ─────────────────────────────────

function BentoCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-shadow duration-[var(--tome-duration-fast)] hover:shadow-sm",
        className
      )}
    >
      {children}
    </div>
  )
}
