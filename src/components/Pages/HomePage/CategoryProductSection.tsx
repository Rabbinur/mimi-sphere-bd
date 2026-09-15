import { Button } from "@/components/ui/button";
import ProductCardLoading from "@/components/ui/ProductCardLoading";
import TitleBadge from "@/components/ui/TitleBadge";
import { getProductsByCategory } from "@/lib/server-api";
import { TCategory, TProduct } from "@/types";
import { ArrowRight, ChevronRight, FolderHeart, Layers, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import CategoryProductSlider from "./CategoryProductSlider";

interface CategoryProductSectionProps {
  category: TCategory;
  bannerPosition?: "left" | "right";
  index?: number;
}

const CATEGORY_BANNERS: Record<string, string> = {
  "mens-fashion": "/assets/hot-deals.png",
  "womens-collection": "/assets/modest-banner.jpg",
  "gadgets-accessories": "/assets/treandings.png",
  "womens-bags": "/assets/limited-time.png",
  "toys-games": "/hero/banner-kids-1.jpg",
};

const FALLBACK_BANNERS = [
  "/assets/treandings.png",
  "/assets/hot-deals.png",
  "/assets/limited-time.png",
  "/assets/supar-sale.png",
  "/assets/ads-1.png",
];

// 🔹 Sub-component for products fetching (Server Component)
async function ProductContent({ categoryId }: { categoryId: string }) {
  const data = await getProductsByCategory(categoryId, 12);
  const products: TProduct[] = data || [];

  if (products.length === 0) return null;

  return <CategoryProductSlider products={products} />;
}

const CategoryProductSection = ({
  category,
  bannerPosition = "left",
  index = 0,
}: CategoryProductSectionProps) => {
  const bannerImage =
    category.imageUrl ||
    CATEGORY_BANNERS[category.slug] ||
    FALLBACK_BANNERS[index % FALLBACK_BANNERS.length];

  const isBannerRight = bannerPosition === "right";

  return (
    <section className="container mx-auto px-2 sm:px-4 py-2 md:py-4">
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300">
        
        {/* ── Section Header ── */}
        <div className="flex items-center justify-between px-3.5 py-3 md:px-6 md:py-4 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 rounded-full bg-primary" />
            <TitleBadge title={category.name} />
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              <Tag className="w-3 h-3 text-slate-500" />
              Collection
            </span>
          </div>

          <Link
            href={`/shop/${category.slug}`}
            aria-label={`View all products in ${category.name}`}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-600 hover:text-primary transition-all duration-200 group px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-primary" />
          </Link>
        </div>

        {/* ── Main Layout: Alternating Banner + Product Slider ── */}
        <div className="flex flex-col lg:flex-row overflow-hidden">
          
          {/* Promotional Banner */}
          <Link
            href={`/shop/${category.slug}`}
            aria-label={`Explore ${category.name}`}
            className={`w-full lg:w-[260px] xl:w-[290px] shrink-0 relative min-h-[160px] sm:min-h-[220px] lg:min-h-[380px] overflow-hidden group block bg-slate-900 ${
              isBannerRight ? "order-first lg:order-last" : "order-first"
            }`}
          >
            <Image
              src={bannerImage}
              alt={`${category.name} Banner`}
              fill
              sizes="(max-width: 1024px) 100vw, 290px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

            {/* Floating pill badge */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 hidden sm:flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-black/40 backdrop-blur-md border border-white/20 shadow-sm group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <FolderHeart className="w-3 h-3 text-amber-300" />
                Explore {category.name}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Product Slider Container */}
          <div className="flex-1 min-w-0 p-2.5 sm:p-3.5 md:p-4 bg-slate-50/50 flex flex-col justify-center">
            <Suspense
              fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardLoading key={i} />
                  ))}
                </div>
              }
            >
              <ProductContent categoryId={category._id} />
            </Suspense>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategoryProductSection;
