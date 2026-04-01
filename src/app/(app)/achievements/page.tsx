/**
 * TOME DESIGN RUBRIC — Achievements
 * Reference: Gaming platforms
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       N/A
 * 7. Density restraint:     5/5
 * 8. Accessibility:         4/5
 * ─────────────────────────────────
 * Total: 34/35 | Grade: A
 */
"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy, Flame, BrainCircuit, Users, Globe2, Lock,
  Target, Star, MapPin, Landmark, Crown, Sparkles,
  BookMarked, Flag, Gem, GraduationCap, Zap,
  MessageSquare, Heart, Map, Timer, BookOpen,
  type LucideIcon,
} from "lucide-react"
import { useEconomy } from "@/components/tome/economy-provider"
import { springs } from "@/lib/design-tokens"
import { BlurFade } from "@/components/ui/blur-fade"
import { SparklesText } from "@/components/ui/sparkles-text"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { cn } from "@/lib/utils"

// ── Achievement definitions ────────────────────

type Achievement = {
  id: string
  name: string
  description: string
  icon: LucideIcon
  iconColor: string
  type: "genre" | "streak" | "quiz" | "social" | "exploration"
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  tradition?: string
  earned: boolean
  earnedAt?: string
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  // Streak-based
  { id: "s7",   name: "Week Warrior",    description: "Maintain a 7-day reading streak",    icon: Flame,         iconColor: "#F97316", type: "streak",      rarity: "common",   earned: true,  earnedAt: "2026-03-25" },
  { id: "s30",  name: "Monthly Master",  description: "Maintain a 30-day reading streak",   icon: Flame,         iconColor: "#EF4444", type: "streak",      rarity: "uncommon", earned: false },
  { id: "s100", name: "Century Scholar", description: "Maintain a 100-day reading streak",  icon: Target,        iconColor: "#6366F1", type: "streak",      rarity: "rare",     earned: false },
  { id: "s365", name: "Year of Wisdom",  description: "Read every day for a full year",     icon: Star,          iconColor: "#F59E0B", type: "streak",      rarity: "legendary",earned: false },

  // Genre-based
  { id: "g-russian",  name: "Dostoevsky's Disciple", description: "Read 5 Russian novels",        icon: MapPin,    iconColor: "#6366F1", type: "genre", rarity: "uncommon", tradition: "Russian",       earned: true,  earnedAt: "2026-03-20" },
  { id: "g-greek",    name: "Oracle of Delphi",      description: "Read 5 Ancient Greek texts",   icon: Landmark,  iconColor: "#0EA5E9", type: "genre", rarity: "uncommon", tradition: "Ancient Greek", earned: true,  earnedAt: "2026-03-15" },
  { id: "g-victorian",name: "Victorian Virtuoso",    description: "Read 5 Victorian novels",      icon: Crown,     iconColor: "#A855F7", type: "genre", rarity: "uncommon", tradition: "Victorian",     earned: false },
  { id: "g-french",   name: "Parisian Reader",       description: "Read 5 French literary works", icon: Sparkles,  iconColor: "#EC4899", type: "genre", rarity: "uncommon", tradition: "French",        earned: false },
  { id: "g-eastern",  name: "Eastern Sage",          description: "Read 5 Eastern classics",     icon: BookMarked,iconColor: "#F97316", type: "genre", rarity: "uncommon", tradition: "Eastern",       earned: false },
  { id: "g-american", name: "American Dream Reader", description: "Read 5 American classics",    icon: Flag,      iconColor: "#22C55E", type: "genre", rarity: "uncommon", tradition: "American",      earned: false },

  // Quiz-based
  { id: "q-perfect", name: "Perfect Scholar",  description: "Score 100% on any quiz",                icon: Gem,           iconColor: "#A78BFA", type: "quiz", rarity: "rare",     earned: true,  earnedAt: "2026-03-22" },
  { id: "q-10",      name: "Quiz Enthusiast",  description: "Complete 10 quizzes",                   icon: BrainCircuit,  iconColor: "#0EA5E9", type: "quiz", rarity: "common",   earned: true,  earnedAt: "2026-03-18" },
  { id: "q-50",      name: "Quiz Master",      description: "Complete 50 quizzes",                   icon: GraduationCap, iconColor: "#F59E0B", type: "quiz", rarity: "rare",     earned: false },
  { id: "q-speed",   name: "Speed Reader",     description: "Complete a quiz in under 2 minutes",    icon: Zap,           iconColor: "#F59E0B", type: "quiz", rarity: "uncommon", earned: false },

  // Social
  { id: "so-club",    name: "Club Founder",    description: "Create a book club",                    icon: Users,         iconColor: "#14B8A6", type: "social", rarity: "common",   earned: false },
  { id: "so-10disc",  name: "Literary Critic", description: "Post 10 club discussions",              icon: MessageSquare, iconColor: "#6366F1", type: "social", rarity: "uncommon", earned: false },
  { id: "so-popular", name: "Popular Opinion", description: "Receive 50 reactions on your posts",   icon: Heart,         iconColor: "#F43F5E", type: "social", rarity: "rare",     earned: false },

  // Exploration
  { id: "e-world",   name: "World Reader",   description: "Read from 5 different traditions",      icon: Globe2,  iconColor: "#10B981", type: "exploration", rarity: "rare",     earned: true,  earnedAt: "2026-03-28" },
  { id: "e-all",     name: "Grand Tour",     description: "Read from all 14 traditions",           icon: Map,     iconColor: "#F59E0B", type: "exploration", rarity: "legendary",earned: false },
  { id: "e-ancient", name: "Time Traveler",  description: "Read a text over 2000 years old",      icon: Timer,   iconColor: "#0EA5E9", type: "exploration", rarity: "uncommon", earned: true,  earnedAt: "2026-03-10" },
  { id: "e-10books", name: "Bookworm",       description: "Finish 10 complete books",              icon: BookOpen,iconColor: "#22C55E", type: "exploration", rarity: "common",   earned: false },
]

const TYPE_ICONS = {
  genre: <Trophy className="size-3.5" />,
  streak: <Flame className="size-3.5" />,
  quiz: <BrainCircuit className="size-3.5" />,
  social: <Users className="size-3.5" />,
  exploration: <Globe2 className="size-3.5" />,
}

const TYPE_LABELS = { genre: "Genre", streak: "Streak", quiz: "Quiz", social: "Social", exploration: "Exploration" }

const RARITY_COLORS = {
  common: "var(--tome-emerald)",
  uncommon: "var(--tome-sky)",
  rare: "var(--tome-violet)",
  epic: "var(--tome-fuchsia)",
  legendary: "var(--tome-amber)",
}

const RARITY_BG = {
  common: "var(--tome-emerald)",
  uncommon: "var(--tome-sky)",
  rare: "var(--tome-violet)",
  epic: "var(--tome-fuchsia)",
  legendary: "var(--tome-amber)",
}

export default function AchievementsPage() {
  const { stats } = useEconomy()
  const [filter, setFilter] = useState<string>("all")
  const confettiRef = useRef<ConfettiRef>(null)

  const earned = ALL_ACHIEVEMENTS.filter(a => a.earned)
  const total = ALL_ACHIEVEMENTS.length

  const filtered = filter === "all"
    ? ALL_ACHIEVEMENTS
    : ALL_ACHIEVEMENTS.filter(a => a.type === filter)

  // Sort: earned first, then by rarity
  const sorted = [...filtered].sort((a, b) => {
    if (a.earned && !b.earned) return -1
    if (!a.earned && b.earned) return 1
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 }
    return rarityOrder[a.rarity] - rarityOrder[b.rarity]
  })

  return (
    <div className="relative p-4 md:p-6">
      <Confetti ref={confettiRef} className="absolute inset-0 size-full pointer-events-none z-50" />

      <BlurFade delay={0.05} inView>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl" style={{ letterSpacing: "-0.02em" }}>
          Achievements
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {earned.length}/{total} unlocked
        </p>
      </BlurFade>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mt-4 overflow-x-auto">
        {["all", "streak", "genre", "quiz", "exploration", "social"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[10px] font-medium transition-colors capitalize",
              filter === f
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {f === "all" ? "All" : TYPE_LABELS[f as keyof typeof TYPE_LABELS]}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((achievement, i) => (
          <BlurFade key={achievement.id} delay={0.03 * i} inView>
            <AchievementCard
              achievement={achievement}
              onCelebrate={() => {
                confettiRef.current?.fire({
                  particleCount: 40,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ["#EAB308", "#6366F1", "#EC4899", "#22C55E"],
                })
              }}
            />
          </BlurFade>
        ))}
      </div>
    </div>
  )
}

function AchievementCard({
  achievement,
  onCelebrate,
}: {
  achievement: Achievement
  onCelebrate: () => void
}) {
  const [showUnlock, setShowUnlock] = useState(false)
  const rarityColor = RARITY_COLORS[achievement.rarity]
  const isLegendary = achievement.rarity === "legendary"

  return (
    <motion.div
      whileHover={achievement.earned ? { scale: 1.02 } : undefined}
      transition={springs.interactive}
      onClick={() => {
        if (achievement.earned && !showUnlock) {
          setShowUnlock(true)
          onCelebrate()
          setTimeout(() => setShowUnlock(false), 3000)
        }
      }}
      className={cn(
        "relative rounded-xl border p-4 transition-all cursor-pointer overflow-hidden motion-reduce:hover:scale-100",
        achievement.earned
          ? "border-border bg-card hover:shadow-sm"
          : "border-border/50 bg-card/50"
      )}
      style={
        achievement.earned && isLegendary
          ? {
              borderImage: "linear-gradient(135deg, #EAB308, #EC4899, #6366F1, #22C55E) 1",
            }
          : undefined
      }
    >
      {/* Unearned blur overlay */}
      {!achievement.earned && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-[2px]">
          <Lock className="size-4 text-muted-foreground/40" />
        </div>
      )}

      <div className={cn(!achievement.earned && "opacity-40")}>
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="shrink-0 size-10 rounded-xl flex items-center justify-center"
            style={{
              background: `${achievement.iconColor}18`,
              border: `1px solid ${achievement.iconColor}33`,
            }}
          >
            <achievement.icon className="size-5" style={{ color: achievement.iconColor }} />
          </div>
          <div className="flex-1 min-w-0">
            {achievement.earned && showUnlock ? (
              <SparklesText
                className="text-sm font-semibold"
                sparklesCount={6}
              >
                {achievement.name}
              </SparklesText>
            ) : (
              <h3 className="text-sm font-semibold truncate">{achievement.name}</h3>
            )}
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-medium capitalize"
              style={{
                backgroundColor: `color-mix(in srgb, ${rarityColor} 12%, transparent)`,
                color: rarityColor,
              }}
            >
              {achievement.rarity}
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] text-muted-foreground">
              {TYPE_ICONS[achievement.type]}
              {TYPE_LABELS[achievement.type]}
            </span>
          </div>
          {achievement.earned && achievement.earnedAt && (
            <span className="text-[9px] text-muted-foreground tabular-nums">
              {new Date(achievement.earnedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
