"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck, Heart, Zap, RefreshCw,
  Moon, Scroll, BookMarked, Contrast,
  Shirt, Crown, Star, BookOpen,
  ChevronDown, ChevronUp, Check, AlertCircle,
  Coins,
} from "lucide-react"
import { useEconomy } from "@/components/tome/economy-provider"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// Shop catalog
// ─────────────────────────────────────────────

type ShopCategory = "power-ups" | "themes" | "virgil"

interface ShopItem {
  id: string
  category: ShopCategory
  name: string
  description: string
  price: number              // 0 = free
  icon: typeof ShieldCheck
  color: string
  accent: string             // bg tint
  badge?: string             // e.g. "Popular"
  stock?: number             // max owned (undefined = unlimited)
  maxOwned?: number
}

const SHOP_ITEMS: ShopItem[] = [
  // ── Power-Ups ───────────────────────────────
  {
    id: "streak-freeze",
    category: "power-ups",
    name: "Streak Freeze",
    description: "Protects your streak for 1 missed day. Hold up to 2.",
    price: 10,
    icon: ShieldCheck,
    color: "#0EA5E9",
    accent: "rgba(14,165,233,0.10)",
    badge: "Popular",
    maxOwned: 2,
  },
  {
    id: "heart-refill",
    category: "power-ups",
    name: "Heart Refill",
    description: "Restore all 5 hearts instantly.",
    price: 15,
    icon: Heart,
    color: "#F43F5E",
    accent: "rgba(244,63,94,0.10)",
  },
  {
    id: "double-wisdom",
    category: "power-ups",
    name: "Double Wisdom",
    description: "Earn 2× Wisdom (XP) for the next hour.",
    price: 20,
    icon: Zap,
    color: "#F59E0B",
    accent: "rgba(245,158,11,0.10)",
    badge: "New",
  },
  {
    id: "quiz-retry",
    category: "power-ups",
    name: "Quiz Retry",
    description: "Retry a failed quiz without losing hearts.",
    price: 5,
    icon: RefreshCw,
    color: "#10B981",
    accent: "rgba(16,185,129,0.10)",
  },

  // ── Reading Themes ───────────────────────────
  {
    id: "theme-night-scholar",
    category: "themes",
    name: "Night Scholar",
    description: "Dark mode with warm amber tones for late-night reading.",
    price: 50,
    icon: Moon,
    color: "#A78BFA",
    accent: "rgba(167,139,250,0.10)",
  },
  {
    id: "theme-parchment",
    category: "themes",
    name: "Parchment",
    description: "Aged paper texture for an antique, book-like feel.",
    price: 50,
    icon: Scroll,
    color: "#F59E0B",
    accent: "rgba(245,158,11,0.10)",
    badge: "Popular",
  },
  {
    id: "theme-manuscript",
    category: "themes",
    name: "Manuscript",
    description: "Medieval manuscript styling with ornamental details.",
    price: 75,
    icon: BookMarked,
    color: "#F97316",
    accent: "rgba(249,115,22,0.10)",
    badge: "Exclusive",
  },
  {
    id: "theme-high-contrast",
    category: "themes",
    name: "High Contrast",
    description: "Accessibility-focused high contrast mode.",
    price: 0,
    icon: Contrast,
    color: "#6366F1",
    accent: "rgba(99,102,241,0.10)",
  },

  // ── Virgil Customization ─────────────────────
  {
    id: "virgil-toga",
    category: "virgil",
    name: "Philosopher's Toga",
    description: "Virgil wears a distinguished blue toga.",
    price: 100,
    icon: Shirt,
    color: "#0EA5E9",
    accent: "rgba(14,165,233,0.10)",
  },
  {
    id: "virgil-laurel",
    category: "virgil",
    name: "Laurel Crown",
    description: "A golden laurel wreath befitting a great guide.",
    price: 100,
    icon: Crown,
    color: "#F59E0B",
    accent: "rgba(245,158,11,0.10)",
    badge: "Popular",
  },
  {
    id: "virgil-cloak",
    category: "virgil",
    name: "Starlight Cloak",
    description: "Virgil's ultimate form — stars embedded in his cloak.",
    price: 200,
    icon: Star,
    color: "#A78BFA",
    accent: "rgba(167,139,250,0.10)",
    badge: "Legendary",
  },
  {
    id: "virgil-scroll",
    category: "virgil",
    name: "Scholar's Scroll",
    description: "Virgil carries a luminous scholar's scroll accessory.",
    price: 75,
    icon: BookOpen,
    color: "#10B981",
    accent: "rgba(16,185,129,0.10)",
  },
]

const CATEGORIES: { id: ShopCategory; label: string; emoji: string }[] = [
  { id: "power-ups", label: "Power-Ups",    emoji: "⚡" },
  { id: "themes",    label: "Themes",        emoji: "🎨" },
  { id: "virgil",    label: "Virgil",         emoji: "📜" },
]

// ─────────────────────────────────────────────
// Coin history seed
// ─────────────────────────────────────────────

const COIN_HISTORY = [
  { id: "h1", amount: +5,  desc: "Completed Chapter 3 of Pride and Prejudice", time: "2h ago",  type: "earn"  },
  { id: "h2", amount: +10, desc: "Quiz passed: The Odyssey Book I",            time: "1d ago",  type: "earn"  },
  { id: "h3", amount: -10, desc: "Purchased Streak Freeze",                    time: "3d ago",  type: "spend" },
  { id: "h4", amount: +5,  desc: "Completed Chapter 8 of The Iliad",           time: "4d ago",  type: "earn"  },
  { id: "h5", amount: +25, desc: "7-day streak bonus",                         time: "5d ago",  type: "earn"  },
  { id: "h6", amount: -15, desc: "Purchased Heart Refill",                     time: "6d ago",  type: "spend" },
  { id: "h7", amount: +10, desc: "Book completed: Frankenstein",               time: "8d ago",  type: "earn"  },
]

// ─────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────

const OWNED_KEY = "tome-shop-owned"
const SPENT_KEY = "tome-shop-spent"

function loadOwned(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(OWNED_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch { return new Set() }
}

function saveOwned(owned: Set<string>) {
  try { localStorage.setItem(OWNED_KEY, JSON.stringify([...owned])) } catch {}
}

function loadSpent(): number {
  if (typeof window === "undefined") return 0
  return parseInt(localStorage.getItem(SPENT_KEY) ?? "0", 10)
}

function saveSpent(n: number) {
  try { localStorage.setItem(SPENT_KEY, String(n)) } catch {}
}

// ─────────────────────────────────────────────
// Toast notification
// ─────────────────────────────────────────────

interface Toast { id: number; message: string; type: "success" | "error" }

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function ShopPage() {
  const { stats }         = useEconomy()
  const [owned,  setOwned]  = useState<Set<string>>(new Set())
  const [spent,  setSpent]  = useState(0)
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("power-ups")
  const [historyOpen, setHistoryOpen] = useState(false)
  const [toasts, setToasts]   = useState<Toast[]>([])
  const [toastId, setToastId] = useState(0)

  useEffect(() => {
    setOwned(loadOwned())
    setSpent(loadSpent())
  }, [])

  const availableCoins = stats.coins - spent

  // Count streak freezes owned (has a max of 2)
  const ownedCount = useCallback((id: string) => {
    // For items with a cap we track as "item-id-0", "item-id-1"
    // Simple: just track the base id and check if owned
    return owned.has(id) ? 1 : 0
  }, [owned])

  function pushToast(message: string, type: Toast["type"] = "success") {
    const id = toastId + 1
    setToastId(id)
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500)
  }

  function handleBuy(item: ShopItem) {
    if (item.price > 0 && availableCoins < item.price) {
      pushToast(`Need ${item.price - availableCoins} more coins`, "error")
      return
    }
    if (item.maxOwned && ownedCount(item.id) >= item.maxOwned) {
      pushToast(`You already have the maximum (${item.maxOwned})`, "error")
      return
    }

    const next = new Set(owned)
    next.add(item.id)
    setOwned(next)
    saveOwned(next)

    if (item.price > 0) {
      const nextSpent = spent + item.price
      setSpent(nextSpent)
      saveSpent(nextSpent)
    }

    pushToast(item.price === 0 ? `${item.name} unlocked!` : `${item.name} purchased!`)
  }

  const visibleItems = useMemo(
    () => SHOP_ITEMS.filter((i) => i.category === activeCategory),
    [activeCategory]
  )

  return (
    <div className="min-h-screen pb-20">

      {/* ── Toast notifications ── */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 48, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg pointer-events-auto",
                t.type === "success"
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-500 text-white"
              )}
            >
              {t.type === "success"
                ? <Check className="size-4 shrink-0" />
                : <AlertCircle className="size-4 shrink-0" />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── 1. Header ───────────────────────────── */}
        <BlurFade delay={0.04} inView>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight">Shop</h1>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
                Earn coins by reading chapters{" "}
                <span className="text-foreground font-medium">(+5)</span>, acing quizzes{" "}
                <span className="text-foreground font-medium">(+10)</span>, and maintaining streaks{" "}
                <span className="text-foreground font-medium">(+25/week)</span>.
              </p>
            </div>

            {/* Coin balance */}
            <div
              className="shrink-0 flex items-center gap-2 rounded-2xl border px-4 py-2.5"
              style={{
                background: "rgba(245,158,11,0.08)",
                borderColor: "rgba(245,158,11,0.3)",
              }}
            >
              <Coins className="size-5 text-amber-500" />
              <div className="text-right">
                <p className="font-serif text-xl font-bold text-amber-500 leading-none">
                  {availableCoins}
                </p>
                <p className="text-[9px] text-muted-foreground/60 mt-0.5">coins</p>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* ── 2. Category tabs ─────────────────────── */}
        <BlurFade delay={0.07} inView>
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-medium transition-all duration-200",
                  activeCategory === cat.id
                    ? "border-[var(--tome-accent,#6366f1)] bg-[var(--tome-accent,#6366f1)]/8 text-[var(--tome-accent,#6366f1)]"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
                )}
              >
                <span className="text-base leading-none">{cat.emoji}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </div>
        </BlurFade>

        {/* ── 3. Item grid ─────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AnimatePresence mode="wait">
            {visibleItems.map((item, i) => {
              const isOwned     = owned.has(item.id)
              const isFree      = item.price === 0
              const canAfford   = isFree || availableCoins >= item.price
              const atMax       = item.maxOwned != null && ownedCount(item.id) >= item.maxOwned
              const Icon        = item.icon
              const needMore    = item.price - availableCoins

              return (
                <BlurFade key={item.id} delay={0.08 + i * 0.04} inView>
                  <motion.div
                    layout
                    className={cn(
                      "relative rounded-2xl border bg-card p-4 flex flex-col gap-3 transition-all duration-200",
                      isOwned || atMax
                        ? "border-border opacity-70"
                        : "border-border hover:border-[color:var(--tome-accent,#6366f1)]/40 hover:shadow-sm"
                    )}
                  >
                    {/* Badge */}
                    {item.badge && !isOwned && (
                      <span
                        className="absolute top-3 right-3 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: item.badge === "Legendary"
                            ? "rgba(167,139,250,0.2)"
                            : item.badge === "Exclusive"
                            ? "rgba(249,115,22,0.15)"
                            : item.badge === "New"
                            ? "rgba(245,158,11,0.15)"
                            : "rgba(99,102,241,0.12)",
                          color: item.badge === "Legendary"
                            ? "#7c3aed"
                            : item.badge === "Exclusive"
                            ? "#c2410c"
                            : item.badge === "New"
                            ? "#b45309"
                            : "#4338ca",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Icon + info */}
                    <div className="flex items-start gap-3">
                      <div
                        className="shrink-0 size-11 rounded-xl flex items-center justify-center"
                        style={{ background: item.accent, border: `1px solid ${item.color}33` }}
                      >
                        <Icon className="size-5" style={{ color: item.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-snug">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                        {item.maxOwned && (
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                            Max: {item.maxOwned}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price + action */}
                    <div className="flex items-center justify-between gap-3 mt-auto">
                      {/* Price */}
                      <div className="flex items-center gap-1.5">
                        {isFree ? (
                          <span className="text-sm font-semibold text-emerald-600">Free</span>
                        ) : (
                          <>
                            <Coins className="size-4 text-amber-500" />
                            <span className="text-sm font-bold tabular-nums text-amber-600">
                              {item.price}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Button */}
                      {isOwned || atMax ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                          <Check className="size-3.5" />
                          {atMax ? "Max owned" : "Owned"}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford}
                          className={cn(
                            "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150",
                            canAfford
                              ? "bg-[var(--tome-accent,#6366f1)] text-white hover:opacity-90 active:scale-95"
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                          )}
                          title={!canAfford ? `Need ${needMore} more coins` : undefined}
                        >
                          {canAfford
                            ? isFree ? "Unlock" : "Buy"
                            : `Need ${needMore} more`}
                        </button>
                      )}
                    </div>

                    {/* Affordability hint */}
                    {!canAfford && !isOwned && (
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 -mt-1">
                        <AlertCircle className="size-3 shrink-0" />
                        <span>You need {needMore} more coins to purchase this.</span>
                      </div>
                    )}
                  </motion.div>
                </BlurFade>
              )
            })}
          </AnimatePresence>
        </div>

        {/* ── 4. Coin History ──────────────────────── */}
        <BlurFade delay={0.18} inView>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
              onClick={() => setHistoryOpen((v) => !v)}
              aria-expanded={historyOpen}
            >
              <div className="flex items-center gap-2">
                <Coins className="size-4 text-amber-500" />
                <span className="text-sm font-semibold">Coin History</span>
                <span className="text-[11px] text-muted-foreground/60">
                  · {COIN_HISTORY.filter((h) => h.type === "earn").reduce((s, h) => s + h.amount, 0)} earned total
                </span>
              </div>
              {historyOpen
                ? <ChevronUp className="size-4 text-muted-foreground" />
                : <ChevronDown className="size-4 text-muted-foreground" />}
            </button>

            <AnimatePresence>
              {historyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border divide-y divide-border/50">
                    {COIN_HISTORY.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-3 px-5 py-3">
                        <div
                          className="shrink-0 size-7 rounded-full flex items-center justify-center"
                          style={{
                            background: entry.type === "earn"
                              ? "rgba(34,197,94,0.12)"
                              : "rgba(239,68,68,0.10)",
                          }}
                        >
                          <Coins
                            className="size-3.5"
                            style={{ color: entry.type === "earn" ? "#16a34a" : "#dc2626" }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-snug text-muted-foreground truncate">
                            {entry.desc}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p
                            className="text-xs font-bold tabular-nums"
                            style={{ color: entry.type === "earn" ? "#16a34a" : "#dc2626" }}
                          >
                            {entry.type === "earn" ? "+" : ""}{entry.amount}
                          </p>
                          <p className="text-[9px] text-muted-foreground/50">{entry.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BlurFade>

      </div>
    </div>
  )
}
