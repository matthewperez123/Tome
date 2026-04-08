"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Calendar, CheckCircle2, Clock, Flame, Trophy, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const DAILY_QUOTES = [
  { original: "Veni, vidi, vici", translation: "I came, I saw, I conquered", author: "Caesar", language: "LATIN" as const },
  { original: "\u03B3\u03BD\u1FF6\u03B8\u03B9 \u03C3\u03B5\u03B1\u03C5\u03C4\u03CC\u03BD", translation: "Know thyself", author: "Delphic maxim", language: "GREEK" as const },
  { original: "Cogito, ergo sum", translation: "I think, therefore I am", author: "Descartes", language: "LATIN" as const },
  { original: "Carpe diem", translation: "Seize the day", author: "Horace", language: "LATIN" as const },
  { original: "\u03BC\u03B7\u03B4\u1F72\u03BD \u1F04\u03B3\u03B1\u03BD", translation: "Nothing in excess", author: "Delphic maxim", language: "GREEK" as const },
  { original: "Alea iacta est", translation: "The die is cast", author: "Caesar", language: "LATIN" as const },
  { original: "\u1F13\u03BD \u03BF\u1F36\u03B4\u03B1 \u1F45\u03C4\u03B9 \u03BF\u1F50\u03B4\u1F72\u03BD \u03BF\u1F36\u03B4\u03B1", translation: "I know that I know nothing", author: "Socrates", language: "GREEK" as const },
  { original: "Memento mori", translation: "Remember that you will die", author: "Roman proverb", language: "LATIN" as const },
  { original: "\u03C0\u03AC\u03BD\u03C4\u03B1 \u1FE5\u03B5\u1FD6", translation: "Everything flows", author: "Heraclitus", language: "GREEK" as const },
  { original: "Dum spiro, spero", translation: "While I breathe, I hope", author: "Cicero", language: "LATIN" as const },
];

const WORD_OF_DAY = [
  { word: "imperium", translation: "command, power, empire", language: "LATIN" as const, context: "imperium populi Romani", hint: "Think of 'imperial'" },
  { word: "\u03C3\u03BF\u03C6\u03AF\u03B1", translation: "wisdom", language: "GREEK" as const, context: "\u1F21 \u03C3\u03BF\u03C6\u03AF\u03B1 \u03C4\u03BF\u1FE6 \u03B8\u03B5\u03BF\u1FE6", hint: "Think of 'philosophy'" },
  { word: "bellum", translation: "war", language: "LATIN" as const, context: "continenter bellum gerunt", hint: "Think of 'belligerent'" },
  { word: "\u03BB\u03CC\u03B3\u03BF\u03C2", translation: "word, reason, speech", language: "GREEK" as const, context: "\u03C4\u1F78\u03BD \u03BB\u03CC\u03B3\u03BF\u03BD \u03C4\u03BF\u1FE6 \u03B8\u03B5\u03BF\u1FE6", hint: "Think of 'logic'" },
  { word: "virtus", translation: "courage, valor", language: "LATIN" as const, context: "Helvetii virtute praecedunt", hint: "Think of 'virtue'" },
  { word: "\u1F00\u03C1\u03B5\u03C4\u03AE", translation: "excellence, virtue", language: "GREEK" as const, context: "\u03C4\u1F74\u03BD \u1F00\u03C1\u03B5\u03C4\u1F74\u03BD \u1F10\u03C0\u03B9\u03C4\u03B7\u03B4\u03B5\u03CD\u03B5\u03B9\u03BD", hint: "Root of 'aristocracy'" },
  { word: "pax", translation: "peace", language: "LATIN" as const, context: "pax Romana", hint: "Think of 'pacify'" },
  { word: "\u03C0\u03CC\u03BB\u03B9\u03C2", translation: "city, city-state", language: "GREEK" as const, context: "\u03C4\u1F74\u03BD \u03C0\u03CC\u03BB\u03B9\u03BD \u03C6\u03C5\u03BB\u03AC\u03C4\u03C4\u03B5\u03B9\u03BD", hint: "Think of 'politics'" },
  { word: "senatus", translation: "senate, council of elders", language: "LATIN" as const, context: "senatus populusque Romanus", hint: "Think of 'senator'" },
  { word: "\u03B4\u03AE\u03BC\u03BF\u03C2", translation: "the people, district", language: "GREEK" as const, context: "\u1F00\u03C0\u1F78 \u03C4\u03BF\u1FE6 \u03B4\u03AE\u03BC\u03BF\u03C5", hint: "Think of 'democracy'" },
];

const ETYMOLOGY_DATA = [
  {
    english: "democracy",
    answer: "\u03B4\u03B7\u03BC\u03BF\u03BA\u03C1\u03B1\u03C4\u03AF\u03B1",
    options: ["\u03B4\u03B7\u03BC\u03BF\u03BA\u03C1\u03B1\u03C4\u03AF\u03B1", "\u03C0\u03BF\u03BB\u03B9\u03C4\u03B5\u03AF\u03B1", "\u03BC\u03BF\u03BD\u03B1\u03C1\u03C7\u03AF\u03B1", "\u1F00\u03C1\u03B9\u03C3\u03C4\u03BF\u03BA\u03C1\u03B1\u03C4\u03AF\u03B1"],
    fact: "From demos (people) + kratos (power). Ancient Athens practiced direct democracy where citizens voted on laws themselves.",
    language: "GREEK" as const,
  },
  {
    english: "republic",
    answer: "res publica",
    options: ["res publica", "imperium", "regnum", "civitas"],
    fact: "Literally 'public thing/affair.' The Romans distinguished their republic from monarchy after expelling the last king in 509 BC.",
    language: "LATIN" as const,
  },
  {
    english: "philosophy",
    answer: "\u03C6\u03B9\u03BB\u03BF\u03C3\u03BF\u03C6\u03AF\u03B1",
    options: ["\u03C6\u03B9\u03BB\u03BF\u03C3\u03BF\u03C6\u03AF\u03B1", "\u03B8\u03B5\u03BF\u03BB\u03BF\u03B3\u03AF\u03B1", "\u03C8\u03C5\u03C7\u03BF\u03BB\u03BF\u03B3\u03AF\u03B1", "\u03B3\u03BD\u03C9\u03C3\u03B9\u03BF\u03BB\u03BF\u03B3\u03AF\u03B1"],
    fact: "From philos (loving) + sophia (wisdom). Pythagoras reportedly coined the term, calling himself a 'lover of wisdom' rather than a wise man.",
    language: "GREEK" as const,
  },
  {
    english: "capital",
    answer: "caput",
    options: ["caput", "urbs", "arx", "forum"],
    fact: "From caput (head). A capital city is the 'head' city. Capital punishment originally meant punishment 'of the head.'",
    language: "LATIN" as const,
  },
  {
    english: "alphabet",
    answer: "\u03B1\u03BB\u03C6\u03AC\u03B2\u03B7\u03C4\u03BF\u03BD",
    options: ["\u03B1\u03BB\u03C6\u03AC\u03B2\u03B7\u03C4\u03BF\u03BD", "\u03B3\u03C1\u03B1\u03BC\u03BC\u03B1\u03C4\u03B9\u03BA\u03AE", "\u03BB\u03B5\u03BE\u03B9\u03BA\u03CC\u03BD", "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u1FD6\u03BF\u03BD"],
    fact: "Simply the first two Greek letters: alpha + beta. The Phoenician alphabet, ancestor of Greek, used aleph (ox) and beth (house).",
    language: "GREEK" as const,
  },
  {
    english: "senator",
    answer: "senex",
    options: ["senex", "vir", "dux", "rex"],
    fact: "From senex (old man). The Roman Senate was originally a council of elders. 'Senior' shares the same root.",
    language: "LATIN" as const,
  },
  {
    english: "telephone",
    answer: "\u03C4\u1FC6\u03BB\u03B5 + \u03C6\u03C9\u03BD\u03AE",
    options: ["\u03C4\u1FC6\u03BB\u03B5 + \u03C6\u03C9\u03BD\u03AE", "\u03C0\u03C1\u03CC + \u03BB\u03BF\u03B3\u03BF\u03C2", "\u03BC\u03B5\u03C4\u03AC + \u03B3\u03C1\u03AC\u03C6\u03C9", "\u1F00\u03BD\u03C4\u03AF + \u03C6\u03C9\u03BD\u03AE"],
    fact: "From tele (far) + phone (voice/sound). Though modern, it follows the classical Greek word-forming pattern perfectly.",
    language: "GREEK" as const,
  },
  {
    english: "aquarium",
    answer: "aqua",
    options: ["aqua", "mare", "flumen", "lacus"],
    fact: "From aqua (water). The Romans built elaborate aqueducts (aqua + ducere, to lead) spanning hundreds of miles.",
    language: "LATIN" as const,
  },
  {
    english: "dinosaur",
    answer: "\u03B4\u03B5\u03B9\u03BD\u03CC\u03C2 + \u03C3\u03B1\u1FE6\u03C1\u03BF\u03C2",
    options: ["\u03B4\u03B5\u03B9\u03BD\u03CC\u03C2 + \u03C3\u03B1\u1FE6\u03C1\u03BF\u03C2", "\u03BC\u03AD\u03B3\u03B1\u03C2 + \u03B8\u03B7\u03C1\u03AF\u03BF\u03BD", "\u03C0\u03B1\u03BB\u03B1\u03B9\u03CC\u03C2 + \u03B6\u1FF7\u03BF\u03BD", "\u1F04\u03B3\u03C1\u03B9\u03BF\u03C2 + \u03B4\u03C1\u03AC\u03BA\u03C9\u03BD"],
    fact: "From deinos (terrible, fearfully great) + sauros (lizard). Coined by Richard Owen in 1842 using Greek roots.",
    language: "GREEK" as const,
  },
  {
    english: "vaccine",
    answer: "vacca",
    options: ["vacca", "medicus", "morbus", "cura"],
    fact: "From vacca (cow). Edward Jenner used cowpox (variolae vaccinae) to immunize against smallpox, giving us the word 'vaccine.'",
    language: "LATIN" as const,
  },
];

const PASSAGE_PUZZLES = [
  {
    words: ["Gallia", "est", "omnis", "divisa", "in", "partes", "tres"],
    correct: ["Gallia", "est", "omnis", "divisa", "in", "partes", "tres"],
    translation: "All of Gaul is divided into three parts",
    author: "Caesar, De Bello Gallico",
    language: "LATIN" as const,
  },
  {
    words: ["\u03BC\u1FC6\u03BD\u03B9\u03BD", "\u1F04\u03B5\u03B9\u03B4\u03B5", "\u03B8\u03B5\u03AC", "\u03A0\u03B7\u03BB\u03B7\u03B9\u03AC\u03B4\u03B5\u03C9", "\u1F08\u03C7\u03B9\u03BB\u1FC6\u03BF\u03C2"],
    correct: ["\u03BC\u1FC6\u03BD\u03B9\u03BD", "\u1F04\u03B5\u03B9\u03B4\u03B5", "\u03B8\u03B5\u03AC", "\u03A0\u03B7\u03BB\u03B7\u03B9\u03AC\u03B4\u03B5\u03C9", "\u1F08\u03C7\u03B9\u03BB\u1FC6\u03BF\u03C2"],
    translation: "Sing, O goddess, the anger of Achilles, son of Peleus",
    author: "Homer, Iliad",
    language: "GREEK" as const,
  },
  {
    words: ["Arma", "virumque", "cano", "Troiae", "qui", "primus", "ab", "oris"],
    correct: ["Arma", "virumque", "cano", "Troiae", "qui", "primus", "ab", "oris"],
    translation: "I sing of arms and the man, who first from the shores of Troy",
    author: "Vergil, Aeneid",
    language: "LATIN" as const,
  },
  {
    words: ["\u1F04\u03BD\u03B4\u03C1\u03B1", "\u03BC\u03BF\u03B9", "\u1F14\u03BD\u03BD\u03B5\u03C0\u03B5", "\u039C\u03BF\u1FE6\u03C3\u03B1", "\u03C0\u03BF\u03BB\u03CD\u03C4\u03C1\u03BF\u03C0\u03BF\u03BD"],
    correct: ["\u1F04\u03BD\u03B4\u03C1\u03B1", "\u03BC\u03BF\u03B9", "\u1F14\u03BD\u03BD\u03B5\u03C0\u03B5", "\u039C\u03BF\u1FE6\u03C3\u03B1", "\u03C0\u03BF\u03BB\u03CD\u03C4\u03C1\u03BF\u03C0\u03BF\u03BD"],
    translation: "Tell me, O Muse, of the man of many turns",
    author: "Homer, Odyssey",
    language: "GREEK" as const,
  },
  {
    words: ["Tempus", "fugit", "irreparabile"],
    correct: ["Sed", "fugit", "interea", "fugit", "irreparabile", "tempus"],
    // simplified for the puzzle:
    translation: "But meanwhile it flees: time flees irretrievably",
    author: "Vergil, Georgics",
    language: "LATIN" as const,
  },
  {
    words: ["O", "tempora", "O", "mores"],
    correct: ["O", "tempora", "O", "mores"],
    translation: "Oh the times! Oh the customs!",
    author: "Cicero, In Catilinam",
    language: "LATIN" as const,
  },
  {
    words: ["\u03B3\u03BD\u1FF6\u03B8\u03B9", "\u03C3\u03B5\u03B1\u03C5\u03C4\u03CC\u03BD"],
    correct: ["\u03B3\u03BD\u1FF6\u03B8\u03B9", "\u03C3\u03B5\u03B1\u03C5\u03C4\u03CC\u03BD"],
    translation: "Know thyself",
    author: "Delphic maxim",
    language: "GREEK" as const,
  },
  {
    words: ["Errare", "humanum", "est"],
    correct: ["Errare", "humanum", "est"],
    translation: "To err is human",
    author: "Seneca",
    language: "LATIN" as const,
  },
  {
    words: ["Veni", "vidi", "vici"],
    correct: ["Veni", "vidi", "vici"],
    translation: "I came, I saw, I conquered",
    author: "Caesar",
    language: "LATIN" as const,
  },
  {
    words: ["\u03C0\u03AC\u03BD\u03C4\u03B1", "\u1FE5\u03B5\u1FD6", "\u03BA\u03B1\u1F76", "\u03BF\u1F50\u03B4\u1F72\u03BD", "\u03BC\u03AD\u03BD\u03B5\u03B9"],
    correct: ["\u03C0\u03AC\u03BD\u03C4\u03B1", "\u1FE5\u03B5\u1FD6", "\u03BA\u03B1\u1F76", "\u03BF\u1F50\u03B4\u1F72\u03BD", "\u03BC\u03AD\u03BD\u03B5\u03B9"],
    translation: "Everything flows and nothing remains",
    author: "Heraclitus",
    language: "GREEK" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function getDayLabel(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "short" });
}

function getChallengeType(dayOfYear: number): number {
  return dayOfYear % 4; // 0=word, 1=quote, 2=etymology, 3=passage
}

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  Challenge Type Components                                           */
/* ------------------------------------------------------------------ */

function WordOfDayChallenge({ onComplete }: { onComplete: (xp: number) => void }) {
  const dayOfYear = getDayOfYear();
  const data = WORD_OF_DAY[dayOfYear % WORD_OF_DAY.length];
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const correct = input.trim().toLowerCase().includes(data.translation.split(",")[0].trim().toLowerCase());
    setIsCorrect(correct);
    setSubmitted(true);
    onComplete(correct ? 50 : 25);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ocean/10 text-ocean">
          Word of the Day
        </span>
        <span className="text-xs text-graphite">{data.language === "LATIN" ? "Latin" : "Ancient Greek"}</span>
      </div>

      <p className="text-2xl font-serif font-bold text-ink mb-1">{data.word}</p>
      <p className="text-sm text-graphite italic mb-4">&ldquo;{data.context}&rdquo;</p>

      {!submitted ? (
        <div>
          <p className="text-sm text-graphite mb-2">Translate this word:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Your translation..."
              className="flex-1 px-3 py-2.5 rounded-xl bg-snow border border-stone/30 text-sm text-ink placeholder:text-graphite/50 outline-none focus:ring-2 focus:ring-ocean/30"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="px-5 py-2.5 rounded-xl bg-ocean text-white text-sm font-semibold hover:bg-ocean/90 transition-colors disabled:opacity-50"
            >
              Check
            </button>
          </div>
          <p className="text-xs text-graphite/60 mt-2">Hint: {data.hint}</p>
        </div>
      ) : (
        <div className={cn(
          "p-3 rounded-xl",
          isCorrect ? "bg-clover/10" : "bg-saffron/10"
        )}>
          <p className={cn("text-sm font-semibold mb-1", isCorrect ? "text-clover" : "text-saffron")}>
            {isCorrect ? "Correct!" : "Good attempt!"}
          </p>
          <p className="text-sm text-ink">
            <span className="font-medium">{data.word}</span> = {data.translation}
          </p>
          <p className={cn("text-xs font-semibold mt-2", isCorrect ? "text-clover" : "text-saffron")}>
            +{isCorrect ? 50 : 25} XP
          </p>
        </div>
      )}
    </div>
  );
}

function QuoteTranslationChallenge({ onComplete }: { onComplete: (xp: number) => void }) {
  const dayOfYear = getDayOfYear();
  const quote = DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isClose, setIsClose] = useState(false);

  const handleSubmit = () => {
    if (!input.trim()) return;
    // Check if at least 2 key words match
    const userWords = input.toLowerCase().split(/\s+/);
    const answerWords = quote.translation.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const matches = answerWords.filter(w => userWords.some(u => u.includes(w) || w.includes(u)));
    const close = matches.length >= Math.min(2, answerWords.length);
    setIsClose(close);
    setSubmitted(true);
    onComplete(close ? 50 : 25);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-iris/10 text-iris">
          Famous Quote
        </span>
        <span className="text-xs text-graphite">{quote.language === "LATIN" ? "Latin" : "Ancient Greek"}</span>
      </div>

      <p className="text-2xl font-serif font-bold text-ink mb-1">{quote.original}</p>
      <p className="text-sm text-graphite mb-4">&mdash; {quote.author}</p>

      {!submitted ? (
        <div>
          <p className="text-sm text-graphite mb-2">Translate this quote:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Your translation..."
              className="flex-1 px-3 py-2.5 rounded-xl bg-snow border border-stone/30 text-sm text-ink placeholder:text-graphite/50 outline-none focus:ring-2 focus:ring-ocean/30"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="px-5 py-2.5 rounded-xl bg-ocean text-white text-sm font-semibold hover:bg-ocean/90 transition-colors disabled:opacity-50"
            >
              Check
            </button>
          </div>
        </div>
      ) : (
        <div className={cn("p-3 rounded-xl", isClose ? "bg-clover/10" : "bg-saffron/10")}>
          <p className={cn("text-sm font-semibold mb-1", isClose ? "text-clover" : "text-saffron")}>
            {isClose ? "Well done!" : "Nice try!"}
          </p>
          <p className="text-sm text-ink">
            <span className="font-medium">Translation:</span> {quote.translation}
          </p>
          <p className={cn("text-xs font-semibold mt-2", isClose ? "text-clover" : "text-saffron")}>
            +{isClose ? 50 : 25} XP
          </p>
        </div>
      )}
    </div>
  );
}

function EtymologyChallenge({ onComplete }: { onComplete: (xp: number) => void }) {
  const dayOfYear = getDayOfYear();
  const data = ETYMOLOGY_DATA[dayOfYear % ETYMOLOGY_DATA.length];
  const shuffledOptions = useMemo(() => shuffle(data.options, dayOfYear), [data.options, dayOfYear]);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    onComplete(opt === data.answer ? 50 : 25);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-saffron/10 text-saffron">
          Etymology Detective
        </span>
        <span className="text-xs text-graphite">{data.language === "LATIN" ? "Latin" : "Ancient Greek"}</span>
      </div>

      <p className="text-sm text-graphite mb-1">The English word:</p>
      <p className="text-2xl font-serif font-bold text-ink mb-3">&ldquo;{data.english}&rdquo;</p>
      <p className="text-sm text-graphite mb-4">What is the original {data.language === "LATIN" ? "Latin" : "Greek"} word?</p>

      <div className="grid grid-cols-1 gap-2 mb-3">
        {shuffledOptions.map((opt) => {
          let cls = "bg-snow border border-stone/30 text-ink hover:border-ocean";
          if (selected) {
            if (opt === data.answer) cls = "bg-clover/10 border-2 border-clover text-clover";
            else if (opt === selected) cls = "bg-vermillion/10 border-2 border-vermillion text-vermillion";
            else cls = "bg-snow border border-stone/20 text-graphite/50";
          }
          return (
            <button
              key={opt}
              disabled={!!selected}
              onClick={() => handleSelect(opt)}
              className={cn("py-2.5 px-4 rounded-xl text-sm font-medium text-left transition-all", cls)}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="p-3 rounded-xl bg-linen/80 mt-3">
          <p className="text-sm text-ink">{data.fact}</p>
          <p className={cn(
            "text-xs font-semibold mt-2",
            selected === data.answer ? "text-clover" : "text-saffron"
          )}>
            +{selected === data.answer ? 50 : 25} XP
          </p>
        </div>
      )}
    </div>
  );
}

function PassagePuzzleChallenge({ onComplete }: { onComplete: (xp: number) => void }) {
  const dayOfYear = getDayOfYear();
  const data = PASSAGE_PUZZLES[dayOfYear % PASSAGE_PUZZLES.length];
  const scrambled = useMemo(() => shuffle(data.correct, dayOfYear), [data.correct, dayOfYear]);

  const [available, setAvailable] = useState<string[]>(scrambled);
  const [placed, setPlaced] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const handlePlace = (word: string, idx: number) => {
    const newAvailable = [...available];
    newAvailable.splice(idx, 1);
    setAvailable(newAvailable);
    const newPlaced = [...placed, word];
    setPlaced(newPlaced);

    if (newPlaced.length === data.correct.length) {
      const isCorrect = newPlaced.every((w, i) => w === data.correct[i]);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const bonus = elapsed < 30 ? 25 : elapsed < 60 ? 10 : 0;
      const xp = (isCorrect ? 50 : 25) + bonus;
      setCompleted(true);
      onComplete(xp);
    }
  };

  const handleRemove = (idx: number) => {
    if (completed) return;
    const word = placed[idx];
    const newPlaced = [...placed];
    newPlaced.splice(idx, 1);
    setPlaced(newPlaced);
    setAvailable([...available, word]);
  };

  const isCorrect = placed.every((w, i) => w === data.correct[i]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-clover/10 text-clover">
          Passage Puzzle
        </span>
        <span className="text-xs text-graphite">{data.language === "LATIN" ? "Latin" : "Ancient Greek"}</span>
        {!completed && (
          <span className="ml-auto flex items-center gap-1 text-xs text-graphite">
            <Clock className="w-3 h-3" />
            Bonus XP for speed!
          </span>
        )}
      </div>

      <p className="text-sm text-graphite mb-3">Put the words in the correct order:</p>

      {/* Placed words area */}
      <div className="min-h-[48px] p-3 rounded-xl bg-snow border-2 border-dashed border-stone/30 flex flex-wrap gap-2 mb-3">
        {placed.length === 0 && (
          <p className="text-xs text-graphite/40">Tap words below to place them here...</p>
        )}
        {placed.map((word, i) => (
          <button
            key={`placed-${i}`}
            onClick={() => handleRemove(i)}
            disabled={completed}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              completed && isCorrect
                ? "bg-clover/10 text-clover border border-clover/30"
                : completed && !isCorrect
                ? "bg-vermillion/10 text-vermillion border border-vermillion/30"
                : "bg-ocean/10 text-ocean border border-ocean/30 hover:bg-ocean/20"
            )}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2 mb-3">
        {available.map((word, i) => (
          <button
            key={`avail-${i}`}
            onClick={() => handlePlace(word, i)}
            disabled={completed}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-linen text-ink border border-stone/20 hover:border-ocean hover:text-ocean transition-all"
          >
            {word}
          </button>
        ))}
      </div>

      {completed && (
        <div className={cn("p-3 rounded-xl", isCorrect ? "bg-clover/10" : "bg-saffron/10")}>
          <p className={cn("text-sm font-semibold mb-1", isCorrect ? "text-clover" : "text-saffron")}>
            {isCorrect ? "Perfect!" : "Close!"}
          </p>
          <p className="text-sm text-ink mb-1">
            <span className="font-serif italic">{data.correct.join(" ")}</span>
          </p>
          <p className="text-xs text-graphite">{data.translation} &mdash; {data.author}</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

export default function DailyChallenge() {
  const { addXp, completeDailyChallenge, dailyChallengeStreak, lastChallengeDate } = useAppStore();
  const [xpAwarded, setXpAwarded] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const alreadyCompleted = lastChallengeDate === today;

  const dayOfYear = getDayOfYear();
  const challengeType = getChallengeType(dayOfYear);

  const handleComplete = useCallback(
    (xp: number) => {
      if (alreadyCompleted) return;
      setXpAwarded(xp);
      addXp(xp);
      completeDailyChallenge();
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    },
    [addXp, completeDailyChallenge, alreadyCompleted]
  );

  const challengeLabels = ["Word of the Day", "Famous Quote", "Etymology Detective", "Passage Puzzle"];

  return (
    <div className="bg-linen rounded-2xl p-5 mb-6 relative overflow-hidden">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 animate-in fade-in duration-300">
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">&#127881;</span>
            <p className="text-lg font-serif font-bold text-ink">Challenge Complete!</p>
            <p className="text-ocean font-semibold">+{xpAwarded} XP</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ocean" />
          <h2 className="text-lg font-serif font-bold text-ink">Daily Challenge</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-snow px-2.5 py-1 rounded-full text-ink">
            {getDayLabel()}
          </span>
          {dailyChallengeStreak > 0 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-saffron">
              <Flame className="w-3.5 h-3.5" />
              {dailyChallengeStreak}
            </span>
          )}
        </div>
      </div>

      {alreadyCompleted && !showCelebration ? (
        <div className="flex items-center gap-3 py-3">
          <CheckCircle2 className="w-8 h-8 text-clover" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-clover">Already completed today</p>
            <p className="text-xs text-graphite">
              Next challenge in {getTimeUntilMidnight()}
            </p>
          </div>
          {dailyChallengeStreak > 0 && (
            <div className="flex items-center gap-1.5 bg-saffron/10 px-3 py-1.5 rounded-full">
              <Trophy className="w-3.5 h-3.5 text-saffron" />
              <span className="text-xs font-semibold text-saffron">{dailyChallengeStreak}-day streak</span>
            </div>
          )}
        </div>
      ) : (
        <>
          {challengeType === 0 && <WordOfDayChallenge onComplete={handleComplete} />}
          {challengeType === 1 && <QuoteTranslationChallenge onComplete={handleComplete} />}
          {challengeType === 2 && <EtymologyChallenge onComplete={handleComplete} />}
          {challengeType === 3 && <PassagePuzzleChallenge onComplete={handleComplete} />}
        </>
      )}
    </div>
  );
}
