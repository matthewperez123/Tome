"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useVirgil } from "@/lib/virgil-context"
import { getPoseImage } from "@/lib/virgil-poses"

export function VirgilCompanion() {
  const { toggleChat, isOpen, currentPose, hasNotification } = useVirgil()

  if (isOpen) return null // hide companion when chat is open

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
      className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-white ring-2 ring-indigo-200 shadow-lg overflow-hidden cursor-pointer outline-none max-md:bottom-20"
      aria-label="Open Virgil chat"
    >
      <Image
        src={getPoseImage(currentPose)}
        alt="Virgil"
        width={56}
        height={56}
        className="w-full h-full object-cover"
      />
      {hasNotification && (
        <motion.span
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-0 right-0 size-3 rounded-full bg-indigo-500 border-2 border-white"
        />
      )}
    </motion.button>
  )
}
