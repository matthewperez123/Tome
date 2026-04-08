/**
 * Codex Proficiency System
 *
 * Tracks user proficiency per language, tied to their authenticated profile.
 * Proficiency is measured across 4 dimensions:
 * 1. Vocabulary breadth (unique words known)
 * 2. Reading comprehension (quiz accuracy)
 * 3. Grammar mastery (concepts completed)
 * 4. Reading fluency (words per minute, consistency)
 *
 * Each dimension contributes to an overall CEFR level (A1-C2).
 */

import type { Language, Difficulty } from "@/types";

// ─── Proficiency Dimensions ────────────────────────────────────────────────

export interface ProficiencyProfile {
  userId: string;
  language: Language;

  // Vocabulary dimension
  vocabKnown: number;         // unique words at LEARNING or MASTERED
  vocabMastered: number;      // unique words at MASTERED only
  vocabTotal: number;         // total words encountered

  // Reading comprehension
  quizAccuracy: number;       // lifetime accuracy 0-100
  quizzesTaken: number;
  correctAnswers: number;
  totalQuestions: number;

  // Grammar mastery
  grammarConceptsCompleted: string[];
  grammarConceptsTotal: number;

  // Reading fluency
  wordsRead: number;
  minutesRead: number;
  averageWpm: number;
  chaptersCompleted: number;
  booksCompleted: number;

  // Calculated
  overallLevel: Difficulty;
  dimensionScores: {
    vocabulary: number;     // 0-100
    comprehension: number;  // 0-100
    grammar: number;        // 0-100
    fluency: number;        // 0-100
  };
  lastAssessedAt: string;
}

// ─── Level Thresholds ──────────────────────────────────────────────────────

interface LevelThresholds {
  vocabKnown: number;
  vocabMastered: number;
  quizAccuracy: number;
  grammarPercent: number;  // % of available grammar concepts
  chaptersCompleted: number;
  averageWpm: number;
}

const LEVEL_THRESHOLDS: Record<Difficulty, LevelThresholds> = {
  A1: {
    vocabKnown: 0,
    vocabMastered: 0,
    quizAccuracy: 0,
    grammarPercent: 0,
    chaptersCompleted: 0,
    averageWpm: 0,
  },
  A2: {
    vocabKnown: 50,
    vocabMastered: 20,
    quizAccuracy: 50,
    grammarPercent: 15,
    chaptersCompleted: 3,
    averageWpm: 5,
  },
  B1: {
    vocabKnown: 150,
    vocabMastered: 75,
    quizAccuracy: 60,
    grammarPercent: 35,
    chaptersCompleted: 12,
    averageWpm: 10,
  },
  B2: {
    vocabKnown: 400,
    vocabMastered: 200,
    quizAccuracy: 70,
    grammarPercent: 55,
    chaptersCompleted: 25,
    averageWpm: 15,
  },
  C1: {
    vocabKnown: 800,
    vocabMastered: 500,
    quizAccuracy: 80,
    grammarPercent: 75,
    chaptersCompleted: 45,
    averageWpm: 20,
  },
  C2: {
    vocabKnown: 1500,
    vocabMastered: 1000,
    quizAccuracy: 90,
    grammarPercent: 90,
    chaptersCompleted: 70,
    averageWpm: 25,
  },
};

// ─── Proficiency Calculation ───────────────────────────────────────────────

/**
 * Calculate dimension score (0-100) based on where the user falls
 * between the current level threshold and the next level threshold.
 */
function dimensionProgress(
  value: number,
  currentThreshold: number,
  nextThreshold: number
): number {
  if (nextThreshold <= currentThreshold) return 100;
  const progress = (value - currentThreshold) / (nextThreshold - currentThreshold);
  return Math.min(100, Math.max(0, Math.round(progress * 100)));
}

const DIFFICULTY_ORDER: Difficulty[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

/**
 * Calculate the user's overall CEFR level for a language.
 * The level is the highest level where ALL dimension thresholds are met.
 */
export function calculateLevel(profile: Omit<ProficiencyProfile, "overallLevel" | "dimensionScores" | "lastAssessedAt">): {
  level: Difficulty;
  dimensionScores: ProficiencyProfile["dimensionScores"];
  nextLevelProgress: number;
} {
  let achievedLevel: Difficulty = "A1";

  for (const level of DIFFICULTY_ORDER) {
    const thresholds = LEVEL_THRESHOLDS[level];
    const grammarPercent =
      profile.grammarConceptsTotal > 0
        ? (profile.grammarConceptsCompleted.length / profile.grammarConceptsTotal) * 100
        : 0;

    const meetsVocab = profile.vocabKnown >= thresholds.vocabKnown;
    const meetsMastered = profile.vocabMastered >= thresholds.vocabMastered;
    const meetsQuiz = profile.quizAccuracy >= thresholds.quizAccuracy || profile.quizzesTaken === 0;
    const meetsGrammar = grammarPercent >= thresholds.grammarPercent;
    const meetsChapters = profile.chaptersCompleted >= thresholds.chaptersCompleted;

    if (meetsVocab && meetsMastered && meetsQuiz && meetsGrammar && meetsChapters) {
      achievedLevel = level;
    } else {
      break;
    }
  }

  // Calculate dimension scores relative to next level
  const currentIdx = DIFFICULTY_ORDER.indexOf(achievedLevel);
  const nextLevel = currentIdx < 5 ? DIFFICULTY_ORDER[currentIdx + 1] : achievedLevel;
  const currentT = LEVEL_THRESHOLDS[achievedLevel];
  const nextT = LEVEL_THRESHOLDS[nextLevel];
  const grammarPercent =
    profile.grammarConceptsTotal > 0
      ? (profile.grammarConceptsCompleted.length / profile.grammarConceptsTotal) * 100
      : 0;

  const dimensionScores = {
    vocabulary: dimensionProgress(profile.vocabKnown, currentT.vocabKnown, nextT.vocabKnown),
    comprehension: dimensionProgress(profile.quizAccuracy, currentT.quizAccuracy, nextT.quizAccuracy),
    grammar: dimensionProgress(grammarPercent, currentT.grammarPercent, nextT.grammarPercent),
    fluency: dimensionProgress(profile.averageWpm, currentT.averageWpm, nextT.averageWpm),
  };

  const nextLevelProgress = Math.round(
    (dimensionScores.vocabulary + dimensionScores.comprehension + dimensionScores.grammar + dimensionScores.fluency) / 4
  );

  return { level: achievedLevel, dimensionScores, nextLevelProgress };
}

// ─── Proficiency Display ───────────────────────────────────────────────────

export interface ProficiencyBreakdown {
  level: Difficulty;
  levelLabel: string;
  nextLevel: Difficulty | null;
  nextLevelProgress: number;
  dimensions: {
    name: string;
    score: number;
    detail: string;
    icon: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export function getProficiencyBreakdown(profile: ProficiencyProfile): ProficiencyBreakdown {
  const levelLabels: Record<Difficulty, string> = {
    A1: "Absolute Beginner",
    A2: "Beginner",
    B1: "Intermediate",
    B2: "Upper Intermediate",
    C1: "Advanced",
    C2: "Mastery",
  };

  const currentIdx = DIFFICULTY_ORDER.indexOf(profile.overallLevel);
  const nextLevel = currentIdx < 5 ? DIFFICULTY_ORDER[currentIdx + 1] : null;

  const { dimensionScores } = profile;

  const dimensions = [
    {
      name: "Vocabulary",
      score: dimensionScores.vocabulary,
      detail: `${profile.vocabKnown} words known, ${profile.vocabMastered} mastered`,
      icon: "book",
    },
    {
      name: "Comprehension",
      score: dimensionScores.comprehension,
      detail: `${profile.quizAccuracy}% quiz accuracy across ${profile.quizzesTaken} quizzes`,
      icon: "brain",
    },
    {
      name: "Grammar",
      score: dimensionScores.grammar,
      detail: `${profile.grammarConceptsCompleted.length}/${profile.grammarConceptsTotal} concepts`,
      icon: "puzzle",
    },
    {
      name: "Fluency",
      score: dimensionScores.fluency,
      detail: `${profile.averageWpm} words/min, ${profile.chaptersCompleted} chapters read`,
      icon: "zap",
    },
  ];

  // Identify strengths and weaknesses
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const strengths = sorted.filter((d) => d.score >= 70).map((d) => d.name);
  const weaknesses = sorted.filter((d) => d.score < 40).map((d) => d.name);

  // Generate recommendations
  const recommendations: string[] = [];
  if (dimensionScores.vocabulary < 50) {
    recommendations.push("Review flashcards daily to build vocabulary");
  }
  if (dimensionScores.comprehension < 50) {
    recommendations.push("Take more chapter quizzes to improve comprehension");
  }
  if (dimensionScores.grammar < 50) {
    recommendations.push("Study grammar reference tables for your current level");
  }
  if (dimensionScores.fluency < 50) {
    recommendations.push("Read more chapters — consistent daily reading builds fluency");
  }
  if (recommendations.length === 0) {
    recommendations.push(
      nextLevel
        ? `You're making great progress toward ${nextLevel}! Keep reading.`
        : "Incredible mastery! Consider exploring a new language."
    );
  }

  const { nextLevelProgress } = calculateLevel(profile);

  return {
    level: profile.overallLevel,
    levelLabel: levelLabels[profile.overallLevel],
    nextLevel,
    nextLevelProgress,
    dimensions,
    strengths,
    weaknesses,
    recommendations,
  };
}

// ─── API helpers for profile-linked proficiency ────────────────────────────

/**
 * Build a proficiency profile from database data.
 * This would be called from an API route with the authenticated user's data.
 */
export function buildProficiencyFromDB(data: {
  userId: string;
  language: Language;
  vocabWords: Array<{ mastery: string }>;
  quizResults: Array<{ score: number; totalQuestions: number }>;
  grammarCompleted: string[];
  grammarTotal: number;
  readingProgress: Array<{
    wordsRead: number;
    totalTimeMinutes: number;
    chaptersCompleted: number;
    completedAt: string | null;
  }>;
}): ProficiencyProfile {
  const vocabKnown = data.vocabWords.filter(
    (v) => v.mastery === "LEARNING" || v.mastery === "MASTERED"
  ).length;
  const vocabMastered = data.vocabWords.filter(
    (v) => v.mastery === "MASTERED"
  ).length;

  const totalQuestions = data.quizResults.reduce((s, q) => s + q.totalQuestions, 0);
  const correctAnswers = data.quizResults.reduce((s, q) => s + q.score, 0);
  const quizAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const wordsRead = data.readingProgress.reduce((s, r) => s + r.wordsRead, 0);
  const minutesRead = data.readingProgress.reduce((s, r) => s + r.totalTimeMinutes, 0);
  const chaptersCompleted = data.readingProgress.reduce((s, r) => s + r.chaptersCompleted, 0);
  const booksCompleted = data.readingProgress.filter((r) => r.completedAt).length;
  const averageWpm = minutesRead > 0 ? Math.round(wordsRead / minutesRead) : 0;

  const baseProfile = {
    userId: data.userId,
    language: data.language,
    vocabKnown,
    vocabMastered,
    vocabTotal: data.vocabWords.length,
    quizAccuracy,
    quizzesTaken: data.quizResults.length,
    correctAnswers,
    totalQuestions,
    grammarConceptsCompleted: data.grammarCompleted,
    grammarConceptsTotal: data.grammarTotal,
    wordsRead,
    minutesRead,
    averageWpm,
    chaptersCompleted,
    booksCompleted,
  };

  const { level, dimensionScores } = calculateLevel(baseProfile);

  return {
    ...baseProfile,
    overallLevel: level,
    dimensionScores,
    lastAssessedAt: new Date().toISOString(),
  };
}
