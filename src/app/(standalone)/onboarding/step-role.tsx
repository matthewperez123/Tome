"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, GraduationCap } from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { saveOnboardingData } from "@/lib/onboarding"

type UserType = "reader" | "teacher"

const options: { id: UserType; label: string; subtitle: string; Icon: typeof BookOpen }[] = [
  {
    id: "reader",
    label: "I'm a reader",
    subtitle: "Reading the great books for myself",
    Icon: BookOpen,
  },
  {
    id: "teacher",
    label: "I'm a teacher",
    subtitle: "Bringing the classics to my students",
    Icon: GraduationCap,
  },
]

export function StepRole({ onNext }: { onNext: (role: UserType) => void }) {
  const [selected, setSelected] = useState<UserType | null>(null)

  function handleContinue() {
    if (!selected) return
    saveOnboardingData({ userType: selected })
    onNext(selected)
  }

  return (
    <div className="flex flex-col items-center text-center" role="radiogroup" aria-label="How will you be using Tome?">
      <h2
        className="font-serif text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        How will you be using Tome?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;ll tailor the experience to how you read.
      </p>

      <div className="mt-8 grid w-full grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.id
          return (
            <motion.button
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(opt.id)}
              animate={{ scale: isSelected ? 1.03 : 1 }}
              transition={springs.interactive}
              className={`flex flex-col items-center gap-3 rounded-xl border p-6 sm:p-8 transition-colors duration-[var(--tome-duration-fast)] ${
                isSelected
                  ? "border-[var(--tome-accent)] bg-[var(--tome-accent)]/5 text-[var(--tome-accent)]"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              <opt.Icon className="size-7" />
              <div>
                <p className="font-serif text-base font-semibold">{opt.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{opt.subtitle}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      <Button
        className="mt-8 w-full"
        disabled={!selected}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  )
}
