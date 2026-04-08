import { type CoverStyle, type Language, LANGUAGE_HEX } from "@/types";

// ---------------------------------------------------------------------------
// Title -> deterministic seed
// ---------------------------------------------------------------------------

function hashTitle(title: string): number {
  let hash = 5381;
  for (let i = 0; i < title.length; i++) {
    hash = ((hash << 5) + hash + title.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// ---------------------------------------------------------------------------
// Genre -> shape pairs
// ---------------------------------------------------------------------------

type Genre =
  | "Military"
  | "Poetry"
  | "Philosophy"
  | "Sacred"
  | "History"
  | "Mythology"
  | "Oratory";

const GENRE_SHAPES: Record<Genre, [string, string]> = {
  Military: ["column", "ribbon"],
  Poetry: ["wave", "arc"],
  Philosophy: ["circle", "dot-grid"],
  Sacred: ["crescent", "laurel"],
  History: ["temple", "column"],
  Mythology: ["wave", "circle"],
  Oratory: ["arc", "column"],
};

// Fallback shapes for unrecognized genres
const DEFAULT_SHAPES: [string, string] = ["circle", "wave"];

// ---------------------------------------------------------------------------
// Palette helpers
// ---------------------------------------------------------------------------

/** Lighten a hex color by mixing it toward white. `amount` 0-1. */
function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);

  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

/** Desaturate a hex color slightly to produce a muted companion. */
function mute(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const avg = (r + g + b) / 3;
  const factor = 0.35;

  const mr = Math.round(r + (avg - r) * factor);
  const mg = Math.round(g + (avg - g) * factor);
  const mb = Math.round(b + (avg - b) * factor);

  return `#${mr.toString(16).padStart(2, "0")}${mg.toString(16).padStart(2, "0")}${mb.toString(16).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generateCoverStyle(book: {
  language: string;
  genre: string;
  difficulty: string;
  title: string;
}): CoverStyle {
  const primaryColor = LANGUAGE_HEX[book.language as Language] ?? "#3B82F6";

  // Build a 3-color palette: primary, muted variant, light variant
  const palette = [primaryColor, mute(primaryColor), lighten(primaryColor, 0.55)];

  const shapes =
    GENRE_SHAPES[book.genre as Genre] ?? DEFAULT_SHAPES;

  const seed = hashTitle(book.title);

  return {
    palette,
    seed,
    shapes: [...shapes],
  };
}
