import { Skeleton } from "@/components/ui/skeleton"

export default function LibraryLoading() {
  return (
    <div className="flex flex-col md:flex-row gap-0 min-h-full">
      {/* Filter sidebar skeleton */}
      <div className="hidden md:block w-56 border-r border-border bg-[var(--tome-surface-elevated)] p-4">
        <Skeleton className="h-3 w-16 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
          <div className="space-y-2 mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-4">
        {/* Search bar */}
        <div className="flex items-center gap-3 border-b border-border pb-2.5 mb-4">
          <Skeleton className="h-7 flex-1 max-w-sm" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Featured card */}
        <Skeleton className="h-28 w-full rounded-xl mb-6" />

        {/* Book grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="w-full rounded-lg" style={{ aspectRatio: "200/280" }} />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
