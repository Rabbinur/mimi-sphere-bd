import React from 'react';

const HeroSkeleton = () => (
  <div className="container mx-auto px-2 sm:px-4 py-2 md:py-6 xl:py-7 xl:pt-10">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
      <div className="lg:col-span-8 bg-gray-100 animate-pulse rounded-2xl h-[160px] sm:h-[230px] lg:h-[450px]" />
      <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
        <div className="bg-gray-100 animate-pulse rounded-2xl h-[100px] sm:h-[140px] lg:h-full" />
        <div className="bg-gray-100 animate-pulse rounded-2xl h-[100px] sm:h-[140px] lg:h-full" />
      </div>
    </div>
  </div>
);

const CategoriesSkeleton = () => (
  <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 overflow-hidden">
    <div className="flex gap-4 sm:gap-6 justify-between">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-50 animate-pulse" />
          <div className="h-3 w-12 bg-gray-50 animate-pulse rounded" />
        </div>
      ))}
    </div>
  </div>
);

const SectionSkeleton = () => (
  <div className="container mx-auto px-4 py-8 sm:py-12">
    <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse mb-8" />
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
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
);

export default function Loading() {
  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <HeroSkeleton />
      <CategoriesSkeleton />
      <div className="bg-gray-50/30 py-8 sm:py-16 space-y-12">
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    </div>
  );
}
