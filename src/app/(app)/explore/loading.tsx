import { Skeleton } from "@/components/ui/skeleton"

export default function ExploreLoading() {
  return (
    <div className="relative h-[calc(100vh-3rem)] bg-[var(--tome-surface-elevated)]">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4">
        <div>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-48 mt-1" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>

      {/* Pulsing dots on map area */}
      <div className="flex items-center justify-center size-full">
        <svg viewBox="-180 -90 360 180" className="w-full max-w-3xl opacity-30">
          {Array.from({ length: 40 }).map((_, i) => (
            <circle
              key={i}
              cx={((i * 47) % 360) - 180}
              cy={((i * 31) % 180) - 90}
              r={1.5}
              fill="currentColor"
              className="text-muted-foreground animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Country pills placeholder */}
      <div className="absolute top-16 left-4 flex flex-wrap gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-20 rounded-full" />
        ))}
      </div>
    </div>
  )
}
