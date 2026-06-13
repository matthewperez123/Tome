import Link from "next/link"
import { BookOpen, Headphones, Mic2, Sparkles, Volume2 } from "lucide-react"
import { getIntegrationStatus } from "@/lib/integrations/status"
import { Button } from "@/components/ui/button"

const listeningPlan = [
  {
    title: "Listen beside the text",
    body: "Pair public-domain classics with narrated passages, scene summaries, and pronunciation support.",
    icon: BookOpen,
  },
  {
    title: "Practice difficult language",
    body: "Replay speeches, soliloquies, and epic catalogues until the music of the sentence clicks.",
    icon: Volume2,
  },
  {
    title: "Teacher-safe controls",
    body: "Audio generation stays server-side and can be limited by voice, work, classroom, and quota.",
    icon: Mic2,
  },
]

export default function AudioPage() {
  const { elevenlabs } = getIntegrationStatus()

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card">
        <div className="relative p-6 sm:p-8">
          <div className="absolute right-6 top-6 hidden rounded-full bg-[#D4A04C]/15 p-5 text-[#D4A04C] sm:block">
            <Headphones className="size-10" aria-hidden="true" />
          </div>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold text-[#60A5FA]">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Tome Audio Lab
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Hear the classics without losing the page.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Audio in Tome is designed for close reading: passages, classroom
              listening, pronunciation, and Virgil-guided context. It is ready
              for preview and safely disabled until ElevenLabs is configured.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button render={<Link href="/reading" />}>
                Continue reading
              </Button>
              <Button variant="outline" render={<Link href="/virgil" />}>
                Ask Virgil about audio
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-border bg-background p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Audio service status</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {elevenlabs.note}
            </p>
          </div>
          <span
            className={
              elevenlabs.configured
                ? "inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300"
                : "inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300"
            }
          >
            {elevenlabs.configured ? "Configured" : "Preview disabled"}
          </span>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {listeningPlan.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-border bg-card p-5"
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#60A5FA]">
              <item.icon className="size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-sm font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}
