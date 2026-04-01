"use client"

import { cn } from "@/lib/utils"

export interface FilterTabItem {
  label: string
  value: string
  count?: number
  dotColor?: string
}

interface FilterTabsProps {
  items: FilterTabItem[]
  activeValue: string
  onChange: (value: string) => void
  className?: string
}

export function FilterTabs({
  items,
  activeValue,
  onChange,
  className,
}: FilterTabsProps) {
  return (
    <div
      className={cn(
        "flex gap-1.5 overflow-x-auto scrollbar-none snap-x snap-mandatory",
        className,
      )}
      role="tablist"
    >
      {items.map((item) => {
        const active = item.value === activeValue
        return (
          <button
            key={item.value}
            onClick={() => onChange(active && item.value !== "" ? "" : item.value)}
            role="tab"
            aria-selected={active}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium snap-start",
              "transition-[background,color,border-color] duration-150",
              active
                ? "bg-[#4F46E5] text-white"
                : "bg-[var(--tome-surface-elevated)] text-muted-foreground border border-border hover:text-foreground hover:border-foreground/30 hover:bg-[#EEF2FF]",
            )}
          >
            {item.dotColor && !active && (
              <span
                className="size-1.5 rounded-full shrink-0"
                style={{ backgroundColor: item.dotColor }}
              />
            )}
            {item.label}
            {item.count != null && (
              <span
                className={cn(
                  "tabular-nums text-[10px]",
                  active ? "opacity-70" : "opacity-50",
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
