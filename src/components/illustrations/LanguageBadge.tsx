import { type Language, LANGUAGE_LABELS, LANGUAGE_HEX } from "@/types";
import { cn } from "@/lib/utils";

interface LanguageBadgeProps {
  language: Language;
  size?: "sm" | "md";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "text-[11px] px-2 py-0.5 gap-1.5",
  md: "text-xs px-2.5 py-1 gap-2",
} as const;

const DOT_SIZES = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
} as const;

export function LanguageBadge({
  language,
  size = "sm",
  className,
}: LanguageBadgeProps) {
  const color = LANGUAGE_HEX[language];
  const label = LANGUAGE_LABELS[language];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-linen font-medium text-graphite",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <span
        className={cn("rounded-full flex-shrink-0", DOT_SIZES[size])}
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

export default LanguageBadge;
