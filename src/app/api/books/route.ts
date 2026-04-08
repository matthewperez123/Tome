import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language");
  const difficulty = searchParams.get("difficulty");

  try {
    const books = await prisma.book.findMany({
      where: {
        ...(language && { language: language as "LATIN" | "GREEK" | "ARAMAIC" | "ARABIC" }),
        ...(difficulty && { difficulty: difficulty as "A1" | "A2" | "B1" | "B2" | "C1" | "C2" }),
      },
      orderBy: { pathOrder: "asc" },
      include: {
        chapters: {
          orderBy: { chapterNumber: "asc" },
          select: { id: true, chapterNumber: true, title: true, paragraphCount: true },
        },
        _count: { select: { vocabulary: true } },
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
