"use client";

import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  /** Compact mode for TopBar (icon only) */
  compact?: boolean;
}

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useAppStore();

  // Sync dark class on mount (for persisted preference)
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex items-center justify-center rounded-lg transition-colors",
        compact
          ? "p-1.5 hover:bg-linen text-graphite"
          : "gap-2 px-3 py-2 hover:bg-stone/30 text-graphite hover:text-ink",
        className
      )}
    >
      <Sun
        className={cn(
          "w-[18px] h-[18px] transition-all duration-300",
          isDarkMode
            ? "rotate-90 scale-0 opacity-0 absolute"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "w-[18px] h-[18px] transition-all duration-300",
          isDarkMode
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0 absolute"
        )}
      />
      {!compact && (
        <span className="text-sm font-medium">
          {isDarkMode ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
