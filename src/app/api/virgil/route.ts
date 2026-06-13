import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type VirgilApiPayload = {
  userMessage?: string
  pageContext?: unknown
  conversationHistory?: unknown[]
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as VirgilApiPayload | null
  if (!payload?.userMessage?.trim()) {
    return NextResponse.json({ error: "userMessage is required." }, { status: 400 })
  }

  const virgilUrl = process.env.VIRGIL_API_URL
  const virgilKey = process.env.VIRGIL_API_KEY

  if (!virgilUrl || !virgilKey) {
    return NextResponse.json({
      configured: false,
      response: null,
    })
  }

  try {
    const upstream = await fetch(virgilUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${virgilKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!upstream.ok) {
      return NextResponse.json(
        { configured: true, error: "Virgil upstream request failed." },
        { status: 502 },
      )
    }

    const data = await upstream.json().catch(() => null)
    const response =
      data?.response ?? data?.message ?? data?.content ?? data?.text ?? null

    return NextResponse.json({
      configured: true,
      response: typeof response === "string" ? response : null,
    })
  } catch {
    return NextResponse.json(
      { configured: true, error: "Virgil upstream request failed." },
      { status: 502 },
    )
  }
}
