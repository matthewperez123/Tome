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
    const vocabulary = await prisma.userVocabulary.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        book: { select: { title: true, language: true } },
      },
    });

    return NextResponse.json(vocabulary);
  } catch (error) {
    console.error("Error fetching vocabulary:", error);
    return NextResponse.json({ error: "Failed to fetch vocabulary" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await request.json();
  const { word, translation, partOfSpeech, context, bookId, language } = body;

  try {
    const vocab = await prisma.userVocabulary.create({
      data: {
        userId,
        word,
        translation,
        partOfSpeech,
        context,
        bookId,
        language,
      },
    });

    return NextResponse.json(vocab, { status: 201 });
  } catch (error) {
    console.error("Error saving vocabulary:", error);
    return NextResponse.json({ error: "Failed to save word" }, { status: 500 });
  }
}
