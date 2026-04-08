/**
 * Codex Progression System
 *
 * Books, vocabulary, and grammar concepts are organized into a sequential
 * learning path that builds difficulty progressively. Users must demonstrate
 * mastery at each level before advancing.
 *
 * Inspired by Duolingo's skill tree + Babbel's structured curriculum.
 */

import type { Language, Difficulty } from "@/types";

// ─── Difficulty Ordering ───────────────────────────────────────────────────

export const DIFFICULTY_ORDER: Difficulty[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function getDifficultyIndex(d: Difficulty): number {
  return DIFFICULTY_ORDER.indexOf(d);
}

export function isAtOrAboveLevel(current: Difficulty, required: Difficulty): boolean {
  return getDifficultyIndex(current) >= getDifficultyIndex(required);
}

export function getNextDifficulty(current: Difficulty): Difficulty | null {
  const idx = getDifficultyIndex(current);
  return idx < DIFFICULTY_ORDER.length - 1 ? DIFFICULTY_ORDER[idx + 1] : null;
}

// ─── Learning Path Definition ──────────────────────────────────────────────

/**
 * Each language has a structured learning path.
 * Books are ordered by difficulty and prerequisite knowledge.
 * Users must complete (or test out of) earlier stages to unlock later ones.
 */
export interface PathNode {
  bookId: string;
  title: string;
  author: string;
  difficulty: Difficulty;
  /** Minimum vocabulary words from previous books needed to unlock */
  vocabPrerequisite: number;
  /** Minimum chapters completed in the path before this unlocks */
  chaptersPrerequisite: number;
  /** Grammar concepts that should be understood */
  grammarPrerequisites: string[];
  /** New grammar concepts introduced in this text */
  grammarIntroduced: string[];
  /** Core vocabulary themes */
  vocabThemes: string[];
  /** What this text builds toward */
  learningObjective: string;
}

export const LATIN_PATH: PathNode[] = [
  {
    bookId: "1",
    title: "De Bello Gallico",
    author: "Caesar",
    difficulty: "A2",
    vocabPrerequisite: 0,
    chaptersPrerequisite: 0,
    grammarPrerequisites: [],
    grammarIntroduced: [
      "1st & 2nd declension nouns",
      "Present tense active indicative",
      "Basic prepositions (in, ad, ab, ex)",
      "Subject-verb agreement",
      "Nominative & accusative cases",
    ],
    vocabThemes: ["military", "geography", "peoples", "basic verbs", "numbers"],
    learningObjective: "Read simple narrative prose with military vocabulary",
  },
  {
    bookId: "4",
    title: "Metamorphoses I",
    author: "Ovid",
    difficulty: "B1",
    vocabPrerequisite: 100,
    chaptersPrerequisite: 4,
    grammarPrerequisites: [
      "1st & 2nd declension nouns",
      "Present tense active indicative",
    ],
    grammarIntroduced: [
      "3rd declension nouns",
      "Imperfect & future tenses",
      "Relative clauses (qui, quae, quod)",
      "Ablative of means/manner",
      "Poetic word order",
    ],
    vocabThemes: ["mythology", "nature", "transformation", "emotions", "gods"],
    learningObjective: "Read mythological narrative with flexible word order",
  },
  {
    bookId: "2",
    title: "In Catilinam I",
    author: "Cicero",
    difficulty: "B1",
    vocabPrerequisite: 200,
    chaptersPrerequisite: 10,
    grammarPrerequisites: [
      "3rd declension nouns",
      "Relative clauses",
      "Imperfect & future tenses",
    ],
    grammarIntroduced: [
      "Subjunctive mood (present & imperfect)",
      "Indirect speech (accusative + infinitive)",
      "Rhetorical questions",
      "Purpose clauses (ut/ne + subjunctive)",
      "Complex periodic sentences",
    ],
    vocabThemes: ["politics", "law", "rhetoric", "morality", "republic"],
    learningObjective: "Understand rhetorical prose and political argumentation",
  },
  {
    bookId: "3",
    title: "Aeneid I",
    author: "Virgil",
    difficulty: "B2",
    vocabPrerequisite: 350,
    chaptersPrerequisite: 18,
    grammarPrerequisites: [
      "Subjunctive mood",
      "Indirect speech",
      "Poetic word order",
    ],
    grammarIntroduced: [
      "Dactylic hexameter (scansion)",
      "Synchysis & hyperbaton",
      "Perfect & pluperfect subjunctive",
      "Ablative absolute",
      "Gerund & gerundive",
    ],
    vocabThemes: ["epic", "fate", "gods", "war", "journey", "duty"],
    learningObjective: "Read epic poetry with advanced grammatical structures",
  },
  {
    bookId: "5",
    title: "Ab Urbe Condita I",
    author: "Livy",
    difficulty: "C1",
    vocabPrerequisite: 500,
    chaptersPrerequisite: 30,
    grammarPrerequisites: [
      "Ablative absolute",
      "Gerund & gerundive",
      "Complex periodic sentences",
    ],
    grammarIntroduced: [
      "Indirect discourse in extended passages",
      "Historical infinitive",
      "Archaisms & formal register",
      "Complex conditional sentences",
      "Oratio obliqua",
    ],
    vocabThemes: ["history", "founding myths", "politics", "religion", "social customs"],
    learningObjective: "Read historical prose with sophisticated narrative techniques",
  },
];

export const GREEK_PATH: PathNode[] = [
  {
    bookId: "6",
    title: "Anabasis I",
    author: "Xenophon",
    difficulty: "A2",
    vocabPrerequisite: 0,
    chaptersPrerequisite: 0,
    grammarPrerequisites: [],
    grammarIntroduced: [
      "Greek alphabet & diacriticals",
      "1st & 2nd declension nouns",
      "Present tense indicative (thematic verbs)",
      "Definite article (ὁ, ἡ, τό)",
      "Basic prepositions (ἐν, εἰς, ἐκ, πρός)",
    ],
    vocabThemes: ["military", "march", "geography", "leadership"],
    learningObjective: "Read straightforward narrative Greek prose",
  },
  {
    bookId: "7",
    title: "Apology",
    author: "Plato",
    difficulty: "B1",
    vocabPrerequisite: 100,
    chaptersPrerequisite: 5,
    grammarPrerequisites: [
      "Greek alphabet & diacriticals",
      "1st & 2nd declension nouns",
      "Present tense indicative",
    ],
    grammarIntroduced: [
      "3rd declension nouns",
      "Aorist tense (1st & 2nd)",
      "Participles (present & aorist)",
      "Infinitive constructions",
      "ὅτι/ὡς clauses",
    ],
    vocabThemes: ["philosophy", "justice", "wisdom", "trial", "death"],
    learningObjective: "Read philosophical dialogue and argumentation",
  },
  {
    bookId: "8",
    title: "Iliad I",
    author: "Homer",
    difficulty: "B2",
    vocabPrerequisite: 250,
    chaptersPrerequisite: 12,
    grammarPrerequisites: [
      "Aorist tense",
      "Participles",
      "3rd declension nouns",
    ],
    grammarIntroduced: [
      "Epic dialect (Ionic/Aeolic forms)",
      "Dactylic hexameter in Greek",
      "Middle/passive voice",
      "Optative mood",
      "Tmesis & epic formulae",
    ],
    vocabThemes: ["heroism", "wrath", "honor", "gods", "war", "fate"],
    learningObjective: "Read Homeric epic poetry in its original dialect",
  },
  {
    bookId: "9",
    title: "Nicomachean Ethics I",
    author: "Aristotle",
    difficulty: "C1",
    vocabPrerequisite: 400,
    chaptersPrerequisite: 22,
    grammarPrerequisites: [
      "Optative mood",
      "Middle/passive voice",
      "Infinitive constructions",
    ],
    grammarIntroduced: [
      "Abstract philosophical vocabulary",
      "Complex conditional reasoning (εἰ + optative)",
      "Articular infinitive",
      "Result clauses (ὥστε)",
      "Technical definition patterns",
    ],
    vocabThemes: ["virtue", "happiness", "good", "soul", "function", "excellence"],
    learningObjective: "Read dense philosophical argumentation in Attic prose",
  },
];

// ─── Progression State ─────────────────────────────────────────────────────

export interface UserProgression {
  language: Language;
  currentLevel: Difficulty;
  vocabMastered: number;
  chaptersCompleted: number;
  grammarCompleted: string[];
  booksCompleted: string[];
  currentBookId: string | null;
  assessmentsPassed: Difficulty[];
}

/**
 * Determines if a book is unlocked based on user's progression
 */
export function isBookUnlocked(
  bookId: string,
  path: PathNode[],
  progression: UserProgression
): { unlocked: boolean; reason?: string; progress?: number } {
  const node = path.find((n) => n.bookId === bookId);
  if (!node) return { unlocked: false, reason: "Book not found in path" };

  // Check difficulty level
  if (!isAtOrAboveLevel(progression.currentLevel, node.difficulty)) {
    return {
      unlocked: false,
      reason: `Requires ${node.difficulty} proficiency. Complete the ${node.difficulty} assessment to unlock.`,
      progress: getDifficultyIndex(progression.currentLevel) / getDifficultyIndex(node.difficulty) * 100,
    };
  }

  // Check vocabulary prerequisite
  if (progression.vocabMastered < node.vocabPrerequisite) {
    return {
      unlocked: false,
      reason: `Requires ${node.vocabPrerequisite} mastered words. You have ${progression.vocabMastered}.`,
      progress: (progression.vocabMastered / node.vocabPrerequisite) * 100,
    };
  }

  // Check chapters prerequisite
  if (progression.chaptersCompleted < node.chaptersPrerequisite) {
    return {
      unlocked: false,
      reason: `Complete ${node.chaptersPrerequisite - progression.chaptersCompleted} more chapters to unlock.`,
      progress: (progression.chaptersCompleted / node.chaptersPrerequisite) * 100,
    };
  }

  // Check grammar prerequisites
  const missingGrammar = node.grammarPrerequisites.filter(
    (g) => !progression.grammarCompleted.includes(g)
  );
  if (missingGrammar.length > 0) {
    return {
      unlocked: false,
      reason: `Review grammar: ${missingGrammar[0]}`,
      progress: ((node.grammarPrerequisites.length - missingGrammar.length) / node.grammarPrerequisites.length) * 100,
    };
  }

  return { unlocked: true };
}

/**
 * Gets the next recommended action for a user in a language path
 */
export function getNextAction(
  path: PathNode[],
  progression: UserProgression
): {
  type: "continue-book" | "start-book" | "review-vocab" | "take-assessment" | "study-grammar" | "path-complete";
  bookId?: string;
  detail: string;
} {
  // If currently reading a book, continue it
  if (progression.currentBookId) {
    const node = path.find((n) => n.bookId === progression.currentBookId);
    if (node) {
      return {
        type: "continue-book",
        bookId: progression.currentBookId,
        detail: `Continue reading ${node.title}`,
      };
    }
  }

  // Find the first locked book and determine what's needed
  for (const node of path) {
    if (progression.booksCompleted.includes(node.bookId)) continue;

    const status = isBookUnlocked(node.bookId, path, progression);
    if (status.unlocked) {
      return {
        type: "start-book",
        bookId: node.bookId,
        detail: `Start ${node.title} by ${node.author}`,
      };
    }

    // Determine what's blocking
    if (!isAtOrAboveLevel(progression.currentLevel, node.difficulty)) {
      return {
        type: "take-assessment",
        detail: `Take the ${node.difficulty} proficiency assessment to unlock ${node.title}`,
      };
    }

    if (progression.vocabMastered < node.vocabPrerequisite) {
      return {
        type: "review-vocab",
        detail: `Master ${node.vocabPrerequisite - progression.vocabMastered} more words to unlock ${node.title}`,
      };
    }

    const missingGrammar = node.grammarPrerequisites.filter(
      (g) => !progression.grammarCompleted.includes(g)
    );
    if (missingGrammar.length > 0) {
      return {
        type: "study-grammar",
        detail: `Study "${missingGrammar[0]}" to unlock ${node.title}`,
      };
    }
  }

  return {
    type: "path-complete",
    detail: `Congratulations! You've completed the ${progression.language} path!`,
  };
}

// ─── Vocabulary Difficulty Tiers ────────────────────────────────────────────

/**
 * Vocabulary words are tiered by frequency and complexity.
 * Earlier books introduce high-frequency words; later books add rarer terms.
 */
export interface VocabTier {
  tier: 1 | 2 | 3 | 4 | 5;
  label: string;
  description: string;
  wordCountRange: [number, number]; // min-max words in this tier
  difficulty: Difficulty;
}

export const VOCAB_TIERS: VocabTier[] = [
  {
    tier: 1,
    label: "Foundation",
    description: "The 100 most common words. Essential for any reading.",
    wordCountRange: [0, 100],
    difficulty: "A2",
  },
  {
    tier: 2,
    label: "Core",
    description: "Words 101-300. Covers most simple prose.",
    wordCountRange: [101, 300],
    difficulty: "B1",
  },
  {
    tier: 3,
    label: "Intermediate",
    description: "Words 301-600. Required for poetry and rhetoric.",
    wordCountRange: [301, 600],
    difficulty: "B2",
  },
  {
    tier: 4,
    label: "Advanced",
    description: "Words 601-1000. Philosophical and literary vocabulary.",
    wordCountRange: [601, 1000],
    difficulty: "C1",
  },
  {
    tier: 5,
    label: "Scholarly",
    description: "Words 1000+. Rare forms, archaic terms, technical language.",
    wordCountRange: [1001, Infinity],
    difficulty: "C2",
  },
];

export function getVocabTier(wordIndex: number): VocabTier {
  for (const tier of VOCAB_TIERS) {
    if (wordIndex >= tier.wordCountRange[0] && wordIndex <= tier.wordCountRange[1]) {
      return tier;
    }
  }
  return VOCAB_TIERS[VOCAB_TIERS.length - 1];
}

// ─── Grammar Progression ───────────────────────────────────────────────────

/**
 * Grammar concepts are introduced sequentially.
 * Each concept has prerequisites and is linked to specific books.
 */
export interface GrammarConcept {
  id: string;
  name: string;
  language: Language;
  difficulty: Difficulty;
  prerequisites: string[];
  description: string;
  introducedInBookId: string;
}

export const LATIN_GRAMMAR_PROGRESSION: GrammarConcept[] = [
  { id: "lat-noun-12", name: "1st & 2nd Declension Nouns", language: "LATIN", difficulty: "A2", prerequisites: [], description: "Learn the basic noun patterns: puella, dominus", introducedInBookId: "1" },
  { id: "lat-pres-act", name: "Present Tense Active", language: "LATIN", difficulty: "A2", prerequisites: [], description: "Basic verb forms: amo, mones, ducit", introducedInBookId: "1" },
  { id: "lat-nom-acc", name: "Nominative & Accusative Cases", language: "LATIN", difficulty: "A2", prerequisites: ["lat-noun-12"], description: "Subject and direct object", introducedInBookId: "1" },
  { id: "lat-prepositions", name: "Basic Prepositions", language: "LATIN", difficulty: "A2", prerequisites: [], description: "in, ad, ab, ex, cum, de", introducedInBookId: "1" },
  { id: "lat-noun-3", name: "3rd Declension Nouns", language: "LATIN", difficulty: "B1", prerequisites: ["lat-noun-12"], description: "Complex noun patterns: rex, nomen, mare", introducedInBookId: "4" },
  { id: "lat-imp-fut", name: "Imperfect & Future Tenses", language: "LATIN", difficulty: "B1", prerequisites: ["lat-pres-act"], description: "Past and future narration", introducedInBookId: "4" },
  { id: "lat-relative", name: "Relative Clauses", language: "LATIN", difficulty: "B1", prerequisites: ["lat-nom-acc"], description: "qui, quae, quod — who, which, that", introducedInBookId: "4" },
  { id: "lat-subjunctive", name: "Subjunctive Mood", language: "LATIN", difficulty: "B1", prerequisites: ["lat-imp-fut"], description: "Purpose, result, and indirect commands", introducedInBookId: "2" },
  { id: "lat-indirect", name: "Indirect Speech", language: "LATIN", difficulty: "B1", prerequisites: ["lat-pres-act", "lat-nom-acc"], description: "Accusative + infinitive construction", introducedInBookId: "2" },
  { id: "lat-hexameter", name: "Dactylic Hexameter", language: "LATIN", difficulty: "B2", prerequisites: ["lat-noun-3", "lat-relative"], description: "Scanning and reading epic poetry", introducedInBookId: "3" },
  { id: "lat-abl-abs", name: "Ablative Absolute", language: "LATIN", difficulty: "B2", prerequisites: ["lat-subjunctive"], description: "Independent participial phrases", introducedInBookId: "3" },
  { id: "lat-gerund", name: "Gerund & Gerundive", language: "LATIN", difficulty: "B2", prerequisites: ["lat-subjunctive"], description: "Verbal nouns and obligation", introducedInBookId: "3" },
  { id: "lat-hist-inf", name: "Historical Infinitive", language: "LATIN", difficulty: "C1", prerequisites: ["lat-indirect"], description: "Vivid narrative technique in history", introducedInBookId: "5" },
  { id: "lat-oratio", name: "Oratio Obliqua", language: "LATIN", difficulty: "C1", prerequisites: ["lat-indirect", "lat-subjunctive"], description: "Extended indirect discourse", introducedInBookId: "5" },
];

export const GREEK_GRAMMAR_PROGRESSION: GrammarConcept[] = [
  { id: "grk-alphabet", name: "Greek Alphabet & Diacriticals", language: "GREEK", difficulty: "A2", prerequisites: [], description: "α β γ δ — breathing marks and accents", introducedInBookId: "6" },
  { id: "grk-article", name: "Definite Article", language: "GREEK", difficulty: "A2", prerequisites: ["grk-alphabet"], description: "ὁ, ἡ, τό — the most important word in Greek", introducedInBookId: "6" },
  { id: "grk-noun-12", name: "1st & 2nd Declension", language: "GREEK", difficulty: "A2", prerequisites: ["grk-alphabet"], description: "Basic noun patterns", introducedInBookId: "6" },
  { id: "grk-pres-ind", name: "Present Indicative", language: "GREEK", difficulty: "A2", prerequisites: ["grk-alphabet"], description: "Thematic verb conjugation", introducedInBookId: "6" },
  { id: "grk-noun-3", name: "3rd Declension", language: "GREEK", difficulty: "B1", prerequisites: ["grk-noun-12"], description: "Complex noun patterns", introducedInBookId: "7" },
  { id: "grk-aorist", name: "Aorist Tense", language: "GREEK", difficulty: "B1", prerequisites: ["grk-pres-ind"], description: "Simple past action — the backbone of narrative", introducedInBookId: "7" },
  { id: "grk-participles", name: "Participles", language: "GREEK", difficulty: "B1", prerequisites: ["grk-pres-ind", "grk-aorist"], description: "The most versatile form in Greek", introducedInBookId: "7" },
  { id: "grk-epic-dialect", name: "Epic Dialect", language: "GREEK", difficulty: "B2", prerequisites: ["grk-noun-3", "grk-aorist"], description: "Ionic/Aeolic forms in Homer", introducedInBookId: "8" },
  { id: "grk-mid-pass", name: "Middle/Passive Voice", language: "GREEK", difficulty: "B2", prerequisites: ["grk-aorist"], description: "Actions done to/for oneself", introducedInBookId: "8" },
  { id: "grk-optative", name: "Optative Mood", language: "GREEK", difficulty: "B2", prerequisites: ["grk-aorist", "grk-participles"], description: "Wishes, potentials, remote conditions", introducedInBookId: "8" },
  { id: "grk-art-inf", name: "Articular Infinitive", language: "GREEK", difficulty: "C1", prerequisites: ["grk-participles"], description: "τὸ + infinitive — abstract concepts", introducedInBookId: "9" },
  { id: "grk-result", name: "Result Clauses", language: "GREEK", difficulty: "C1", prerequisites: ["grk-optative"], description: "ὥστε + infinitive/indicative", introducedInBookId: "9" },
];

/**
 * Get grammar concepts available at a given point in the path
 */
export function getAvailableGrammar(
  language: Language,
  completedConcepts: string[]
): GrammarConcept[] {
  const allConcepts =
    language === "LATIN" ? LATIN_GRAMMAR_PROGRESSION : GREEK_GRAMMAR_PROGRESSION;

  return allConcepts.filter((concept) => {
    // Already completed
    if (completedConcepts.includes(concept.id)) return false;
    // All prerequisites met
    return concept.prerequisites.every((p) => completedConcepts.includes(p));
  });
}
