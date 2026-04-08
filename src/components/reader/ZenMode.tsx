"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { LANGUAGE_HEX, type Language } from "@/types";
import { ZenSettings } from "./ZenSettings";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ZenModeProps {
  paragraphs: Array<{ id: string; original: string; english: string }>;
  language: string;
  bookTitle: string;
  chapterTitle: string;
  onExit: () => void;
}

type ZenReadingMode = "original" | "side-by-side" | "transliteration";

// ---------------------------------------------------------------------------
// Gradient presets keyed by progress band
// ---------------------------------------------------------------------------

const GRADIENT_STOPS: Record<string, [string, string]> = {
  "0": ["#FFF8F0", "#FAFAF8"],
  "25": ["#FFF5EB", "#FAFAF8"],
  "50": ["#F5F0FF", "#FAFAF8"],
  "75": ["#FFF8F0", "#F8F5F0"],
  "100": ["#FFF9E6", "#FAFAF8"],
};

function gradientForProgress(pct: number): [string, string] {
  if (pct >= 100) return GRADIENT_STOPS["100"];
  if (pct >= 75) return GRADIENT_STOPS["75"];
  if (pct >= 50) return GRADIENT_STOPS["50"];
  if (pct >= 25) return GRADIENT_STOPS["25"];
  return GRADIENT_STOPS["0"];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ZenMode({
  paragraphs,
  language,
  bookTitle,
  chapterTitle,
  onExit,
}: ZenModeProps) {
  const prefersReduced = usePrefersReducedMotion();
  const langHex = LANGUAGE_HEX[language as Language] ?? "#3B82F6";

  // ---- State ---------------------------------------------------------------
  const [activeParagraph, setActiveParagraph] = useState(0);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [chromeVisible, setChromeVisible] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [fontSize, setFontSize] = useState(22);
  const [readingMode, setReadingMode] = useState<ZenReadingMode>("original");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [startTime] = useState(() => Date.now());

  const scrollRef = useRef<HTMLDivElement>(null);
  const chromeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paragraphRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ---- Derived values ------------------------------------------------------
  const progress = paragraphs.length
    ? ((activeParagraph + 1) / paragraphs.length) * 100
    : 0;
  const [gradTop, gradBottom] = gradientForProgress(progress);

  const totalWords = useMemo(
    () =>
      paragraphs.reduce(
        (sum, p) => sum + p.original.split(/\s+/).filter(Boolean).length,
        0,
      ),
    [paragraphs],
  );

  // ---- Intersection Observer -----------------------------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(idx)) {
              setActiveParagraph(idx);
              if (idx === paragraphs.length - 1) {
                setShowCompletion(true);
              }
            }
          }
        }
      },
      { threshold: [0.3, 0.7] },
    );

    for (const el of paragraphRefs.current.values()) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [paragraphs.length]);

  // ---- Chrome auto-hide ----------------------------------------------------
  const flashChrome = useCallback(() => {
    setChromeVisible(true);
    if (chromeTimer.current) clearTimeout(chromeTimer.current);
    chromeTimer.current = setTimeout(() => setChromeVisible(false), 3000);
  }, []);

  const handleTopTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      if (y < rect.height * 0.2) flashChrome();
    },
    [flashChrome],
  );

  // ---- Paragraph reveal toggle ---------------------------------------------
  const toggleReveal = useCallback((id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ---- Long press for settings ---------------------------------------------
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPointerDown = useCallback(() => {
    longPressTimer.current = setTimeout(() => setSettingsOpen(true), 600);
  }, []);

  const onPointerUp = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);

  // ---- Escape key ----------------------------------------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExit]);

  // ---- Completion stats ----------------------------------------------------
  const elapsedMinutes = Math.max(
    1,
    Math.round((Date.now() - startTime) / 60000),
  );

  // ---- Opacity for a paragraph at a given index ----------------------------
  function paraOpacity(idx: number): number {
    if (idx === activeParagraph) return 1;
    if (idx < activeParagraph) return 0.4;
    return 0.2;
  }

  // --------------------------------------------------------------------------
  // Completion screen
  // --------------------------------------------------------------------------
  if (showCompletion) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background:
            "radial-gradient(ellipse at center, #FFF9E6 0%, #FAFAF8 70%)",
        }}
      >
        <div className="text-center max-w-md px-6">
          <motion.h1
            className="font-serif text-4xl text-stone-800 mb-8"
            initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Chapter complete
          </motion.h1>

          {[
            { label: "Paragraphs read", value: paragraphs.length },
            {
              label: "Time spent",
              value: `${elapsedMinutes} min${elapsedMinutes !== 1 ? "s" : ""}`,
            },
            { label: "Words", value: totalWords },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="mb-4"
              initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                prefersReduced ? undefined : { delay: 0.4 + i * 0.3 }
              }
            >
              <p className="text-sm text-stone-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-serif text-stone-700">{stat.value}</p>
            </motion.div>
          ))}

          <div className="mt-10 flex flex-col gap-3 items-center">
            <motion.button
              className="px-8 py-3 rounded-xl font-medium text-white"
              style={{ backgroundColor: langHex }}
              initial={prefersReduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={prefersReduced ? undefined : { delay: 1.6 }}
              onClick={() => setShowCompletion(false)}
            >
              Continue
            </motion.button>
            <motion.button
              className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
              initial={prefersReduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={prefersReduced ? undefined : { delay: 1.8 }}
              onClick={onExit}
            >
              Exit Zen Mode
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Main reading view
  // --------------------------------------------------------------------------
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden select-none"
      style={{
        background: `linear-gradient(to bottom, ${gradTop}, ${gradBottom})`,
        transition: "background 2s ease",
      }}
      onClick={handleTopTap}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* ---- Hidden chrome (top bar) ---- */}
      <AnimatePresence>
        {chromeVisible && (
          <motion.div
            className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-md"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-700 truncate">
                {bookTitle}
              </p>
              <p className="text-xs text-stone-400">{chapterTitle}</p>
            </div>
            <span className="text-xs font-mono text-stone-400 mx-4">
              {Math.round(progress)}%
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExit();
              }}
              className="p-2 rounded-full hover:bg-stone-200/50 transition-colors"
              aria-label="Exit Zen Mode"
            >
              <X size={18} className="text-stone-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Scrollable paragraph area ---- */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain px-6 py-24"
      >
        <div className="mx-auto" style={{ maxWidth: 560 }}>
          {paragraphs.map((p, idx) => {
            const isRevealed = revealedIds.has(p.id);
            const opacity = paraOpacity(idx);

            return (
              <div
                key={p.id}
                ref={(el) => {
                  if (el) paragraphRefs.current.set(p.id, el);
                }}
                data-index={idx}
                className="mb-12 cursor-pointer"
                style={{
                  opacity,
                  transition: prefersReduced
                    ? "opacity 0.05s"
                    : "opacity 600ms ease",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (readingMode === "original") toggleReveal(p.id);
                }}
              >
                {/* Original text */}
                <p
                  className="font-serif text-stone-800 leading-[2]"
                  style={{ fontSize }}
                >
                  {p.original}
                </p>

                {/* English translation */}
                {(readingMode === "side-by-side" ||
                  (readingMode === "original" && isRevealed)) && (
                  <motion.p
                    className="font-serif text-stone-400 leading-relaxed mt-3"
                    style={{ fontSize: fontSize - 2 }}
                    initial={
                      prefersReduced ? undefined : { opacity: 0, height: 0 }
                    }
                    animate={{ opacity: 1, height: "auto" }}
                    exit={
                      prefersReduced ? undefined : { opacity: 0, height: 0 }
                    }
                    transition={{ duration: 0.4 }}
                  >
                    {p.english}
                  </motion.p>
                )}

                {/* Transliteration placeholder (same slot as english for now) */}
                {readingMode === "transliteration" && (
                  <p
                    className="font-mono text-stone-400 leading-relaxed mt-3"
                    style={{ fontSize: fontSize - 4 }}
                  >
                    {p.english}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Bottom progress line (always visible) ---- */}
      <div
        className="absolute bottom-0 inset-x-0 h-[2px] transition-opacity duration-300 group"
        style={{ opacity: 0.05 }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "0.2";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "0.05";
        }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: langHex,
          }}
        />
      </div>

      {/* ---- Breathing progress dot ---- */}
      <div className="absolute bottom-4 right-4 group/dot">
        <motion.div
          className="rounded-full flex items-center justify-center"
          style={{
            width: 12,
            height: 12,
            backgroundColor: langHex,
            opacity: 0.3,
          }}
          animate={
            prefersReduced
              ? undefined
              : { scale: [1, 1.2, 1] }
          }
          transition={
            prefersReduced
              ? undefined
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {/* Hover tooltip: paragraph number */}
        <span className="absolute bottom-full right-0 mb-2 text-xs font-mono text-stone-400 opacity-0 group-hover/dot:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {activeParagraph + 1} / {paragraphs.length}
        </span>
      </div>

      {/* ---- Zen Settings panel ---- */}
      <AnimatePresence>
        {settingsOpen && (
          <ZenSettings
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            readingMode={readingMode}
            onReadingModeChange={setReadingMode}
            onExit={onExit}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
