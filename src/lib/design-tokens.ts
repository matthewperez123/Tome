// ─────────────────────────────────────────────
// Tome Design System — Design Tokens
// ─────────────────────────────────────────────

// ── Colors: 18-Hue Spectrum ──────────────────

export const hues = {
  red: "#EF4444",
  coral: "#F97316",
  orange: "#FB923C",
  amber: "#F59E0B",
  gold: "#EAB308",
  lime: "#84CC16",
  green: "#22C55E",
  emerald: "#10B981",
  teal: "#14B8A6",
  cyan: "#06B6D4",
  sky: "#0EA5E9",
  blue: "#3B82F6",
  indigo: "#6366F1",
  violet: "#8B5CF6",
  purple: "#A855F7",
  fuchsia: "#D946EF",
  pink: "#EC4899",
  rose: "#F43F5E",
} as const;

// ── Surface Colors ───────────────────────────

export const surfaces = {
  white: "#FFFFFF",
  elevated: "#F9FAFB",
  recessed: "#F3F4F6",
  spotlight: "#111827",
} as const;

// ── Semantic Colors ──────────────────────────

export const semantic = {
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  accent: "#6366F1",
} as const;

// ── Typography Scale ─────────────────────────

export type TypographyToken = {
  fontSize: string;
  fontWeight: number;
  letterSpacing: string;
  fontFamily: string;
};

const fontFamily = "var(--font-sans)";

export const typography = {
  display: {
    fontSize: "40px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    fontFamily,
  },
  h1: {
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "-0.025em",
    fontFamily,
  },
  h2: {
    fontSize: "24px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    fontFamily,
  },
  h3: {
    fontSize: "20px",
    fontWeight: 600,
    letterSpacing: "-0.015em",
    fontFamily,
  },
  body: {
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0em",
    fontFamily,
  },
  "body-strong": {
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0em",
    fontFamily,
  },
  small: {
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: "+0.01em",
    fontFamily,
  },
  micro: {
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "+0.02em",
    fontFamily,
  },
} as const satisfies Record<string, TypographyToken>;

// ── Spacing (4px base grid) ──────────────────

export const spacing = {
  0: "0px",
  px: "1px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",
} as const;

// ── Motion: Easing Curves ────────────────────

export const ease = {
  scholarly: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

// ── Motion: Spring Configs (for framer-motion) ─

export const springs = {
  interactive: { type: "spring" as const, stiffness: 300, damping: 25 },
  gentle: { type: "spring" as const, stiffness: 120, damping: 20 },
} as const;

// ── Motion: Durations ────────────────────────

export const durations = {
  instant: "100ms",
  fast: "200ms",
  normal: "350ms",
  slow: "500ms",
  reveal: "800ms",
} as const;

// ── Motion: Stagger ──────────────────────────

export const stagger = 0.06;

// ── Aggregate Export ─────────────────────────

export const tokens = {
  hues,
  surfaces,
  semantic,
  typography,
  spacing,
  ease,
  springs,
  durations,
  stagger,
} as const;
