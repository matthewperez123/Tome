"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
interface LevelUpProps {
  level: number;
  title: string;
  trigger: boolean;
  onClose: () => void;
}

export function LevelUp({ level, title, trigger, onClose }: LevelUpProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [showButton, setShowButton] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (trigger && !hasAnimated.current) {
      hasAnimated.current = true;

      const buttonTimer = setTimeout(
        () => setShowButton(true),
        prefersReduced ? 0 : 1500
      );

      return () => {
        clearTimeout(buttonTimer);
      };
    }
    if (!trigger) {
      hasAnimated.current = false;
      setShowButton(false);
    }
  }, [trigger, prefersReduced]);

  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.3 }}
        >
          {/* Pulsing ring */}
          {!prefersReduced && (
            <div className="absolute">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute -inset-8 rounded-full border-4 border-iris"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.4 + 0.2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Level number */}
          <motion.div
            className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-iris text-snow"
            initial={{ scale: prefersReduced ? 1 : 0 }}
            animate={{ scale: [prefersReduced ? 1 : 0, 1.2, 1] }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    duration: 0.6,
                  }
            }
          >
            <span className="text-5xl font-bold font-sans">{level}</span>
          </motion.div>

          {/* Title text */}
          <motion.p
            className="relative z-10 mt-6 text-2xl font-bold font-sans text-snow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: prefersReduced ? 0 : 0.5,
              duration: prefersReduced ? 0 : 0.5,
              ease: "easeOut",
            }}
          >
            You&apos;re now a {title}!
          </motion.p>

          {/* Continue button */}
          <AnimatePresence>
            {showButton && (
              <motion.button
                className="relative z-10 mt-10 rounded-xl bg-iris px-8 py-3 text-lg font-semibold font-sans text-snow transition-colors hover:bg-iris/90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.4 }}
                onClick={onClose}
              >
                Continue
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
