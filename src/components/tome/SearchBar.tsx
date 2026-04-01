"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 pl-9 pr-8 text-xs bg-[var(--tome-surface-elevated)] border-transparent focus-visible:border-[var(--tome-accent)] rounded-full"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  )
}
