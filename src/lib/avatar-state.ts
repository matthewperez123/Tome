import { BOOK_CHARACTERS, CHARACTER_MAP, CHARACTERS_BY_BOOK, type BookCharacter, type CharacterRarity } from "@/data/character-avatars"

const STORAGE_KEY = "tome-avatar-state"

interface AvatarState {
  selectedCharacterId: string
  unlockedCharacterIds: string[]
}

const DEFAULT_STATE: AvatarState = {
  selectedCharacterId: "odysseus",    // demo: Odysseus selected
  unlockedCharacterIds: [             // demo: 7 pre-unlocked
    "virgil",
    "odysseus",
    "penelope",
    "achilles",
    "dante",
    "elizabeth-bennet",
    "jean-valjean",
  ],
}

function loadState(): AvatarState {
  if (typeof window === "undefined") return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<AvatarState>
    return {
      selectedCharacterId: parsed.selectedCharacterId ?? DEFAULT_STATE.selectedCharacterId,
      unlockedCharacterIds: parsed.unlockedCharacterIds ?? DEFAULT_STATE.unlockedCharacterIds,
    }
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(state: AvatarState): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* storage full or unavailable */ }
}

export function getCurrentAvatar(): BookCharacter {
  const state = loadState()
  return CHARACTER_MAP[state.selectedCharacterId] ?? CHARACTER_MAP["virgil"] ?? BOOK_CHARACTERS[0]
}

export function getSelectedCharacterId(): string {
  return loadState().selectedCharacterId
}

export function setAvatar(characterId: string): void {
  const state = loadState()
  // Only allow selecting unlocked characters
  if (!state.unlockedCharacterIds.includes(characterId)) return
  state.selectedCharacterId = characterId
  saveState(state)
}

export function unlockCharacter(characterId: string): { isNew: boolean } {
  const state = loadState()
  if (state.unlockedCharacterIds.includes(characterId)) return { isNew: false }
  state.unlockedCharacterIds.push(characterId)
  saveState(state)
  return { isNew: true }
}

export function isCharacterUnlocked(characterId: string): boolean {
  // Virgil is always unlocked
  if (characterId === "virgil") return true
  return loadState().unlockedCharacterIds.includes(characterId)
}

export function getUnlockedCharacters(): BookCharacter[] {
  const state = loadState()
  return state.unlockedCharacterIds
    .map(id => CHARACTER_MAP[id])
    .filter(Boolean) as BookCharacter[]
}

export function getLockedCharacters(): BookCharacter[] {
  const unlockedIds = new Set(loadState().unlockedCharacterIds)
  return BOOK_CHARACTERS.filter(c => !unlockedIds.has(c.id))
}

export interface UnlockProgress {
  total: number
  unlocked: number
  percentage: number
  byRarity: Record<CharacterRarity, { total: number; unlocked: number }>
  byTradition: Record<string, { total: number; unlocked: number }>
}

export function getUnlockProgress(): UnlockProgress {
  const state = loadState()
  const unlockedSet = new Set(state.unlockedCharacterIds)
  const total = BOOK_CHARACTERS.length
  const unlocked = BOOK_CHARACTERS.filter(c => unlockedSet.has(c.id)).length

  const byRarity: Record<string, { total: number; unlocked: number }> = {}
  const byTradition: Record<string, { total: number; unlocked: number }> = {}

  for (const c of BOOK_CHARACTERS) {
    byRarity[c.rarity] ??= { total: 0, unlocked: 0 }
    byRarity[c.rarity].total++
    if (unlockedSet.has(c.id)) byRarity[c.rarity].unlocked++

    byTradition[c.tradition] ??= { total: 0, unlocked: 0 }
    byTradition[c.tradition].total++
    if (unlockedSet.has(c.id)) byTradition[c.tradition].unlocked++
  }

  return {
    total,
    unlocked,
    percentage: Math.round((unlocked / Math.max(total, 1)) * 100),
    byRarity: byRarity as UnlockProgress["byRarity"],
    byTradition,
  }
}

// Called when a book is completed — finds characters for that book and unlocks them
export function unlockCharactersForBook(bookId: string): BookCharacter[] {
  const characters = CHARACTERS_BY_BOOK[bookId] ?? []
  const newlyUnlocked: BookCharacter[] = []
  for (const character of characters) {
    const { isNew } = unlockCharacter(character.id)
    if (isNew) newlyUnlocked.push(character)
  }
  return newlyUnlocked
}
