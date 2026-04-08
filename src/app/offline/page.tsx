"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff, BookOpen, ArrowRight } from "lucide-react";

interface CachedBook {
  url: string;
  title: string;
}

export default function OfflinePage() {
  const [cachedBooks, setCachedBooks] = useState<CachedBook[]>([]);

  useEffect(() => {
    async function loadCachedBooks() {
      if ("caches" in window) {
        try {
          const cache = await caches.open("codex-v1");
          const keys = await cache.keys();
          const bookUrls = keys
            .map((req) => req.url)
            .filter((url) => url.includes("/reader/"));
          const books = bookUrls.map((url) => {
            const id = url.split("/reader/")[1]?.split("/")[0] || "unknown";
            return { url: new URL(url).pathname, title: `Book ${id}` };
          });
          setCachedBooks(books);
        } catch {
          // Cache API not available
        }
      }
    }
    loadCachedBooks();
  }, []);

  return (
    <div className="min-h-screen bg-snow flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Illustration */}
        <div className="mx-auto w-32 h-32">
          <svg
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Cloud body */}
            <ellipse cx="64" cy="64" rx="40" ry="24" fill="#E8E6E1" />
            <circle cx="42" cy="56" r="18" fill="#E8E6E1" />
            <circle cx="78" cy="52" r="22" fill="#E8E6E1" />
            <circle cx="60" cy="48" r="20" fill="#E8E6E1" />
            {/* X mark */}
            <line
              x1="54"
              y1="56"
              x2="74"
              y2="76"
              stroke="#6B6966"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="74"
              y1="56"
              x2="54"
              y2="76"
              stroke="#6B6966"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Small rain drops */}
            <line
              x1="44"
              y1="90"
              x2="44"
              y2="98"
              stroke="#E8E6E1"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="64"
              y1="92"
              x2="64"
              y2="100"
              stroke="#E8E6E1"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="84"
              y1="90"
              x2="84"
              y2="98"
              stroke="#E8E6E1"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <WifiOff className="w-5 h-5 text-graphite" />
            <h1 className="font-serif text-xl font-semibold text-ink">
              You&apos;re Offline
            </h1>
          </div>
          <p className="text-sm text-graphite">
            No internet connection detected. Your downloaded books are still
            available for reading.
          </p>
        </div>

        {cachedBooks.length > 0 ? (
          <div className="bg-linen rounded-xl p-4 text-left">
            <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-ocean" />
              Available Offline
            </h2>
            <div className="space-y-2">
              {cachedBooks.map((book) => (
                <Link
                  key={book.url}
                  href={book.url}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-snow hover:bg-stone/30 transition-colors"
                >
                  <span className="text-sm text-ink">{book.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-graphite" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-linen rounded-xl p-4">
            <p className="text-sm text-graphite">
              No books have been downloaded for offline reading yet. When you
              read a book while online, it will be cached automatically.
            </p>
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ocean text-white rounded-full text-sm font-medium hover:bg-ocean/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
