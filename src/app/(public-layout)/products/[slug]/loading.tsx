import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="hidden sm:block border-b border-gray-100">
        <div className="container mx-auto px-3 py-2">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="container mx-auto px-2 md:px-3 py-4 lg:py-8">
        {/* Mobile Title Skeleton */}
        <div className="lg:hidden space-y-2 mb-6">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-2/3" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Product Content Skeleton */}
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery Skeleton */}
              <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-20 w-20 rounded-lg shrink-0" />
                  ))}
                </div>
              </div>

              {/* Product Info Skeleton */}
              <div className="space-y-6">
                <div className="hidden lg:block space-y-3 pb-6 border-b border-gray-100">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-2/3" />
                  <div className="flex items-center gap-4 pt-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>

                <div className="py-4 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-28" />
                </div>

                <div className="space-y-4 py-4 border-t border-b border-gray-100">
                  <Skeleton className="h-3 w-20" />
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-24 rounded-md" />
                    ))}
                  </div>
                </div>

                <div className="space-y-4 py-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="border-t pt-8">
              <div className="flex gap-8 border-b border-gray-100">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
              <div className="py-8 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <Skeleton className="h-6 w-48 mb-6" />
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-4 w-1/3 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
              <Skeleton className="h-11 w-full rounded-xl mt-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
