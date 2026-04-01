import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-6">
      <Skeleton className="h-6 w-40 mb-1" />
      <Skeleton className="h-4 w-24 mb-6" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {/* Daily goal ring */}
        <div className="rounded-xl border border-border p-4 flex flex-col items-center gap-2">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        {/* Streak */}
        <div className="rounded-xl border border-border p-4 flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
        {/* XP */}
        <div className="rounded-xl border border-border p-4 flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-1 w-16 rounded-full" />
        </div>
        {/* Hearts */}
        <div className="rounded-xl border border-border p-4 flex flex-col items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="size-5 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
        {/* Currently reading */}
        <div className="col-span-2 rounded-xl border border-border p-4 flex gap-4">
          <Skeleton className="w-16 shrink-0" style={{ aspectRatio: "200/280" }} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        </div>
        {/* Activity feed */}
        <div className="col-span-2 md:row-span-2 rounded-xl border border-border p-4">
          <Skeleton className="h-4 w-24 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        </div>
        {/* Suggested book */}
        <div className="col-span-2 rounded-xl border border-border p-4 flex gap-3">
          <Skeleton className="w-14 shrink-0" style={{ aspectRatio: "200/280" }} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
