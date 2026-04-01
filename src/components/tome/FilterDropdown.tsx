"use client"

import { cn } from "@/lib/utils"

interface FilterDropdownProps {
  label: string
  options: ReadonlyArray<{ label: string; value: string }>
  value: string
  onChange: (value: string) => void
  className?: string
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  className,
}: FilterDropdownProps) {
  const isActive = value !== "" && value !== (options[0]?.value ?? "")
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={cn(
        "h-7 rounded-full border bg-background px-2.5 text-[11px] outline-none appearance-none cursor-pointer",
        "transition-colors focus:border-[var(--tome-accent)]",
        isActive
          ? "border-[var(--tome-accent)] text-[var(--tome-accent)]"
          : "border-border text-muted-foreground",
        className,
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
