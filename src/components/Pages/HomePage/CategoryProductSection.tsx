import ProductCardLoading from "@/components/ui/ProductCardLoading";
import { getProductsByCategory } from "@/lib/server-api";
import { TCategory, TProduct } from "@/types";
import {
  ChevronRight,
  Gamepad2,
  Gem,
  Headphones,
  Layers,
  Shirt,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import CategoryProductSlider from "./CategoryProductSlider";

interface CategoryProductSectionProps {
  category: TCategory;
  bannerPosition?: "left" | "right";
  index?: number;
}

const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; subtitle: string }
> = {
  "womens-bags": {
    icon: ShoppingBag,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100/80",
    subtitle: "Luxury handbags, totes & daily essentials",
  },
  "mens-fashion": {
    icon: Shirt,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-100/80",
    subtitle: "Modern menswear, denim & statement styles",
  },
  "womens-collection": {
    icon: Layers,
    color: "text-pink-600",
    bg: "bg-pink-50 border-pink-100/80",
    subtitle: "Ethnic wear, modest abayas & 2-piece sets",
  },
  "gadgets-accessories": {
    icon: Headphones,
    color: "text-sky-600",
    bg: "bg-sky-50 border-sky-100/80",
    subtitle: "Smart tech, wearables, audio & accessories",
  },
  "toys-games": {
    icon: Gamepad2,
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-100/80",
    subtitle: "Fun learning toys, blocks & creative games",
  },
  "premium-bangles": {
    icon: Gem,
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-100/80",
    subtitle: "Handcrafted Kashmiri churi & bridal bangles",
  },
};

const DEFAULT_META = {
  icon: ShoppingBag,
  color: "text-slate-600",
  bg: "bg-slate-50 border-slate-100",
  subtitle: "Curated collection and popular favorites",
};

const CATEGORY_BANNERS: Record<string, string> = {
  "mens-fashion": "/assets/banner-mens-fashion.jpg",
  "womens-collection": "/assets/banner-womens-collection.jpg",
  "gadgets-accessories": "/assets/banner-gadgets-accessories.jpg",
  "womens-bags": "/assets/banner-womens-bags.jpg",
  "toys-games": "/assets/banner-toys-games.jpg",
  "premium-bangles": "/assets/poster-premium-bangles.png",
  "hijab-abayas": "/assets/banner-hijab-abayas.jpg",
  "modest-fashion": "/assets/banner-hijab-abayas.jpg",
};

const FALLBACK_BANNERS = [
  "/assets/banner-gadgets-accessories.jpg",
  "/assets/banner-mens-fashion.jpg",
  "/assets/banner-womens-collection.jpg",
  "/assets/banner-womens-bags.jpg",
  "/assets/banner-toys-games.jpg",
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
    CATEGORY_BANNERS[category.slug] ||
    category.imageUrl ||
    FALLBACK_BANNERS[index % FALLBACK_BANNERS.length];

  const meta = CATEGORY_META[category.slug] || DEFAULT_META;
  const CategoryIcon = meta.icon;

  const isBannerRight = bannerPosition === "right";

  return (
    <section className="container mx-auto px-2 sm:px-4 py-2 md:py-4">
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300">

        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3.5 md:px-6 md:py-4 bg-white border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl border shrink-0 ${meta.bg} ${meta.color} shadow-xs`}
            >
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none">
                  {category.name}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                  <Tag className="w-2.5 h-2.5 text-slate-400" />
                  Collection
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
                {meta.subtitle}
              </p>
            </div>
          </div>

          <Link
            href={`/shop/${category.slug}`}
            aria-label={`View all products in ${category.name}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-primary bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 transition-all duration-200 group self-end sm:self-auto shadow-2xs"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-primary" />
          </Link>
        </div>

        {/* ── Main Layout: Alternating Banner + Product Slider ── */}
        <div className="flex flex-col lg:flex-row overflow-hidden">

          {/* Promotional Poster Banner */}
          <Link
            href={`/shop/${category.slug}`}
            aria-label={`Explore ${category.name}`}
            className={`w-full lg:w-[280px] xl:w-[320px] shrink-0 relative aspect-[3/4] sm:aspect-[4/5] sm:max-h-[480px] lg:aspect-auto lg:min-h-[460px] xl:min-h-[490px] overflow-hidden group block bg-slate-100 border-b lg:border-b-0 ${
              isBannerRight
                ? "order-first lg:order-last lg:border-l border-slate-100"
                : "order-first lg:border-r border-slate-100"
            }`}
          >
            <Image
              src={bannerImage}
              alt={`${category.name} Poster`}
              fill
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              priority={index < 2}
            />
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
