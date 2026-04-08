"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useSpring,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

interface XpCounterProps {
  value: number;
  trigger: boolean;
}

export function XpCounter({ value, trigger }: XpCounterProps) {
  const prefersReduced = usePrefersReducedMotion();
  const motionValue = useMotionValue(0);
  const springScale = useSpring(1, { stiffness: 300, damping: 15 });
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const displayRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;
    hasAnimated.current = true;

    motionValue.set(0);

    if (prefersReduced) {
      motionValue.set(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        // Bounce at the end
        springScale.set(1.15);
        setTimeout(() => springScale.set(1), 150);
      },
    });

    return () => controls.stop();
  }, [trigger, value, motionValue, prefersReduced, springScale]);

  useEffect(() => {
    if (!trigger) {
      hasAnimated.current = false;
    }
  }, [trigger]);

  // Subscribe to rounded value changes and update the DOM directly
  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = `+${v} XP`;
      }
    });
    return unsubscribe;
  }, [rounded]);

  return (
    <motion.div
      style={{ scale: springScale }}
      initial={{ opacity: 0, y: 10 }}
      animate={trigger ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: prefersReduced ? 0 : 0.3 }}
      className="inline-flex items-center justify-center"
    >
      <span
        ref={displayRef}
        className="text-4xl font-bold font-sans text-clover"
      >
        +0 XP
      </span>
    </motion.div>
  );
}
