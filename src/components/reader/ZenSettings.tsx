"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ZenReadingMode = "original" | "side-by-side" | "transliteration";

interface ZenSettingsProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  readingMode: ZenReadingMode;
  onReadingModeChange: (mode: ZenReadingMode) => void;
  onExit: () => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Reading mode options
// ---------------------------------------------------------------------------

const MODES: { value: ZenReadingMode; label: string }[] = [
  { value: "original", label: "Original only" },
  { value: "side-by-side", label: "Side by side" },
  { value: "transliteration", label: "Transliteration" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ZenSettings({
  fontSize,
  onFontSizeChange,
  readingMode,
  onReadingModeChange,
  onExit,
  onClose,
}: ZenSettingsProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40"
        initial={prefersReduced ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={prefersReduced ? undefined : { opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed bottom-8 left-1/2 z-50 w-72 -translate-x-1/2 rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl border border-stone-200/40 p-5"
        initial={prefersReduced ? undefined : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReduced ? undefined : { opacity: 0, y: 24 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Font size slider */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
            Font size
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 font-mono">A</span>
            <input
              type="range"
              min={16}
              max={32}
              step={1}
              value={fontSize}
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="flex-1 accent-stone-400 h-1"
            />
            <span className="text-base text-stone-400 font-mono">A</span>
          </div>
          <p className="text-xs text-stone-400 text-center mt-1">
            {fontSize}px
          </p>
        </div>

        {/* Reading mode */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
            Reading mode
          </label>
          <div className="flex flex-col gap-1">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => onReadingModeChange(m.value)}
                className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  readingMode === m.value
                    ? "bg-stone-200/60 text-stone-800 font-medium"
                    : "text-stone-500 hover:bg-stone-100/50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exit link */}
        <button
          onClick={onExit}
          className="w-full text-center text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          Exit Zen Mode
        </button>
      </motion.div>
    </>
  );
}
