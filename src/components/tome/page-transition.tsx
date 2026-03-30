"use client"

import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion"
import { usePathname } from "next/navigation"
import { crossfade, crossfadeTransition } from "@/lib/transitions"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <m.div
          key={pathname}
          variants={crossfade}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={crossfadeTransition}
          className="flex-1"
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
}
