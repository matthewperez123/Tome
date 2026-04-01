import { Skeleton } from "@/components/ui/skeleton"

export default function AchievementsLoading() {
  return (
    <div className="p-4 md:p-6">
      <Skeleton className="h-6 w-32 mb-1" />
      <Skeleton className="h-4 w-20 mb-4" />

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="size-8 rounded-md" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48 mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Skeleton className="h-4 w-14 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
