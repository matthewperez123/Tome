import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST() {
  if (!process.env.LIVEBLOCKS_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Live classroom collaboration is unavailable until LIVEBLOCKS_SECRET_KEY is configured server-side.",
      },
      { status: 503 },
    )
  }

  return NextResponse.json(
    {
      error:
        "Liveblocks is configured, but room authorization still needs classroom membership wiring.",
    },
    { status: 501 },
  )
}
