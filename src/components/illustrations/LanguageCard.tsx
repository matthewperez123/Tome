"use client";

import { type Language, LANGUAGE_LABELS, LANGUAGE_HEX } from "@/types";
import { cn } from "@/lib/utils";
import React from "react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface LanguageCardProps {
  language: Language;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

// ---------------------------------------------------------------------------
// Extended language metadata (fills gaps in types/index.ts)
// ---------------------------------------------------------------------------

const EXTENDED_LABELS: Record<Language, string> = {
  ...LANGUAGE_LABELS,
  SANSKRIT: "Sanskrit",
  HINDI: "Hindi",
  TIBETAN: "Tibetan",
  SCOTS_GAELIC: "Scots Gaelic",
};

const EXTENDED_HEX: Record<Language, string> = {
  ...LANGUAGE_HEX,
  SANSKRIT: "#EA580C",
  HINDI: "#F97316",
  TIBETAN: "#0D9488",
  SCOTS_GAELIC: "#16A34A",
};

// ---------------------------------------------------------------------------
// Size config
// ---------------------------------------------------------------------------

const SIZE_CONFIG = {
  sm: { card: "w-28 h-36", viewBox: "0 0 80 100", charScale: 0.7, textClass: "text-[10px]" },
  md: { card: "w-36 h-44", viewBox: "0 0 100 120", charScale: 0.85, textClass: "text-xs" },
  lg: { card: "w-44 h-52", viewBox: "0 0 120 140", charScale: 1, textClass: "text-sm" },
} as const;

// ---------------------------------------------------------------------------
// Color helpers — derive a 3-tone palette from the base hex
// ---------------------------------------------------------------------------

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function palette(hex: string): { base: string; light: string; dark: string; bg: string } {
  const [h, s, l] = hexToHSL(hex);
  return {
    base: hex,
    light: `hsl(${h}, ${Math.min(s + 5, 100)}%, ${Math.min(l + 18, 92)}%)`,
    dark: `hsl(${h}, ${Math.min(s + 8, 100)}%, ${Math.max(l - 18, 15)}%)`,
    bg: `hsl(${h}, ${Math.min(s, 80)}%, ${Math.min(l + 35, 96)}%)`,
  };
}

// ---------------------------------------------------------------------------
// Character SVG renderers
//
// Each returns a <g> group positioned in a 100x120 viewBox coordinate system.
// Characters are ~80-100px tall, centered horizontally around cx=50.
// ---------------------------------------------------------------------------

type CharRenderer = (p: { base: string; light: string; dark: string }) => React.ReactNode;

// ---- Latin: Roman senator (toga, laurel wreath) — deep blue ----
const latinChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — toga */}
    <rect x={30} y={52} width={40} height={42} rx={6} fill={base} />
    <rect x={34} y={52} width={12} height={38} rx={3} fill={light} opacity={0.5} />
    {/* Toga drape */}
    <path d="M30,58 Q26,72 32,92" stroke={dark} strokeWidth={2} fill="none" opacity={0.4} />
    {/* Head */}
    <circle cx={50} cy={38} r={14} fill={light} />
    {/* Eyes */}
    <circle cx={45} cy={36} r={1.5} fill={dark} />
    <circle cx={55} cy={36} r={1.5} fill={dark} />
    {/* Laurel wreath */}
    <ellipse cx={38} cy={28} rx={3} ry={5} transform="rotate(-30,38,28)" fill={base} opacity={0.7} />
    <ellipse cx={42} cy={25} rx={2.5} ry={4.5} transform="rotate(-15,42,25)" fill={base} opacity={0.7} />
    <ellipse cx={50} cy={24} rx={2.5} ry={4} fill={base} opacity={0.7} />
    <ellipse cx={58} cy={25} rx={2.5} ry={4.5} transform="rotate(15,58,25)" fill={base} opacity={0.7} />
    <ellipse cx={62} cy={28} rx={3} ry={5} transform="rotate(30,62,28)" fill={base} opacity={0.7} />
    {/* Arms */}
    <rect x={22} y={56} width={8} height={28} rx={4} fill={base} opacity={0.8} />
    <rect x={70} y={56} width={8} height={28} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={35} y={92} width={12} height={5} rx={2.5} fill={dark} opacity={0.5} />
    <rect x={53} y={92} width={12} height={5} rx={2.5} fill={dark} opacity={0.5} />
  </g>
);

// ---- Greek: Bearded philosopher (chiton, scroll) — purple ----
const greekChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — chiton */}
    <rect x={32} y={52} width={36} height={42} rx={5} fill={base} />
    <path d="M32,52 L50,48 L68,52" stroke={light} strokeWidth={2} fill="none" />
    {/* Head */}
    <circle cx={50} cy={36} r={14} fill={light} />
    {/* Beard */}
    <ellipse cx={50} cy={48} rx={8} ry={6} fill={dark} opacity={0.3} />
    <path d="M42,44 Q50,56 58,44" fill={dark} opacity={0.25} />
    {/* Eyes */}
    <circle cx={45} cy={34} r={1.5} fill={dark} />
    <circle cx={55} cy={34} r={1.5} fill={dark} />
    {/* Headband */}
    <rect x={36} y={28} width={28} height={3} rx={1.5} fill={base} opacity={0.6} />
    {/* Scroll in hand */}
    <rect x={72} y={62} width={6} height={20} rx={3} fill={dark} opacity={0.4} />
    <circle cx={75} cy={62} r={4} fill={dark} opacity={0.3} />
    <circle cx={75} cy={82} r={4} fill={dark} opacity={0.3} />
    {/* Arms */}
    <rect x={24} y={56} width={8} height={26} rx={4} fill={base} opacity={0.8} />
    <rect x={68} y={56} width={8} height={26} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={36} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
    <rect x={53} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
  </g>
);

// ---- Aramaic: Scribe (robes, writing tablet) — rose ----
const aramaicChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — flowing robes (trapezoid) */}
    <path d="M34,52 L28,94 L72,94 L66,52 Z" fill={base} rx={4} />
    <path d="M38,52 L34,90 L46,90 L44,52 Z" fill={light} opacity={0.3} />
    {/* Head */}
    <circle cx={50} cy={36} r={13} fill={light} />
    {/* Head covering */}
    <path d="M37,32 Q50,20 63,32" fill={base} opacity={0.5} />
    <rect x={37} y={30} width={26} height={4} rx={2} fill={base} opacity={0.4} />
    {/* Eyes */}
    <circle cx={45} cy={35} r={1.5} fill={dark} />
    <circle cx={55} cy={35} r={1.5} fill={dark} />
    {/* Beard */}
    <ellipse cx={50} cy={46} rx={6} ry={5} fill={dark} opacity={0.2} />
    {/* Tablet in hands */}
    <rect x={18} y={64} width={14} height={18} rx={2} fill={dark} opacity={0.35} />
    <rect x={20} y={66} width={10} height={14} rx={1} fill={light} opacity={0.4} />
    {/* Writing lines on tablet */}
    <line x1={21} y1={69} x2={29} y2={69} stroke={dark} strokeWidth={0.8} opacity={0.3} />
    <line x1={21} y1={72} x2={28} y2={72} stroke={dark} strokeWidth={0.8} opacity={0.3} />
    <line x1={21} y1={75} x2={27} y2={75} stroke={dark} strokeWidth={0.8} opacity={0.3} />
    {/* Arms */}
    <rect x={24} y={56} width={8} height={22} rx={4} fill={base} opacity={0.8} />
    <rect x={66} y={56} width={8} height={22} rx={4} fill={base} opacity={0.8} />
  </g>
);

// ---- Arabic: Scholar (turban, open book) — teal ----
const arabicChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — scholarly robes */}
    <rect x={32} y={54} width={36} height={40} rx={5} fill={base} />
    <rect x={46} y={54} width={4} height={38} rx={2} fill={dark} opacity={0.15} />
    {/* Head */}
    <circle cx={50} cy={38} r={13} fill={light} />
    {/* Turban */}
    <ellipse cx={50} cy={28} rx={14} ry={10} fill={base} />
    <ellipse cx={50} cy={26} rx={12} ry={8} fill={light} opacity={0.3} />
    <path d="M44,28 Q50,22 56,28" stroke={dark} strokeWidth={1} fill="none" opacity={0.3} />
    {/* Eyes */}
    <circle cx={45} cy={37} r={1.5} fill={dark} />
    <circle cx={55} cy={37} r={1.5} fill={dark} />
    {/* Beard */}
    <ellipse cx={50} cy={48} rx={7} ry={5} fill={dark} opacity={0.2} />
    {/* Open book */}
    <rect x={16} y={66} width={10} height={14} rx={1} fill={dark} opacity={0.35} />
    <rect x={26} y={66} width={10} height={14} rx={1} fill={dark} opacity={0.28} />
    <line x1={26} y1={66} x2={26} y2={80} stroke={light} strokeWidth={1} opacity={0.5} />
    {/* Arms */}
    <rect x={24} y={58} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    <rect x={68} y={58} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={36} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.4} />
    <rect x={53} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.4} />
  </g>
);

// ---- Old English: Shakespeare-like (ruff collar, quill) — amber ----
const oldEnglishChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — doublet */}
    <rect x={32} y={56} width={36} height={38} rx={5} fill={base} />
    <line x1={50} y1={56} x2={50} y2={92} stroke={dark} strokeWidth={1.5} opacity={0.2} />
    {/* Head */}
    <circle cx={50} cy={36} r={13} fill={light} />
    {/* Ruff collar — zigzag */}
    <path
      d="M30,52 L34,48 L38,52 L42,48 L46,52 L50,48 L54,52 L58,48 L62,52 L66,48 L70,52"
      stroke={base}
      strokeWidth={2.5}
      fill="none"
      opacity={0.7}
    />
    <ellipse cx={50} cy={52} rx={20} ry={4} fill={light} opacity={0.4} />
    {/* Eyes */}
    <circle cx={45} cy={35} r={1.5} fill={dark} />
    <circle cx={55} cy={35} r={1.5} fill={dark} />
    {/* Hair — balding top */}
    <path d="M38,28 Q40,22 50,22 Q60,22 62,28" stroke={dark} strokeWidth={2} fill="none" opacity={0.3} />
    {/* Quill in hand */}
    <line x1={74} y1={54} x2={80} y2={38} stroke={dark} strokeWidth={1.5} opacity={0.5} />
    <path d="M80,38 L82,36 L78,40 Z" fill={base} opacity={0.6} />
    {/* Arms */}
    <rect x={24} y={58} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    <rect x={68} y={58} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={36} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
    <rect x={53} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
  </g>
);

// ---- French: Revolutionary (tricorn hat, manuscript) — indigo ----
const frenchChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — period coat */}
    <rect x={32} y={54} width={36} height={40} rx={5} fill={base} />
    <rect x={46} y={54} width={8} height={38} rx={2} fill={light} opacity={0.2} />
    {/* Head */}
    <circle cx={50} cy={38} r={13} fill={light} />
    {/* Tricorn hat — triangle */}
    <polygon points="30,30 50,14 70,30" fill={base} />
    <rect x={30} y={28} width={40} height={4} rx={2} fill={dark} opacity={0.3} />
    {/* Eyes */}
    <circle cx={45} cy={37} r={1.5} fill={dark} />
    <circle cx={55} cy={37} r={1.5} fill={dark} />
    {/* Manuscript */}
    <rect x={72} y={64} width={8} height={16} rx={1} fill={light} opacity={0.5} />
    <line x1={74} y1={68} x2={78} y2={68} stroke={dark} strokeWidth={0.7} opacity={0.3} />
    <line x1={74} y1={71} x2={78} y2={71} stroke={dark} strokeWidth={0.7} opacity={0.3} />
    {/* Arms */}
    <rect x={24} y={58} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    <rect x={68} y={58} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={36} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
    <rect x={53} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
  </g>
);

// ---- Italian: Renaissance figure (beret, scroll) — emerald ----
const italianChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — renaissance garb */}
    <rect x={32} y={54} width={36} height={40} rx={5} fill={base} />
    <path d="M38,54 L38,90" stroke={light} strokeWidth={2} opacity={0.3} />
    {/* Head */}
    <circle cx={50} cy={38} r={13} fill={light} />
    {/* Beret */}
    <ellipse cx={50} cy={26} rx={16} ry={6} fill={base} />
    <ellipse cx={52} cy={24} rx={12} ry={4} fill={dark} opacity={0.2} />
    {/* Eyes */}
    <circle cx={45} cy={37} r={1.5} fill={dark} />
    <circle cx={55} cy={37} r={1.5} fill={dark} />
    {/* Subtle nose */}
    <path d="M50,38 L48,42" stroke={dark} strokeWidth={1} opacity={0.2} />
    {/* Poetic scroll */}
    <rect x={72} y={60} width={5} height={24} rx={2.5} fill={dark} opacity={0.35} />
    <circle cx={74.5} cy={60} r={3.5} fill={dark} opacity={0.25} />
    {/* Arms */}
    <rect x={24} y={58} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    <rect x={68} y={58} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={36} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
    <rect x={53} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
  </g>
);

// ---- German: Thinker (formal coat, intense gaze) — violet ----
const germanChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — formal coat */}
    <rect x={30} y={54} width={40} height={40} rx={5} fill={base} />
    {/* Coat collar / lapels */}
    <path d="M40,54 L50,62 L60,54" stroke={dark} strokeWidth={2} fill="none" opacity={0.3} />
    <rect x={48} y={62} width={4} height={30} rx={2} fill={dark} opacity={0.15} />
    {/* Head */}
    <circle cx={50} cy={38} r={13} fill={light} />
    {/* Hair — swept */}
    <path d="M37,34 Q38,22 50,22 Q62,22 63,34" fill={dark} opacity={0.25} />
    {/* Eyes — intense */}
    <rect x={43} y={35} width={4} height={2} rx={1} fill={dark} />
    <rect x={53} y={35} width={4} height={2} rx={1} fill={dark} />
    {/* Brow furrow */}
    <line x1={42} y1={32} x2={48} y2={33} stroke={dark} strokeWidth={1} opacity={0.3} />
    <line x1={52} y1={33} x2={58} y2={32} stroke={dark} strokeWidth={1} opacity={0.3} />
    {/* Arms */}
    <rect x={22} y={58} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    <rect x={70} y={58} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={35} y={92} width={12} height={5} rx={2.5} fill={dark} opacity={0.5} />
    <rect x={53} y={92} width={12} height={5} rx={2.5} fill={dark} opacity={0.5} />
  </g>
);

// ---- Spanish: Knight (armor, lance) — red ----
const spanishChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — armor */}
    <rect x={32} y={54} width={36} height={38} rx={4} fill={base} />
    <rect x={36} y={56} width={28} height={4} rx={2} fill={light} opacity={0.3} />
    <rect x={36} y={74} width={28} height={3} rx={1.5} fill={dark} opacity={0.15} />
    {/* Head */}
    <circle cx={50} cy={38} r={13} fill={light} />
    {/* Helmet visor hint */}
    <path d="M37,34 L63,34 L60,28 L40,28 Z" fill={base} opacity={0.35} />
    {/* Eyes */}
    <circle cx={45} cy={37} r={1.5} fill={dark} />
    <circle cx={55} cy={37} r={1.5} fill={dark} />
    {/* Thin mustache */}
    <path d="M44,42 Q50,44 56,42" stroke={dark} strokeWidth={1} fill="none" opacity={0.3} />
    {/* Lance */}
    <line x1={78} y1={26} x2={78} y2={94} stroke={dark} strokeWidth={2} opacity={0.4} />
    <polygon points="78,26 74,34 82,34" fill={base} opacity={0.6} />
    {/* Shield */}
    <ellipse cx={22} cy={70} rx={8} ry={10} fill={base} opacity={0.5} />
    <line x1={22} y1={62} x2={22} y2={78} stroke={dark} strokeWidth={1} opacity={0.3} />
    <line x1={14} y1={70} x2={30} y2={70} stroke={dark} strokeWidth={1} opacity={0.3} />
    {/* Arms */}
    <rect x={24} y={58} width={8} height={22} rx={4} fill={base} opacity={0.8} />
    <rect x={68} y={58} width={8} height={22} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={36} y={90} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
    <rect x={53} y={90} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
  </g>
);

// ---- Russian: Novelist (winter coat, thick book, beard) — crimson ----
const russianChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — heavy winter coat */}
    <rect x={28} y={52} width={44} height={42} rx={6} fill={base} />
    <rect x={46} y={52} width={4} height={40} rx={2} fill={dark} opacity={0.15} />
    {/* Coat collar */}
    <ellipse cx={50} cy={54} rx={18} ry={4} fill={light} opacity={0.35} />
    {/* Head */}
    <circle cx={50} cy={36} r={14} fill={light} />
    {/* Thick beard */}
    <ellipse cx={50} cy={48} rx={10} ry={7} fill={dark} opacity={0.25} />
    <path d="M40,44 Q50,58 60,44" fill={dark} opacity={0.2} />
    {/* Eyes — deep set */}
    <circle cx={44} cy={34} r={1.5} fill={dark} />
    <circle cx={56} cy={34} r={1.5} fill={dark} />
    {/* Hair */}
    <path d="M36,32 Q38,22 50,22 Q62,22 64,32" fill={dark} opacity={0.2} />
    {/* Thick book */}
    <rect x={72} y={62} width={10} height={16} rx={2} fill={dark} opacity={0.4} />
    <rect x={73} y={63} width={2} height={14} rx={1} fill={light} opacity={0.3} />
    {/* Arms */}
    <rect x={20} y={56} width={8} height={26} rx={4} fill={base} opacity={0.8} />
    <rect x={72} y={56} width={8} height={26} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={34} y={92} width={12} height={5} rx={2.5} fill={dark} opacity={0.5} />
    <rect x={54} y={92} width={12} height={5} rx={2.5} fill={dark} opacity={0.5} />
  </g>
);

// ---- Sanskrit: Sage (meditation pose, lotus) — burnt orange ----
const sanskritChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Seated body — cross-legged */}
    <ellipse cx={50} cy={86} rx={22} ry={10} fill={base} opacity={0.8} />
    <rect x={36} y={56} width={28} height={32} rx={6} fill={base} />
    {/* Head */}
    <circle cx={50} cy={42} r={13} fill={light} />
    {/* Top-knot */}
    <ellipse cx={50} cy={30} rx={5} ry={4} fill={dark} opacity={0.3} />
    <rect x={48} y={28} width={4} height={6} rx={2} fill={dark} opacity={0.25} />
    {/* Eyes — closed/meditative */}
    <path d="M43,41 Q45,43 47,41" stroke={dark} strokeWidth={1.2} fill="none" opacity={0.5} />
    <path d="M53,41 Q55,43 57,41" stroke={dark} strokeWidth={1.2} fill="none" opacity={0.5} />
    {/* Dot on forehead */}
    <circle cx={50} cy={37} r={1.2} fill={base} opacity={0.7} />
    {/* Lotus flower below */}
    <ellipse cx={50} cy={98} rx={8} ry={3} fill={base} opacity={0.4} />
    <ellipse cx={44} cy={96} rx={4} ry={6} transform="rotate(-20,44,96)" fill={base} opacity={0.3} />
    <ellipse cx={56} cy={96} rx={4} ry={6} transform="rotate(20,56,96)" fill={base} opacity={0.3} />
    <ellipse cx={50} cy={95} rx={3.5} ry={5.5} fill={light} opacity={0.4} />
    {/* Hands on knees */}
    <circle cx={34} cy={80} r={4} fill={light} opacity={0.6} />
    <circle cx={66} cy={80} r={4} fill={light} opacity={0.6} />
  </g>
);

// ---- Hindi: Poet (dhoti, veena-like instrument) — bright orange ----
const hindiChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Seated body */}
    <ellipse cx={50} cy={86} rx={22} ry={10} fill={base} opacity={0.7} />
    <rect x={36} y={56} width={28} height={32} rx={5} fill={base} />
    {/* Head */}
    <circle cx={50} cy={42} r={13} fill={light} />
    {/* Turban/headwear */}
    <ellipse cx={50} cy={32} rx={14} ry={8} fill={base} opacity={0.6} />
    <path d="M42,32 Q50,24 58,32" fill={dark} opacity={0.2} />
    {/* Eyes */}
    <circle cx={45} cy={41} r={1.5} fill={dark} />
    <circle cx={55} cy={41} r={1.5} fill={dark} />
    {/* Veena — long neck instrument */}
    <line x1={26} y1={42} x2={26} y2={90} stroke={dark} strokeWidth={2} opacity={0.4} />
    <circle cx={26} cy={42} r={5} fill={base} opacity={0.4} />
    <ellipse cx={26} cy={86} rx={6} ry={5} fill={base} opacity={0.35} />
    {/* Strings */}
    <line x1={25} y1={47} x2={25} y2={82} stroke={dark} strokeWidth={0.5} opacity={0.3} />
    <line x1={27} y1={47} x2={27} y2={82} stroke={dark} strokeWidth={0.5} opacity={0.3} />
    {/* Left arm reaching to veena */}
    <path d="M36,64 Q30,68 26,72" stroke={base} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.8} />
    {/* Right hand */}
    <circle cx={66} cy={78} r={4} fill={light} opacity={0.6} />
  </g>
);

// ---- Tibetan: Monk (robes, prayer beads) — dark teal ----
const tibetanChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — monk robes */}
    <rect x={30} y={52} width={40} height={42} rx={6} fill={base} />
    {/* Robe wrap diagonal */}
    <path d="M30,52 L60,52 L70,92 L30,92 Z" fill={light} opacity={0.15} />
    <path d="M30,52 L58,92" stroke={dark} strokeWidth={1.5} opacity={0.2} fill="none" />
    {/* Head — shaved */}
    <circle cx={50} cy={38} r={13} fill={light} />
    {/* Shaved head — no hair, just a subtle shine */}
    <ellipse cx={48} cy={30} rx={6} ry={3} fill={light} opacity={0.3} />
    {/* Eyes — serene */}
    <path d="M43,37 Q45,39 47,37" stroke={dark} strokeWidth={1.2} fill="none" opacity={0.5} />
    <path d="M53,37 Q55,39 57,37" stroke={dark} strokeWidth={1.2} fill="none" opacity={0.5} />
    {/* Gentle smile */}
    <path d="M46,42 Q50,44 54,42" stroke={dark} strokeWidth={0.8} fill="none" opacity={0.3} />
    {/* Prayer beads — string of circles */}
    <circle cx={30} cy={64} r={2} fill={dark} opacity={0.4} />
    <circle cx={28} cy={68} r={2} fill={dark} opacity={0.4} />
    <circle cx={27} cy={72} r={2} fill={dark} opacity={0.4} />
    <circle cx={28} cy={76} r={2} fill={dark} opacity={0.4} />
    <circle cx={30} cy={80} r={2} fill={dark} opacity={0.4} />
    <circle cx={33} cy={83} r={2} fill={dark} opacity={0.4} />
    {/* Arms */}
    <rect x={22} y={56} width={8} height={26} rx={4} fill={base} opacity={0.8} />
    <rect x={70} y={56} width={8} height={26} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={36} y={92} width={11} height={4} rx={2} fill={dark} opacity={0.4} />
    <rect x={53} y={92} width={11} height={4} rx={2} fill={dark} opacity={0.4} />
  </g>
);

// ---- Scots Gaelic: Philosopher (Scottish bonnet, quill + book) — forest green ----
const scotsGaelicChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — jacket with tartan hint */}
    <rect x={32} y={54} width={36} height={40} rx={5} fill={base} />
    {/* Tartan crossing lines */}
    <line x1={38} y1={54} x2={38} y2={92} stroke={dark} strokeWidth={1} opacity={0.15} />
    <line x1={50} y1={54} x2={50} y2={92} stroke={dark} strokeWidth={1} opacity={0.15} />
    <line x1={62} y1={54} x2={62} y2={92} stroke={dark} strokeWidth={1} opacity={0.15} />
    <line x1={32} y1={66} x2={68} y2={66} stroke={dark} strokeWidth={1} opacity={0.15} />
    <line x1={32} y1={78} x2={68} y2={78} stroke={dark} strokeWidth={1} opacity={0.15} />
    {/* Head */}
    <circle cx={50} cy={38} r={13} fill={light} />
    {/* Scottish bonnet (tam) */}
    <ellipse cx={50} cy={28} rx={15} ry={5} fill={base} />
    <ellipse cx={50} cy={26} rx={10} ry={6} fill={base} opacity={0.8} />
    <circle cx={50} cy={22} r={2.5} fill={dark} opacity={0.3} />
    {/* Eyes */}
    <circle cx={45} cy={37} r={1.5} fill={dark} />
    <circle cx={55} cy={37} r={1.5} fill={dark} />
    {/* Book in left hand */}
    <rect x={16} y={66} width={10} height={14} rx={2} fill={dark} opacity={0.35} />
    <line x1={21} y1={66} x2={21} y2={80} stroke={light} strokeWidth={0.8} opacity={0.4} />
    {/* Quill in right hand */}
    <line x1={76} y1={54} x2={82} y2={38} stroke={dark} strokeWidth={1.5} opacity={0.45} />
    <path d="M82,38 L84,36 L80,40 Z" fill={base} opacity={0.5} />
    {/* Arms */}
    <rect x={24} y={58} width={8} height={22} rx={4} fill={base} opacity={0.8} />
    <rect x={68} y={58} width={8} height={22} rx={4} fill={base} opacity={0.8} />
    {/* Feet */}
    <rect x={36} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
    <rect x={53} y={92} width={11} height={5} rx={2.5} fill={dark} opacity={0.5} />
  </g>
);

// ---------------------------------------------------------------------------
// Character registry
// ---------------------------------------------------------------------------

// ---- Hebrew: Prophet (robes, stone tablets) — bronze/dark gold ----
const hebrewChar: CharRenderer = ({ base, light, dark }) => (
  <g>
    {/* Body — flowing robes */}
    <path d="M34,52 L28,94 L72,94 L66,52 Z" fill={base} />
    <path d="M40,52 L36,90 L48,90 L46,52 Z" fill={light} opacity={0.25} />
    {/* Head */}
    <circle cx={50} cy={36} r={13} fill={light} />
    {/* Head covering / shawl */}
    <path d="M36,30 Q50,18 64,30" fill={base} opacity={0.5} />
    <rect x={36} y={28} width={28} height={4} rx={2} fill={base} opacity={0.4} />
    {/* Eyes */}
    <circle cx={45} cy={35} r={1.5} fill={dark} />
    <circle cx={55} cy={35} r={1.5} fill={dark} />
    {/* Beard */}
    <ellipse cx={50} cy={47} rx={8} ry={6} fill={dark} opacity={0.25} />
    <path d="M42,44 Q50,56 58,44" fill={dark} opacity={0.2} />
    {/* Stone tablets — two rounded rectangles */}
    <rect x={14} y={58} width={12} height={18} rx={3} fill={dark} opacity={0.4} />
    <rect x={15.5} y={60} width={9} height={14} rx={2} fill={light} opacity={0.35} />
    {/* Lines on tablet */}
    <line x1={17} y1={63} x2={23} y2={63} stroke={dark} strokeWidth={0.8} opacity={0.3} />
    <line x1={17} y1={66} x2={22} y2={66} stroke={dark} strokeWidth={0.8} opacity={0.3} />
    <line x1={17} y1={69} x2={23} y2={69} stroke={dark} strokeWidth={0.8} opacity={0.3} />
    {/* Second tablet */}
    <rect x={74} y={58} width={12} height={18} rx={3} fill={dark} opacity={0.4} />
    <rect x={75.5} y={60} width={9} height={14} rx={2} fill={light} opacity={0.35} />
    <line x1={77} y1={63} x2={83} y2={63} stroke={dark} strokeWidth={0.8} opacity={0.3} />
    <line x1={77} y1={66} x2={82} y2={66} stroke={dark} strokeWidth={0.8} opacity={0.3} />
    <line x1={77} y1={69} x2={83} y2={69} stroke={dark} strokeWidth={0.8} opacity={0.3} />
    {/* Arms holding tablets */}
    <rect x={24} y={56} width={8} height={24} rx={4} fill={base} opacity={0.8} />
    <rect x={68} y={56} width={8} height={24} rx={4} fill={base} opacity={0.8} />
  </g>
);

const CHARACTER_RENDERERS: Record<Language, CharRenderer> = {
  LATIN: latinChar,
  GREEK: greekChar,
  ARAMAIC: aramaicChar,
  ARABIC: arabicChar,
  OLD_ENGLISH: oldEnglishChar,
  FRENCH: frenchChar,
  ITALIAN: italianChar,
  GERMAN: germanChar,
  SPANISH: spanishChar,
  RUSSIAN: russianChar,
  SANSKRIT: sanskritChar,
  HINDI: hindiChar,
  TIBETAN: tibetanChar,
  SCOTS_GAELIC: scotsGaelicChar,
  HEBREW: hebrewChar,
};

// ---------------------------------------------------------------------------
// LanguageCard component
// ---------------------------------------------------------------------------

export function LanguageCard({
  language,
  isSelected = false,
  onClick,
  size = "md",
}: LanguageCardProps) {
  const config = SIZE_CONFIG[size];
  const hex = EXTENDED_HEX[language];
  const label = EXTENDED_LABELS[language];
  const pal = palette(hex);
  const render = CHARACTER_RENDERERS[language];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-2xl transition-all duration-200 ease-out",
        "border-2 cursor-pointer select-none",
        config.card,
        isSelected
          ? "border-current shadow-lg scale-105 ring-2 ring-current/20"
          : "border-transparent hover:border-stone/40 hover:shadow-md hover:scale-[1.02]",
      )}
      style={{
        backgroundColor: pal.bg,
        color: hex,
      }}
      aria-pressed={isSelected}
      aria-label={`${label} language`}
    >
      {/* Character illustration */}
      <svg
        viewBox="0 0 100 120"
        className="flex-1 w-full max-h-[70%] px-1 pt-1"
        role="img"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={50}
          cy={58}
          r={42}
          fill={hex}
          opacity={0.06}
        />
        {render(pal)}
      </svg>

      {/* Language name */}
      <span
        className={cn(
          "font-semibold pb-2 tracking-wide",
          config.textClass,
        )}
        style={{ color: pal.dark }}
      >
        {label}
      </span>
    </button>
  );
}

export default LanguageCard;
