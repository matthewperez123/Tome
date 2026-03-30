"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────

export type CoverGenre =
  | "poetry"
  | "fiction"
  | "philosophy"
  | "drama"
  | "tragedy"
  | "comedy"
  | "history"
  | "satire"
  | "adventure"
  | "mystery"
  | "horror"
  | "fantasy"
  | "romance"
  | "spiritual"
  | "nonfiction"
  | "children"
  | "autobiography"
  | "travel"

export type CoverTradition =
  | "Ancient Greek"
  | "Roman"
  | "Medieval European"
  | "Renaissance"
  | "Enlightenment"
  | "Romantic"
  | "Victorian"
  | "Russian"
  | "American"
  | "French"
  | "Modernist"
  | "Post-Colonial"
  | "Eastern"
  | "Contemporary"

export type CoverMood = "light" | "warm" | "cool" | "dark" | "muted"

export interface BookCoverProps {
  genre: string
  tradition: string
  mood?: CoverMood
  primaryColor: string
  secondaryColor: string
  seed?: string
  className?: string
}

// ── Deterministic pseudo-random ────────────────

function seededRandom(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return function next() {
    h = (h ^ (h >>> 16)) * 0x45d9f3b
    h = (h ^ (h >>> 16)) * 0x45d9f3b
    h = h ^ (h >>> 16)
    return (h >>> 0) / 4294967296
  }
}

// ── Grammar: SVG shape generators per tradition ─

type ShapeGenerator = (
  rand: () => number,
  w: number,
  h: number,
  primary: string,
  secondary: string
) => string[]

const grammars: Record<string, ShapeGenerator> = {
  // Epic poetry: sweeping arcs, warm golds
  poetry: (rand, w, h, primary, secondary) => {
    const shapes: string[] = []
    const count = 5 + Math.floor(rand() * 4)
    for (let i = 0; i < count; i++) {
      const cx = rand() * w
      const cy = rand() * h
      const rx = 30 + rand() * (w * 0.6)
      const ry = 10 + rand() * 30
      const rotation = rand() * 360
      const opacity = 0.15 + rand() * 0.3
      const color = rand() > 0.5 ? primary : secondary
      shapes.push(
        `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}" transform="rotate(${rotation} ${cx} ${cy})" />`
      )
    }
    // Sweeping arc
    const startX = rand() * w * 0.3
    const startY = h * 0.4 + rand() * h * 0.3
    const endX = w * 0.7 + rand() * w * 0.3
    const endY = rand() * h * 0.4
    shapes.push(
      `<path d="M${startX},${startY} Q${w * 0.5},${rand() * h * 0.2} ${endX},${endY}" stroke="${primary}" stroke-width="${2 + rand() * 3}" fill="none" opacity="0.4" />`
    )
    return shapes
  },

  // Russian: angular intersecting planes, cool grays + deep reds
  russian: (rand, w, h, primary, secondary) => {
    const shapes: string[] = []
    const count = 6 + Math.floor(rand() * 5)
    for (let i = 0; i < count; i++) {
      const x = rand() * w - w * 0.2
      const y = rand() * h - h * 0.2
      const rw = w * 0.3 + rand() * w * 0.5
      const rh = h * 0.15 + rand() * h * 0.3
      const rotation = -30 + rand() * 60
      const opacity = 0.1 + rand() * 0.25
      const color = rand() > 0.4 ? primary : secondary
      shapes.push(
        `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${color}" opacity="${opacity}" transform="rotate(${rotation} ${x + rw / 2} ${y + rh / 2})" />`
      )
    }
    // Diagonal line accent
    shapes.push(
      `<line x1="${rand() * w * 0.3}" y1="${h}" x2="${w}" y2="${rand() * h * 0.3}" stroke="${primary}" stroke-width="${1.5 + rand() * 2}" opacity="0.3" />`
    )
    return shapes
  },

  // Ancient philosophy: concentric circles, muted earth tones
  philosophy: (rand, w, h, primary, secondary) => {
    const shapes: string[] = []
    const cx = w * 0.35 + rand() * w * 0.3
    const cy = h * 0.35 + rand() * h * 0.3
    const rings = 5 + Math.floor(rand() * 4)
    for (let i = rings; i >= 1; i--) {
      const r = (i / rings) * Math.min(w, h) * 0.45
      const opacity = 0.08 + (i / rings) * 0.2
      const color = i % 2 === 0 ? primary : secondary
      shapes.push(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${1 + rand() * 2}" opacity="${opacity}" />`
      )
    }
    // Center dot
    shapes.push(
      `<circle cx="${cx}" cy="${cy}" r="${3 + rand() * 5}" fill="${primary}" opacity="0.5" />`
    )
    // Scattered small circles
    for (let i = 0; i < 4; i++) {
      shapes.push(
        `<circle cx="${rand() * w}" cy="${rand() * h}" r="${2 + rand() * 4}" fill="${secondary}" opacity="${0.15 + rand() * 0.2}" />`
      )
    }
    return shapes
  },

  // French: elegant curves, soft blues and lavenders
  french: (rand, w, h, primary, secondary) => {
    const shapes: string[] = []
    const curves = 4 + Math.floor(rand() * 4)
    for (let i = 0; i < curves; i++) {
      const startX = rand() * w
      const startY = rand() * h
      const cp1x = rand() * w
      const cp1y = rand() * h
      const cp2x = rand() * w
      const cp2y = rand() * h
      const endX = rand() * w
      const endY = rand() * h
      const color = rand() > 0.5 ? primary : secondary
      shapes.push(
        `<path d="M${startX},${startY} C${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}" stroke="${color}" stroke-width="${1 + rand() * 2.5}" fill="none" opacity="${0.2 + rand() * 0.3}" />`
      )
    }
    // Soft ellipse accent
    shapes.push(
      `<ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${w * 0.25 + rand() * w * 0.15}" ry="${h * 0.15 + rand() * h * 0.1}" fill="${secondary}" opacity="0.1" />`
    )
    return shapes
  },

  // Victorian: dense overlapping rectangles, deep greens and burgundy
  victorian: (rand, w, h, primary, secondary) => {
    const shapes: string[] = []
    const count = 8 + Math.floor(rand() * 6)
    for (let i = 0; i < count; i++) {
      const x = rand() * w * 0.8
      const y = rand() * h * 0.8
      const rw = w * 0.15 + rand() * w * 0.25
      const rh = h * 0.1 + rand() * h * 0.2
      const opacity = 0.08 + rand() * 0.18
      const color = rand() > 0.5 ? primary : secondary
      shapes.push(
        `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${color}" opacity="${opacity}" rx="${rand() * 3}" />`
      )
    }
    // Border frame
    const inset = 8 + rand() * 4
    shapes.push(
      `<rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}" fill="none" stroke="${primary}" stroke-width="1" opacity="0.2" rx="2" />`
    )
    return shapes
  },

  // Modernist: fragmented geometric shapes, bold primaries
  modernist: (rand, w, h, primary, secondary) => {
    const shapes: string[] = []
    const count = 7 + Math.floor(rand() * 5)
    for (let i = 0; i < count; i++) {
      const shapeType = Math.floor(rand() * 3)
      const opacity = 0.15 + rand() * 0.3
      const color = rand() > 0.5 ? primary : secondary

      if (shapeType === 0) {
        // Triangle
        const x1 = rand() * w
        const y1 = rand() * h
        const x2 = x1 + (rand() - 0.5) * w * 0.4
        const y2 = y1 + (rand() - 0.5) * h * 0.4
        const x3 = x1 + (rand() - 0.5) * w * 0.4
        const y3 = y1 + (rand() - 0.5) * h * 0.4
        shapes.push(
          `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${color}" opacity="${opacity}" />`
        )
      } else if (shapeType === 1) {
        // Rectangle at angle
        const x = rand() * w
        const y = rand() * h
        const rw = 15 + rand() * w * 0.3
        const rh = 15 + rand() * h * 0.2
        const rotation = rand() * 90 - 45
        shapes.push(
          `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${color}" opacity="${opacity}" transform="rotate(${rotation} ${x + rw / 2} ${y + rh / 2})" />`
        )
      } else {
        // Circle
        shapes.push(
          `<circle cx="${rand() * w}" cy="${rand() * h}" r="${8 + rand() * 25}" fill="${color}" opacity="${opacity}" />`
        )
      }
    }
    // Bold line
    shapes.push(
      `<line x1="0" y1="${rand() * h}" x2="${w}" y2="${rand() * h}" stroke="${primary}" stroke-width="${2 + rand() * 3}" opacity="0.35" />`
    )
    return shapes
  },

  // Eastern: flowing wave patterns, teals and ambers
  eastern: (rand, w, h, primary, secondary) => {
    const shapes: string[] = []
    const waves = 5 + Math.floor(rand() * 4)
    for (let i = 0; i < waves; i++) {
      const y = (h / (waves + 1)) * (i + 1)
      const amplitude = 10 + rand() * 20
      const frequency = 2 + rand() * 3
      let d = `M0,${y}`
      for (let x = 0; x <= w; x += 10) {
        const waveY = y + Math.sin((x / w) * Math.PI * frequency + i) * amplitude
        d += ` L${x},${waveY}`
      }
      const color = rand() > 0.5 ? primary : secondary
      shapes.push(
        `<path d="${d}" stroke="${color}" stroke-width="${1 + rand() * 1.5}" fill="none" opacity="${0.15 + rand() * 0.25}" />`
      )
    }
    // Circle accent (zen)
    const cx = w * 0.3 + rand() * w * 0.4
    const cy = h * 0.3 + rand() * h * 0.4
    shapes.push(
      `<circle cx="${cx}" cy="${cy}" r="${15 + rand() * 25}" fill="none" stroke="${primary}" stroke-width="${2 + rand() * 2}" opacity="0.25" />`
    )
    return shapes
  },

  // Default: abstract dots and lines
  default: (rand, w, h, primary, secondary) => {
    const shapes: string[] = []
    for (let i = 0; i < 8; i++) {
      const color = rand() > 0.5 ? primary : secondary
      shapes.push(
        `<circle cx="${rand() * w}" cy="${rand() * h}" r="${3 + rand() * 12}" fill="${color}" opacity="${0.1 + rand() * 0.25}" />`
      )
    }
    for (let i = 0; i < 3; i++) {
      shapes.push(
        `<line x1="${rand() * w}" y1="${rand() * h}" x2="${rand() * w}" y2="${rand() * h}" stroke="${primary}" stroke-width="${1 + rand()}" opacity="0.2" />`
      )
    }
    return shapes
  },
}

// ── Tradition → Grammar mapping ────────────────

function getGrammar(tradition: string, genre: string): ShapeGenerator {
  const t = tradition.toLowerCase()
  const g = genre.toLowerCase()

  if (t.includes("russian")) return grammars.russian
  if (t.includes("french")) return grammars.french
  if (t.includes("victorian")) return grammars.victorian
  if (t.includes("modernist")) return grammars.modernist
  if (t.includes("eastern")) return grammars.eastern
  if (t.includes("ancient greek") || t.includes("roman")) {
    if (g.includes("philosophy")) return grammars.philosophy
    return grammars.poetry
  }
  if (t.includes("medieval")) return grammars.victorian
  if (t.includes("renaissance")) {
    if (g.includes("poetry")) return grammars.poetry
    return grammars.french
  }
  if (t.includes("romantic")) return grammars.poetry
  if (t.includes("enlightenment")) return grammars.philosophy
  if (t.includes("post-colonial")) return grammars.eastern
  if (t.includes("contemporary")) return grammars.modernist
  if (t.includes("american")) return grammars.modernist

  // Genre fallbacks
  if (g.includes("poetry")) return grammars.poetry
  if (g.includes("philosophy") || g.includes("spiritual")) return grammars.philosophy
  if (g.includes("mystery") || g.includes("horror")) return grammars.russian
  if (g.includes("adventure")) return grammars.eastern
  if (g.includes("romance")) return grammars.french

  return grammars.default
}

// ── Mood → Background color ────────────────────

function getMoodBg(mood: CoverMood): string {
  switch (mood) {
    case "light": return "#FAFAFA"
    case "warm": return "#FBF7F0"
    case "cool": return "#F0F4F8"
    case "dark": return "#1A1A2E"
    case "muted": return "#F3F1EE"
    default: return "#FAFAFA"
  }
}

function getMoodTextColor(mood: CoverMood): string {
  return mood === "dark" ? "#E5E5E5" : "#1A1A2E"
}

// ── Component ──────────────────────────────────

const VIEWBOX_W = 200
const VIEWBOX_H = 280

export function BookCover({
  genre,
  tradition,
  mood = "muted",
  primaryColor,
  secondaryColor,
  seed = `${genre}-${tradition}`,
  className,
}: BookCoverProps) {
  const svgContent = useMemo(() => {
    const rand = seededRandom(seed)
    const grammar = getGrammar(tradition, genre)
    const shapes = grammar(rand, VIEWBOX_W, VIEWBOX_H, primaryColor, secondaryColor)
    return shapes.join("\n")
  }, [genre, tradition, primaryColor, secondaryColor, seed])

  const bg = getMoodBg(mood)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md",
        className
      )}
      style={{ aspectRatio: `${VIEWBOX_W}/${VIEWBOX_H}` }}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="size-full"
        aria-hidden="true"
      >
        <rect width={VIEWBOX_W} height={VIEWBOX_H} fill={bg} />
        <g dangerouslySetInnerHTML={{ __html: svgContent }} />
      </svg>
    </div>
  )
}

// ── getCoverParams helper ──────────────────────

export type CoverParams = {
  genre: string
  tradition: string
  mood: CoverMood
  primaryColor: string
  secondaryColor: string
  seed: string
}

type BookMeta = {
  title: string
  author: string
  genre?: string | null
  tradition?: string | null
  cover_colors?: string[] | null
  year?: number | null
}

function inferMood(tradition: string, year: number | null): CoverMood {
  const t = tradition.toLowerCase()
  if (t.includes("ancient") || t.includes("roman") || t.includes("medieval")) return "warm"
  if (t.includes("russian") || t.includes("victorian")) return "dark"
  if (t.includes("french") || t.includes("renaissance")) return "cool"
  if (t.includes("eastern")) return "muted"
  if (t.includes("modernist") || t.includes("contemporary")) return "light"
  if (year && year < 0) return "warm"
  if (year && year < 1500) return "muted"
  return "muted"
}

const defaultColorsByGenre: Record<string, [string, string]> = {
  poetry: ["#A855F7", "#8B5CF6"],
  fiction: ["#F59E0B", "#EAB308"],
  philosophy: ["#3B82F6", "#6366F1"],
  drama: ["#EF4444", "#F97316"],
  tragedy: ["#EF4444", "#F43F5E"],
  comedy: ["#EAB308", "#84CC16"],
  history: ["#F59E0B", "#F97316"],
  satire: ["#EAB308", "#84CC16"],
  adventure: ["#22C55E", "#10B981"],
  mystery: ["#6366F1", "#8B5CF6"],
  horror: ["#EF4444", "#111827"],
  fantasy: ["#A855F7", "#D946EF"],
  romance: ["#EC4899", "#F43F5E"],
  spiritual: ["#EAB308", "#8B5CF6"],
  nonfiction: ["#0EA5E9", "#06B6D4"],
  children: ["#22C55E", "#84CC16"],
  autobiography: ["#14B8A6", "#10B981"],
  travel: ["#0EA5E9", "#22C55E"],
}

export function getCoverParams(book: BookMeta): CoverParams {
  const genre = book.genre ?? "fiction"
  const tradition = book.tradition ?? "Contemporary"
  const mood = inferMood(tradition, book.year ?? null)

  let primaryColor: string
  let secondaryColor: string

  if (book.cover_colors && book.cover_colors.length >= 2) {
    primaryColor = book.cover_colors[0]
    secondaryColor = book.cover_colors[1]
  } else {
    const defaults = defaultColorsByGenre[genre.toLowerCase()] ?? ["#6366F1", "#8B5CF6"]
    primaryColor = defaults[0]
    secondaryColor = defaults[1]
  }

  return {
    genre,
    tradition,
    mood,
    primaryColor,
    secondaryColor,
    seed: `${book.title}-${book.author}`,
  }
}
