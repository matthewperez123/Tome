"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

interface SlideTransitionProps {
  direction?: "left" | "right" | "up" | "down";
  children: ReactNode;
  transitionKey: string;
}

const directionOffsets: Record<
  string,
  { enter: { x: number; y: number }; exit: { x: number; y: number } }
> = {
  right: { enter: { x: 80, y: 0 }, exit: { x: -80, y: 0 } },
  left: { enter: { x: -80, y: 0 }, exit: { x: 80, y: 0 } },
  up: { enter: { x: 0, y: -60 }, exit: { x: 0, y: 60 } },
  down: { enter: { x: 0, y: 60 }, exit: { x: 0, y: -60 } },
};

export function SlideTransition({
  direction = "right",
  children,
  transitionKey,
}: SlideTransitionProps) {
  const prefersReduced = usePrefersReducedMotion();
  const offsets = directionOffsets[direction];

  if (prefersReduced) {
    return <div key={transitionKey}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, x: offsets.enter.x, y: offsets.enter.y }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: offsets.exit.x, y: offsets.exit.y }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
