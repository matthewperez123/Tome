"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Bell, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/tome/avatar/UserAvatar"
import { getCurrentAvatar } from "@/lib/avatar-state"
import type { BookCharacter } from "@/data/character-avatars"
import { CHARACTER_MAP } from "@/data/character-avatars"
import { useSearch } from "@/hooks/useSearch"
import { SearchDropdown } from "@/components/tome/SearchDropdown"

export function TopBar({ className }: { className?: string }) {
  const [character, setCharacter] = React.useState<BookCharacter | null>(null)
  const [query, setQuery] = React.useState("")
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setCharacter(getCurrentAvatar())
  }, [])

  const displayCharacter = character ?? CHARACTER_MAP["virgil"]
  const { results, isSearching } = useSearch(query)

  const handleClose = React.useCallback(() => {
    setDropdownOpen(false)
    setQuery("")
    inputRef.current?.blur()
  }, [])

  return (
    <header
      className={cn(
        "flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background px-4",
        className
      )}
    >
      <SidebarTrigger className="md:hidden" />

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setDropdownOpen(e.target.value.trim().length >= 2)
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setDropdownOpen(true)
          }}
          placeholder="Search books, authors, genres…"
          className="h-8 bg-[var(--tome-surface-elevated)] pl-8 pr-7 text-sm border-transparent focus-visible:border-[var(--tome-accent)] focus-visible:bg-background"
        />
        {query && (
          <button
            onClick={handleClose}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-3.5" />
          </button>
        )}
        <SearchDropdown
          results={results}
          query={query}
          isOpen={dropdownOpen && isSearching}
          onClose={handleClose}
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
