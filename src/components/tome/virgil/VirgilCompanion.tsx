"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useVirgil } from "@/lib/virgil-context"
import { getPoseImage } from "@/lib/virgil-poses"

export function VirgilCompanion() {
  const { toggleChat, isOpen, currentPose, hasNotification } = useVirgil()
  const pathname = usePathname()

  // Hide on landing page (has its own Virgil presence) and when chat is open
  if (isOpen || pathname === "/") return null

  return (
    <motion.button
      onClick={toggleChat}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [1, 1.03, 1],
        opacity: 1,
      }}
      transition={{
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 0.3 },
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 size-10 rounded-full bg-[#C9A84C] ring-2 ring-[#C9A84C]/50 shadow-lg overflow-hidden cursor-pointer outline-none flex items-center justify-center font-semibold leading-none tracking-tight text-xs"
      aria-label="Open Virgil chat"
    >
      <span className="text-[#1a1a2e]">V</span>
      {hasNotification && (
        <motion.span
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-0 right-0 size-3 rounded-full bg-[#D4A04C] border-2 border-background"
        />
      )}
    </motion.button>
  )
}
