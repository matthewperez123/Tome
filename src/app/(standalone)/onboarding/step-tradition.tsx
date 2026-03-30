"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"

const traditions: { label: string; color: string }[] = [
  { label: "Ancient Greek", color: "var(--tome-sky)" },
  { label: "Roman", color: "var(--tome-red)" },
  { label: "Medieval European", color: "var(--tome-amber)" },
  { label: "Renaissance", color: "var(--tome-gold)" },
  { label: "Enlightenment", color: "var(--tome-cyan)" },
  { label: "Romantic", color: "var(--tome-rose)" },
  { label: "Victorian", color: "var(--tome-purple)" },
  { label: "Russian", color: "var(--tome-blue)" },
  { label: "American", color: "var(--tome-indigo)" },
  { label: "French", color: "var(--tome-coral)" },
  { label: "Modernist", color: "var(--tome-teal)" },
  { label: "Post-Colonial", color: "var(--tome-emerald)" },
  { label: "Eastern", color: "var(--tome-orange)" },
  { label: "Contemporary", color: "var(--tome-violet)" },
]

export function StepTradition({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-center text-center">
      <h2
        className="text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        Pick your first literary tradition
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        You can explore all of them later.
      </p>

      <div className="mt-8 grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
        {traditions.map((t) => {
          const isSelected = selected === t.label
          return (
            <motion.button
              key={t.label}
              onClick={() => setSelected(t.label)}
              animate={{ scale: isSelected ? 1.03 : 1 }}
              transition={springs.interactive}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors duration-[var(--tome-duration-fast)] ${
                isSelected
                  ? "border-[var(--tome-accent)] bg-[var(--tome-accent)]/5"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: t.color }}
              />
              {t.label}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-8 flex w-full gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!selected}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
