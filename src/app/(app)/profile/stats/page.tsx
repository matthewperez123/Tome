"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Clock, BookOpen, TrendingUp, Award,
  ChevronLeft, Download, Zap, BookMarked,
  Flame, Trophy, Star,
} from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { TRADITION_COLORS } from "@/components/tome/book-card"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// Demo seed data
// ─────────────────────────────────────────────

// 30 days of reading minutes — realistic: zeros on busy days, spikes on weekends
const RAW_DAYS: number[] = [
  0, 12, 35, 45, 0, 80, 92,   // week 1: slow start, weekend spike
  20, 0, 55, 38, 15, 70, 88,  // week 2
  0, 42, 60, 55, 0, 95, 110,  // week 3: improving
  30, 45, 0, 72, 80, 50, 105, // week 4
  90, 120,                    // final 2 days strong finish
]

const TRADITION_BREAKDOWN = [
  { tradition: "Victorian",     minutes: 260, color: TRADITION_COLORS["Victorian"]?.dot     ?? "#8B5CF6" },
  { tradition: "Ancient Greek", minutes: 165, color: TRADITION_COLORS["Ancient Greek"]?.dot ?? "#0EA5E9" },
  { tradition: "Russian",       minutes: 130, color: TRADITION_COLORS["Russian"]?.dot       ?? "#6366F1" },
  { tradition: "French",        minutes: 75,  color: TRADITION_COLORS["French"]?.dot        ?? "#EC4899" },
  { tradition: "American",      minutes: 50,  color: TRADITION_COLORS["American"]?.dot      ?? "#22C55E" },
]

const MILESTONES = [
  {
    id: "join",
    date: "Jan 3, 2025",
    icon: Star,
    color: "#F59E0B",
    title: "Joined Tome",
    desc: "Began the journey through the great literary canon.",
  },
  {
    id: "ch1",
    date: "Jan 5, 2025",
    icon: BookOpen,
    color: "#0EA5E9",
    title: "First Chapter Completed",
    desc: "Finished Book I of The Iliad by Homer.",
  },
  {
    id: "streak7",
    date: "Jan 12, 2025",
    icon: Flame,
    color: "#F97316",
    title: "7-Day Streak",
    desc: "Read every day for a week without interruption.",
  },
  {
    id: "russian",
    date: "Feb 2, 2025",
    icon: BookMarked,
    color: "#6366F1",
    title: "Russian Literature Unlocked",
    desc: "Began Crime and Punishment by Fyodor Dostoevsky.",
  },
  {
    id: "10ch",
    date: "Feb 15, 2025",
    icon: Trophy,
    color: "#F59E0B",
    title: "10 Chapters Milestone",
    desc: "Completed 10 chapters across 3 different works.",
  },
  {
    id: "book1",
    date: "Feb 28, 2025",
    icon: Award,
    color: "#22C55E",
    title: "First Book Finished",
    desc: "Completed all 10 books of The Iliad — a Homeric triumph.",
  },
  {
    id: "scholar",
    date: "Mar 10, 2025",
    icon: Zap,
    color: "#8B5CF6",
    title: "Scholar Level Reached",
    desc: "Accumulated 700 XP — promoted to Scholar.",
  },
  {
    id: "streak19",
    date: "Mar 20, 2025",
    icon: Flame,
    color: "#EF4444",
    title: "Personal Best Streak",
    desc: "19-day streak — longest unbroken reading run yet.",
  },
]

// ─────────────────────────────────────────────
// Computed constants
// ─────────────────────────────────────────────

const TOTAL_MINUTES = RAW_DAYS.reduce((s, v) => s + v, 0)
const AVG_MINUTES   = Math.round(TOTAL_MINUTES / 30)
const AVG_SPEED_PPH = 38
const TOTAL_TRADITION_MIN = TRADITION_BREAKDOWN.reduce((s, t) => s + t.minutes, 0)

function fmtMinutes(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  return h > 0 ? (min > 0 ? `${h}h ${min}m` : `${h}h`) : `${m}m`
}

function fmtShort(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  return h > 0 ? `${h}h ${min > 0 ? min + "m" : ""}`.trim() : `${m}m`
}

// ─────────────────────────────────────────────
// SVG Area Chart
// ─────────────────────────────────────────────

const CHART_W = 600
const CHART_H = 180
const PAD_L   = 40
const PAD_R   = 16
const PAD_T   = 24
const PAD_B   = 32
const PLOT_W  = CHART_W - PAD_L - PAD_R
const PLOT_H  = CHART_H - PAD_T - PAD_B

function AreaChart({ data, accent }: { data: number[]; accent: string }) {
  const [tooltip, setTooltip] = useState<{ i: number; x: number; y: number } | null>(null)

  const maxVal = Math.max(...data, 1)
  const avg    = Math.round(data.reduce((s, v) => s + v, 0) / data.length)

  const points = data.map((v, i) => {
    const x = PAD_L + (i / (data.length - 1)) * PLOT_W
    const y = PAD_T + PLOT_H - (v / maxVal) * PLOT_H
    return { x, y, v }
  })

  // Build smooth area path using cardinal spline
  function smoothPath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return ""
    const tension = 0.4
    let d = `M ${pts[0].x},${pts[0].y}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const curr = pts[i]
      const cpx  = prev.x + (curr.x - prev.x) * tension
      d += ` C ${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`
    }
    return d
  }

  const linePath  = smoothPath(points)
  const areaPath  = linePath
    + ` L ${points[points.length - 1].x},${PAD_T + PLOT_H}`
    + ` L ${points[0].x},${PAD_T + PLOT_H} Z`

  const avgY = PAD_T + PLOT_H - (avg / maxVal) * PLOT_H

  // Y-axis ticks
  const yTicks = [0, Math.round(maxVal / 2), maxVal]

  // X-axis labels: show every 7th day
  const today = new Date()
  const xLabels = data.map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (data.length - 1 - i))
    return d
  }).filter((_, i) => i % 7 === 0 || i === data.length - 1)

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full"
        style={{ minWidth: 280 }}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines + labels */}
        {yTicks.map((tick) => {
          const y = PAD_T + PLOT_H - (tick / maxVal) * PLOT_H
          return (
            <g key={tick}>
              <line x1={PAD_L} y1={y} x2={CHART_W - PAD_R} y2={y}
                stroke="currentColor" strokeOpacity="0.07" strokeDasharray="3 3" />
              <text x={PAD_L - 6} y={y + 4} textAnchor="end"
                fontSize="9" fill="currentColor" fillOpacity="0.4">
                {tick}
              </text>
            </g>
          )
        })}

        {/* Average reference line */}
        <line x1={PAD_L} y1={avgY} x2={CHART_W - PAD_R} y2={avgY}
          stroke={accent} strokeOpacity="0.5" strokeDasharray="5 4" strokeWidth="1" />
        <text x={CHART_W - PAD_R + 2} y={avgY + 4}
          fontSize="8" fill={accent} fillOpacity="0.8">avg</text>

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />

        {/* X-axis labels */}
        {xLabels.map((date, idx) => {
          // Find original index
          const origIdx = data.findIndex((_, i) => {
            const d = new Date(today)
            d.setDate(d.getDate() - (data.length - 1 - i))
            return d.toDateString() === date.toDateString()
          })
          const x = origIdx >= 0 ? PAD_L + (origIdx / (data.length - 1)) * PLOT_W : 0
          return (
            <text key={idx} x={x} y={CHART_H - 6} textAnchor="middle"
              fontSize="8" fill="currentColor" fillOpacity="0.45">
              {date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
            </text>
          )
        })}

        {/* Interactive dots */}
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x} cy={pt.y} r={tooltip?.i === i ? 4 : 3}
            fill={pt.v === 0 ? "transparent" : accent}
            fillOpacity={tooltip?.i === i ? 1 : 0.6}
            className="cursor-crosshair"
            onMouseEnter={() => setTooltip({ i, x: pt.x, y: pt.y })}
          />
        ))}

        {/* Tooltip */}
        {tooltip && (() => {
          const pt  = points[tooltip.i]
          const d   = new Date(today)
          d.setDate(d.getDate() - (data.length - 1 - tooltip.i))
          const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          const tx  = Math.min(Math.max(pt.x - 36, 2), CHART_W - 80)
          const ty  = Math.max(pt.y - 42, 4)
          return (
            <g>
              <rect x={tx} y={ty} width={78} height={28} rx="5"
                fill="var(--background, #ffffff)" stroke={accent} strokeOpacity="0.4" strokeWidth="1" />
              <text x={tx + 7} y={ty + 11} fontSize="9" fill="currentColor" fillOpacity="0.6">
                {label}
              </text>
              <text x={tx + 7} y={ty + 22} fontSize="10" fontWeight="600"
                fill={accent}>
                {pt.v}m reading
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────
// Donut Chart
// ─────────────────────────────────────────────

function DonutChart({ slices }: {
  slices: { label: string; value: number; color: string }[]
}) {
  const [hovered, setHovered] = useState<string | null>(null)

  const total = slices.reduce((s, sl) => s + sl.value, 0)
  const R = 52, r = 32
  const cx = 68, cy = 68

  let cumulAngle = -Math.PI / 2

  const paths = slices.map((sl) => {
    const angle    = (sl.value / total) * 2 * Math.PI
    const startA   = cumulAngle
    const endA     = cumulAngle + angle
    cumulAngle     = endA

    const x1 = cx + R * Math.cos(startA), y1 = cy + R * Math.sin(startA)
    const x2 = cx + R * Math.cos(endA),   y2 = cy + R * Math.sin(endA)
    const x3 = cx + r * Math.cos(endA),   y3 = cy + r * Math.sin(endA)
    const x4 = cx + r * Math.cos(startA), y4 = cy + r * Math.sin(startA)
    const large = angle > Math.PI ? 1 : 0

    const d = [
      `M ${x1} ${y1}`,
      `A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${r} ${r} 0 ${large} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ")

    return { ...sl, d, angle }
  })

  const hoveredSlice = hovered ? slices.find((s) => s.label === hovered) : null

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* SVG donut */}
      <div className="relative shrink-0">
        <svg width="136" height="136" viewBox="0 0 136 136">
          {paths.map((p) => (
            <path
              key={p.label}
              d={p.d}
              fill={p.color}
              fillOpacity={hovered && hovered !== p.label ? 0.3 : 1}
              className="cursor-pointer transition-opacity duration-150"
              onMouseEnter={() => setHovered(p.label)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          {/* Center text */}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontWeight="700"
            fill="currentColor">
            {hoveredSlice
              ? fmtShort(hoveredSlice.value)
              : fmtShort(total)}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="8"
            fill="currentColor" fillOpacity="0.5">
            {hoveredSlice ? hoveredSlice.label.split(" ")[0] : "total"}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full space-y-2">
        {slices.map((sl) => {
          const pct = Math.round((sl.value / total) * 100)
          return (
            <div
              key={sl.label}
              className="flex items-center gap-2 group cursor-default"
              onMouseEnter={() => setHovered(sl.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: sl.color }} />
              <span className={cn(
                "text-xs flex-1 truncate transition-colors",
                hovered === sl.label ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {sl.label}
              </span>
              <span className="text-xs tabular-nums text-muted-foreground/70 shrink-0">
                {fmtShort(sl.value)}
              </span>
              <span
                className="text-[10px] font-semibold shrink-0 w-8 text-right"
                style={{ color: sl.color }}
              >
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function StatsPage() {
  const accentColor = "#6366F1"

  const donutSlices = useMemo(
    () => TRADITION_BREAKDOWN.map((t) => ({ ...t, label: t.tradition, value: t.minutes })),
    []
  )

  const handleExport = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      totalMinutes: TOTAL_MINUTES,
      avgMinutesPerDay: AVG_MINUTES,
      totalChapters: 23,
      booksFinished: 3,
      traditionBreakdown: TRADITION_BREAKDOWN.map((t) => ({
        tradition: t.tradition,
        minutes: t.minutes,
        pct: Math.round((t.minutes / TOTAL_TRADITION_MIN) * 100),
      })),
      dailyMinutes: RAW_DAYS,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement("a"), {
      href: url, download: "tome-stats.json",
    })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

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

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-12">

        {/* ── Page Header ───────────────────────── */}
        <BlurFade delay={0.04} inView>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="size-4" />
                Profile
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <h1 className="font-serif text-xl font-semibold tracking-tight">
                Reading Analytics
              </h1>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
            >
              <Download className="size-3.5" />
              Export JSON
            </button>
          </div>
        </BlurFade>

        {/* ── 1. Stats Header Row ───────────────── */}
        <BlurFade delay={0.08} inView>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Reading Time",
                value: fmtShort(TOTAL_MINUTES),
                icon: Clock,
                color: "#0EA5E9",
                sub: "last 30 days",
              },
              {
                label: "Chapters Done",
                value: "23",
                icon: BookOpen,
                color: accentColor,
                sub: "completed",
              },
              {
                label: "Avg per Day",
                value: fmtShort(AVG_MINUTES),
                icon: TrendingUp,
                color: "#22C55E",
                sub: "daily average",
              },
              {
                label: "Books Finished",
                value: "3",
                icon: Award,
                color: "#F59E0B",
                sub: "completed",
              },
            ].map(({ label, value, icon: Icon, color, sub }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
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

        {/* ── 2. Reading Time Chart ─────────────── */}
        <BlurFade delay={0.12} inView>
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-semibold tracking-tight">Reading Time</h2>
              <span className="text-[11px] text-muted-foreground/60">Last 30 days</span>
            </div>
            <OrnamentalDivider color={accentColor} />

            <div className="rounded-xl border border-border bg-card p-5">
              <AreaChart data={RAW_DAYS} accent={accentColor} />
              <p className="text-[11px] text-muted-foreground/50 mt-1 text-right">
                Total: {fmtMinutes(TOTAL_MINUTES)} · Avg: {fmtShort(AVG_MINUTES)}/day
              </p>
            </div>
          </section>
        </BlurFade>

        {/* ── 3. Tradition Breakdown ────────────── */}
        <BlurFade delay={0.16} inView>
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-1">
              Time by Tradition
            </h2>
            <OrnamentalDivider color={accentColor} />

            <div className="rounded-xl border border-border bg-card p-5">
              <DonutChart slices={donutSlices} />

              {/* Horizontal stacked bar (secondary view) */}
              <div className="mt-5 h-3 rounded-full overflow-hidden flex">
                {TRADITION_BREAKDOWN.map((t) => {
                  const pct = (t.minutes / TOTAL_TRADITION_MIN) * 100
                  return (
                    <motion.div
                      key={t.tradition}
                      className="h-full"
                      title={`${t.tradition}: ${fmtShort(t.minutes)}`}
                      style={{ backgroundColor: t.color, width: `${pct}%` }}
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  )
                })}
              </div>
            </div>
          </section>
        </BlurFade>

        {/* ── 4. Reading Speed ──────────────────── */}
        <BlurFade delay={0.2} inView>
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-1">Reading Speed</h2>
            <OrnamentalDivider color={accentColor} />

            <div className="grid sm:grid-cols-2 gap-3">
              {/* Speed card */}
              <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                <div
                  className="shrink-0 size-12 rounded-full flex items-center justify-center"
                  style={{ background: `${accentColor}18` }}
                >
                  <Zap className="size-5" style={{ color: accentColor }} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Reading pace</p>
                  <p className="font-serif text-3xl font-bold" style={{ color: accentColor }}>
                    {AVG_SPEED_PPH}
                    <span className="text-sm font-normal text-muted-foreground ml-1">pg/hr</span>
                  </p>
                </div>
              </div>

              {/* Improvement card */}
              <div
                className="rounded-xl border p-5 flex items-center gap-4"
                style={{
                  background: "rgba(34,197,94,0.06)",
                  borderColor: "rgba(34,197,94,0.25)",
                }}
              >
                <div
                  className="shrink-0 size-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(34,197,94,0.15)" }}
                >
                  <TrendingUp className="size-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">This month</p>
                  <p className="font-serif text-3xl font-bold text-emerald-500">
                    +14%
                    <span className="text-sm font-normal text-muted-foreground ml-1">faster</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    Pace improved vs. last month
                  </p>
                </div>
              </div>
            </div>
          </section>
        </BlurFade>

        {/* ── 5. Milestones Timeline ────────────── */}
        <BlurFade delay={0.24} inView>
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight mb-1">
              Milestones
            </h2>
            <OrnamentalDivider color={accentColor} />

            <div className="relative">
              {/* Vertical spine */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" aria-hidden />

              <div className="space-y-0">
                {MILESTONES.map((m, i) => {
                  const Icon = m.icon
                  return (
                    <motion.div
                      key={m.id}
                      className="relative flex items-start gap-4 pb-6 last:pb-0"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.24 + i * 0.07, duration: 0.35, ease: "easeOut" }}
                    >
                      {/* Icon dot */}
                      <div
                        className="relative z-10 shrink-0 size-10 rounded-full flex items-center justify-center border-2 border-background"
                        style={{ background: `${m.color}22`, boxShadow: `0 0 0 2px ${m.color}44` }}
                      >
                        <Icon className="size-4" style={{ color: m.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1.5">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <p className="text-sm font-semibold">{m.title}</p>
                          <time className="text-[10px] text-muted-foreground/60 shrink-0">
                            {m.date}
                          </time>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>
        </BlurFade>

      </div>
    </div>
  )
}
