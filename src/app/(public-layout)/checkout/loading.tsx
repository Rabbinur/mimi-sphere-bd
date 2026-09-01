import React from 'react';

const CheckoutSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
        {/* Billing Details Skeleton */}
        <div className="flex-1 space-y-8">
          <div className="h-8 w-64 bg-gray-100 rounded-lg animate-pulse mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-50 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-50 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-50 rounded animate-pulse" />
            <div className="h-24 w-full bg-gray-50 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div className="w-full lg:w-[400px] bg-gray-50/50 rounded-3xl p-6 sm:p-8 border border-gray-100 space-y-6 h-fit">
          <div className="h-7 w-40 bg-gray-100 rounded animate-pulse mb-6" />
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-gray-50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-50 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-50 rounded animate-pulse" />
            </div>
            <div className="flex justify-between pt-2">
              <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>

          <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse mt-8" />
        </div>
      </div>
    </div>
  );
};

export default function Loading() {
  return <CheckoutSkeleton />;
}
