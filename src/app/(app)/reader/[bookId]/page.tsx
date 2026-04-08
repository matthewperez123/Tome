"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, X, Heart, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { ReadingMode } from "@/types";
import { LANGUAGE_HEX, LANGUAGE_LABELS, type Language } from "@/types";
import { BookmarkButton } from "@/components/reader/BookmarkButton";
import { useParams } from "next/navigation";
import { getBookById, getChaptersByBookId, getParagraphsByChapterId, type MockBook } from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/*  Fallback Mock Data (used when book not found in mock-data)         */
/* ------------------------------------------------------------------ */

const FALLBACK_PARAGRAPHS = [
  { id: "p1", original: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.", english: "All Gaul is divided into three parts, one of which the Belgae inhabit, another the Aquitani, and the third those who in their own language are called Celts, in ours Gauls." },
  { id: "p2", original: "Hi omnes lingua, institutis, legibus inter se differunt.", english: "All these differ from each other in language, customs, and laws." },
  { id: "p3", original: "Gallos ab Aquitanis Garumna flumen, a Belgis Matrona et Sequana dividit.", english: "The Garonne River separates the Gauls from the Aquitani; the Marne and the Seine separate them from the Belgae." },
  { id: "p4", original: "Horum omnium fortissimi sunt Belgae, propterea quod a cultu atque humanitate provinciae longissime absunt.", english: "Of all these, the Belgae are the bravest, because they are farthest from the civilization and refinement of our Province." },
  { id: "p5", original: "Proximique sunt Germanis, qui trans Rhenum incolunt, quibuscum continenter bellum gerunt.", english: "They are the nearest to the Germans, who dwell beyond the Rhine, with whom they are continually waging war." },
];

const MOCK_WORD_DATA: Record<string, { translation: string; partOfSpeech: string }> = {
  gallia: { translation: "Gaul (region of Western Europe)", partOfSpeech: "noun, fem." },
  est: { translation: "is, exists", partOfSpeech: "verb, 3rd sg." },
  omnis: { translation: "all, every", partOfSpeech: "adjective" },
  divisa: { translation: "divided", partOfSpeech: "participle" },
  partes: { translation: "parts, regions", partOfSpeech: "noun, fem. pl." },
  tres: { translation: "three", partOfSpeech: "numeral" },
  belgae: { translation: "the Belgae (a people)", partOfSpeech: "noun, masc. pl." },
  lingua: { translation: "language, tongue", partOfSpeech: "noun, fem." },
  bellum: { translation: "war", partOfSpeech: "noun, neut." },
  gerunt: { translation: "they wage, carry on", partOfSpeech: "verb, 3rd pl." },
  flumen: { translation: "river", partOfSpeech: "noun, neut." },
  fortissimi: { translation: "bravest, strongest", partOfSpeech: "adjective, superl." },
  virtute: { translation: "courage, valor", partOfSpeech: "noun, fem. abl." },
  mercatores: { translation: "merchants, traders", partOfSpeech: "noun, masc. pl." },
  germanis: { translation: "the Germans", partOfSpeech: "noun, masc. pl." },
  rhenum: { translation: "the Rhine (river)", partOfSpeech: "noun, masc." },
  helvetii: { translation: "the Helvetii (a people)", partOfSpeech: "noun, masc. pl." },
  finibus: { translation: "borders, territories", partOfSpeech: "noun, masc. pl." },
  proeliis: { translation: "battles", partOfSpeech: "noun, neut. pl." },
  imperium: { translation: "command, empire", partOfSpeech: "noun, neut." },
};

const QUIZ_QUESTIONS = [
  {
    word: "bellum",
    correct: "war",
    options: ["peace", "war", "river", "language"],
  },
  {
    word: "flumen",
    correct: "river",
    options: ["mountain", "city", "river", "forest"],
  },
  {
    word: "virtute",
    correct: "courage, valor",
    options: ["truth", "courage, valor", "freedom", "power"],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReaderPage() {
  const params = useParams();
  const bookId = params.bookId as string;

  const {
    hearts,
    maxHearts,
    loseHeart,
    readingMode,
    setReadingMode,
    fontSize,
    setFontSize,
    addXp,
  } = useAppStore();

  // Load book data dynamically
  const book = getBookById(bookId);
  const chapters = book ? getChaptersByBookId(bookId) : [];
  const firstChapterId = chapters[0]?.id;
  const bookParagraphs = firstChapterId
    ? getParagraphsByChapterId(firstChapterId)
    : null;

  const BOOK_TITLE = book?.title ?? "Unknown Book";
  const BOOK_LANGUAGE = (book?.language ?? "LATIN") as Language;
  const BOOK_COLOR = LANGUAGE_HEX[BOOK_LANGUAGE] ?? "#3B82F6";
  const TOTAL_CHAPTERS = book?.chapterCount ?? 8;

  // Use dynamic paragraphs or fallback
  const MOCK_PARAGRAPHS = bookParagraphs && bookParagraphs.length > 0
    ? bookParagraphs.map((p) => ({
        id: p.id,
        original: p.original,
        english: p.translation,
      }))
    : FALLBACK_PARAGRAPHS;

  // UI state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [revealedParagraphs, setRevealedParagraphs] = useState<Set<string>>(new Set());
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());

  // Word popup
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Progress / Chapter completion
  const [readParagraphs, setReadParagraphs] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [startTime] = useState(Date.now());

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);
  const [quizXpEarned, setQuizXpEarned] = useState(0);

  // Progress %
  const progressPercent = (readParagraphs.size / MOCK_PARAGRAPHS.length) * 100;

  /* Track paragraph visibility via IntersectionObserver */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (id) setReadParagraphs((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.6 }
    );

    const nodes = document.querySelectorAll("[data-paragraph]");
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  /* Close popup on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSelectedWord(null);
        setPopupPos(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ---- Handlers ---- */

  const handleWordClick = useCallback(
    (word: string, e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const containerRect = contentRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      setSelectedWord(word.toLowerCase().replace(/[.,;:!?]/g, ""));
      setPopupPos({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.bottom - containerRect.top + 8,
      });
    },
    []
  );

  const handleSaveWord = useCallback(
    (word: string) => {
      setSavedWords((prev) => new Set(prev).add(word));
    },
    []
  );

  const toggleReveal = useCallback((id: string) => {
    setRevealedParagraphs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleCompleteChapter = () => {
    setShowQuiz(true);
  };

  const handleQuizAnswer = (answer: string) => {
    const q = QUIZ_QUESTIONS[quizIndex];
    setQuizAnswered(answer);

    if (answer === q.correct) {
      setQuizCorrectCount((c) => c + 1);
      const xp = 25;
      setQuizXpEarned((prev) => prev + xp);
      addXp(xp);
    } else {
      loseHeart();
    }

    setTimeout(() => {
      setQuizAnswered(null);
      if (quizIndex < QUIZ_QUESTIONS.length - 1) {
        setQuizIndex((i) => i + 1);
      } else {
        setShowQuiz(false);
        setShowCelebration(true);
        addXp(50); // chapter completion bonus
        setQuizXpEarned((prev) => prev + 50);
      }
    }, 1200);
  };

  /* ---- Render helpers ---- */

  const renderWords = (text: string) => {
    return text.split(/(\s+)/).map((token, i) => {
      if (/^\s+$/.test(token)) return <span key={i}>{token}</span>;
      return (
        <span
          key={i}
          onClick={(e) => handleWordClick(token, e)}
          className="cursor-pointer hover:bg-ocean/10 hover:text-ocean rounded px-0.5 transition-colors"
        >
          {token}
        </span>
      );
    });
  };

  /* ================================================================ */
  /*  QUIZ OVERLAY                                                     */
  /* ================================================================ */
  if (showQuiz) {
    const q = QUIZ_QUESTIONS[quizIndex];
    return (
      <div className="fixed inset-0 z-50 bg-snow flex flex-col">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-6 pb-4">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                i < quizIndex
                  ? "bg-ocean"
                  : i === quizIndex
                  ? "bg-ocean ring-2 ring-ocean/30"
                  : "bg-stone"
              )}
            />
          ))}
        </div>
        <p className="text-center text-sm text-graphite mb-8">
          Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
        </p>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="text-lg text-graphite mb-2">What does this word mean?</p>
          <p className="text-3xl font-serif font-bold text-ink mb-10">{q.word}</p>

          <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
            {q.options.map((opt) => {
              let btnClass = "bg-snow border-2 border-stone/40 text-ink hover:border-ocean";
              if (quizAnswered) {
                if (opt === q.correct) btnClass = "bg-clover/10 border-2 border-clover text-clover";
                else if (opt === quizAnswered && opt !== q.correct)
                  btnClass = "bg-vermillion/10 border-2 border-vermillion text-vermillion";
                else btnClass = "bg-snow border-2 border-stone/20 text-graphite opacity-50";
              }
              return (
                <button
                  key={opt}
                  disabled={!!quizAnswered}
                  onClick={() => handleQuizAnswer(opt)}
                  className={cn(
                    "py-3.5 px-4 rounded-xl font-medium text-left transition-all",
                    btnClass
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {quizAnswered && (
            <div
              className={cn(
                "mt-6 text-sm font-semibold animate-pulse",
                quizAnswered === q.correct ? "text-clover" : "text-vermillion"
              )}
            >
              {quizAnswered === q.correct ? "+25 XP" : "Wrong — lost 1 heart"}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  CELEBRATION OVERLAY                                              */
  /* ================================================================ */
  if (showCelebration) {
    const elapsed = Math.round((Date.now() - startTime) / 60000);
    return (
      <div className="fixed inset-0 z-50 bg-snow flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">&#127881;</div>
        <h1 className="text-3xl font-serif font-bold text-ink mb-2">Chapter Complete!</h1>
        <p className="text-graphite mb-8">Excellent work finishing this chapter.</p>

        <div className="grid grid-cols-3 gap-6 mb-10">
          <div>
            <p className="text-2xl font-bold text-ink">{MOCK_PARAGRAPHS.length}</p>
            <p className="text-xs text-graphite">Paragraphs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-ink">{elapsed || 1}m</p>
            <p className="text-xs text-graphite">Reading time</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-ocean">{quizXpEarned} XP</p>
            <p className="text-xs text-graphite">Earned</p>
          </div>
        </div>

        <p className="text-sm text-graphite mb-6">
          Quiz score: {quizCorrectCount}/{QUIZ_QUESTIONS.length}
        </p>

        <Link
          href="/stories"
          className="w-full max-w-xs py-3 rounded-xl bg-ocean text-white font-semibold text-center block mb-3"
        >
          Continue to next chapter
        </Link>
        <Link
          href="/review"
          className="w-full max-w-xs py-3 rounded-xl border-2 border-stone text-ink font-semibold text-center block"
        >
          Review new words
        </Link>
      </div>
    );
  }

  /* ================================================================ */
  /*  MAIN READER                                                      */
  /* ================================================================ */
  return (
    <div className="fixed inset-0 z-40 bg-snow flex flex-col">
      {/* ---- Top Bar ---- */}
      <header className="flex items-center gap-3 px-4 py-3 bg-snow border-b border-stone/20 relative z-10">
        <Link href="/stories" className="text-graphite hover:text-ink transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-ink truncate">{BOOK_TITLE}</h1>
          <p className="text-xs text-graphite">Ch 3 / 12</p>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxHearts }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "w-4 h-4 transition-colors",
                i < hearts ? "text-vermillion fill-vermillion" : "text-stone"
              )}
            />
          ))}
        </div>

        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="p-1.5 rounded-lg hover:bg-linen transition-colors text-graphite"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-stone/30" style={{ height: 3 }}>
        <div
          className="h-full transition-all duration-500"
          style={{ backgroundColor: BOOK_COLOR, width: `${progressPercent}%` }}
        />
      </div>

      {/* ---- Settings Panel ---- */}
      {settingsOpen && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-snow border-b border-stone/30 shadow-lg animate-in slide-in-from-top">
          <div className="px-4 py-5 max-w-[640px] mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-ink">Reading Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 rounded-lg hover:bg-linen text-graphite"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Font size */}
            <div className="mb-5">
              <label className="text-sm text-graphite mb-2 block">
                Font size: {fontSize}px
              </label>
              <input
                type="range"
                min={16}
                max={24}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-ocean"
              />
              <div className="flex justify-between text-xs text-graphite mt-1">
                <span>16px</span>
                <span>24px</span>
              </div>
            </div>

            {/* Reading mode */}
            <div>
              <label className="text-sm text-graphite mb-2 block">Reading mode</label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: "side-by-side", label: "Side by side" },
                    { value: "tap-to-reveal", label: "Tap to reveal" },
                    { value: "original-only", label: "Original only" },
                    { value: "english-only", label: "English only" },
                  ] as { value: ReadingMode; label: string }[]
                ).map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setReadingMode(m.value)}
                    className={cn(
                      "py-2 px-3 rounded-xl text-sm font-medium transition-all",
                      readingMode === m.value
                        ? "bg-ocean text-white shadow-sm"
                        : "bg-linen text-graphite hover:bg-stone/40"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Reading Content ---- */}
      <div ref={contentRef} className="flex-1 overflow-y-auto relative">
        <div className="max-w-[640px] mx-auto pl-10 pr-4 py-6 space-y-6">
          {MOCK_PARAGRAPHS.map((para) => (
            <div
              key={para.id}
              data-id={para.id}
              data-paragraph
              onClick={() => {
                if (readingMode === "tap-to-reveal") toggleReveal(para.id);
              }}
              className={cn(
                "group relative pl-4 border-l-2 border-ocean/40 transition-colors",
                readingMode === "tap-to-reveal" && "cursor-pointer hover:border-ocean"
              )}
            >
              {/* Bookmark button */}
              <div className="absolute -left-7 top-0.5">
                <BookmarkButton
                  bookId="1"
                  bookTitle={BOOK_TITLE}
                  chapterId="1-ch-3"
                  chapterTitle="Caesar's Response"
                  paragraphId={para.id}
                  paragraphText={para.original}
                  language="LATIN"
                />
              </div>
              {/* Original text */}
              {readingMode !== "english-only" && (
                <p
                  className="font-serif text-ink leading-relaxed"
                  style={{ fontSize }}
                >
                  {renderWords(para.original)}
                </p>
              )}

              {/* English translation */}
              {(readingMode === "side-by-side" ||
                readingMode === "english-only" ||
                (readingMode === "tap-to-reveal" && revealedParagraphs.has(para.id))) && (
                <p
                  className={cn(
                    "font-serif italic text-graphite leading-relaxed mt-2",
                    readingMode === "english-only" ? "text-ink not-italic" : ""
                  )}
                  style={{ fontSize: readingMode === "english-only" ? fontSize : fontSize - 2 }}
                >
                  {para.english}
                </p>
              )}

              {readingMode === "tap-to-reveal" && !revealedParagraphs.has(para.id) && (
                <p className="text-xs text-graphite/50 mt-1 select-none">
                  Tap to reveal translation
                </p>
              )}
            </div>
          ))}

          {/* Complete chapter button */}
          <div className="pt-6 pb-12">
            <button
              onClick={handleCompleteChapter}
              className="w-full py-3.5 rounded-xl bg-ocean text-white font-semibold text-center hover:bg-ocean/90 transition-colors"
            >
              Complete chapter
            </button>
          </div>
        </div>

        {/* ---- Word Popup ---- */}
        {selectedWord && popupPos && (
          <div
            ref={popupRef}
            className="absolute z-30 bg-snow shadow-lg rounded-xl p-4 w-64 border border-stone/20"
            style={{
              left: Math.max(8, Math.min(popupPos.x - 128, (contentRef.current?.clientWidth ?? 640) - 272)),
              top: popupPos.y,
            }}
          >
            {MOCK_WORD_DATA[selectedWord] ? (
              <>
                <p className="font-serif font-bold text-ink text-lg">{selectedWord}</p>
                <p className="text-sm text-graphite mt-1">
                  {MOCK_WORD_DATA[selectedWord].translation}
                </p>
                <p className="text-xs text-graphite/70 mt-0.5">
                  {MOCK_WORD_DATA[selectedWord].partOfSpeech}
                </p>
                <div className="mt-3">
                  {savedWords.has(selectedWord) ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-clover">
                      <Check className="w-4 h-4" /> In your Codex
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSaveWord(selectedWord)}
                      className="w-full py-2 rounded-lg bg-ocean text-white text-sm font-semibold hover:bg-ocean/90 transition-colors"
                    >
                      Save to Codex
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="font-serif font-bold text-ink text-lg">{selectedWord}</p>
                <p className="text-sm text-graphite mt-1 italic">
                  No entry found. Tap &quot;Save&quot; to add it.
                </p>
                <div className="mt-3">
                  {savedWords.has(selectedWord) ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-clover">
                      <Check className="w-4 h-4" /> In your Codex
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSaveWord(selectedWord)}
                      className="w-full py-2 rounded-lg bg-ocean text-white text-sm font-semibold hover:bg-ocean/90 transition-colors"
                    >
                      Save to Codex
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
