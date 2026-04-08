"use client"

import Link from "next/link"
import { ArrowRight, Bookmark, BookmarkCheck } from "lucide-react"
import type { CrossReference } from "@/lib/virgil/types"
import { cn } from "@/lib/utils"

const TYPE_LABELS: Record<string, string> = {
  echo: "ECHO",
  source: "SOURCE",
  parody: "PARODY",
  allusion: "ALLUSION",
  compare: "COMPARE",
}

interface CrossReferenceCardProps {
  crossRef: CrossReference
  bookmarked?: boolean
  onToggleBookmark?: () => void
}

export function CrossReferenceCard({ crossRef, bookmarked, onToggleBookmark }: CrossReferenceCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded"
          style={{ color: "#D4A04C", backgroundColor: "rgba(212,160,76,0.1)" }}
        >
          {TYPE_LABELS[crossRef.type] ?? crossRef.type}
        </span>
        {onToggleBookmark && (
          <button
            onClick={onToggleBookmark}
            className="text-muted-foreground hover:text-[#D4A04C] transition-colors shrink-0"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this reference"}
          >
            {bookmarked
              ? <BookmarkCheck className="size-3.5" style={{ color: "#D4A04C" }} />
              : <Bookmark className="size-3.5" />}
          </button>
        )}
      </div>

      <p className="font-serif text-xs leading-relaxed mt-2 text-foreground/80">
        {crossRef.description}
      </p>

      <div className="mt-2 flex items-center justify-between">
        <div className="text-[10px] text-muted-foreground">
          <span className="font-serif italic">{crossRef.workTitle}</span>
          <span> · {crossRef.workAuthor}</span>
          {crossRef.passageReference && (
            <span> · {crossRef.passageReference}</span>
          )}
        </div>

        {crossRef.targetBookId && (
          <Link
            href={`/read/${crossRef.targetBookId}`}
            className="flex items-center gap-1 text-[10px] font-medium transition-colors hover:opacity-80"
            style={{ color: "#D4A04C" }}
          >
            Read this <ArrowRight className="size-3" />
          </Link>
        )}
      </div>
    </div>
  )
}
