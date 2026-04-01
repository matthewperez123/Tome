import { Skeleton } from "@/components/ui/skeleton"

export default function AuthorsLoading() {
  return (
    <div className="p-4">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="size-14 rounded-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
