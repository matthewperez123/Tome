"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

// ── Tradition band colors ───────────────────────────────────────────────────

const TRADITION_COLORS: Record<string, string> = {
  "Ancient Greek":     "#1E3A5F",    // deep navy blue
  "Roman":             "#6B1414",    // deep crimson
  "Medieval European": "#1B4332",    // forest green
  "Renaissance":       "#3D1A6E",    // deep violet
  "Enlightenment":     "#0F2744",    // midnight blue
  "Romantic":          "#4A0E2D",    // deep plum
  "Victorian":         "#2D1B5E",    // dark indigo
  "Russian":           "#5C1A1A",    // dark burgundy
  "American":          "#143220",    // deep forest
  "French":            "#0A1F3D",    // Prussian blue
  "Modernist":         "#111111",    // near black
  "Eastern":           "#5C2800",    // dark amber-brown
  "Scandinavian":      "#1E293B",
  "Germanic":          "#1F2937",
  "World Literature":  "#1A1A2E",
}

const DEFAULT_BAND_COLOR = "#1A1A2E"

function getBandColor(tradition: string): string {
  return TRADITION_COLORS[tradition] ?? DEFAULT_BAND_COLOR
}

// ── Fallback procedural gradient background ────────────────────────────────

function getFallbackGradient(
  primary: string,
  secondary: string,
  accent: string
): string {
  return `linear-gradient(160deg, ${secondary} 0%, ${primary} 45%, ${accent} 100%)`
}

// ── Tradition SVG motifs for fallback covers ───────────────────────────────

function getTraditionMotif(tradition: string, primary: string, accent: string): string {
  const t = tradition.toLowerCase()

  if (t.includes("ancient greek") || t.includes("roman")) {
    // Concentric arc / laurel hint
    return `
      <circle cx="100" cy="95" r="55" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.25"/>
      <circle cx="100" cy="95" r="38" fill="none" stroke="${accent}" stroke-width="0.8" opacity="0.18"/>
      <circle cx="100" cy="95" r="20" fill="${accent}" opacity="0.12"/>
      <line x1="45" y1="95" x2="155" y2="95" stroke="${accent}" stroke-width="0.7" opacity="0.2"/>
      <line x1="100" y1="40" x2="100" y2="150" stroke="${accent}" stroke-width="0.7" opacity="0.2"/>
    `
  }

  if (t.includes("eastern")) {
    // Wave pattern
    const waves = [0.3, 0.5, 0.7].map((yFrac) => {
      const y = yFrac * 190
      return `<path d="M0,${y} C33,${y - 12} 67,${y + 12} 100,${y} C133,${y - 12} 167,${y + 12} 200,${y}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.2"/>`
    })
    return waves.join("\n") + `<circle cx="100" cy="95" r="22" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.22"/>`
  }

  if (t.includes("modernist") || t.includes("contemporary")) {
    // Fragmented geometric
    return `
      <polygon points="60,40 140,40 170,95 140,150 60,150 30,95" fill="none" stroke="${accent}" stroke-width="1" opacity="0.2"/>
      <line x1="0" y1="95" x2="200" y2="95" stroke="${accent}" stroke-width="1.5" opacity="0.25"/>
      <line x1="100" y1="0" x2="100" y2="190" stroke="${accent}" stroke-width="0.8" opacity="0.18"/>
    `
  }

  if (t.includes("medieval")) {
    // Gothic arch
    return `
      <path d="M70,160 L70,80 Q100,40 130,80 L130,160" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.22"/>
      <rect x="55" y="155" width="90" height="6" fill="${accent}" opacity="0.15" rx="1"/>
      <circle cx="100" cy="60" r="8" fill="${accent}" opacity="0.2"/>
    `
  }

  if (t.includes("romantic")) {
    // Flowing curves
    return `
      <path d="M20,60 C60,20 140,120 180,80" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.22"/>
      <path d="M20,110 C60,70 140,170 180,130" fill="none" stroke="${accent}" stroke-width="1" opacity="0.18"/>
      <ellipse cx="100" cy="95" rx="50" ry="30" fill="${accent}" opacity="0.08"/>
    `
  }

  if (t.includes("victorian")) {
    // Dense ornamental rectangles
    return `
      <rect x="20" y="20" width="160" height="150" fill="none" stroke="${accent}" stroke-width="1" opacity="0.2" rx="2"/>
      <rect x="30" y="30" width="140" height="130" fill="none" stroke="${accent}" stroke-width="0.6" opacity="0.15" rx="1"/>
      <rect x="80" y="75" width="40" height="40" fill="${accent}" opacity="0.1" rx="2"/>
    `
  }

  // Default: subtle radial
  return `
    <circle cx="100" cy="85" r="60" fill="none" stroke="${accent}" stroke-width="1" opacity="0.18"/>
    <circle cx="100" cy="85" r="35" fill="${accent}" opacity="0.08"/>
  `
}

// ── Props ──────────────────────────────────────────────────────────────────

export interface ClassicsCoverProps {
  bookId: string
  title: string
  author: string
  tradition: string
  artImageUrl?: string
  fallbackColors?: { primary: string; secondary: string; accent: string }
  className?: string
  showTomeWordmark?: boolean
  /** Hide the bottom tradition band with title/author text */
  hideBand?: boolean
  aspectRatio?: "2/3" | "1/1"
  priority?: boolean
}

// ── Component ──────────────────────────────────────────────────────────────

export function ClassicsCover({
  bookId,
  title,
  author,
  tradition,
  artImageUrl,
  fallbackColors = { primary: "#1E3A5F", secondary: "#0F2744", accent: "#C9A84C" },
  className,
  showTomeWordmark = true,
  hideBand = false,
  aspectRatio = "2/3",
  priority = false,
}: ClassicsCoverProps) {
  const bandColor = getBandColor(tradition)
  const accentGold = "#C9A84C"

  const containerStyle: React.CSSProperties = {
    aspectRatio,
    position: "relative",
    containerType: "inline-size",
  }

  const motifSvg = !artImageUrl
    ? getTraditionMotif(tradition, fallbackColors.primary, fallbackColors.accent)
    : ""

  const fallbackGradient = !artImageUrl
    ? getFallbackGradient(fallbackColors.primary, fallbackColors.secondary, fallbackColors.accent)
    : ""

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm select-none",
        "shadow-[0_4px_24px_rgba(0,0,0,0.45),0_1px_4px_rgba(0,0,0,0.3)]",
        className
      )}
      style={containerStyle}
      data-book-id={bookId}
    >
      {/* ── Artwork / Fallback background ── */}
      {artImageUrl ? (
        <>
          <Image
            src={artImageUrl}
            alt={`${title} cover artwork`}
            fill
            unoptimized
            priority={priority}
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover object-center"
          />
          {/* Vignette: subtle dark gradient on the bottom half to blend into band */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.22) 60%, rgba(0,0,0,0.55) 73%)",
            }}
          />
        </>
      ) : (
        /* Procedural fallback */
        <div className="absolute inset-0" style={{ background: fallbackGradient }}>
          <svg
            viewBox="0 0 200 190"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid slice"
          >
            <g dangerouslySetInnerHTML={{ __html: motifSvg }} />
          </svg>
        </div>
      )}

      {!hideBand && (
        <>
          {/* ── Gold/white separator line ── */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              bottom: "30%",
              height: "1px",
              background: `linear-gradient(to right, transparent, ${accentGold}CC, transparent)`,
              zIndex: 3,
            }}
          />

          {/* ── Colored band (bottom 30%) ── */}
          <div
            className="absolute left-0 right-0 bottom-0 flex flex-col justify-center px-[7%] py-[4%]"
            style={{
              height: "30%",
              backgroundColor: bandColor,
              zIndex: 4,
            }}
          >
            {/* Title */}
            <p
              className="font-serif text-white leading-tight line-clamp-3"
              style={{
                fontSize: "clamp(0.6rem, 2.8cqw, 1rem)",
                fontWeight: 700,
                letterSpacing: "0.01em",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              {title}
            </p>
            {/* Author */}
            <p
              className="text-white/75 mt-[3%] font-sans truncate"
              style={{
                fontSize: "clamp(0.5rem, 2cqw, 0.75rem)",
                letterSpacing: "0.04em",
                fontWeight: 400,
              }}
            >
              {author}
            </p>
          </div>
        </>
      )}

      {/* ── TOME wordmark (top-right) ── */}
      {showTomeWordmark && (
        <div
          aria-hidden="true"
          className="absolute top-[5%] right-[6%] pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <span
            className="font-sans text-white/35 tracking-[0.25em] uppercase"
            style={{ fontSize: "clamp(0.35rem, 1.4cqw, 0.5rem)", fontWeight: 600 }}
          >
            TOME
          </span>
        </div>
      )}

      {/* ── Gold/white border frame (inset 4px) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-1 pointer-events-none rounded-[1px]"
        style={{
          border: `1px solid ${accentGold}55`,
          zIndex: 6,
        }}
      />
    </div>
  )
}
