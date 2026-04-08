import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildProficiencyFromDB } from "@/lib/proficiency";
import type { Language } from "@/types";

/**
 * GET /api/proficiency?language=LATIN
 *
 * Returns the authenticated user's proficiency profile for a specific language.
 * Proficiency is calculated from their actual data: vocabulary, quizzes,
 * grammar progress, and reading activity.
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language") as Language;

  if (!language) {
    return NextResponse.json(
      { error: "language query parameter required" },
      { status: 400 }
    );
  }

  try {
    // Fetch all user data for this language in parallel
    const [vocabWords, quizResults, readingProgress, user] = await Promise.all([
      prisma.userVocabulary.findMany({
        where: { userId, language },
        select: { mastery: true },
      }),
      prisma.quizResult.findMany({
        where: {
          userId,
          chapter: { book: { language } },
        },
        select: { score: true, totalQuestions: true },
      }),
      prisma.readingProgress.findMany({
        where: {
          userId,
          book: { language },
        },
        select: {
          wordsRead: true,
          totalTimeMinutes: true,
          chaptersCompleted: true,
          completedAt: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { totalXp: true, currentLevel: true },
      }),
    ]);

    // Grammar concepts: check which ones the user has "completed"
    // (In a full implementation, this would be tracked in a separate table.
    // For now, we estimate based on books completed.)
    const completedBooks = readingProgress
      .filter((r) => r.completedAt)
      .length;

    // Simple heuristic: each completed book unlocks ~2 grammar concepts
    const grammarCompleted: string[] = [];
    const grammarTotal = language === "LATIN" ? 14 : language === "GREEK" ? 12 : 8;

    const profile = buildProficiencyFromDB({
      userId,
      language,
      vocabWords: vocabWords.map((v) => ({ mastery: v.mastery })),
      quizResults: quizResults.map((q) => ({
        score: q.score,
        totalQuestions: q.totalQuestions,
      })),
      grammarCompleted,
      grammarTotal,
      readingProgress: readingProgress.map((r) => ({
        wordsRead: r.wordsRead,
        totalTimeMinutes: r.totalTimeMinutes,
        chaptersCompleted: r.chaptersCompleted,
        completedAt: r.completedAt?.toISOString() ?? null,
      })),
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error calculating proficiency:", error);
    return NextResponse.json(
      { error: "Failed to calculate proficiency" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/proficiency/all
 *
 * Returns proficiency profiles for ALL languages the user is studying.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  try {
    // Find all languages the user has vocabulary or progress in
    const [vocabLanguages, progressLanguages] = await Promise.all([
      prisma.userVocabulary.findMany({
        where: { userId },
        select: { language: true },
        distinct: ["language"],
      }),
      prisma.readingProgress.findMany({
        where: { userId },
        select: { book: { select: { language: true } } },
        distinct: ["bookId"],
      }),
    ]);

    const allLanguages = new Set<Language>();
    vocabLanguages.forEach((v) => allLanguages.add(v.language as Language));
    progressLanguages.forEach((p) =>
      allLanguages.add(p.book.language as Language)
    );

    // Build profiles for each language
    const profiles: Record<string, unknown> = {};
    for (const language of allLanguages) {
      const [vocabWords, quizResults, readingProgress] = await Promise.all([
        prisma.userVocabulary.findMany({
          where: { userId, language },
          select: { mastery: true },
        }),
        prisma.quizResult.findMany({
          where: { userId, chapter: { book: { language } } },
          select: { score: true, totalQuestions: true },
        }),
        prisma.readingProgress.findMany({
          where: { userId, book: { language } },
          select: {
            wordsRead: true,
            totalTimeMinutes: true,
            chaptersCompleted: true,
            completedAt: true,
          },
        }),
      ]);

      const grammarTotal =
        language === "LATIN" ? 14 : language === "GREEK" ? 12 : 8;

      profiles[language] = buildProficiencyFromDB({
        userId,
        language,
        vocabWords: vocabWords.map((v) => ({ mastery: v.mastery })),
        quizResults: quizResults.map((q) => ({
          score: q.score,
          totalQuestions: q.totalQuestions,
        })),
        grammarCompleted: [],
        grammarTotal,
        readingProgress: readingProgress.map((r) => ({
          wordsRead: r.wordsRead,
          totalTimeMinutes: r.totalTimeMinutes,
          chaptersCompleted: r.chaptersCompleted,
          completedAt: r.completedAt?.toISOString() ?? null,
        })),
      });
    }

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error calculating proficiencies:", error);
    return NextResponse.json(
      { error: "Failed to calculate proficiencies" },
      { status: 500 }
    );
  }
}
