"use client"

import { TextAnimate } from "@/components/ui/text-animate"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { Button } from "@/components/ui/button"

const virgilSpeech =
  "I am Virgil, your guide through the great books. As I once guided Dante through the underworld, I will guide you through the greatest stories ever written."

export function StepVirgil({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="relative flex flex-col items-center text-center overflow-hidden">
      {/* Light Rays Background */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2">
        <div className="relative size-72 motion-reduce:hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-36 w-px origin-bottom -translate-x-1/2 animate-pulse opacity-[0.08]"
              style={{
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                background:
                  "linear-gradient(to top, var(--tome-accent), transparent)",
                animationDelay: `${i * 0.15}s`,
                animationDuration: "3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Virgil Avatar */}
      <div className="relative z-10 flex size-24 items-center justify-center rounded-full bg-[var(--tome-accent)]/10 ring-1 ring-[var(--tome-accent)]/20">
        <span className="text-4xl">🏛️</span>
      </div>

      {/* Title */}
      <div className="mt-6">
        <TextAnimate
          animation="blurInUp"
          by="word"
          className="text-2xl font-semibold tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Meet Virgil
        </TextAnimate>
      </div>

      {/* Speech Bubble */}
      <div className="relative z-10 mt-6 w-full rounded-xl border border-border bg-[var(--tome-surface-elevated)] p-5">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 rotate-45 size-4 border-l border-t border-border bg-[var(--tome-surface-elevated)]" />
        {/* Typing animation with reduced-motion fallback */}
        <div className="motion-reduce:hidden">
          <TypingAnimation
            className="text-sm leading-relaxed text-muted-foreground font-serif italic text-left"
            duration={30}
          >
            {virgilSpeech}
          </TypingAnimation>
        </div>
        <p className="hidden motion-reduce:block text-sm leading-relaxed text-muted-foreground font-serif italic text-left">
          {virgilSpeech}
        </p>
      </div>

      <Button className="mt-8 w-full" onClick={onComplete}>
        Begin Your Journey
      </Button>
    </div>
  )
}
