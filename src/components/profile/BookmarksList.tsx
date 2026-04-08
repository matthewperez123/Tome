"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookOpen,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { Bookmark as BookmarkType } from "@/lib/store";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function BookmarkItem({
  bookmark,
  onRemove,
}: {
  bookmark: BookmarkType;
  onRemove: (id: string) => void;
}) {
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const touchStart = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    setSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.touches[0].clientX;
    // Only allow swiping left
    setSwipeX(Math.max(0, Math.min(diff, 80)));
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (swipeX > 60) {
      onRemove(bookmark.id);
    }
    setSwipeX(0);
    setSwiping(false);
    touchStart.current = null;
  }, [swipeX, onRemove, bookmark.id]);

  const excerpt =
    bookmark.paragraphText.length > 100
      ? bookmark.paragraphText.slice(0, 100) + "..."
      : bookmark.paragraphText;

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-lg">
      {/* Delete action behind swipe */}
      <div className="absolute inset-y-0 right-0 flex items-center justify-center w-20 bg-vermillion text-white">
        <Trash2 className="w-4 h-4" />
      </div>

      {/* Main content */}
      <div
        className={cn(
          "relative bg-snow flex items-start gap-3 p-3 rounded-lg",
          swiping ? "" : "transition-transform duration-200"
        )}
        style={{ transform: `translateX(-${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Link
          href={`/reader/${bookmark.bookId}`}
          className="flex-1 min-w-0"
        >
          <p className="text-sm font-medium text-ink leading-snug">
            {bookmark.chapterTitle}
          </p>
          <p className="text-xs text-graphite mt-1 leading-relaxed line-clamp-2">
            {excerpt}
          </p>
          <p className="text-[10px] text-graphite/60 mt-1.5">
            {formatDate(bookmark.createdAt)}
          </p>
        </Link>

        {/* Desktop delete button */}
        <button
          onClick={() => onRemove(bookmark.id)}
          className="hidden md:flex p-1.5 rounded-lg hover:bg-vermillion/10 text-graphite hover:text-vermillion transition-colors shrink-0"
          aria-label="Remove bookmark"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <Link
          href={`/reader/${bookmark.bookId}`}
          className="md:hidden p-1.5 text-graphite shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export function BookmarksList() {
  const { bookmarks, removeBookmark } = useAppStore();

  // Group bookmarks by book
  const grouped = useMemo(() => {
    const map = new Map<string, BookmarkType[]>();
    // Sort by createdAt descending
    const sorted = [...bookmarks].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    for (const bm of sorted) {
      const existing = map.get(bm.bookId);
      if (existing) {
        existing.push(bm);
      } else {
        map.set(bm.bookId, [bm]);
      }
    }
    return map;
  }, [bookmarks]);

  if (bookmarks.length === 0) {
    return (
      <div className="bg-linen rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Bookmarks
          </h2>
        </div>
        <div className="flex flex-col items-center py-6 text-center">
          <Bookmark className="w-8 h-8 text-stone mb-3" />
          <p className="text-sm text-graphite">No bookmarks yet</p>
          <p className="text-xs text-graphite/60 mt-1">
            Tap the bookmark icon while reading to save passages
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linen rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Bookmarks
        </h2>
        <span className="text-xs text-graphite">
          {bookmarks.length} saved
        </span>
      </div>

      <div className="space-y-4">
        {Array.from(grouped.entries()).map(([bookId, items]) => (
          <div key={bookId}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-ocean" />
              <span className="text-xs font-semibold text-ocean uppercase tracking-wide">
                {items[0].bookTitle}
              </span>
            </div>
            <div className="space-y-1">
              {items.map((bm) => (
                <BookmarkItem
                  key={bm.id}
                  bookmark={bm}
                  onRemove={removeBookmark}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
