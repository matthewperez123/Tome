"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { saveOnboardingData } from "@/lib/onboarding"

const levels = [
  "Middle school",
  "High school",
  "Undergraduate",
  "Graduate",
  "Other",
]

export function StepTeacherLevel({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleContinue() {
    if (!selected) return
    saveOnboardingData({ teacherLevel: selected })
    onNext()
  }

  return (
    <div className="flex flex-col items-center text-center" role="radiogroup" aria-label="What level do you teach?">
      <h2
        className="font-serif text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        What level?
      </h2>
      <p className="mt-2 text-xs text-muted-foreground/70">
        This helps us understand who&apos;s using Tome.
      </p>

      <div className="mt-8 grid w-full grid-cols-1 gap-2">
        {levels.map((level) => {
          const isSelected = selected === level
          return (
            <motion.button
              key={level}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(level)}
              animate={{ scale: isSelected ? 1.03 : 1 }}
              transition={springs.interactive}
              className={`rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors duration-[var(--tome-duration-fast)] ${
                isSelected
                  ? "border-[var(--tome-accent)] bg-[var(--tome-accent)]/5 text-[var(--tome-accent)]"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {level}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-8 flex w-full gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button className="flex-1" disabled={!selected} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
