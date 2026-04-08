"use client"

import { Send } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function VirgilChatFooter() {
  function handleClick() {
    toast("Conversational Virgil arrives soon. For now, the annotations are your guide.", {
      duration: 3000,
    })
  }

  return (
    <div
      className="border-t px-4 py-3 flex items-center gap-3"
      style={{ borderColor: "rgba(212,160,76,0.15)", backgroundColor: "var(--background-secondary, var(--card))" }}
    >
      {/* Virgil glyph */}
      <span className="text-sm shrink-0" style={{ color: "#D4A04C" }}>✦</span>

      {/* Input field (disabled) */}
      <div
        onClick={handleClick}
        className={cn(
          "flex-1 flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer",
          "border-border hover:border-[#D4A04C]/20 transition-colors"
        )}
      >
        <span className="text-sm text-muted-foreground/50 flex-1">
          Ask Virgil about this passage…
        </span>
        <span
          className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
          style={{ backgroundColor: "rgba(212,160,76,0.1)", color: "#D4A04C" }}
        >
          Coming soon
        </span>
      </div>

      {/* Send button (disabled) */}
      <button
        onClick={handleClick}
        disabled
        className="flex items-center justify-center size-8 rounded-lg bg-muted text-muted-foreground/30 cursor-not-allowed"
        aria-label="Send message (coming soon)"
      >
        <Send className="size-3.5" />
      </button>
    </div>
  )
}
