"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { springs } from "@/lib/design-tokens"

// Simple local word data for common literary terms
const DEFINITIONS: Record<string, { def: string; etymology?: string }> = {
  dawn: { def: "The first appearance of light in the sky before sunrise.", etymology: "Old English dagung, from dæg (day)" },
  hero: { def: "A person admired for courage, outstanding achievements, or noble qualities.", etymology: "Greek hērōs, originally 'defender, protector'" },
  wine: { def: "An alcoholic drink made from fermented grapes.", etymology: "Latin vinum, of Mediterranean origin" },
  sea: { def: "The expanse of salt water that covers most of the earth's surface.", etymology: "Old English sǣ, Germanic origin" },
  fire: { def: "Combustion or burning, producing light, heat, and flame.", etymology: "Old English fȳr, from Proto-Germanic fūr" },
  philosopher: { def: "A person engaged in the study of fundamental questions about existence, knowledge, and ethics.", etymology: "Greek philosophos, 'lover of wisdom'" },
  temple: { def: "A building devoted to the worship of a god or gods.", etymology: "Latin templum, 'sacred precinct'" },
  manuscript: { def: "A book or document written by hand.", etymology: "Medieval Latin manuscriptum, 'written by hand'" },
  stars: { def: "Luminous celestial bodies visible in the night sky.", etymology: "Old English steorra, from Proto-Indo-European ster-" },
  justice: { def: "The quality of being fair and reasonable; the administration of law.", etymology: "Latin justitia, from justus 'upright, just'" },
  virtue: { def: "Behavior showing high moral standards.", etymology: "Latin virtus, from vir 'man' — originally meaning manliness or valor" },
  fortune: { def: "Chance or luck as an external force affecting human affairs.", etymology: "Latin fortuna, from fors 'luck, chance'" },
  resilience: { def: "The capacity to recover quickly from difficulties.", etymology: "Latin resilire, 'to spring back'" },
  incense: { def: "A substance that produces a fragrant odor when burned.", etymology: "Latin incendere, 'to set fire to'" },
  scribe: { def: "A person who copies out documents, especially before printing.", etymology: "Latin scriba, from scribere 'to write'" },
  navigator: { def: "A person who directs the route or course of a ship.", etymology: "Latin navigare, from navis 'ship' + agere 'to drive'" },
}

type TooltipState = {
  word: string
  x: number
  y: number
} | null

export function WordTooltipProvider({ children }: { children: React.ReactNode }) {
  const [tooltip, setTooltip] = useState<TooltipState>(null)

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest("[data-reader-text]")) {
      setTooltip(null)
      return
    }

    // Get the clicked word
    const selection = window.getSelection()
    if (!selection) return

    // Expand selection to word at click point
    const range = document.caretRangeFromPoint(e.clientX, e.clientY)
    if (!range) return

    selection.removeAllRanges()
    selection.addRange(range)
    selection.modify("move", "backward", "word")
    selection.modify("extend", "forward", "word")

    const word = selection.toString().trim().toLowerCase().replace(/[^a-z]/g, "")
    if (!word || word.length < 3) {
      selection.removeAllRanges()
      setTooltip(null)
      return
    }

    const def = DEFINITIONS[word]
    if (def) {
      const rect = range.getBoundingClientRect()
      setTooltip({
        word,
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8,
      })
    } else {
      setTooltip(null)
    }
    selection.removeAllRanges()
  }, [])

  useEffect(() => {
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [handleClick])

  // Dismiss on scroll
  useEffect(() => {
    if (!tooltip) return
    const dismiss = () => setTooltip(null)
    window.addEventListener("scroll", dismiss, { capture: true, passive: true })
    return () => window.removeEventListener("scroll", dismiss, { capture: true })
  }, [tooltip])

  return (
    <>
      {children}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={springs.interactive}
            className="fixed z-50 w-64 rounded-lg border border-border bg-card p-3 shadow-lg"
            style={{
              left: Math.min(tooltip.x, window.innerWidth - 280),
              top: tooltip.y,
              transform: "translateX(-50%)",
            }}
          >
            <p className="text-xs font-semibold capitalize">{tooltip.word}</p>
            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
              {DEFINITIONS[tooltip.word]?.def}
            </p>
            {DEFINITIONS[tooltip.word]?.etymology && (
              <p className="mt-1.5 text-[9px] text-muted-foreground/60 italic">
                {DEFINITIONS[tooltip.word].etymology}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
