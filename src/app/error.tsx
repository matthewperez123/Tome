"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <BlurFade delay={0.1} inView>
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="flex size-16 items-center justify-center rounded-full bg-[var(--tome-accent)]/10 mb-5">
            <span className="text-3xl">🏛️</span>
          </div>
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ letterSpacing: "-0.015em" }}
          >
            Virgil seems to have lost his way
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Something unexpected happened. Don&apos;t worry — even the best guides
            take a wrong turn sometimes.
          </p>
          <Button className="mt-6" onClick={reset}>
            Try Again
          </Button>
        </div>
      </BlurFade>
    </div>
  )
}
