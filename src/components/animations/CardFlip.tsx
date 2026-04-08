"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

interface CardFlipProps {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
}

export function CardFlip({ front, back, isFlipped }: CardFlipProps) {
  const prefersReduced = usePrefersReducedMotion();

  const springTransition = prefersReduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 25 };

  return (
    <div className="relative" style={{ perspective: 1000 }}>
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={springTransition}
      >
        {/* Front face */}
        <div
          className="relative w-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 w-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
