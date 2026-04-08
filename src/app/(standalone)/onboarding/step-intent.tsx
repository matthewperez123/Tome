"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, GraduationCap, Users, Sparkles } from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

const options: { label: string; icon: LucideIcon; id: string }[] = [
  { label: "Personal enrichment", icon: Sparkles, id: "personal" },
  { label: "School / university", icon: GraduationCap, id: "school" },
  { label: "Book club", icon: Users, id: "club" },
  { label: "Curious reader", icon: BookOpen, id: "curious" },
]

export function StepIntent({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-center text-center">
      <h2
        className="text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        What brings you to Tome?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This helps us personalize your experience.
      </p>

      <div className="mt-8 grid w-full grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.id
          return (
            <motion.button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              animate={{ scale: isSelected ? 1.03 : 1 }}
              transition={springs.interactive}
              className={`flex flex-col items-center gap-2 rounded-xl border p-5 text-sm font-medium transition-colors duration-[var(--tome-duration-fast)] ${
                isSelected
                  ? "border-[var(--tome-accent)] bg-[var(--tome-accent)]/5 text-[var(--tome-accent)]"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              <opt.icon className="size-5" />
              {opt.label}
            </motion.button>
          )
        })}
      </div>

      <div className={`mt-8 flex w-full ${onBack ? "gap-3" : ""}`}>
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        <Button className="flex-1" disabled={!selected} onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  )
}
