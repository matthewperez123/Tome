"use client";

import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Heart,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import type { Language, Mastery } from "@/types";
import { LANGUAGE_LABELS } from "@/types";
import GrammarReference from "@/components/review/GrammarReference";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

interface VocabWord {
  id: string;
  word: string;
  translation: string;
  language: Language;
  partOfSpeech: string;
  context: string;
  mastery: Mastery;
  book: string;
  timesReviewed: number;
  timesCorrect: number;
}

const MOCK_VOCAB: VocabWord[] = [
  { id: "v1", word: "bellum", translation: "war", language: "LATIN", partOfSpeech: "noun", context: "continenter bellum gerunt", mastery: "LEARNING", book: "De Bello Gallico", timesReviewed: 4, timesCorrect: 3 },
  { id: "v2", word: "virtus", translation: "courage, valor", language: "LATIN", partOfSpeech: "noun", context: "Helvetii quoque reliquos Gallos virtute praecedunt", mastery: "NEW", book: "De Bello Gallico", timesReviewed: 1, timesCorrect: 0 },
  { id: "v3", word: "flumen", translation: "river", language: "LATIN", partOfSpeech: "noun", context: "Garumna flumen dividit", mastery: "MASTERED", book: "De Bello Gallico", timesReviewed: 8, timesCorrect: 8 },
  { id: "v4", word: "\u1F00\u03C1\u03B5\u03C4\u03AE", translation: "excellence, virtue", language: "GREEK", partOfSpeech: "noun", context: "\u03C4\u1F74\u03BD \u1F00\u03C1\u03B5\u03C4\u1F74\u03BD \u1F10\u03C0\u03B9\u03C4\u03B7\u03B4\u03B5\u03CD\u03B5\u03B9\u03BD", mastery: "NEW", book: "Apology", timesReviewed: 0, timesCorrect: 0 },
  { id: "v5", word: "\u03BB\u03CC\u03B3\u03BF\u03C2", translation: "word, reason, speech", language: "GREEK", partOfSpeech: "noun", context: "\u03C4\u1F78\u03BD \u03BB\u03CC\u03B3\u03BF\u03BD \u03C4\u03BF\u1FE6 \u03B8\u03B5\u03BF\u1FE6", mastery: "LEARNING", book: "Apology", timesReviewed: 3, timesCorrect: 2 },
  { id: "v6", word: "imperium", translation: "command, power, empire", language: "LATIN", partOfSpeech: "noun", context: "imperium populi Romani", mastery: "LEARNING", book: "In Catilinam", timesReviewed: 5, timesCorrect: 3 },
  { id: "v7", word: "\u03C3\u03BF\u03C6\u03AF\u03B1", translation: "wisdom", language: "GREEK", partOfSpeech: "noun", context: "\u1F21 \u03C3\u03BF\u03C6\u03AF\u03B1 \u03C4\u03BF\u1FE6 \u03B8\u03B5\u03BF\u1FE6", mastery: "MASTERED", book: "Apology", timesReviewed: 10, timesCorrect: 9 },
  { id: "v8", word: "pax", translation: "peace", language: "LATIN", partOfSpeech: "noun", context: "pax Romana", mastery: "NEW", book: "Ab Urbe Condita", timesReviewed: 0, timesCorrect: 0 },
];

const QUIZ_BANK = [
  { word: "bellum", correct: "war", options: ["peace", "war", "river", "king"] },
  { word: "imperium", correct: "command, power, empire", options: ["soldier", "command, power, empire", "city", "field"] },
  { word: "virtus", correct: "courage, valor", options: ["truth", "justice", "courage, valor", "love"] },
  { word: "flumen", correct: "river", options: ["river", "mountain", "road", "sea"] },
  { word: "pax", correct: "peace", options: ["war", "bread", "peace", "land"] },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

type Tab = "flashcards" | "quizzes" | "wordbank" | "grammar";

const MASTERY_DOT: Record<Mastery, string> = {
  NEW: "bg-vermillion",
  LEARNING: "bg-saffron",
  MASTERED: "bg-clover",
};

const MASTERY_LABEL: Record<Mastery, string> = {
  NEW: "New",
  LEARNING: "Learning",
  MASTERED: "Mastered",
};

/* ================================================================== */
/*  Flashcards Tab                                                     */
/* ================================================================== */

function FlashcardsTab() {
  const { addXp } = useAppStore();
  const reviewWords = MOCK_VOCAB.filter((w) => w.mastery !== "MASTERED");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
  const [knownCount, setKnownCount] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const current = reviewWords[currentIndex];

  const langBreakdown = useMemo(() => {
    const counts: Partial<Record<Language, number>> = {};
    reviewWords.forEach((w) => {
      counts[w.language] = (counts[w.language] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([lang, count]) => `${count} ${LANGUAGE_LABELS[lang as Language]}`)
      .join(", ");
  }, []);

  const advance = useCallback(
    (dir: "left" | "right") => {
      setSlideDir(dir);
      if (dir === "right") setKnownCount((c) => c + 1);

      setTimeout(() => {
        setSlideDir(null);
        if (currentIndex >= reviewWords.length - 1) {
          const earned = (knownCount + (dir === "right" ? 1 : 0)) * 5;
          addXp(earned);
          setSessionDone(true);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 300);
    },
    [currentIndex, reviewWords.length, knownCount, addXp]
  );

  if (sessionDone) {
    const totalReviewed = reviewWords.length;
    const xpEarned = knownCount * 5;
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">&#127775;</div>
        <h2 className="text-xl font-serif font-bold text-ink mb-1">Great review!</h2>
        <p className="text-graphite mb-6">
          {knownCount}/{totalReviewed} correct &middot; +{xpEarned} XP
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setKnownCount(0);
            setSessionDone(false);
          }}
          className="py-3 px-8 rounded-xl bg-ocean text-white font-semibold hover:bg-ocean/90 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="py-6">
      <p className="text-sm text-graphite mb-1 text-center">
        {reviewWords.length} words to review
      </p>
      <p className="text-xs text-graphite/60 mb-8 text-center">{langBreakdown}</p>

      {/* Card stack */}
      <div className="relative flex justify-center mb-8">
        {/* Shadow cards behind */}
        <div className="absolute top-2 w-[260px] h-[270px] bg-linen rounded-2xl shadow-sm" />
        <div className="absolute top-1 w-[270px] h-[275px] bg-stone/30 rounded-2xl" />

        {/* Active card */}
        <div
          className={cn(
            "relative w-[280px] h-[280px] bg-snow rounded-2xl shadow-md border border-stone/20 flex flex-col items-center justify-center p-6 transition-transform duration-300",
            slideDir === "left" && "-translate-x-40 opacity-0 rotate-[-8deg]",
            slideDir === "right" && "translate-x-40 opacity-0 rotate-[8deg]"
          )}
        >
          <p className="text-2xl font-serif font-bold text-ink text-center leading-tight">
            {current.word}
          </p>
          <p className="text-sm text-graphite mt-3 text-center italic">
            &ldquo;{current.context}&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", MASTERY_DOT[current.mastery])} />
            <span className="text-xs text-graphite">{MASTERY_LABEL[current.mastery]}</span>
          </div>
          <p className="absolute bottom-3 text-xs text-graphite/40">
            {currentIndex + 1} / {reviewWords.length}
          </p>
        </div>
      </div>

      {/* Reveal area */}
      <p className="text-center text-lg font-medium text-ink mb-6">{current.translation}</p>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => advance("left")}
          className="flex items-center gap-2 py-3 px-6 rounded-xl border-2 border-saffron text-saffron font-semibold hover:bg-saffron/5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Still learning
        </button>
        <button
          onClick={() => advance("right")}
          className="flex items-center gap-2 py-3 px-6 rounded-xl bg-clover text-white font-semibold hover:bg-clover/90 transition-colors"
        >
          <Check className="w-4 h-4" />
          I know this
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Quizzes Tab                                                        */
/* ================================================================== */

function QuizzesTab() {
  const { addXp, loseHeart, hearts } = useAppStore();

  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const totalQ = QUIZ_BANK.length;

  const handleAnswer = (opt: string) => {
    const q = QUIZ_BANK[qIndex];
    setAnswered(opt);

    if (opt === q.correct) {
      setCorrectCount((c) => c + 1);
      addXp(20);
    } else {
      loseHeart();
    }

    setTimeout(() => {
      setAnswered(null);
      if (qIndex >= totalQ - 1) {
        setDone(true);
      } else {
        setQIndex((i) => i + 1);
      }
    }, 1000);
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-ocean/10 flex items-center justify-center mb-4">
          <span className="text-3xl">&#129504;</span>
        </div>
        <h2 className="text-lg font-serif font-bold text-ink mb-1">Vocabulary Quiz</h2>
        <p className="text-sm text-graphite mb-6">
          {totalQ} questions &middot; Multiple choice
        </p>
        <div className="flex items-center gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "w-4 h-4",
                i < hearts ? "text-vermillion fill-vermillion" : "text-stone"
              )}
            />
          ))}
        </div>
        <button
          onClick={() => setStarted(true)}
          className="py-3 px-10 rounded-xl bg-ocean text-white font-semibold hover:bg-ocean/90 transition-colors"
        >
          Practice
        </button>
      </div>
    );
  }

  if (done) {
    const xpEarned = correctCount * 20;
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">{correctCount >= 4 ? "\u{1F389}" : "\u{1F4AA}"}</div>
        <h2 className="text-xl font-serif font-bold text-ink mb-1">Quiz Complete!</h2>
        <p className="text-graphite mb-2">
          {correctCount}/{totalQ} correct
        </p>
        <p className="text-ocean font-semibold mb-8">+{xpEarned} XP</p>
        <button
          onClick={() => {
            setStarted(false);
            setQIndex(0);
            setCorrectCount(0);
            setDone(false);
          }}
          className="py-3 px-10 rounded-xl bg-ocean text-white font-semibold hover:bg-ocean/90 transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  const q = QUIZ_BANK[qIndex];

  return (
    <div className="py-6">
      {/* Progress bar */}
      <div className="w-full h-2 bg-stone/30 rounded-full mb-2 overflow-hidden">
        <div
          className="h-full bg-ocean rounded-full transition-all duration-500"
          style={{ width: `${((qIndex + (answered ? 1 : 0)) / totalQ) * 100}%` }}
        />
      </div>
      <p className="text-xs text-graphite text-center mb-8">
        {qIndex + 1} / {totalQ}
      </p>

      <p className="text-center text-sm text-graphite mb-2">What does this word mean?</p>
      <p className="text-center text-2xl font-serif font-bold text-ink mb-8">{q.word}</p>

      <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
        {q.options.map((opt) => {
          let cls = "bg-snow border-2 border-stone/40 text-ink hover:border-ocean";
          if (answered) {
            if (opt === q.correct) cls = "bg-clover/10 border-2 border-clover text-clover";
            else if (opt === answered && opt !== q.correct)
              cls = "bg-vermillion/10 border-2 border-vermillion text-vermillion";
            else cls = "bg-snow border-2 border-stone/20 text-graphite opacity-50";
          }
          return (
            <button
              key={opt}
              disabled={!!answered}
              onClick={() => handleAnswer(opt)}
              className={cn("py-3 px-4 rounded-xl font-medium text-left transition-all", cls)}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <p
          className={cn(
            "text-center mt-4 text-sm font-semibold animate-pulse",
            answered === q.correct ? "text-clover" : "text-vermillion"
          )}
        >
          {answered === q.correct ? "+20 XP" : "Wrong \u2014 lost 1 heart"}
        </p>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Word Bank Tab                                                      */
/* ================================================================== */

function WordBankTab() {
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<Language | "ALL">("ALL");
  const [masteryFilter, setMasteryFilter] = useState<Mastery | "ALL">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return MOCK_VOCAB.filter((w) => {
      if (search && !w.word.toLowerCase().includes(search.toLowerCase()) && !w.translation.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (langFilter !== "ALL" && w.language !== langFilter) return false;
      if (masteryFilter !== "ALL" && w.mastery !== masteryFilter) return false;
      return true;
    });
  }, [search, langFilter, masteryFilter]);

  return (
    <div className="py-4">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite" />
        <input
          type="text"
          placeholder="Search words..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-linen text-sm text-ink placeholder:text-graphite/50 outline-none focus:ring-2 focus:ring-ocean/30"
        />
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {/* Language filters */}
        {(["ALL", "LATIN", "GREEK"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setLangFilter(lang)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              langFilter === lang
                ? "bg-ocean text-white"
                : "bg-linen text-graphite hover:bg-stone/40"
            )}
          >
            {lang === "ALL" ? "All Languages" : LANGUAGE_LABELS[lang]}
          </button>
        ))}

        <div className="w-px h-5 bg-stone/40 self-center" />

        {/* Mastery filters */}
        {(["ALL", "NEW", "LEARNING", "MASTERED"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMasteryFilter(m)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              masteryFilter === m
                ? "bg-ocean text-white"
                : "bg-linen text-graphite hover:bg-stone/40"
            )}
          >
            {m === "ALL" ? "All Levels" : MASTERY_LABEL[m]}
          </button>
        ))}
      </div>

      {/* Word list */}
      <div className="space-y-1">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-graphite py-8">No words match your filters.</p>
        )}

        {filtered.map((w) => {
          const isExpanded = expandedId === w.id;
          return (
            <div key={w.id}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : w.id)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-linen/60 transition-colors text-left"
              >
                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", MASTERY_DOT[w.mastery])} />
                <span className="flex-1 min-w-0">
                  <span className="font-serif font-semibold text-ink text-[15px]">{w.word}</span>
                  <span className="text-graphite text-sm ml-2">{w.translation}</span>
                </span>
                <span className="text-xs text-graphite/50 shrink-0 hidden sm:block">{w.book}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-graphite shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-graphite shrink-0" />
                )}
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="ml-6 mr-3 mb-2 px-4 py-3 bg-linen/50 rounded-xl">
                  <p className="text-xs text-graphite mb-1.5">
                    <span className="font-medium">Part of speech:</span> {w.partOfSpeech}
                  </p>
                  <p className="text-xs text-graphite mb-1.5">
                    <span className="font-medium">Context:</span>{" "}
                    <span className="italic font-serif">&ldquo;{w.context}&rdquo;</span>
                  </p>
                  <p className="text-xs text-graphite mb-1.5">
                    <span className="font-medium">Source:</span> {w.book}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-xs text-graphite">
                      Reviewed {w.timesReviewed}x &middot; {w.timesCorrect} correct
                    </p>
                    {w.mastery !== "MASTERED" && (
                      <p className="text-xs text-ocean font-medium">Next review: Today</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Review Page                                                   */
/* ================================================================== */

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<Tab>("flashcards");

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-ink mb-5">Review</h1>

      {/* Segmented Control */}
      <div className="bg-linen rounded-xl p-1 flex mb-6">
        {(
          [
            { key: "flashcards", label: "Flashcards" },
            { key: "quizzes", label: "Quizzes" },
            { key: "wordbank", label: "Word Bank" },
            { key: "grammar", label: "Grammar" },
          ] as { key: Tab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-snow text-ink shadow-sm"
                : "text-graphite hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "flashcards" && <FlashcardsTab />}
      {activeTab === "quizzes" && <QuizzesTab />}
      {activeTab === "wordbank" && <WordBankTab />}
      {activeTab === "grammar" && <GrammarReference />}
    </div>
  );
}
