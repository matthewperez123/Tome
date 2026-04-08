"use client";

import { useMemo, useCallback } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { Bookmark as BookmarkType } from "@/lib/store";

interface BookmarkButtonProps {
  bookId: string;
  bookTitle: string;
  chapterId: string;
  chapterTitle: string;
  paragraphId: string;
  paragraphText: string;
  language: string;
}

export function BookmarkButton({
  bookId,
  bookTitle,
  chapterId,
  chapterTitle,
  paragraphId,
  paragraphText,
  language,
}: BookmarkButtonProps) {
  const { bookmarks, addBookmark, removeBookmark } = useAppStore();

  const existing = useMemo(
    () => bookmarks.find((b) => b.paragraphId === paragraphId),
    [bookmarks, paragraphId]
  );

  const isBookmarked = !!existing;

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (existing) {
        removeBookmark(existing.id);
      } else {
        const bookmark: BookmarkType = {
          id: `bm-${paragraphId}-${Date.now()}`,
          bookId,
          bookTitle,
          chapterId,
          chapterTitle,
          paragraphId,
          paragraphText: paragraphText.slice(0, 200),
          language,
          createdAt: new Date().toISOString(),
        };
        addBookmark(bookmark);
      }
    },
    [
      existing,
      removeBookmark,
      addBookmark,
      bookId,
      bookTitle,
      chapterId,
      chapterTitle,
      paragraphId,
      paragraphText,
      language,
    ]
  );

  return (
    <button
      onClick={handleToggle}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      className={cn(
        "p-1 rounded-md transition-all duration-200",
        "opacity-0 group-hover:opacity-100 focus:opacity-100",
        "hover:bg-saffron/10",
        isBookmarked && "opacity-100"
      )}
    >
      <Bookmark
        className={cn(
          "w-4 h-4 transition-colors duration-200",
          isBookmarked
            ? "text-saffron fill-saffron"
            : "text-graphite hover:text-saffron"
        )}
      />
    </button>
  );
}
