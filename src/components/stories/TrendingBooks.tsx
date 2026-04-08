"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGE_COLORS, LANGUAGE_LABELS, type Language } from "@/types";

interface TrendingBook {
  id: string;
  title: string;
  author: string;
  language: Language;
  activeReaders: number;
  recentCompletions: number;
  weeklyXpEarned: number;
  coverColor: string;
  trend: "rising" | "hot" | "steady";
}

// Mock trending data — in production, this would come from an API
// tracking real-time reading sessions
const MOCK_TRENDING: TrendingBook[] = [
  {
    id: "1",
    title: "De Bello Gallico",
    author: "Caesar",
    language: "LATIN",
    activeReaders: 147,
    recentCompletions: 23,
    weeklyXpEarned: 45200,
    coverColor: "#3B82F6",
    trend: "hot",
  },
  {
    id: "7",
    title: "Apology",
    author: "Plato",
    language: "GREEK",
    activeReaders: 89,
    recentCompletions: 12,
    weeklyXpEarned: 28400,
    coverColor: "#8B5CF6",
    trend: "rising",
  },
  {
    id: "3",
    title: "Aeneid Book I",
    author: "Virgil",
    language: "LATIN",
    activeReaders: 76,
    recentCompletions: 8,
    weeklyXpEarned: 21800,
    coverColor: "#3B82F6",
    trend: "steady",
  },
  {
    id: "19",
    title: "Inferno",
    author: "Dante",
    language: "ITALIAN",
    activeReaders: 64,
    recentCompletions: 5,
    weeklyXpEarned: 18900,
    coverColor: "#10B981",
    trend: "rising",
  },
  {
    id: "8",
    title: "Iliad Book I",
    author: "Homer",
    language: "GREEK",
    activeReaders: 52,
    recentCompletions: 3,
    weeklyXpEarned: 15600,
    coverColor: "#8B5CF6",
    trend: "hot",
  },
];

function TrendBadge({ trend }: { trend: TrendingBook["trend"] }) {
  const config = {
    hot: { label: "Hot", bg: "bg-vermillion/10", text: "text-vermillion" },
    rising: { label: "Rising", bg: "bg-saffron/10", text: "text-saffron" },
    steady: { label: "Steady", bg: "bg-clover/10", text: "text-clover" },
  };
  const { label, bg, text } = config[trend];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold",
        bg,
        text
      )}
    >
      <TrendingUp className="w-3 h-3" />
      {label}
    </span>
  );
}

export function TrendingBooks() {
  const [trending, setTrending] = useState<TrendingBook[]>(MOCK_TRENDING);

  // Simulate live reader count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrending((prev) =>
        prev.map((book) => ({
          ...book,
          activeReaders:
            book.activeReaders + Math.floor(Math.random() * 5) - 2,
        }))
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-ink">
            Trending Now
          </h2>
          <p className="text-sm text-graphite">
            Based on active readers this week
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-graphite">
          <span className="w-2 h-2 rounded-full bg-clover animate-pulse" />
          Live
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {trending.map((book, i) => (
          <Link
            key={book.id}
            href={`/stories/${book.id}`}
            className="flex-shrink-0 w-[200px]"
          >
            <div className="bg-linen rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {/* Rank + cover color strip */}
              <div
                className="h-20 relative flex items-center justify-center"
                style={{ backgroundColor: `${book.coverColor}15` }}
              >
                <span
                  className="text-4xl font-serif font-bold"
                  style={{ color: `${book.coverColor}30` }}
                >
                  #{i + 1}
                </span>
                <div className="absolute top-2 right-2">
                  <TrendBadge trend={book.trend} />
                </div>
              </div>

              <div className="p-3">
                <p className="font-serif font-semibold text-sm text-ink truncate">
                  {book.title}
                </p>
                <p className="text-xs text-graphite mb-2">{book.author}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-graphite">
                    <Users className="w-3 h-3" />
                    <span>{book.activeReaders} reading</span>
                  </div>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: `${book.coverColor}15`,
                      color: book.coverColor,
                    }}
                  >
                    {LANGUAGE_LABELS[book.language]}
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
