"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface VirgilTriggerProps {
  onClick: () => void
  visible: boolean
  className?: string
}

export function VirgilTrigger({ onClick, visible, className }: VirgilTriggerProps) {
  if (!visible) return null

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "fixed right-4 top-1/2 -translate-y-1/2 z-30",
        "flex items-center justify-center size-12 rounded-full",
        "font-serif font-bold text-lg",
        "shadow-lg shadow-black/20",
        "transition-all duration-200",
        "hover:scale-110 hover:shadow-xl hover:shadow-[#D4A04C]/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A04C]/50",
        className
      )}
      style={{
        background: "linear-gradient(135deg, #D4A04C, #B8924A)",
        color: "#1a1a2e",
      }}
      aria-label="Open Virgil AI tutor"
      title="Ask Virgil"
    >
      V
    </motion.button>
  )
}
