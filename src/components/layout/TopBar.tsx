"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { Heart, Flame, Sparkles, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "./SearchModal";

function SearchTrigger() {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label="Search (Cmd+K)"
        className="p-1.5 rounded-lg hover:bg-linen transition-colors text-graphite"
      >
        <Search className="w-[18px] h-[18px]" />
      </button>
      <SearchModal open={open} onClose={handleClose} />
    </>
  );
}

export function TopBar() {
  const { hearts, currentStreak, totalXp } = useAppStore();

  return (
    <div className="flex items-center justify-end gap-4 px-4 py-2 bg-snow border-b border-stone/30">
      {/* Hearts with pulse glow */}
      <div className="flex items-center gap-1.5">
        <Heart
          className={`w-5 h-5 ${hearts > 0 ? "text-vermillion fill-vermillion heart-pulse" : "text-stone"}`}
        />
        <span
          className={`text-sm font-semibold ${hearts > 0 ? "text-vermillion" : "text-stone"}`}
        >
          {hearts}
        </span>
      </div>

      {/* Streak with warm glow */}
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
        style={currentStreak > 0 ? { backgroundColor: "rgba(245, 158, 11, 0.1)" } : undefined}
      >
        <Flame
          className={`w-5 h-5 ${currentStreak > 0 ? "text-saffron fill-saffron" : "text-stone"}`}
        />
        <span
          className={`text-sm font-semibold ${currentStreak > 0 ? "text-saffron" : "text-stone"}`}
        >
          {currentStreak}
        </span>
      </div>

      {/* XP with clover background pill */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
        style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
      >
        <Sparkles className="w-5 h-5 text-clover" />
        <span className="text-sm font-semibold text-clover">{totalXp}</span>
      </div>

      <div className="w-px h-5 bg-stone/40" />

      <SearchTrigger />
      <ThemeToggle compact />
    </div>
  );
}
