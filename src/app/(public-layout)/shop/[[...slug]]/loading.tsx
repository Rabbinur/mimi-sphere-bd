import React from 'react';

const ShopSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter Skeleton */}
        <div className="hidden lg:block w-64 shrink-0 space-y-8">
          <div>
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-50 animate-pulse" />
                  <div className="h-4 w-24 bg-gray-50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="h-10 w-full bg-gray-50 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Product Grid Section */}
        <div className="flex-1">
          {/* Toolbar Skeleton */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 w-40 bg-gray-50 rounded-lg animate-pulse" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-gray-50 rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-50 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-50 rounded animate-pulse" />
                  <div className="h-6 w-1/3 bg-gray-100 rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Loading() {
  return <ShopSkeleton />;
}
