"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { saveOnboardingData } from "@/lib/onboarding"

const sizes = [
  { label: "Just a handful", range: "1–10" },
  { label: "One classroom", range: "10–30" },
  { label: "Multiple classrooms", range: "30–100" },
  { label: "A whole department or school", range: "100+" },
]

export function StepTeacherSize({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleContinue() {
    if (!selected) return
    saveOnboardingData({ teacherClassSize: selected })
    onNext()
  }

  return (
    <div className="flex flex-col items-center text-center" role="radiogroup" aria-label="How many students would read with Tome?">
      <h2
        className="font-serif text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        How many students would read with Tome?
      </h2>
      <p className="mt-2 text-xs text-muted-foreground/70">
        This helps us understand who&apos;s using Tome.
      </p>

      <div className="mt-8 grid w-full grid-cols-1 gap-2">
        {sizes.map((size) => {
          const isSelected = selected === size.range
          return (
            <motion.button
              key={size.range}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(size.range)}
              animate={{ scale: isSelected ? 1.03 : 1 }}
              transition={springs.interactive}
              className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors duration-[var(--tome-duration-fast)] ${
                isSelected
                  ? "border-[var(--tome-accent)] bg-[var(--tome-accent)]/5 text-[var(--tome-accent)]"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              <span>{size.label}</span>
              <span className="text-xs opacity-60">{size.range}</span>
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
