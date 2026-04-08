"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Lock, Star, BookOpen, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { MOCK_BOOKS, getNodeStatus, getBookProgress, type NodeStatus } from "@/lib/mock-data";
import { LANGUAGE_LABELS, LANGUAGE_HEX, type Language } from "@/types";
import DailyChallenge from "@/components/learn/DailyChallenge";

/* ─── Daily Goal Ring ───────────────────────────────────── */

function DailyGoalRing() {
  const chaptersCompletedToday = useAppStore((s) => s.chaptersCompletedToday);
  const dailyGoalChapters = useAppStore((s) => s.dailyGoalChapters);

  const progress = Math.min(chaptersCompletedToday / dailyGoalChapters, 1);
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          {/* Background ring */}
          <circle
            cx="48"
            cy="48"
            r={40}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            className="text-stone/20"
          />
          {/* Progress ring */}
          <circle
            cx="48"
            cy="48"
            r={40}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 40}
            strokeDashoffset={2 * Math.PI * 40 * (1 - progress)}
            className="transition-all duration-700 ease-out"
            style={{ filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))" }}
          />
        </svg>
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-ocean/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-ocean" />
          </div>
        </div>
      </div>
      <p className="text-sm text-graphite font-medium">
        <span className="text-ocean font-bold">{chaptersCompletedToday}</span> of {dailyGoalChapters} chapters today
      </p>
    </div>
  );
}

/* ─── Skill Tree Node ───────────────────────────────────── */

function SkillNode({
  bookId,
  title,
  author,
  language,
  status,
  index,
  isExpanded,
  onToggle,
}: {
  bookId: string;
  title: string;
  author: string;
  language: Language;
  status: NodeStatus;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const side = index % 2 === 0 ? "left" : "right";
  const isCurrent = status === "current";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  const isPremium = status === "premium";

  const nodeSize = isCurrent ? "w-16 h-16" : "w-14 h-14";
  const hex = LANGUAGE_HEX[language];

  return (
    <div className="flex flex-col items-center">
      {/* Node row */}
      <div
        className={cn(
          "w-full flex items-center",
          side === "left" ? "justify-start pl-8 sm:pl-16" : "justify-end pr-8 sm:pr-16"
        )}
      >
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={onToggle}
            disabled={isLocked}
            className={cn(
              "relative rounded-full flex items-center justify-center transition-all duration-300",
              nodeSize,
              isPremium && "shadow-md",
            )}
            style={{
              ...(isCompleted ? { backgroundColor: hex, color: "white", boxShadow: `0 4px 12px ${hex}40` } : {}),
              ...(isCurrent ? { backgroundColor: hex, color: "white", boxShadow: `0 4px 16px ${hex}50`, outline: `4px solid ${hex}30` } : {}),
              ...(isLocked ? { backgroundColor: `${hex}18`, color: `${hex}60`, opacity: 0.7, cursor: "not-allowed" } : {}),
              ...(isPremium ? { backgroundColor: `${hex}10`, color: hex, border: `2px solid ${hex}` } : {}),
            }}
          >
            {isCompleted && <Check className="w-6 h-6" strokeWidth={3} />}
            {isCurrent && <BookOpen className="w-6 h-6" />}
            {isLocked && <Lock className="w-5 h-5" />}
            {isPremium && <Star className="w-5 h-5" style={{ fill: hex }} />}
          </button>

          <span
            className={cn(
              "text-xs font-medium text-center max-w-[100px] leading-tight",
              isLocked && "opacity-50",
              isCurrent && "font-semibold",
            )}
            style={{
              color: isLocked ? `${hex}80` : isCurrent || isCompleted ? hex : isPremium ? hex : undefined,
            }}
          >
            {title}
          </span>

          {isCurrent && (
            <span
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${hex}15`, color: hex }}
            >
              Continue
            </span>
          )}
        </div>
      </div>

      {/* Expanded card for current/completed */}
      {isExpanded && !isLocked && (
        <CurrentBookCard bookId={bookId} title={title} author={author} language={language} status={status} />
      )}
    </div>
  );
}

/* ─── Current Book Card ─────────────────────────────────── */

function CurrentBookCard({
  bookId,
  title,
  author,
  language,
  status,
}: {
  bookId: string;
  title: string;
  author: string;
  language: Language;
  status: NodeStatus;
}) {
  const progress = getBookProgress(bookId);
  const percent = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

  const hex = LANGUAGE_HEX[language];

  return (
    <div
      className="mt-3 w-full max-w-sm mx-auto bg-white rounded-xl shadow-sm p-4 animate-in fade-in slide-in-from-top-2 duration-300"
      style={{ border: `1.5px solid ${hex}25`, borderTop: `3px solid ${hex}` }}
    >
      <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>
      <p className="text-sm text-graphite mt-0.5">{author}</p>

      <div className="flex items-center gap-2 mt-3">
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${hex}20`, color: hex }}
        >
          {LANGUAGE_LABELS[language]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-graphite mb-1">
          <span>Chapter progress</span>
          <span className="font-semibold" style={{ color: hex }}>{progress.completed}/{progress.total}</span>
        </div>
        <div className="h-2.5 bg-stone/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: hex }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Link
          href={`/stories/${bookId}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: hex }}
        >
          <BookOpen className="w-4 h-4" />
          {status === "completed" ? "Read again" : "Continue reading"}
        </Link>
        <Link
          href="/review"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-linen"
          style={{ border: `1px solid ${hex}30`, color: hex }}
        >
          <RotateCcw className="w-4 h-4" />
          Review
        </Link>
      </div>
    </div>
  );
}

/* ─── Dotted Connector Line ─────────────────────────────── */

function DottedConnector({ fromSide, toSide }: { fromSide: "left" | "right"; toSide: "left" | "right" }) {
  const crosses = fromSide !== toSide;

  return (
    <div className="relative h-12 w-full">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <line
          x1={fromSide === "left" ? "25" : "75"}
          y1="0"
          x2={toSide === "left" ? "25" : "75"}
          y2="100"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 6"
          className="text-stone/50"
        />
      </svg>
    </div>
  );
}

/* ─── Main Learn Page ───────────────────────────────────── */

export default function LearnPage() {
  const [expandedNode, setExpandedNode] = useState<string | null>("2"); // current book expanded by default

  return (
    <div className="flex flex-col">
      {/* Header */}
      <h1 className="font-serif text-2xl font-bold text-ink text-center">Learn</h1>
      <p className="text-sm text-graphite text-center mt-1">Your reading path</p>

      {/* Daily challenge */}
      <div className="mt-4">
        <DailyChallenge />
      </div>

      {/* Daily goal */}
      <DailyGoalRing />

      {/* Skill tree */}
      <div className="relative flex flex-col gap-0 mt-2">
        {MOCK_BOOKS.map((book, i) => {
          const status = getNodeStatus(book.id);
          const side = i % 2 === 0 ? "left" : "right";
          const nextSide = (i + 1) % 2 === 0 ? "left" : "right";

          return (
            <div key={book.id}>
              <SkillNode
                bookId={book.id}
                title={book.title}
                author={book.author}
                language={book.language}
                status={status}
                index={i}
                isExpanded={expandedNode === book.id}
                onToggle={() =>
                  setExpandedNode((prev) => (prev === book.id ? null : book.id))
                }
              />
              {/* Connector line (skip after last) */}
              {i < MOCK_BOOKS.length - 1 && (
                <DottedConnector fromSide={side} toSide={nextSide} />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom spacer for mobile tab bar */}
      <div className="h-8" />
    </div>
  );
}
