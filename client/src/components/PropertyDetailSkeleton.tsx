import { Skeleton } from "@/components/ui/skeleton";

export function PropertyDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      
      {/* Property title skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
      
      {/* Image gallery skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Skeleton className="h-[400px] rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-[192px] rounded-lg" />
          <Skeleton className="h-[192px] rounded-lg" />
          <Skeleton className="h-[192px] rounded-lg" />
          <Skeleton className="h-[192px] rounded-lg" />
        </div>
      </div>
      
      {/* Property details and booking form skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Description skeleton */}
          <div className="mb-8">
            <Skeleton className="h-7 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Amenities skeleton */}
          <div className="mb-8">
            <Skeleton className="h-7 w-40 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Location skeleton */}
          <div className="mb-8">
            <Skeleton className="h-7 w-40 mb-4" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
          
          {/* Reviews skeleton */}
          <div>
            <Skeleton className="h-7 w-40 mb-4" />
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Booking form skeleton */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
            
            <div className="mb-6">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            
            <Skeleton className="h-12 w-full rounded-lg mb-4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}