"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  ChevronDown,
  ChevronRight,
  Check,
  Lock,
  Layers,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_BOOKS,
  getMockChapters,
  getBookProgress,
  MOCK_SYNOPSIS,
  getPreviewParagraphs,
} from "@/lib/mock-data";
import { LANGUAGE_LABELS, LANGUAGE_HEX, type Language } from "@/types";

/* ─── Hero Art ──────────────────────────────────────────── */

function HeroArt({ book }: { book: (typeof MOCK_BOOKS)[number] }) {
  const bgColor = book.coverStyle.palette[0];
  const accentColor = book.coverStyle.palette[1] || bgColor;
  const seed = book.coverStyle.seed;

  return (
    <div className="relative h-[200px] -mx-4 -mt-6 overflow-hidden" style={{ backgroundColor: `${bgColor}18` }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        {/* Large background shape */}
        <circle cx={200} cy={220} r={160 + (seed % 40)} fill={bgColor} opacity={0.06} />

        {/* Shape 1 */}
        {book.coverStyle.shapes[0] === "column" && (
          <>
            <rect x={60 + (seed % 30)} y={20} width={24} height={160} rx={6} fill={bgColor} opacity={0.12} />
            <rect x={100 + (seed % 30)} y={40} width={18} height={140} rx={4} fill={bgColor} opacity={0.08} />
          </>
        )}
        {book.coverStyle.shapes[0] === "wave" && (
          <>
            <path d={`M0,${100 + (seed % 30)} Q100,${50 + (seed % 30)} 200,${100 + (seed % 30)} T400,${100 + (seed % 30)}`} fill="none" stroke={bgColor} strokeWidth={3} opacity={0.15} />
            <path d={`M0,${120 + (seed % 20)} Q120,${70 + (seed % 20)} 240,${120 + (seed % 20)} T400,${120 + (seed % 20)}`} fill="none" stroke={bgColor} strokeWidth={2} opacity={0.08} />
          </>
        )}
        {book.coverStyle.shapes[0] === "arc" && (
          <circle cx={200} cy={250} r={140 + (seed % 40)} fill="none" stroke={bgColor} strokeWidth={3} opacity={0.12} />
        )}
        {book.coverStyle.shapes[0] === "circle" && (
          <circle cx={120 + (seed % 60)} cy={100} r={50 + (seed % 30)} fill={bgColor} opacity={0.08} />
        )}

        {/* Shape 2 */}
        {book.coverStyle.shapes[1] === "wave" && (
          <path d={`M0,${140 + (seed % 20)} Q80,${80 + (seed % 30)} 200,${140 + (seed % 20)} T400,${140 + (seed % 20)}`} fill="none" stroke={accentColor} strokeWidth={2} opacity={0.1} />
        )}
        {book.coverStyle.shapes[1] === "column" && (
          <rect x={280 + (seed % 40)} y={30} width={20} height={140} rx={5} fill={accentColor} opacity={0.1} />
        )}
        {book.coverStyle.shapes[1] === "circle" && (
          <circle cx={300 + (seed % 40)} cy={80 + (seed % 40)} r={35 + (seed % 20)} fill={accentColor} opacity={0.07} />
        )}
        {book.coverStyle.shapes[1] === "dot-grid" && (
          <g opacity={0.08}>
            {Array.from({ length: 25 }).map((_, i) => (
              <circle key={i} cx={220 + (i % 5) * 24 + (seed % 10)} cy={40 + Math.floor(i / 5) * 24 + (seed % 10)} r={3} fill={accentColor} />
            ))}
          </g>
        )}
        {book.coverStyle.shapes[1] === "arc" && (
          <circle cx={350} cy={0} r={80 + (seed % 30)} fill="none" stroke={accentColor} strokeWidth={2} opacity={0.1} />
        )}
      </svg>
    </div>
  );
}

/* ─── Chapter Accordion ─────────────────────────────────── */

function ChapterList({ bookId }: { bookId: string }) {
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const chapters = getMockChapters(bookId);

  return (
    <div className="flex flex-col divide-y divide-stone/20">
      {chapters.map((chapter) => {
        const isOpen = openChapter === chapter.id;
        return (
          <div key={chapter.id}>
            <button
              onClick={() => setOpenChapter(isOpen ? null : chapter.id)}
              className="w-full flex items-center gap-3 py-3.5 text-left hover:bg-linen/50 transition-colors rounded-lg px-2 -mx-2"
            >
              {/* Status icon */}
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                  chapter.completed
                    ? "bg-clover/15 text-clover"
                    : "bg-stone/20 text-graphite/50"
                )}
              >
                {chapter.completed ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : (
                  <span className="text-xs font-semibold">{chapter.number}</span>
                )}
              </div>

              {/* Chapter info */}
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", chapter.completed ? "text-ink" : "text-graphite")}>
                  {chapter.title}
                </p>
                <p className="text-xs text-graphite/70">
                  {chapter.wordCount} words &middot; ~{chapter.estimatedMinutes} min
                </p>
              </div>

              {/* Chevron */}
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-graphite flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-graphite flex-shrink-0" />
              )}
            </button>

            {/* Expanded content */}
            {isOpen && (
              <div className="pl-12 pr-2 pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-xs text-graphite mb-3">
                  Practice vocabulary and grammar from this chapter, then read the original text with translation support.
                </p>
                <Link
                  href={`/reader/${bookId}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean hover:underline"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {chapter.completed ? "Read again" : "Start chapter"}
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Book Detail Page ─────────────────────────────── */

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const [synopsisOpen, setSynopsisOpen] = useState(false);

  const book = MOCK_BOOKS.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-graphite">Book not found.</p>
        <Link href="/stories" className="mt-3 text-sm text-ocean font-medium hover:underline">
          Back to Stories
        </Link>
      </div>
    );
  }

  const progress = getBookProgress(bookId);
  const totalWords = getMockChapters(bookId).reduce((sum, ch) => sum + ch.wordCount, 0);
  const totalMinutes = getMockChapters(bookId).reduce((sum, ch) => sum + ch.estimatedMinutes, 0);
  const synopsis = MOCK_SYNOPSIS[bookId] || "A classical text selected for language learners.";
  const preview = getPreviewParagraphs(bookId);

  const hex = LANGUAGE_HEX[book.language];

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/stories"
        className="inline-flex items-center gap-1.5 text-sm text-graphite hover:text-ink transition-colors -mt-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Stories
      </Link>

      {/* Hero */}
      <HeroArt book={book} />

      {/* Info card overlapping hero */}
      <div className="bg-white rounded-xl shadow-sm border border-stone/15 p-5 -mt-10 relative z-10">
        <h1 className="font-serif text-xl font-bold text-ink">{book.title}</h1>
        <p className="text-sm text-graphite mt-0.5">{book.author}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${hex}26`, color: hex }}
          >
            {LANGUAGE_LABELS[book.language]}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-linen text-ink">
            {book.difficulty}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-saffron/15 text-saffron">
            {book.genre}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-stone/15">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-graphite" />
            <span className="text-xs text-graphite">
              <span className="font-semibold text-ink">{book.chapterCount}</span> chapters
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Type className="w-4 h-4 text-graphite" />
            <span className="text-xs text-graphite">
              <span className="font-semibold text-ink">{totalWords.toLocaleString()}</span> words
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-graphite" />
            <span className="text-xs text-graphite">
              <span className="font-semibold text-ink">~{totalMinutes}</span> min
            </span>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <Link
        href={`/reader/${bookId}`}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-ocean text-white font-semibold rounded-xl hover:bg-ocean/90 transition-colors shadow-sm"
      >
        <BookOpen className="w-5 h-5" />
        {progress.completed > 0 ? "Continue reading" : "Start reading"}
      </Link>

      {/* Synopsis */}
      <div>
        <button
          onClick={() => setSynopsisOpen(!synopsisOpen)}
          className="flex items-center gap-2 w-full text-left"
        >
          <h2 className="font-serif text-lg font-semibold text-ink">Synopsis</h2>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-graphite transition-transform duration-200",
              synopsisOpen && "rotate-180"
            )}
          />
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            synopsisOpen ? "max-h-96 opacity-100 mt-2" : "max-h-16 mt-2"
          )}
        >
          <p
            className={cn(
              "text-sm text-graphite leading-relaxed",
              !synopsisOpen && "line-clamp-2"
            )}
          >
            {synopsis}
          </p>
        </div>
        {!synopsisOpen && (
          <button
            onClick={() => setSynopsisOpen(true)}
            className="text-xs text-ocean font-medium mt-1 hover:underline"
          >
            Read more
          </button>
        )}
      </div>

      {/* Preview section */}
      <div>
        <h2 className="font-serif text-lg font-semibold text-ink">Preview</h2>
        <div className="relative mt-3 space-y-4">
          {preview.map((para, i) => (
            <div key={i} className="space-y-1.5">
              <p className="text-sm text-ink font-serif leading-relaxed italic">
                {para.original}
              </p>
              <p className="text-xs text-graphite leading-relaxed">
                {para.translation}
              </p>
            </div>
          ))}
          {/* Fade overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-snow to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Chapter list */}
      <div>
        <h2 className="font-serif text-lg font-semibold text-ink mb-2">
          Chapters
          <span className="text-sm text-graphite font-sans font-normal ml-2">
            {progress.completed}/{progress.total}
          </span>
        </h2>

        {/* Progress bar */}
        {progress.total > 0 && (
          <div className="h-1.5 bg-stone/20 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-clover rounded-full transition-all duration-500"
              style={{ width: `${(progress.completed / progress.total) * 100}%` }}
            />
          </div>
        )}

        <ChapterList bookId={bookId} />
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
}
