"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { BookCharacter } from "@/data/character-avatars"
import { RARITY_COLORS } from "@/data/character-avatars"

// ── Types ───────────────────────────────────────────────────────────────────

type AvatarSize = "xs" | "sm" | "md" | "lg"

interface UserAvatarProps {
  character: BookCharacter
  size?: AvatarSize
  showRarityRing?: boolean
  className?: string
  /** If true, show the character name below */
  showName?: boolean
}

// ── Size map ────────────────────────────────────────────────────────────────

const SIZE_STYLES: Record<AvatarSize, { outer: string; text: string; px: number }> = {
  xs: { outer: "w-6 h-6",    text: "text-[8px]",  px: 24 },
  sm: { outer: "w-8 h-8",    text: "text-[10px]", px: 32 },
  md: { outer: "w-10 h-10",  text: "text-xs",     px: 40 },
  lg: { outer: "w-14 h-14",  text: "text-sm",     px: 56 },
}

// ── Helper ──────────────────────────────────────────────────────────────────

/**
 * Derives display initials from a character's name.
 * Single-word names return their first letter ("Odysseus" → "O").
 * Multi-word names return first + last initials ("Elizabeth Bennet" → "EB").
 */
export function getCharacterInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// ── Component ───────────────────────────────────────────────────────────────

export function UserAvatar({
  character,
  size = "md",
  showRarityRing = false,
  className,
  showName = false,
}: UserAvatarProps) {
  const { outer, text, px } = SIZE_STYLES[size]
  const rarityColors     = RARITY_COLORS[character.rarity]
  const initials         = getCharacterInitials(character.name)

  // Background: accent colour at 20% opacity
  const bgColor = hexToRgba(character.accentColor, 0.2)

  // Border ring
  const borderStyle: React.CSSProperties = showRarityRing
    ? { border: `2px solid ${rarityColors.border}` }
    : {}

  // Legendary-only golden glow
  const glowStyle: React.CSSProperties =
    showRarityRing && character.rarity === "Legendary"
      ? {
          boxShadow:
            "0 0 0 2px rgba(245,158,11,0.4), 0 0 8px rgba(245,158,11,0.25)",
        }
      : {}

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center shrink-0 select-none",
          "font-semibold leading-none tracking-tight",
          outer,
          text
        )}
        style={{
          backgroundColor: bgColor,
          color: character.accentColor,
          ...borderStyle,
          ...glowStyle,
        }}
        aria-label={character.name}
        title={character.name}
      >
        {character.image ? (
          <Image
            src={character.image}
            alt={character.name}
            width={px}
            height={px}
            className="rounded-full object-cover w-full h-full"
          />
        ) : (
          initials
        )}
      </div>

      {showName && (
        <span className="text-[10px] text-muted-foreground leading-none text-center max-w-[80px] truncate">
          {character.name}
        </span>
      )}
    </div>
  )
}

// ── Internal helpers ────────────────────────────────────────────────────────

/** Converts a 3- or 6-digit hex colour to rgba(r,g,b,alpha). */
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "")
  const full  = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
