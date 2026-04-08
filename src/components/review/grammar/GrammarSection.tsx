"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface GrammarSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function GrammarSection({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: GrammarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="border border-stone/20 rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-linen hover:bg-stone/20 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-serif font-bold text-ink">{title}</h3>
          {subtitle && (
            <p className="text-xs text-graphite mt-0.5">{subtitle}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setBookmarked(!bookmarked);
          }}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            bookmarked
              ? "text-saffron"
              : "text-graphite/40 hover:text-graphite"
          )}
        >
          <Bookmark
            className="w-4 h-4"
            fill={bookmarked ? "currentColor" : "none"}
          />
        </button>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-graphite shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-graphite shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 bg-snow animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
