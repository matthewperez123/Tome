"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

interface StreakCelebrationProps {
  streakCount: number;
  trigger: boolean;
}

function SparkParticle({ index, total }: { index: number; total: number }) {
  const angle = (index / total) * Math.PI * 2;
  const distance = 60 + Math.random() * 30;
  const targetX = Math.cos(angle) * distance;
  const targetY = Math.sin(angle) * distance;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-saffron"
      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
      animate={{
        x: targetX,
        y: targetY,
        scale: [0, 1.2, 0],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut",
      }}
    />
  );
}

export function StreakCelebration({ streakCount, trigger }: StreakCelebrationProps) {
  const prefersReduced = usePrefersReducedMotion();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger) {
      hasAnimated.current = false;
    }
  }, [trigger]);

  const shouldAnimate = trigger && !hasAnimated.current;

  useEffect(() => {
    if (shouldAnimate) {
      hasAnimated.current = true;
    }
  }, [shouldAnimate]);

  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="relative flex flex-col items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.3 }}
        >
          {/* Warm glow behind flame */}
          {!prefersReduced && (
            <motion.div
              className="absolute top-0 h-24 w-24 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(245,158,11,0.4) 0%, rgba(245,158,11,0) 70%)",
              }}
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
              transition={{
                duration: 1,
                repeat: 2,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Spark particles */}
          {!prefersReduced && (
            <div className="absolute top-6">
              {Array.from({ length: 8 }, (_, i) => (
                <SparkParticle key={i} index={i} total={8} />
              ))}
            </div>
          )}

          {/* Flame icon */}
          <motion.div
            className="relative z-10 text-6xl leading-none"
            initial={{ scale: prefersReduced ? 1 : 0.5 }}
            animate={{ scale: [prefersReduced ? 1 : 0.5, 1.2, 1] }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 15,
                    duration: 0.6,
                  }
            }
          >
            <span role="img" aria-label="fire">
              🔥
            </span>
          </motion.div>

          {/* Streak text */}
          <motion.p
            className="relative z-10 text-xl font-bold font-sans text-saffron"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: prefersReduced ? 0 : 0.4,
              duration: prefersReduced ? 0 : 0.5,
              ease: "easeOut",
            }}
          >
            🔥 {streakCount} day streak!
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
