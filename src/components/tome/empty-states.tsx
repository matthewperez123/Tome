"use client"

import { BookOpen, Feather, MessageSquare, Trophy, Search } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  className?: string
  action?: { label: string; onClick: () => void }
}

// ── Library: No books matching filter ──────────

export function EmptyLibrary({ className, action }: EmptyStateProps) {
  return (
    <BlurFade delay={0.1} inView>
      <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
        <svg viewBox="0 0 120 80" className="size-24 mb-4" aria-hidden="true">
          <rect x="10" y="20" width="12" height="50" rx="2" fill="var(--tome-accent)" opacity="0.15" />
          <rect x="26" y="15" width="12" height="55" rx="2" fill="var(--tome-violet)" opacity="0.2" />
          <rect x="42" y="25" width="12" height="45" rx="2" fill="var(--tome-amber)" opacity="0.15" />
          <rect x="58" y="10" width="12" height="60" rx="2" fill="var(--tome-emerald)" opacity="0.2" />
          <rect x="74" y="22" width="12" height="48" rx="2" fill="var(--tome-sky)" opacity="0.15" />
          <rect x="90" y="18" width="12" height="52" rx="2" fill="var(--tome-rose)" opacity="0.2" />
          <line x1="5" y1="70" x2="115" y2="70" stroke="var(--border)" strokeWidth="1" />
          <circle cx="60" cy="40" r="15" fill="none" stroke="var(--tome-accent)" strokeWidth="1.5" opacity="0.3" />
          <line x1="70" y1="50" x2="80" y2="60" stroke="var(--tome-accent)" strokeWidth="1.5" opacity="0.3" />
        </svg>
        <p className="text-sm font-medium">No books found</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Try adjusting your filters or search for something different.
        </p>
        {action && (
          <Button variant="ghost" size="sm" onClick={action.onClick} className="mt-3 text-xs">
            {action.label}
          </Button>
        )}
      </div>
    </BlurFade>
  )
}

// ── Quiz: No results ───────────────────────────

export function EmptyQuizResults({ className }: EmptyStateProps) {
  return (
    <BlurFade delay={0.1} inView>
      <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
        <svg viewBox="0 0 80 100" className="size-20 mb-4" aria-hidden="true">
          {/* Parchment */}
          <rect x="10" y="5" width="60" height="80" rx="3" fill="var(--tome-surface-elevated)" stroke="var(--tome-amber)" strokeWidth="1" opacity="0.5" />
          <line x1="20" y1="25" x2="60" y2="25" stroke="var(--tome-amber)" strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="35" x2="55" y2="35" stroke="var(--tome-amber)" strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="45" x2="50" y2="45" stroke="var(--tome-amber)" strokeWidth="0.5" opacity="0.3" />
          {/* Quill */}
          <path d="M65 10 Q70 30 55 55" fill="none" stroke="var(--tome-accent)" strokeWidth="1.5" opacity="0.4" />
          <circle cx="55" cy="55" r="1.5" fill="var(--tome-accent)" opacity="0.6" />
        </svg>
        <p className="text-sm font-medium">No quizzes taken yet</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Complete a chapter to unlock your first quiz.
        </p>
      </div>
    </BlurFade>
  )
}

// ── Activity: No items ─────────────────────────

export function EmptyActivity({ className }: EmptyStateProps) {
  return (
    <BlurFade delay={0.1} inView>
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <div className="flex size-14 items-center justify-center rounded-full bg-[var(--tome-accent)]/10 mb-4">
          <span className="text-2xl">🏛️</span>
        </div>
        <p className="text-sm font-medium">Your journey begins here</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs font-serif italic">
          &ldquo;Every great reader starts with a single page.&rdquo;
          <br />
          <span className="not-italic text-[10px]">— Virgil, your guide</span>
        </p>
      </div>
    </BlurFade>
  )
}

// ── Clubs: No discussions ──────────────────────

export function EmptyDiscussions({ className }: EmptyStateProps) {
  return (
    <BlurFade delay={0.1} inView>
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <MessageSquare className="size-8 text-muted-foreground/20 mb-3" />
        <p className="text-sm font-medium">Start a conversation</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Be the first to share your thoughts on this chapter.
        </p>
      </div>
    </BlurFade>
  )
}

// ── Achievements: None earned ──────────────────

export function EmptyAchievements({ className }: EmptyStateProps) {
  return (
    <BlurFade delay={0.1} inView>
      <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex size-10 items-center justify-center rounded-lg bg-muted/50 border border-border/50"
            >
              <Trophy className="size-4 text-muted-foreground/20" />
            </div>
          ))}
        </div>
        <p className="text-sm font-medium">Achievements await</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Read books, complete quizzes, and join clubs to unlock badges.
        </p>
      </div>
    </BlurFade>
  )
}
