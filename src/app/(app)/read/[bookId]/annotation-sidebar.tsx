"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageSquare } from "lucide-react"
import { springs } from "@/lib/design-tokens"

type Annotation = {
  text: string
  chapter: number
  timestamp: string
  type: string
}

interface AnnotationSidebarProps {
  bookId: string
  chapterIndex: number
  open: boolean
  onClose: () => void
}

export function AnnotationSidebar({
  bookId,
  chapterIndex,
  open,
  onClose,
}: AnnotationSidebarProps) {
  const annotations = useMemo(() => {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem(`tome-annotations-${bookId}`)
      if (!raw) return []
      const all: Annotation[] = JSON.parse(raw)
      return all.filter((a) => a.chapter === chapterIndex)
    } catch {
      return []
    }
  }, [bookId, chapterIndex, open]) // re-read when opened

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={springs.interactive}
          className="absolute right-0 top-0 bottom-0 z-30 w-72 border-l border-border bg-background shadow-lg overflow-y-auto motion-reduce:transition-none"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-3.5 text-muted-foreground" />
              <h3 className="text-xs font-medium">Annotations</h3>
              {annotations.length > 0 && (
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  ({annotations.length})
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="p-4">
            {annotations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No annotations in this chapter.
                <br />
                <span className="text-[10px]">
                  Select text to create one.
                </span>
              </p>
            ) : (
              <div className="space-y-3">
                {annotations.map((a, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-[var(--tome-surface-elevated)] p-3"
                  >
                    <p className="text-xs font-serif italic text-foreground/80 leading-relaxed line-clamp-3">
                      &ldquo;{a.text}&rdquo;
                    </p>
                    <p className="mt-2 text-[9px] text-muted-foreground">
                      {new Date(a.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
