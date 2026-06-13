import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.ELEVENLABS_API_KEY),
    provider: "elevenlabs",
  })
}

export async function POST() {
  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Audio generation is unavailable until ELEVENLABS_API_KEY is configured server-side.",
      },
      { status: 503 },
    )
  }

  return NextResponse.json(
    {
      error:
        "ElevenLabs is configured, but production audio generation still needs voice, quota, and content policy setup.",
    },
    { status: 501 },
  )
}
