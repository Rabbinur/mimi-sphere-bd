import CategoriesSection from "@/components/Pages/HomePage/CategoriesSection";
import HeroSlider from "@/components/Pages/HomePage/HeroSlider";
import HomeCategorySections from "@/components/Pages/HomePage/HomeCategorySections";
import { DynamicBrandSlider, DynamicHotDealsSection, DynamicTrendySection } from "@/components/Pages/HomePage/HomeClientSections";
import ProductCardLoading from "@/components/ui/ProductCardLoading";
import { fetchData, getCategories, getCMS } from "@/lib/server-api";
import { Metadata } from "next";
import { Suspense } from "react";
import BentoGridSection from "@/components/Pages/HomePage/BentoGridSection";

/* ─── Skeletons ─── */
const HeroSkeleton = () => (
  <div className="container mx-auto px-2 sm:px-4 py-2 md:py-6 xl:py-7 xl:pt-10">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
      <div className="lg:col-span-8 bg-gray-200 animate-pulse rounded-lg h-[160px] sm:h-[230px] lg:h-[450px]" />
      <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
        <div className="bg-gray-200 animate-pulse rounded-lg h-[100px] sm:h-[140px] lg:h-full" />
        <div className="bg-gray-200 animate-pulse rounded-lg h-[100px] sm:h-[140px] lg:h-full" />
      </div>
    </div>
  </div>
);

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

const CategoriesSkeleton = () => (
  <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 overflow-hidden">
    <div className="flex gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="w-24 h-24 rounded-full bg-gray-100 flex-shrink-0 animate-pulse" />
      ))}
    </div>
  </div>
);

/* ─── Metadata ─── */
export const metadata: Metadata = {
  title: "Mimi Sphere | Everything You Need, All in One Place",
  description: "Shop trendy Korean cosmetics, premium lifestyle essentials & aesthetic accessories in Bangladesh. 100% authentic products at Mimi Sphere.",
  alternates: { canonical: "https://www.mimisphere.com" },
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ─── API Helpers ─── */
const getFeaturedProducts = (limit = 20) => fetchData(`${API_BASE}/products/featured?limit=${limit}`, 60);
const getTrendyProducts = (limit = 20) => fetchData(`${API_BASE}/products/trendy?limit=${limit}`, 60);

/* ─── Main Page ─── */
export default function Home() {
  return (
    <div className="w-full">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSliderWrapper />
      </Suspense>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSectionWrapper />
      </Suspense>

      <div className="bg-gray-50 space-y-4 md:space-y-6 xl:space-y-10 py-4 md:py-6 xl:py-10">
        <BentoGridSection />

        <Suspense fallback={<SectionSkeleton />}>
          <HotDealsWrapper />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <TrendyWrapper />
        </Suspense>

        <DynamicBrandSlider />

        <Suspense fallback={<SectionSkeleton />}>
          <HomeCategorySectionsWrapper />
        </Suspense>
      </div>
    </div>
  );
}

/* ─── Data Fetching Wrappers ─── */
async function HeroSliderWrapper() {
  const cmsData = await getCMS();
  return <HeroSlider initialCmsData={cmsData} />;
}

async function CategoriesSectionWrapper() {
  const categories = await getCategories();
  return <CategoriesSection categories={categories} />;
}

async function HotDealsWrapper() {
  const products = await getFeaturedProducts(20);
  return <DynamicHotDealsSection products={products} />;
}

async function TrendyWrapper() {
  const products = await getTrendyProducts(18);
  return <DynamicTrendySection products={products} />;
}

async function HomeCategorySectionsWrapper() {
  const categories = await getCategories();
  return <HomeCategorySections categories={categories} />;
}
