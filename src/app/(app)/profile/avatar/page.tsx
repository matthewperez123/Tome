"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Lock, Compass, Check, ArrowLeft, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  BOOK_CHARACTERS,
  CHARACTER_MAP,
  RARITY_COLORS,
  RARITY_ORDER,
  type CharacterRarity,
} from "@/data/character-avatars"
import { UserAvatar } from "@/components/tome/avatar/UserAvatar"
import {
  getCurrentAvatar,
  getSelectedCharacterId,
  setAvatar,
  getUnlockedCharacters,
  isCharacterUnlocked,
  getUnlockProgress,
} from "@/lib/avatar-state"

// ── Types ────────────────────────────────────────────────────────────────────

type FilterTab   = "all" | "unlocked" | "locked"
type SortBy      = "rarity" | "tradition" | "alpha"
type RarityFilter = CharacterRarity | "All"

// ── Motivational message ─────────────────────────────────────────────────────

function getMotivationalMessage(pct: number): string {
  if (pct === 0)                  return "Every journey begins with a single page. Keep reading!"
  if (pct <= 10)                  return "Every journey begins with a single page. Keep reading!"
  if (pct <= 30)                  return "You're building your collection. The classics await."
  if (pct <= 60)                  return "An impressive library of heroes and legends."
  if (pct <= 90)                  return "Nearly complete — you've read deeply and well."
  if (pct < 100)                  return "Almost there! Just a few great works remain."
  return "You've conquered the entire library. A true scholar."
}

// ── Rarity badge ─────────────────────────────────────────────────────────────

function RarityBadge({
  rarity,
  size = "sm",
}: {
  rarity: CharacterRarity
  size?: "sm" | "md"
}) {
  const colors = RARITY_COLORS[rarity]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold leading-none",
        size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2.5 py-1 text-xs"
      )}
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

// ── Tradition badge ───────────────────────────────────────────────────────────

function TraditionBadge({ tradition }: { tradition: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground border border-border">
      {tradition}
    </span>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AvatarPage() {
  // ── State ──────────────────────────────────────────────────────────────────

  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)
  const [currentAvatarId,     setCurrentAvatarId]     = useState<string>("odysseus")
  const [unlockedIds,         setUnlockedIds]         = useState<Set<string>>(new Set())
  const [progress,            setProgress]            = useState(getUnlockProgress())
  const [filterTab,           setFilterTab]           = useState<FilterTab>("all")
  const [filterTradition,     setFilterTradition]     = useState<string>("All")
  const [filterRarity,        setFilterRarity]        = useState<RarityFilter>("All")
  const [sortBy,              setSortBy]              = useState<SortBy>("rarity")
  const [mounted,             setMounted]             = useState(false)

  // ── Load state from localStorage client-side ───────────────────────────────

  useEffect(() => {
    const unlocked = getUnlockedCharacters()
    setUnlockedIds(new Set(unlocked.map((c) => c.id)))
    setCurrentAvatarId(getSelectedCharacterId())
    setProgress(getUnlockProgress())
    setMounted(true)
  }, [])

  // ── Derived: all unique traditions ────────────────────────────────────────

  const allTraditions = useMemo(() => {
    const seen = new Set<string>()
    BOOK_CHARACTERS.forEach((c) => seen.add(c.tradition))
    return Array.from(seen)
  }, [])

  // ── Derived: filtered + sorted characters ─────────────────────────────────

  const filteredCharacters = useMemo(() => {
    let list = [...BOOK_CHARACTERS]

    // Tab filter
    if (filterTab === "unlocked") list = list.filter((c) => unlockedIds.has(c.id))
    if (filterTab === "locked")   list = list.filter((c) => !unlockedIds.has(c.id))

    // Tradition filter
    if (filterTradition !== "All") list = list.filter((c) => c.tradition === filterTradition)

    // Rarity filter
    if (filterRarity !== "All") list = list.filter((c) => c.rarity === filterRarity)

    // Sort
    if (sortBy === "rarity") {
      list.sort((a, b) => RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity))
    } else if (sortBy === "tradition") {
      list.sort((a, b) => a.tradition.localeCompare(b.tradition) || a.name.localeCompare(b.name))
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [filterTab, filterTradition, filterRarity, sortBy, unlockedIds])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSetAvatar(characterId: string) {
    setAvatar(characterId)
    setCurrentAvatarId(characterId)
    setProgress(getUnlockProgress())
  }

  function handleResetFilters() {
    setFilterTab("all")
    setFilterTradition("All")
    setFilterRarity("All")
    setSortBy("rarity")
  }

  // ── Derived: selected character ───────────────────────────────────────────

  const selectedCharacter = selectedCharacterId ? CHARACTER_MAP[selectedCharacterId] : null
  const isSelectedUnlocked = selectedCharacterId ? unlockedIds.has(selectedCharacterId) : false
  const isCurrentAvatar    = selectedCharacterId === currentAvatarId

  // ── Rarity dot color ──────────────────────────────────────────────────────

  const rarities: CharacterRarity[] = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            Profile
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Avatar Collection</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete books to unlock characters from the classics
          </p>
        </div>

        {/* ── Two-column layout ─────────────────────────────────────────── */}
        <div className="lg:grid lg:grid-cols-[1fr,320px] lg:gap-8 space-y-8 lg:space-y-0">

          {/* ── LEFT: Grid + Filters + Stats ────────────────────────────── */}
          <div className="space-y-6 min-w-0">

            {/* ── Filter Controls ───────────────────────────────────────── */}
            <div className="space-y-3">

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
                {(["all", "unlocked", "locked"] as FilterTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
                      filterTab === tab
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab === "all" ? "All Characters" : tab === "unlocked" ? "Unlocked" : "Locked"}
                  </button>
                ))}
              </div>

              {/* Rarity pills */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterRarity("All")}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                    filterRarity === "All"
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                  )}
                >
                  All Rarities
                </button>
                {rarities.map((r) => {
                  const colors = RARITY_COLORS[r]
                  const active = filterRarity === r
                  return (
                    <button
                      key={r}
                      onClick={() => setFilterRarity(r)}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
                      style={{
                        color:            active ? "#fff"         : colors.text,
                        backgroundColor:  active ? colors.text    : colors.bg,
                        borderColor:      active ? colors.text    : colors.border,
                      }}
                    >
                      {r}
                    </button>
                  )
                })}
              </div>

              {/* Tradition + Sort row */}
              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={filterTradition}
                  onChange={(e) => setFilterTradition(e.target.value)}
                  className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="All">All Traditions</option>
                  {allTraditions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="rarity">By Rarity</option>
                  <option value="tradition">By Tradition</option>
                  <option value="alpha">Alphabetical</option>
                </select>

                <span className="text-xs text-muted-foreground ml-auto">
                  Showing {filteredCharacters.length} of {BOOK_CHARACTERS.length} characters
                </span>
              </div>
            </div>

            {/* ── Character Grid ────────────────────────────────────────── */}
            {filteredCharacters.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-xl border border-dashed border-border text-muted-foreground">
                <BookOpen className="size-8 opacity-40" />
                {filterTab === "unlocked" ? (
                  <>
                    <p className="text-sm font-medium">No unlocked characters yet</p>
                    <p className="text-xs opacity-70">Complete books to unlock characters</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">No characters match your filters</p>
                    <button
                      onClick={handleResetFilters}
                      className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      Reset filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {filteredCharacters.map((character) => {
                  const unlocked  = mounted ? unlockedIds.has(character.id) : false
                  const isCurrent = character.id === currentAvatarId
                  const isSelected = character.id === selectedCharacterId

                  return (
                    <button
                      key={character.id}
                      onClick={() => setSelectedCharacterId(character.id)}
                      className={cn(
                        "relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border cursor-pointer",
                        "transition-all duration-150 text-left",
                        unlocked
                          ? "bg-card hover:bg-accent/50"
                          : "bg-muted/50 hover:bg-muted",
                        isSelected
                          ? "ring-2 ring-offset-2 ring-offset-background"
                          : "border-border"
                      )}
                      style={isSelected ? { "--tw-ring-color": character.accentColor } as React.CSSProperties : {}}
                    >
                      {/* Current avatar badge */}
                      {isCurrent && (
                        <span className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 rounded-full bg-emerald-500 text-white px-1.5 py-0.5 text-[8px] font-bold leading-none">
                          <Check className="size-2.5" strokeWidth={3} />
                        </span>
                      )}

                      {/* Avatar */}
                      <div className="relative mt-1">
                        <UserAvatar
                          character={character}
                          size="md"
                          showRarityRing={unlocked}
                          className={cn(!unlocked && "opacity-30 grayscale")}
                        />
                        {!unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="size-4 text-foreground/60" />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <p
                        className={cn(
                          "text-xs font-semibold truncate w-full text-center leading-tight",
                          unlocked ? "text-foreground" : "text-muted-foreground/50"
                        )}
                      >
                        {character.name}
                      </p>

                      {/* Rarity / unlock hint */}
                      {unlocked ? (
                        <RarityBadge rarity={character.rarity} size="sm" />
                      ) : (
                        <p className="text-[9px] text-muted-foreground/40 text-center leading-tight truncate w-full">
                          Complete {character.bookTitle}
                        </p>
                      )}

                      {/* Book source (unlocked only) */}
                      {unlocked && (
                        <p className="text-[10px] text-muted-foreground truncate w-full text-center leading-none">
                          {character.bookTitle}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* ── Collection Stats ──────────────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-5">
              <h2 className="font-serif text-lg font-semibold">Your Collection</h2>

              {/* Overall progress */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold tabular-nums">
                    {progress.unlocked} <span className="text-muted-foreground text-base font-normal">/ {progress.total} Unlocked</span>
                  </span>
                  <span className="text-sm text-muted-foreground">{progress.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {getMotivationalMessage(progress.percentage)}
                </p>
              </div>

              {/* Rarity breakdown */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">By Rarity</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {rarities.map((rarity) => {
                    const stat   = progress.byRarity[rarity]
                    const colors = RARITY_COLORS[rarity]
                    if (!stat) return null
                    return (
                      <div key={rarity} className="flex items-center gap-2.5">
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: colors.text }}
                        />
                        <span className="text-xs text-muted-foreground w-20 shrink-0">{rarity}</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.round((stat.unlocked / stat.total) * 100)}%`,
                              backgroundColor: colors.text,
                            }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground w-10 text-right shrink-0">
                          {stat.unlocked} / {stat.total}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tradition bars */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">By Tradition</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {Object.entries(progress.byTradition)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([tradition, stat]) => (
                      <div key={tradition} className="flex items-center gap-2.5">
                        <span className="text-xs text-muted-foreground w-28 shrink-0 truncate">{tradition}</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-indigo-400 transition-all duration-500"
                            style={{ width: `${Math.round((stat.unlocked / stat.total) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground w-10 text-right shrink-0">
                          {stat.unlocked} / {stat.total}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Preview Panel ─────────────────────────────────────── */}
          <div className={cn(
            "lg:block",
            !selectedCharacter && "hidden lg:block"
          )}>
            <div className="sticky top-24">
              {!selectedCharacter ? (
                /* Empty state */
                <div className="rounded-xl border border-dashed border-border bg-card p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[400px]">
                  <Compass className="size-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Select a character to preview</p>
                </div>
              ) : (
                /* Character detail */
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  {/* Accent header */}
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: selectedCharacter.accentColor }}
                  />

                  <div className="p-6 space-y-4">
                    {/* Avatar + name */}
                    <div className="flex flex-col items-center gap-3 text-center">
                      <UserAvatar
                        character={selectedCharacter}
                        size="lg"
                        showRarityRing={isSelectedUnlocked}
                        className={cn(!isSelectedUnlocked && "opacity-40 grayscale")}
                      />
                      <div>
                        <h2 className="text-xl font-bold font-serif leading-tight">
                          {selectedCharacter.name}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
                          <RarityBadge rarity={selectedCharacter.rarity} size="md" />
                          <TraditionBadge tradition={selectedCharacter.tradition} />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedCharacter.description}
                    </p>

                    {/* Unlock quote */}
                    {isSelectedUnlocked && (
                      <blockquote
                        className="pl-3 py-0.5 italic text-sm text-muted-foreground border-l-2"
                        style={{ borderColor: selectedCharacter.accentColor }}
                      >
                        "{selectedCharacter.unlockQuote}"
                      </blockquote>
                    )}

                    {/* Book source */}
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">From:</span>
                      <Link
                        href={`/book/${selectedCharacter.bookId}`}
                        className="font-medium hover:underline truncate"
                        style={{ color: selectedCharacter.accentColor }}
                      >
                        {selectedCharacter.bookTitle}
                      </Link>
                    </div>

                    {/* CTA */}
                    <div className="pt-1">
                      {!isSelectedUnlocked ? (
                        <div className="rounded-lg bg-muted/60 border border-border px-4 py-3 text-center space-y-1">
                          <Lock className="size-4 mx-auto text-muted-foreground/60" />
                          <p className="text-xs text-muted-foreground">
                            Complete{" "}
                            <Link
                              href={`/book/${selectedCharacter.bookId}`}
                              className="font-semibold hover:underline text-foreground"
                            >
                              {selectedCharacter.bookTitle}
                            </Link>
                            {" "}to unlock
                          </p>
                        </div>
                      ) : isCurrentAvatar ? (
                        <button
                          disabled
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 cursor-default"
                        >
                          <Check className="size-4" strokeWidth={2.5} />
                          Current Avatar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSetAvatar(selectedCharacter.id)}
                          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                          style={{ backgroundColor: selectedCharacter.accentColor }}
                        >
                          Set as Avatar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
