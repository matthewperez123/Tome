"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

interface HeartLossProps {
  trigger: boolean;
  heartsRemaining: number;
}

function HeartIcon({ filled, breaking }: { filled: boolean; breaking: boolean }) {
  if (breaking) {
    return (
      <div className="relative w-8 h-8">
        {/* Left half */}
        <motion.svg
          viewBox="0 0 12 24"
          className="absolute left-0 top-0 w-4 h-8"
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: -6, y: 8, rotate: -15, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09"
            fill="#6B6966"
            transform="scale(0.5)"
          />
        </motion.svg>
        {/* Right half */}
        <motion.svg
          viewBox="0 0 12 24"
          className="absolute right-0 top-0 w-4 h-8"
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: 6, y: 8, rotate: 15, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09L16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#6B6966"
            transform="scale(0.5) translate(-12, 0)"
          />
        </motion.svg>
      </div>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={filled ? "#EF4444" : "#E8E6E1"}
      />
    </svg>
  );
}

const shakeKeyframes = {
  x: [0, -3, 3, -2, 2, 0],
};

export function HeartLoss({ trigger, heartsRemaining }: HeartLossProps) {
  const prefersReduced = usePrefersReducedMotion();
  const hasAnimated = useRef(false);
  const showBreaking = useRef(false);
  const showFlash = useRef(false);

  useEffect(() => {
    if (trigger && !hasAnimated.current) {
      hasAnimated.current = true;
      showBreaking.current = true;
      showFlash.current = true;
    }
    if (!trigger) {
      hasAnimated.current = false;
      showBreaking.current = false;
      showFlash.current = false;
    }
  }, [trigger]);

  const maxHearts = heartsRemaining + (trigger ? 1 : 0);

  return (
    <motion.div
      className="relative inline-flex flex-col items-center gap-2"
      animate={
        trigger && !prefersReduced
          ? shakeKeyframes
          : { x: 0 }
      }
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Vermillion flash border */}
      <AnimatePresence>
        {trigger && (
          <motion.div
            className="pointer-events-none absolute -inset-4 rounded-xl border-2 border-vermillion"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Hearts row */}
      <div className="flex items-center gap-1">
        {Array.from({ length: maxHearts }, (_, i) => {
          const isBreaking = trigger && i === heartsRemaining;
          const isFilled = i < heartsRemaining;

          return (
            <motion.div
              key={i}
              animate={
                isBreaking && !prefersReduced
                  ? { scale: [1, 0.8, 0.6] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.3 }}
            >
              <HeartIcon filled={isFilled} breaking={isBreaking && !prefersReduced} />
            </motion.div>
          );
        })}
      </div>

      {/* Remaining hearts label */}
      <AnimatePresence>
        {trigger && (
          <motion.p
            className="text-sm font-sans text-graphite"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: prefersReduced ? 0 : 0.4, duration: 0.3 }}
          >
            {heartsRemaining} {heartsRemaining === 1 ? "heart" : "hearts"} remaining
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
