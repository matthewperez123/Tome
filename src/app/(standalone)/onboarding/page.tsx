"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { StepGoal } from "./step-goal"
import { StepIntent } from "./step-intent"
import { StepTradition } from "./step-tradition"
import { StepVirgil } from "./step-virgil"

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)

  function next() {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1)
      setStep((s) => s + 1)
    } else {
      router.push("/")
    }
  }

  function back() {
    if (step > 0) {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springs.interactive}
          >
            {step === 0 && <StepIntent onNext={next} />}
            {step === 1 && <StepTradition onNext={next} onBack={back} />}
            {step === 2 && <StepGoal onNext={next} onBack={back} />}
            {step === 3 && <StepVirgil onComplete={next} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="mt-10 flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className="relative flex items-center justify-center">
            <div className="size-2 rounded-full bg-muted" />
            {i === step && (
              <motion.div
                layoutId="onboarding-dot"
                className="absolute size-2 rounded-full bg-foreground"
                transition={springs.interactive}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
