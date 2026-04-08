"use client";

import { type Language } from "@/types";
import { cn } from "@/lib/utils";
import { LanguageCard } from "./LanguageCard";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface LanguageCardGridProps {
  /** Languages to display. Defaults to ALL_LANGUAGES if omitted. */
  languages?: Language[];
  /** Currently selected language(s). */
  selected?: Language | Language[];
  /** Callback when a language card is clicked. */
  onSelect?: (language: Language) => void;
  /** Card size variant. */
  size?: "sm" | "md" | "lg";
  /** Optional number of books per language (shown as badge). */
  bookCounts?: Partial<Record<Language, number>>;
  /** Extra className on the grid container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// All available languages in display order
// ---------------------------------------------------------------------------

const ALL_LANGUAGES: Language[] = [
  "LATIN",
  "GREEK",
  "ARAMAIC",
  "ARABIC",
  "HEBREW",
  "OLD_ENGLISH",
  "FRENCH",
  "ITALIAN",
  "GERMAN",
  "SPANISH",
  "RUSSIAN",
  "SANSKRIT",
  "HINDI",
  "TIBETAN",
  "SCOTS_GAELIC",
];

// Extended labels (same as LanguageCard, duplicated to avoid circular dep)
const GRID_LABELS: Record<Language, string> = {
  LATIN: "Latin",
  GREEK: "Ancient Greek",
  ARAMAIC: "Aramaic",
  ARABIC: "Arabic",
  HEBREW: "Hebrew",
  OLD_ENGLISH: "Old English",
  FRENCH: "French",
  ITALIAN: "Italian",
  GERMAN: "German",
  SPANISH: "Spanish",
  RUSSIAN: "Russian",
  SANSKRIT: "Sanskrit",
  HINDI: "Hindi",
  TIBETAN: "Tibetan",
  SCOTS_GAELIC: "Scots Gaelic",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LanguageCardGrid({
  languages = ALL_LANGUAGES,
  selected,
  onSelect,
  size = "md",
  bookCounts,
  className,
}: LanguageCardGridProps) {
  const selectedSet = new Set(
    Array.isArray(selected)
      ? selected
      : selected !== undefined
        ? [selected]
        : [],
  );

  return (
    <div
      className={cn(
        "grid gap-3",
        // Responsive columns: 2 mobile, 3 tablet, 5 desktop
        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
        className,
      )}
      role="listbox"
      aria-label="Select a language"
      aria-multiselectable={Array.isArray(selected)}
    >
      {languages.map((lang) => {
        const count = bookCounts?.[lang];
        const isSelected = selectedSet.has(lang);

        return (
          <div key={lang} role="option" aria-selected={isSelected} className="relative">
            <LanguageCard
              language={lang}
              isSelected={isSelected}
              onClick={() => onSelect?.(lang)}
              size={size}
            />

            {/* Book count badge */}
            {count !== undefined && (
              <span
                className={cn(
                  "absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5",
                  "flex items-center justify-center",
                  "rounded-full text-[10px] font-bold text-white",
                  "shadow-sm pointer-events-none",
                )}
                style={{
                  backgroundColor:
                    count > 0
                      ? "var(--color-graphite, #6B6966)"
                      : "var(--color-stone, #E0DBD2)",
                  color: count > 0 ? "#fff" : "var(--color-graphite, #6B6966)",
                }}
              >
                {count} {count === 1 ? "book" : "books"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LanguageCardGrid;
