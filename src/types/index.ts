export type Language =
  | "LATIN"
  | "GREEK"
  | "ARAMAIC"
  | "ARABIC"
  | "OLD_ENGLISH"
  | "SPANISH"
  | "ITALIAN"
  | "FRENCH"
  | "GERMAN"
  | "RUSSIAN"
  | "SANSKRIT"
  | "HINDI"
  | "TIBETAN"
  | "SCOTS_GAELIC"
  | "HEBREW";

export type Difficulty = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type Mastery = "NEW" | "LEARNING" | "MASTERED";

export type ReadingMode =
  | "side-by-side"
  | "side-by-side-transliteration"
  | "tap-to-reveal"
  | "original-only"
  | "english-only";

export type HighlightColor = "OCEAN" | "SAFFRON" | "IRIS" | "CLOVER";

export const HIGHLIGHT_HEX: Record<HighlightColor, string> = {
  OCEAN: "#3B82F6",
  SAFFRON: "#F59E0B",
  IRIS: "#8B5CF6",
  CLOVER: "#10B981",
};

export const LANGUAGE_COLORS: Record<Language, string> = {
  LATIN: "royal",
  GREEK: "violet",
  ARAMAIC: "rose",
  ARABIC: "teal",
  OLD_ENGLISH: "amber",
  SPANISH: "vermillion",
  ITALIAN: "emerald",
  FRENCH: "indigo",
  GERMAN: "iris",
  RUSSIAN: "crimson",
  SANSKRIT: "burnt-orange",
  HINDI: "bright-orange",
  TIBETAN: "dark-teal",
  SCOTS_GAELIC: "forest",
  HEBREW: "bronze",
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  LATIN: "Latin",
  GREEK: "Ancient Greek",
  ARAMAIC: "Aramaic",
  ARABIC: "Arabic",
  OLD_ENGLISH: "Old English",
  SPANISH: "Spanish",
  ITALIAN: "Italian",
  FRENCH: "French",
  GERMAN: "German",
  RUSSIAN: "Russian",
  SANSKRIT: "Sanskrit",
  HINDI: "Hindi",
  TIBETAN: "Tibetan",
  SCOTS_GAELIC: "Scots Gaelic",
  HEBREW: "Hebrew",
};

export const LANGUAGE_HEX: Record<Language, string> = {
  LATIN: "#2563EB",
  GREEK: "#7C3AED",
  ARAMAIC: "#DB2777",
  ARABIC: "#0891B2",
  OLD_ENGLISH: "#D97706",
  SPANISH: "#DC2626",
  ITALIAN: "#059669",
  FRENCH: "#4F46E5",
  GERMAN: "#9333EA",
  RUSSIAN: "#E11D48",
  SANSKRIT: "#EA580C",
  HINDI: "#F97316",
  TIBETAN: "#0D9488",
  SCOTS_GAELIC: "#16A34A",
  HEBREW: "#854D0E",
};

// Languages that need special script handling
export const RTL_LANGUAGES: Language[] = ["ARABIC", "ARAMAIC", "HEBREW"];
export const TRANSLITERABLE_LANGUAGES: Language[] = [
  "GREEK",
  "ARAMAIC",
  "ARABIC",
  "RUSSIAN",
  "SANSKRIT",
  "HINDI",
  "TIBETAN",
  "HEBREW",
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  A1: "Absolute Beginner",
  A2: "Beginner",
  B1: "Intermediate",
  B2: "Upper Intermediate",
  C1: "Advanced",
  C2: "Mastery",
};

export const LEVEL_TITLES: Record<number, string> = {
  1: "Reader",
  6: "Scholar",
  11: "Linguist",
  21: "Polyglot",
  31: "Sage",
  41: "Grandmaster",
};

export function getLevelTitle(level: number): string {
  const thresholds = [41, 31, 21, 11, 6, 1];
  for (const t of thresholds) {
    if (level >= t) return LEVEL_TITLES[t];
  }
  return "Reader";
}

export const XP_PER_LEVEL = 500;

export function getLevel(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

export function getXpProgress(totalXp: number): {
  current: number;
  needed: number;
  percent: number;
} {
  const current = totalXp % XP_PER_LEVEL;
  return {
    current,
    needed: XP_PER_LEVEL,
    percent: (current / XP_PER_LEVEL) * 100,
  };
}

export function isRTL(language: Language): boolean {
  return RTL_LANGUAGES.includes(language);
}

export function needsTransliteration(language: Language): boolean {
  return TRANSLITERABLE_LANGUAGES.includes(language);
}

export interface CoverStyle {
  palette: string[];
  seed: number;
  shapes: string[];
}
