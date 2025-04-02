import { PropertyCardSkeletonGrid } from "./PropertyCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertyListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter skeleton */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-8">
          <div className="w-full md:w-64">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="w-full md:w-64">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="w-full md:w-64">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>

      {/* Results count skeleton */}
      <div className="mb-6 flex justify-between items-center">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Property grid skeleton */}
      <PropertyCardSkeletonGrid count={9} />
    </div>
  );
}