import Link from "next/link"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <BlurFade delay={0.1} inView>
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="flex size-20 items-center justify-center rounded-full bg-[var(--tome-accent)]/10 mb-6">
            <span className="text-4xl">🧭</span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            This page is as lost as Odysseus
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Ten years of wandering and still no sign of this page.
            Perhaps it sailed past the Pillars of Heracles.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
            <Link href="/library">
              <Button variant="ghost">Browse Library</Button>
            </Link>
          </div>
        </div>
      </BlurFade>
    </div>
  )
}
