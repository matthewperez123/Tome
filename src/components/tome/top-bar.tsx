"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/tome/avatar/UserAvatar"
import { getCurrentAvatar } from "@/lib/avatar-state"
import type { BookCharacter } from "@/data/character-avatars"
import { CHARACTER_MAP } from "@/data/character-avatars"

export function TopBar({ className }: { className?: string }) {
  const [character, setCharacter] = React.useState<BookCharacter | null>(null)

  React.useEffect(() => {
    setCharacter(getCurrentAvatar())
  }, [])

  const displayCharacter = character ?? CHARACTER_MAP["virgil"]

  return (
    <header
      className={cn(
        "flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background px-4",
        className
      )}
    >
      <SidebarTrigger className="md:hidden" />

      {/* Search — Notion style */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search books, notes, quizzes…"
          className="h-8 bg-[var(--tome-surface-elevated)] pl-8 text-sm border-transparent focus-visible:border-[var(--tome-accent)] focus-visible:bg-background"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        {/* Notification bell */}
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User avatar */}
        <Link href="/profile/avatar" className="rounded-full hover:opacity-80 transition-opacity">
          <UserAvatar
            character={displayCharacter}
            size="xs"
            showRarityRing
          />
        </Link>
      </div>
    </header>
  )
}
