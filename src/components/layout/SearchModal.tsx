"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  BookOpen,
  Languages,
  FileText,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_BOOKS, MOCK_VOCAB, MOCK_CHAPTERS } from "@/lib/mock-data";

interface SearchResult {
  id: string;
  type: "book" | "vocabulary" | "chapter";
  title: string;
  subtitle: string;
  href: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

function searchData(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search books
  for (const book of MOCK_BOOKS) {
    if (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q)
    ) {
      results.push({
        id: `book-${book.id}`,
        type: "book",
        title: book.title,
        subtitle: `${book.author} — ${book.language}`,
        href: `/stories/${book.id}`,
      });
    }
  }

  // Search chapters
  for (const [bookId, chapters] of Object.entries(MOCK_CHAPTERS)) {
    const book = MOCK_BOOKS.find((b) => b.id === bookId);
    for (const ch of chapters) {
      if (ch.title.toLowerCase().includes(q)) {
        results.push({
          id: `chapter-${ch.id}`,
          type: "chapter",
          title: ch.title,
          subtitle: book ? `${book.title}, Chapter ${ch.number}` : `Chapter ${ch.number}`,
          href: `/reader/${bookId}`,
        });
      }
    }
  }

  // Search vocabulary
  for (const word of MOCK_VOCAB) {
    if (
      word.word.toLowerCase().includes(q) ||
      word.translation.toLowerCase().includes(q)
    ) {
      results.push({
        id: `vocab-${word.id}`,
        type: "vocabulary",
        title: word.word,
        subtitle: `${word.translation} — ${word.language}`,
        href: "/review",
      });
    }
  }

  return results.slice(0, 20);
}

const TYPE_CONFIG = {
  book: { icon: BookOpen, label: "Books", color: "text-ocean" },
  vocabulary: { icon: Languages, label: "Vocabulary", color: "text-iris" },
  chapter: { icon: FileText, label: "Chapters", color: "text-saffron" },
} as const;

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const found = searchData(value);
      setResults(found);
      setActiveIndex(0);
    }, 300);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIndex]) {
        onClose();
      }
    },
    [onClose, results, activeIndex]
  );

  // Group results by type
  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const r of results) {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    }
    return groups;
  }, [results]);

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] md:pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full mx-4 md:mx-0 md:max-w-lg bg-snow rounded-xl shadow-2xl overflow-hidden",
          "animate-in fade-in slide-in-from-top-4 duration-200",
          // On mobile: nearly full screen
          "max-h-[80vh] md:max-h-[60vh] flex flex-col"
        )}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-stone/30">
          <Search className="w-5 h-5 text-graphite shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search books, vocabulary, chapters..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent text-ink placeholder:text-graphite/50 outline-none text-sm"
          />
          {query && (
            <button
              onClick={() => handleSearch("")}
              className="p-0.5 rounded hover:bg-stone/30 text-graphite"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-graphite bg-linen px-1.5 py-0.5 rounded border border-stone/30 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {query && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Search className="w-8 h-8 text-stone mb-3" />
              <p className="text-sm text-graphite">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-graphite/60 mt-1">
                Try searching for a book title, author, or vocabulary word
              </p>
            </div>
          )}

          {!query && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-sm text-graphite">
                Start typing to search across your library
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-graphite/60">
                <kbd className="inline-flex items-center gap-0.5 bg-linen px-1.5 py-0.5 rounded border border-stone/30 font-mono text-[10px]">
                  <Command className="w-3 h-3" />K
                </kbd>
                <span>to open search anywhere</span>
              </div>
            </div>
          )}

          {Object.entries(grouped).map(([type, items]) => {
            const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG];
            const Icon = config.icon;
            return (
              <div key={type} className="py-2">
                <div className="px-4 py-1.5 text-xs font-semibold text-graphite uppercase tracking-wider">
                  {config.label}
                </div>
                {items.map((result) => {
                  flatIndex++;
                  const idx = flatIndex;
                  const isActive = idx === activeIndex;
                  return (
                    <Link
                      key={result.id}
                      href={result.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 transition-colors",
                        isActive ? "bg-ocean/10" : "hover:bg-linen"
                      )}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0", config.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">
                          {result.title}
                        </p>
                        <p className="text-xs text-graphite truncate">
                          {result.subtitle}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-stone/30 flex items-center gap-4 text-[10px] text-graphite/60">
            <span className="flex items-center gap-1">
              <kbd className="bg-linen px-1 py-0.5 rounded border border-stone/30 font-mono">
                &uarr;&darr;
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-linen px-1 py-0.5 rounded border border-stone/30 font-mono">
                &crarr;
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-linen px-1 py-0.5 rounded border border-stone/30 font-mono">
                esc
              </kbd>
              close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
