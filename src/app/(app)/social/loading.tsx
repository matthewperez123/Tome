import { Skeleton } from "@/components/ui/skeleton"

export default function SocialLoading() {
  return (
    <div className="p-4 md:p-6">
      <Skeleton className="h-6 w-32 mb-1" />
      <Skeleton className="h-4 w-56 mb-6" />

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border pb-2 mb-4">
        <Skeleton className="h-8 w-28 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      {/* Leaderboard rows */}
      <div className="space-y-1.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40 mt-1" />
            </div>
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
