"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Lock, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  BOOK_CHARACTERS,
  RARITY_COLORS,
  RARITY_ORDER,
  type CharacterRarity,
  type BookCharacter,
} from "@/data/character-avatars"
import {
  getSelectedCharacterId,
  setAvatar,
  isCharacterUnlocked,
  getUnlockedCharacters,
} from "@/lib/avatar-state"
import { UserAvatar } from "@/components/tome/avatar/UserAvatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

// ── Types ────────────────────────────────────────────────────────────────────

type RarityFilter = "All" | CharacterRarity

interface AvatarPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAvatarChanged?: () => void
}

// ── Rarity badge ─────────────────────────────────────────────────────────────

function RarityBadge({ rarity }: { rarity: CharacterRarity }) {
  const colors = RARITY_COLORS[rarity]
  return (
    <span
      className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none"
      style={{
        color: colors.text,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      {rarity}
    </span>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function AvatarPickerModal({
  open,
  onOpenChange,
  onAvatarChanged,
}: AvatarPickerModalProps) {
  const [currentAvatarId, setCurrentAvatarId] = useState(() => getSelectedCharacterId())
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(() => {
    const unlocked = getUnlockedCharacters()
    return new Set(unlocked.map((c) => c.id))
  })
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("All")
  const [justSelected, setJustSelected] = useState<string | null>(null)

  // Refresh state when dialog opens
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setCurrentAvatarId(getSelectedCharacterId())
      const unlocked = getUnlockedCharacters()
      setUnlockedIds(new Set(unlocked.map((c) => c.id)))
      setJustSelected(null)
    }
    onOpenChange(nextOpen)
  }

  // Filtered + sorted characters
  const characters = useMemo(() => {
    let list = [...BOOK_CHARACTERS]
    if (rarityFilter !== "All") list = list.filter((c) => c.rarity === rarityFilter)
    list.sort((a, b) => {
      const aUnlocked = unlockedIds.has(a.id) ? 0 : 1
      const bUnlocked = unlockedIds.has(b.id) ? 0 : 1
      if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked
      return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity)
    })
    return list
  }, [rarityFilter, unlockedIds])

  // Selection handler
  function handleSelect(character: BookCharacter) {
    if (!unlockedIds.has(character.id)) return
    if (character.id === currentAvatarId) return

    setAvatar(character.id)
    setCurrentAvatarId(character.id)
    setJustSelected(character.id)
    onAvatarChanged?.()

    setTimeout(() => {
      onOpenChange(false)
      setJustSelected(null)
    }, 500)
  }

  const rarities: CharacterRarity[] = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Choose your guide</DialogTitle>
          <DialogDescription>Complete books to unlock new characters</DialogDescription>
        </DialogHeader>

        {/* Rarity filter pills */}
        <div className="flex flex-wrap gap-1.5 -mt-1">
          <button
            onClick={() => setRarityFilter("All")}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
              rarityFilter === "All"
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/40"
            )}
          >
            All
          </button>
          {rarities.map((r) => {
            const colors = RARITY_COLORS[r]
            const active = rarityFilter === r
            return (
              <button
                key={r}
                onClick={() => setRarityFilter(r)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
                style={{
                  color: active ? "#fff" : colors.text,
                  backgroundColor: active ? colors.text : colors.bg,
                  borderColor: active ? colors.text : colors.border,
                }}
              >
                {r}
              </button>
            )
          })}
        </div>

        {/* Character grid */}
        <div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {characters.map((character) => {
                const unlocked = unlockedIds.has(character.id)
                const isCurrent = character.id === currentAvatarId
                const wasJustSelected = character.id === justSelected

                return (
                  <motion.button
                    key={character.id}
                    animate={{
                      y: wasJustSelected ? [0, -8, 0] : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={() => handleSelect(character)}
                    disabled={!unlocked}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border",
                      "transition-shadow duration-150 text-center outline-none",
                      unlocked
                        ? "bg-card hover:shadow-md cursor-pointer"
                        : "bg-muted/50 cursor-not-allowed opacity-50 grayscale",
                      isCurrent && "ring-2 ring-offset-2 ring-offset-background"
                    )}
                    style={
                      isCurrent
                        ? ({ "--tw-ring-color": character.accentColor } as React.CSSProperties)
                        : {}
                    }
                  >
                    {/* Current badge */}
                    {isCurrent && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 z-10 flex items-center justify-center size-4 rounded-full bg-emerald-500 text-white"
                      >
                        <Check className="size-2.5" strokeWidth={3} />
                      </motion.span>
                    )}

                    {/* Avatar */}
                    <div className="relative mt-0.5">
                      <motion.div
                        whileHover={unlocked ? { scale: 1.08 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <UserAvatar
                          character={character}
                          size="md"
                          showRarityRing={unlocked}
                        />
                      </motion.div>
                      {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="size-4 text-foreground/60" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <p
                      className={cn(
                        "text-xs font-semibold truncate w-full leading-tight",
                        unlocked ? "text-foreground" : "text-muted-foreground/50"
                      )}
                    >
                      {character.name}
                    </p>

                    {/* Rarity + book */}
                    {unlocked ? (
                      <>
                        <RarityBadge rarity={character.rarity} />
                        <p className="text-[10px] text-muted-foreground truncate w-full leading-none">
                          {character.bookTitle}
                        </p>
                      </>
                    ) : (
                      <p className="text-[9px] text-muted-foreground/40 leading-tight truncate w-full">
                        Complete {character.bookTitle}
                      </p>
                    )}
                  </motion.button>
                )
              })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
