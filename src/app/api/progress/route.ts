import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  try {
    const progress = await prisma.readingProgress.findMany({
      where: { userId },
      include: {
        book: {
          select: { id: true, title: true, author: true, language: true, chapterCount: true },
        },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await request.json();
  const { bookId, currentChapterId, currentParagraphId, percentComplete, wordsRead, chaptersCompleted } = body;

  try {
    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_bookId: { userId, bookId },
      },
      update: {
        currentChapterId,
        currentParagraphId,
        percentComplete,
        wordsRead,
        chaptersCompleted,
        lastReadAt: new Date(),
      },
      create: {
        userId,
        bookId,
        currentChapterId,
        currentParagraphId,
        percentComplete,
        wordsRead: wordsRead ?? 0,
        chaptersCompleted: chaptersCompleted ?? 0,
      },
    });

    // Update user's lastReadAt and XP
    const xpGained = (wordsRead ?? 0) > 0 ? 10 : 0;
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastReadAt: new Date(),
        totalXp: { increment: xpGained },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
