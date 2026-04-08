"use client";

import Link from "next/link";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import { LANGUAGE_LABELS, LANGUAGE_HEX, type Language } from "@/types";

interface InProgressBook {
  id: string;
  title: string;
  author: string;
  language: Language;
  currentChapter: number;
  totalChapters: number;
  percentComplete: number;
  lastReadAt: string;
  timeSpentMinutes: number;
}

// Mock in-progress books
const MOCK_IN_PROGRESS: InProgressBook[] = [
  {
    id: "1",
    title: "De Bello Gallico",
    author: "Caesar",
    language: "LATIN",
    currentChapter: 5,
    totalChapters: 8,
    percentComplete: 62,
    lastReadAt: "2 hours ago",
    timeSpentMinutes: 145,
  },
  {
    id: "6",
    title: "Anabasis Book I",
    author: "Xenophon",
    language: "GREEK",
    currentChapter: 3,
    totalChapters: 10,
    percentComplete: 28,
    lastReadAt: "Yesterday",
    timeSpentMinutes: 67,
  },
];

export function ContinueReading() {
  if (MOCK_IN_PROGRESS.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-ocean" />
        <h2 className="font-serif text-xl font-bold text-ink">
          Continue Reading
        </h2>
      </div>

      <div className="space-y-3">
        {MOCK_IN_PROGRESS.map((book) => (
          <Link key={book.id} href={`/reader/${book.id}`}>
            <div
              className="bg-snow rounded-xl p-4 hover:shadow-md transition-all group"
              style={{
                border: `1px solid ${LANGUAGE_HEX[book.language]}25`,
                borderLeft: `4px solid ${LANGUAGE_HEX[book.language]}`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-serif font-semibold text-ink">
                    {book.title}
                  </p>
                  <p className="text-sm text-graphite">
                    {book.author} ·{" "}
                    <span style={{ color: LANGUAGE_HEX[book.language] }}>
                      {LANGUAGE_LABELS[book.language]}
                    </span>
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-stone group-hover:text-ocean transition-colors" />
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="h-2 bg-stone/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${book.percentComplete}%`,
                      backgroundColor: LANGUAGE_HEX[book.language],
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-graphite">
                <span>
                  Chapter {book.currentChapter} of {book.totalChapters} ·{" "}
                  {book.percentComplete}%
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{book.lastReadAt}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
