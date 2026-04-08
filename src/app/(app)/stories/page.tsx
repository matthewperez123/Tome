"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MOCK_BOOKS, type MockBook } from "@/lib/mock-data";
import { LANGUAGE_LABELS, LANGUAGE_HEX, LANGUAGE_COLORS, type Language, type Difficulty } from "@/types";
import { TrendingBooks } from "@/components/stories/TrendingBooks";
import { RecommendedBooks } from "@/components/stories/RecommendedBooks";
import { ContinueReading } from "@/components/stories/ContinueReading";
import { ReadingCircles } from "@/components/stories/ReadingCircle";

/* ─── Abstract Cover Art ────────────────────────────────── */

function CoverArt({ book }: { book: MockBook }) {
  const bgColor = book.coverStyle.palette[0];
  const accentColor = book.coverStyle.palette[1] || book.coverStyle.palette[0];
  const seed = book.coverStyle.seed;

  return (
    <div
      className="relative h-40 overflow-hidden rounded-t-xl"
      style={{ background: `linear-gradient(135deg, ${bgColor}22 0%, ${accentColor}15 100%)` }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 160"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Shape 1 */}
        {book.coverStyle.shapes[0] === "column" && (
          <rect
            x={30 + (seed % 40)}
            y={20}
            width={20}
            height={120}
            rx={4}
            fill={bgColor}
            opacity={0.25}
          />
        )}
        {book.coverStyle.shapes[0] === "wave" && (
          <path
            d={`M0,${80 + (seed % 30)} Q50,${40 + (seed % 20)} 100,${80 + (seed % 30)} T200,${80 + (seed % 30)}`}
            fill="none"
            stroke={bgColor}
            strokeWidth={3}
            opacity={0.35}
          />
        )}
        {book.coverStyle.shapes[0] === "arc" && (
          <circle
            cx={100}
            cy={160}
            r={80 + (seed % 30)}
            fill="none"
            stroke={bgColor}
            strokeWidth={2}
            opacity={0.25}
          />
        )}
        {book.coverStyle.shapes[0] === "circle" && (
          <circle
            cx={60 + (seed % 40)}
            cy={80}
            r={30 + (seed % 20)}
            fill={bgColor}
            opacity={0.2}
          />
        )}

        {/* Shape 2 */}
        {book.coverStyle.shapes[1] === "wave" && (
          <path
            d={`M0,${100 + (seed % 20)} Q70,${60 + (seed % 30)} 140,${100 + (seed % 20)} T200,${100 + (seed % 20)}`}
            fill="none"
            stroke={accentColor}
            strokeWidth={2}
            opacity={0.28}
          />
        )}
        {book.coverStyle.shapes[1] === "column" && (
          <rect
            x={120 + (seed % 30)}
            y={30}
            width={16}
            height={100}
            rx={3}
            fill={accentColor}
            opacity={0.22}
          />
        )}
        {book.coverStyle.shapes[1] === "circle" && (
          <circle
            cx={140 + (seed % 30)}
            cy={60 + (seed % 40)}
            r={20 + (seed % 15)}
            fill={accentColor}
            opacity={0.18}
          />
        )}
        {book.coverStyle.shapes[1] === "dot-grid" && (
          <g opacity={0.22}>
            {Array.from({ length: 16 }).map((_, i) => (
              <circle
                key={i}
                cx={100 + (i % 4) * 20 + (seed % 10)}
                cy={40 + Math.floor(i / 4) * 20 + (seed % 10)}
                r={2.5}
                fill={accentColor}
              />
            ))}
          </g>
        )}
        {book.coverStyle.shapes[1] === "arc" && (
          <circle
            cx={160}
            cy={0}
            r={60 + (seed % 20)}
            fill="none"
            stroke={accentColor}
            strokeWidth={2}
            opacity={0.22}
          />
        )}
      </svg>
    </div>
  );
}

/* ─── Book Card ─────────────────────────────────────────── */

function BookCard({ book }: { book: MockBook }) {
  const hex = LANGUAGE_HEX[book.language];

  return (
    <Link href={`/stories/${book.id}`} className="group">
      <div
        className="bg-snow rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 duration-200"
        style={{ border: `1.5px solid ${hex}30` }}
      >
        {/* Cover */}
        <div className="relative">
          <CoverArt book={book} />
          {/* Language badge */}
          <span
            className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: `${hex}33`, color: hex }}
          >
            {LANGUAGE_LABELS[book.language]}
          </span>
          {/* Level badge */}
          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-ink backdrop-blur-sm">
            {book.difficulty}
          </span>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3
            className="font-serif text-sm font-semibold text-ink leading-tight line-clamp-1 transition-colors"
            style={{ color: undefined }}
          >
            {book.title}
          </h3>
          <p className="text-xs text-graphite mt-0.5">{book.author}</p>
          {/* Color accent line */}
          <div
            className="mt-2 h-0.5 rounded-full w-8 opacity-60"
            style={{ backgroundColor: hex }}
          />
        </div>
      </div>
    </Link>
  );
}

/* ─── Filter Pills ──────────────────────────────────────── */

type LanguageFilter = "ALL" | Language;

const LANGUAGE_OPTIONS: { value: LanguageFilter; label: string; hex: string }[] = [
  { value: "ALL", label: "All", hex: "#6B6966" },
  ...Object.entries(LANGUAGE_LABELS).map(([key, label]) => ({
    value: key as Language,
    label,
    hex: LANGUAGE_HEX[key as Language],
  })),
];

const LEVEL_OPTIONS: (Difficulty | "ALL")[] = ["ALL", "A1", "A2", "B1", "B2", "C1", "C2"];

function LanguagePill({
  option,
  isActive,
  onClick,
}: {
  option: (typeof LANGUAGE_OPTIONS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
        isActive ? "text-white shadow-sm" : "border"
      )}
      style={
        isActive
          ? { backgroundColor: option.hex }
          : { borderColor: `${option.hex}40`, color: option.hex }
      }
    >
      {option.label}
    </button>
  );
}

/* ─── Main Stories Page ─────────────────────────────────── */

export default function StoriesPage() {
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("ALL");
  const [levelFilter, setLevelFilter] = useState<Difficulty | "ALL">("ALL");

  const filteredBooks = MOCK_BOOKS.filter((book) => {
    if (languageFilter !== "ALL" && book.language !== languageFilter) return false;
    if (levelFilter !== "ALL" && book.difficulty !== levelFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-ink">Stories</h1>
        <p className="text-sm text-graphite mt-1">
          Explore classical texts across languages and difficulty levels
        </p>
      </div>

      {/* Continue Reading */}
      <ContinueReading />

      {/* Trending Now */}
      <TrendingBooks />

      {/* Recommended for You */}
      <RecommendedBooks />

      {/* Community — Reading Circles + Recommendations */}
      <ReadingCircles />

      {/* Full Library — Scroll Reader */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg font-semibold text-ink">Full Library</h2>
          <span className="text-xs text-graphite">797 books available</span>
        </div>
        <Link
          href="/read/scroll/the-odyssey"
          className="block rounded-xl border border-stone/40 bg-linen/50 p-4 hover:border-ocean/40 hover:bg-ocean/5 transition-all duration-200"
        >
          <p className="text-sm font-medium text-ink">Browse the complete Supabase library</p>
          <p className="text-xs text-graphite mt-1">
            Access 797 books with 3,484 chapters in the scroll reader — full texts from antiquity to modern classics.
          </p>
          <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-ocean">
            Open scroll reader &rarr;
          </span>
        </Link>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {MOCK_BOOKS.slice(0, 3).map((book) => (
            <Link
              key={book.id}
              href={`/read/scroll/${book.id}`}
              className="flex items-center gap-2 rounded-lg border border-stone/30 bg-snow px-3 py-2 hover:border-ocean/40 transition-colors"
            >
              <div
                className="shrink-0 size-8 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: LANGUAGE_HEX[book.language] }}
              >
                {book.title.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink truncate">{book.title}</p>
                <p className="text-[10px] text-graphite truncate">{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Language filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {LANGUAGE_OPTIONS.map((option) => (
          <LanguagePill
            key={option.value}
            option={option}
            isActive={languageFilter === option.value}
            onClick={() => setLanguageFilter(option.value)}
          />
        ))}
      </div>

      {/* Level filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {LEVEL_OPTIONS.map((level) => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={cn(
              "flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
              levelFilter === level
                ? "bg-ink text-snow"
                : "border border-stone/40 text-graphite hover:bg-linen"
            )}
          >
            {level === "ALL" ? "All levels" : level}
          </button>
        ))}
      </div>

      {/* Book grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-graphite text-sm">No books match the selected filters.</p>
          <button
            onClick={() => {
              setLanguageFilter("ALL");
              setLevelFilter("ALL");
            }}
            className="mt-3 text-sm text-ocean font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}
