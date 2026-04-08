"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

interface ProgressRingProps {
  progress: number;
  size: number;
  color: string;
  strokeWidth?: number;
  showPercentage?: boolean;
}

export function ProgressRing({
  progress,
  size,
  color,
  strokeWidth = 6,
  showPercentage = true,
}: ProgressRingProps) {
  const prefersReduced = usePrefersReducedMotion();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8E6E1"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 0.6, ease: "easeInOut" }
          }
        />
      </svg>

      {/* Center text */}
      {showPercentage && (
        <span
          className="absolute text-sm font-bold font-sans"
          style={{ color }}
        >
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
}
