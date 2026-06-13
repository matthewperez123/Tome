"use client"

import Link from "next/link"
import { BookOpen, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVirgil } from "@/lib/virgil-context"

export function VirgilGuideClient({ configured }: { configured: boolean }) {
  const { openChat, setSuggestions, setPageContext } = useVirgil()

  function openGuide() {
    setPageContext({ page: "dashboard" })
    setSuggestions([
      "What should I read first?",
      "Explain The Odyssey for a ninth grader",
      "Help me plan a classroom reading sprint",
    ])
    openChat()
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-border bg-card p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#D4A04C]/15 px-3 py-1 text-xs font-semibold text-[#D4A04C]">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Virgil Guide
        </span>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A literary mentor for every reader.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Virgil helps students understand context, symbolism, characters,
              and what to read next. In preview, he gracefully falls back to
              local guided responses unless a secure server AI endpoint is set.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={openGuide}>
                <MessageCircle className="size-4" aria-hidden="true" />
                Ask Virgil
              </Button>
              <Button variant="outline" render={<Link href="/library/browse" />}>
                <BookOpen className="size-4" aria-hidden="true" />
                Browse the library
              </Button>
            </div>
          </div>
          <aside className="rounded-3xl border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              AI status
            </p>
            <p className="mt-3 text-lg font-semibold">
              {configured ? "Server AI configured" : "Local preview fallback"}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {configured
                ? "Virgil can use the configured server endpoint for live responses."
                : "No secrets are required to preview the guide. Real credentials can be added in Vercel later."}
            </p>
          </aside>
        </div>
      </section>
    </main>
  )
}
