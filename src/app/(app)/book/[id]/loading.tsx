import { Skeleton } from "@/components/ui/skeleton"

export default function BookDetailLoading() {
  return (
    <div className="px-4 py-4 max-w-3xl mx-auto space-y-8">
      <Skeleton className="h-3 w-48" />
      <div className="flex gap-5">
        <Skeleton className="w-36 shrink-0 rounded-lg" style={{ aspectRatio: "200/280" }} />
        <div className="flex-1 space-y-3 pt-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-36 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 mb-3" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
