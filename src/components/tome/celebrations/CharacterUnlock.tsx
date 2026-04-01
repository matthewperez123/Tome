"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star, Sparkles, Trophy } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { BookCharacter } from "@/data/character-avatars"
import { RARITY_COLORS, RARITY_ORDER } from "@/data/character-avatars"
import { UserAvatar } from "@/components/tome/avatar/UserAvatar"

// ── Types ───────────────────────────────────────────────────────────────────

type Phase = 1 | 2 | 3

interface CharacterUnlockProps {
  character: BookCharacter
  isOpen: boolean
  onClose: () => void
  /** Called when user clicks "Set as Avatar" */
  onSelectAvatar: () => void
}

// ── Animation variants ──────────────────────────────────────────────────────

const cardVariants = {
  hidden:  { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.35, type: "tween" as const } },
  exit:    { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.2,  type: "tween" as const } },
}

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, type: "tween" as const } },
  exit:    { opacity: 0, transition: { duration: 0.25, type: "tween" as const } },
}

// ── Rarity ring helper ──────────────────────────────────────────────────────

function RingPulse({
  color,
  delay = 0,
  scale = 1.6,
}: {
  color: string
  delay?: number
  scale?: number
}) {
  return (
    <span
      className="absolute inset-0 rounded-full animate-ping"
      style={{
        backgroundColor: color,
        opacity: 0,
        animationDelay: `${delay}s`,
        animationDuration: "1.8s",
        transform: `scale(${scale})`,
      }}
    />
  )
}

// ── Phase 1 — Book Complete ─────────────────────────────────────────────────

function Phase1Card() {
  return (
    <motion.div
      key="phase-1"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center gap-4 text-center px-8 py-10"
    >
      <div className="rounded-full bg-amber-500/15 p-4">
        <Trophy className="size-12 text-amber-400" strokeWidth={1.5} />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">Book Complete!</h2>
        <p className="text-sm text-muted-foreground">
          A new character has been unlocked&hellip;
        </p>
      </div>

      {/* Loading dots */}
      <div className="flex items-center gap-1.5 pt-1">
        {[0, 0.3, 0.6].map((delay, i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ── Phase 2 — Character Reveal ──────────────────────────────────────────────

function Phase2Card({ character }: { character: BookCharacter }) {
  const rarityColors = RARITY_COLORS[character.rarity]
  const isLegendary  = character.rarity === "Legendary"
  const isEpic       = character.rarity === "Epic"
  const ringCount    = isLegendary ? 3 : isEpic ? 2 : 1

  return (
    <motion.div
      key="phase-2"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center gap-5 text-center px-8 py-10 relative"
    >
      {/* Legendary sparkle corners */}
      {isLegendary && (
        <>
          <Sparkles
            className="absolute top-3 left-3 size-4 text-amber-400/60"
            strokeWidth={1.5}
          />
          <Sparkles
            className="absolute top-3 right-3 size-4 text-amber-400/60"
            strokeWidth={1.5}
          />
        </>
      )}

      {/* Avatar with pulsing rings */}
      <div className="relative flex items-center justify-center">
        {Array.from({ length: ringCount }).map((_, i) => (
          <RingPulse
            key={i}
            color={rarityColors.border}
            delay={i * 0.55}
            scale={1.5 + i * 0.25}
          />
        ))}
        <UserAvatar
          character={character}
          size="lg"
          showRarityRing
          className="size-20 relative z-10"
        />
      </div>

      {/* Character info */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <h2 className="text-xl font-bold">{character.name}</h2>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: rarityColors.bg, color: rarityColors.text }}
          >
            {character.rarity}
          </span>
        </div>

        <p className="text-sm text-muted-foreground max-w-[240px] line-clamp-2">
          {character.description}
        </p>

        <p className="text-sm italic text-muted-foreground/70 max-w-[240px]">
          &ldquo;{character.unlockQuote}&rdquo;
        </p>
      </div>

      {/* Book source */}
      <p className="text-[10px] text-muted-foreground/50">
        From&nbsp;
        <span className="italic">{character.bookTitle}</span>
      </p>
    </motion.div>
  )
}

// ── Phase 3 — Action Prompt ─────────────────────────────────────────────────

function Phase3Card({
  character,
  onSelectAvatar,
  onClose,
}: {
  character: BookCharacter
  onSelectAvatar: () => void
  onClose: () => void
}) {
  const rarityColors = RARITY_COLORS[character.rarity]

  return (
    <motion.div
      key="phase-3"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center gap-4 text-center px-8 pb-8 pt-6 relative"
    >
      {/* Dismiss button */}
      <button
        onClick={onClose}
        className={cn(
          "absolute top-3 right-3 rounded-md p-1 text-muted-foreground/60",
          "hover:text-foreground hover:bg-muted/60 transition-colors"
        )}
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>

      {/* Compact avatar */}
      <UserAvatar
        character={character}
        size="md"
        showRarityRing
        showName={false}
      />

      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="font-semibold text-sm">{character.name}</span>
          <span
            className="text-[10px] font-semibold px-1.5 py-px rounded-full"
            style={{ background: rarityColors.bg, color: rarityColors.text }}
          >
            {character.rarity}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Added to your collection
        </p>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col w-full gap-2 pt-1">
        <button
          onClick={() => {
            onSelectAvatar()
            onClose()
          }}
          className={cn(
            "w-full rounded-lg px-4 py-2.5 text-sm font-semibold",
            "bg-foreground text-background",
            "hover:opacity-90 active:scale-[0.98] transition-[opacity,transform]"
          )}
        >
          Set as Avatar
        </button>

        <Link
          href="/profile/avatar"
          onClick={onClose}
          className={cn(
            "w-full rounded-lg px-4 py-2.5 text-sm font-medium text-center",
            "border border-border text-muted-foreground",
            "hover:text-foreground hover:bg-muted/40 transition-colors"
          )}
        >
          View Collection
        </Link>
      </div>
    </motion.div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export function CharacterUnlock({
  character,
  isOpen,
  onClose,
  onSelectAvatar,
}: CharacterUnlockProps) {
  const [phase, setPhase] = useState<Phase>(1)

  const isLegendary = character.rarity === "Legendary"
  const isEpic      = character.rarity === "Epic"

  // Derive overlay background tint from rarity
  const overlayClass = isLegendary
    ? "bg-gradient-to-b from-amber-950/60 to-black/85 backdrop-blur-sm"
    : isEpic
    ? "bg-gradient-to-b from-purple-950/50 to-black/85 backdrop-blur-sm"
    : "bg-black/80 backdrop-blur-sm"

  // Advance through phases on a timer
  useEffect(() => {
    if (!isOpen) {
      setPhase(1)
      return
    }

    if (phase === 1) {
      const id = setTimeout(() => setPhase(2), 3000)
      return () => clearTimeout(id)
    }

    if (phase === 2) {
      const id = setTimeout(() => setPhase(3), 5500)
      return () => clearTimeout(id)
    }

    // Phase 3 has no auto-advance
  }, [isOpen, phase])

  const handleClose = useCallback(() => {
    setPhase(1)
    onClose()
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="character-unlock-overlay"
          className={cn("fixed inset-0 z-[9999] flex items-center justify-center p-4", overlayClass)}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          // Allow clicking outside to dismiss only in Phase 3
          onClick={phase === 3 ? handleClose : undefined}
        >
          {/* Card — stop event propagation so inner clicks don't bubble to overlay */}
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              {phase === 1 && <Phase1Card key="p1" />}
              {phase === 2 && <Phase2Card key="p2" character={character} />}
              {phase === 3 && (
                <Phase3Card
                  key="p3"
                  character={character}
                  onSelectAvatar={onSelectAvatar}
                  onClose={handleClose}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
