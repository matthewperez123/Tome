import { type Difficulty } from "@/types";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: "sm" | "md";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "text-[11px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
} as const;

/**
 * Iris-based palette that increases in intensity with difficulty.
 * Uses the project's iris (#8B5CF6) as the base hue.
 */
const DIFFICULTY_STYLES: Record<
  Difficulty,
  { bg: string; text: string }
> = {
  A1: { bg: "rgba(139,92,246,0.08)", text: "rgba(139,92,246,0.55)" },
  A2: { bg: "rgba(139,92,246,0.12)", text: "rgba(139,92,246,0.65)" },
  B1: { bg: "rgba(139,92,246,0.16)", text: "rgba(139,92,246,0.75)" },
  B2: { bg: "rgba(139,92,246,0.22)", text: "rgba(139,92,246,0.85)" },
  C1: { bg: "rgba(139,92,246,0.30)", text: "rgba(139,92,246,0.95)" },
  C2: { bg: "rgba(139,92,246,0.40)", text: "#FAFAF8" },
};

export function DifficultyBadge({
  difficulty,
  size = "sm",
  className,
}: DifficultyBadgeProps) {
  const style = DIFFICULTY_STYLES[difficulty];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold tabular-nums",
        SIZE_CLASSES[size],
        className,
      )}
      style={{
        backgroundColor: style.bg,
        color: style.text,
      }}
    >
      {difficulty}
    </span>
  );
}

export default DifficultyBadge;
