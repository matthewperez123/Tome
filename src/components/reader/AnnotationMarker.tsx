"use client"

import { cn } from "@/lib/utils"

interface AnnotationMarkerProps {
  onClick: () => void
  className?: string
}

export function AnnotationMarker({ onClick, className }: AnnotationMarkerProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        "inline-flex items-center justify-center",
        "text-[10px] align-super ml-0.5",
        "transition-all duration-150",
        "hover:scale-125",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4A04C]/50 rounded-sm",
        className
      )}
      style={{ color: "#D4A04C" }}
      aria-label="View annotation"
      title="View Virgil's annotation"
    >
      ✦
    </button>
  )
}
