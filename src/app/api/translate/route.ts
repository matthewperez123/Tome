import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { text, sourceLanguage, targetLanguage = "English" } = body;

  if (!text || !sourceLanguage) {
    return NextResponse.json(
      { error: "text and sourceLanguage are required" },
      { status: 400 }
    );
  }

  const languageNames: Record<string, string> = {
    LATIN: "Latin",
    GREEK: "Ancient Greek",
    ARAMAIC: "Aramaic (Syriac Peshitta)",
    ARABIC: "Classical Arabic",
  };

  const sourceLang = languageNames[sourceLanguage] ?? sourceLanguage;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Translate the following ${sourceLang} text into ${targetLanguage}. Provide a faithful, scholarly translation that preserves the meaning and tone of the original. Return ONLY the translation, no commentary.

Text:
${text}`,
        },
      ],
    });

    const translation =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
