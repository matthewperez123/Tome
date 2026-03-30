"use client"

import { useState, useRef } from "react"
import { NumberTicker } from "@/components/ui/number-ticker"
import { AnimatedList } from "@/components/ui/animated-list"
import { BlurFade } from "@/components/ui/blur-fade"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { TextAnimate } from "@/components/ui/text-animate"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar"
import { BorderBeam } from "@/components/ui/border-beam"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"

const listItems = [
  { name: "The Great Gatsby", description: "Added to library" },
  { name: "1984", description: "Reading started" },
  { name: "Dune", description: "Quiz completed" },
  { name: "Sapiens", description: "New highlight" },
]

export default function DevComponents() {
  const [progress, setProgress] = useState(62)
  const confettiRef = useRef<ConfettiRef>(null)

  return (
    <>
      <ScrollProgress />
      <div className="p-6 space-y-12 max-w-2xl">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Magic UI Components
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dev-only page. All components use Tome design tokens.
          </p>
        </div>

        {/* ── Confetti ── */}
        <Section title="Confetti">
          <div className="relative h-32 flex items-center justify-center">
            <Confetti
              ref={confettiRef}
              className="absolute inset-0 size-full"
            />
            <button
              onClick={() => confettiRef.current?.fire({})}
              className="rounded-lg bg-[var(--tome-accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Fire Confetti
            </button>
          </div>
        </Section>

        {/* ── Number Ticker ── */}
        <Section title="Number Ticker">
          <div className="flex items-baseline gap-6">
            <div>
              <NumberTicker value={1247} className="text-3xl font-bold" />
              <p className="text-xs text-muted-foreground mt-1">Books read</p>
            </div>
            <div>
              <NumberTicker value={89.5} decimalPlaces={1} className="text-3xl font-bold" />
              <p className="text-xs text-muted-foreground mt-1">Avg score</p>
            </div>
          </div>
        </Section>

        {/* ── Animated List ── */}
        <Section title="Animated List">
          <div className="relative h-48 overflow-hidden rounded-lg border border-border p-4">
            <AnimatedList delay={2000}>
              {listItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 rounded-md border border-border bg-[var(--tome-surface-elevated)] p-3"
                >
                  <div className="size-8 rounded-full bg-[var(--tome-accent)]/10 flex items-center justify-center text-xs font-medium text-[var(--tome-accent)]">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </AnimatedList>
          </div>
        </Section>

        {/* ── Blur Fade ── */}
        <Section title="Blur Fade">
          <div className="space-y-3">
            {["First item fades in", "Second with delay", "Third staggered"].map(
              (text, i) => (
                <BlurFade key={text} delay={i * 0.15} inView>
                  <div className="rounded-md border border-border p-3 text-sm">
                    {text}
                  </div>
                </BlurFade>
              )
            )}
          </div>
        </Section>

        {/* ── Shimmer Button ── */}
        <Section title="Shimmer Button">
          <ShimmerButton>
            <span className="text-sm font-medium">Start Reading</span>
          </ShimmerButton>
        </Section>

        {/* ── Text Animate ── */}
        <Section title="Text Animate">
          <TextAnimate
            animation="blurInUp"
            by="word"
            className="text-lg font-semibold"
          >
            Welcome back to your reading journey
          </TextAnimate>
        </Section>

        {/* ── Typing Animation ── */}
        <Section title="Typing Animation">
          <TypingAnimation className="text-lg font-medium">
            Discovering new worlds through books...
          </TypingAnimation>
        </Section>

        {/* ── Circular Progress ── */}
        <Section title="Animated Circular Progress">
          <div className="flex items-center gap-8">
            <AnimatedCircularProgressBar
              value={progress}
              gaugePrimaryColor="var(--tome-accent)"
              gaugeSecondaryColor="var(--tome-surface-recessed)"
            />
            <div className="space-y-2">
              <button
                onClick={() => setProgress((p) => Math.min(100, p + 10))}
                className="block rounded-md border border-border px-3 py-1 text-xs hover:bg-muted"
              >
                +10%
              </button>
              <button
                onClick={() => setProgress((p) => Math.max(0, p - 10))}
                className="block rounded-md border border-border px-3 py-1 text-xs hover:bg-muted"
              >
                -10%
              </button>
            </div>
          </div>
        </Section>

        {/* ── Border Beam ── */}
        <Section title="Border Beam">
          <div className="relative rounded-xl border border-border bg-[var(--tome-surface-elevated)] p-6">
            <p className="text-sm">
              This card has an animated border beam using Tome accent colors.
            </p>
            <BorderBeam duration={8} size={80} />
          </div>
        </Section>

        {/* ── Scroll Progress ── */}
        <Section title="Scroll Progress">
          <p className="text-sm text-muted-foreground">
            Scroll the page to see the progress bar at the top (violet → pink →
            amber gradient using Tome tokens).
          </p>
        </Section>

        <div className="h-32" />
      </div>
    </>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground mb-3">
        {title}
      </h2>
      {children}
    </section>
  )
}
