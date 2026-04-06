"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  generateReflection,
  hasBeenShown,
  markAsShown,
  hashReflection,
  type ReflectionType,
  type ReflectionContext,
} from "@/lib/virgil-reflections"

interface VirgilReflectionProps {
  type: ReflectionType
  context: ReflectionContext
  className?: string
}

export function VirgilReflection({ type, context, className }: VirgilReflectionProps) {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    // Don't show for empty context (new user)
    const hasData =
      context.chaptersCompleted ||
      context.quizScore != null ||
      context.streakDays ||
      (context.booksRead && context.booksRead.length > 0) ||
      context.correctCount != null ||
      context.wisdomEarned ||
      context.achievementName

    if (!hasData) return

    const message = generateReflection(type, context)
    if (!message) return

    const hash = hashReflection(type, message)
    if (hasBeenShown(hash)) return

    setText(message)
    setVisible(true)
    markAsShown(hash)
  }, [type, context])

  function dismiss() {
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && text && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={cn(
            "relative rounded-lg bg-card border-l-2 border-l-[#D4B37A] border border-border px-4 py-3",
            className
          )}
        >
          {/* Dismiss button */}
          <button
            onClick={dismiss}
            className="absolute top-2.5 right-2.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="size-3.5" />
          </button>

          {/* Content */}
          <div className="flex gap-3 items-start pr-6">
            {/* Virgil avatar */}
            <Image
              src="/virgil/virgil-idle.png"
              alt="Virgil"
              width={32}
              height={32}
              className="rounded-full shrink-0 mt-0.5"
              unoptimized
            />

            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[#D4B37A] mb-1">Virgil</p>
              <p className="text-sm text-foreground leading-relaxed">{text}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
