"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LANGUAGE_LABELS, LANGUAGE_HEX, type Language } from "@/types";
import { BookCover } from "@/components/illustrations/BookCover";
import { MOCK_BOOKS } from "@/lib/mock-data";

interface RecommendedBook {
  id: string;
  title: string;
  author: string;
  language: Language;
  difficulty: string;
  reason: string;
  matchPercent: number;
}

// Mock recommendations — in production, based on user's reading history,
// vocabulary level, and preferred languages
const MOCK_RECOMMENDED: RecommendedBook[] = [
  {
    id: "2",
    title: "In Catilinam I",
    author: "Cicero",
    language: "LATIN",
    difficulty: "B1",
    reason: "You know 72% of the vocabulary",
    matchPercent: 72,
  },
  {
    id: "6",
    title: "Anabasis Book I",
    author: "Xenophon",
    language: "GREEK",
    difficulty: "A2",
    reason: "Great next step after basic Greek",
    matchPercent: 45,
  },
  {
    id: "19",
    title: "Inferno",
    author: "Dante",
    language: "ITALIAN",
    difficulty: "B2",
    reason: "Popular with Latin readers",
    matchPercent: 38,
  },
];

export function RecommendedBooks() {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-iris" />
        <h2 className="font-serif text-xl font-bold text-ink">
          Recommended for You
        </h2>
      </div>

      <div className="space-y-3">
        {MOCK_RECOMMENDED.map((book) => (
          <Link key={book.id} href={`/stories/${book.id}`}>
            <div className="flex items-center gap-4 bg-linen rounded-xl p-4 hover:shadow-sm transition-shadow">
              {/* Mini cover */}
              {(() => {
                const mockBook = MOCK_BOOKS.find((b) => b.id === book.id);
                return mockBook ? (
                  <BookCover coverStyle={mockBook.coverStyle} size="sm" className="w-12 h-16 flex-shrink-0" />
                ) : (
                  <div
                    className="w-12 h-16 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${LANGUAGE_HEX[book.language]}15` }}
                  />
                );
              })()}

              <div className="flex-1 min-w-0">
                <p className="font-serif font-semibold text-sm text-ink truncate">
                  {book.title}
                </p>
                <p className="text-xs text-graphite">
                  {book.author} · {LANGUAGE_LABELS[book.language]} ·{" "}
                  {book.difficulty}
                </p>
                <p className="text-xs text-iris mt-1">{book.reason}</p>
              </div>

              {/* Match ring */}
              <div className="flex-shrink-0 text-center">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="#E8E6E1"
                      strokeWidth="3"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke={LANGUAGE_HEX[book.language]}
                      strokeWidth="3"
                      strokeDasharray={`${book.matchPercent} ${100 - book.matchPercent}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink">
                    {book.matchPercent}%
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
