"use client"

import ProductCardLoading from "@/components/ui/ProductCardLoading";
import dynamic from "next/dynamic";

const SectionSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <ProductCardLoading key={i} />
      ))}
    </div>
  </div>
);

export const DynamicHotDealsSection = dynamic(() => import("./HotDealsSection"), {
  ssr: false,
  loading: () => <SectionSkeleton />
});

export const DynamicTrendySection = dynamic(() => import("./TrendySection"), {
  ssr: false,
  loading: () => <SectionSkeleton />
});

export const DynamicBrandSlider = dynamic(() => import("./BrandSlider"), {
  ssr: false,
});
