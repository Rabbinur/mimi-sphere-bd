import { Button } from "@/components/ui/button";
import { ItemCardClient as ItemCard } from "@/components/ui/ItemCardClient";
import ProductCardLoading from "@/components/ui/ProductCardLoading";
import TitleBadge from "@/components/ui/TitleBadge";
import { getProductsByCategory } from "@/lib/server-api";
import { TCategory, TProduct } from "@/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface CategoryProductSectionProps {
  category: TCategory;
}

// 🔹 Sub-component for products fetching (Server Component)
async function ProductList({ categoryId }: { categoryId: string }) {
  const data = await getProductsByCategory(categoryId, 5);
  const products = data || [];

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product: TProduct) => (
        <div
          key={product._id}
        >
          <ItemCard product={product} />
        </div>
      ))}
    </div>
  );
}

const CategoryProductSection = ({ category }: CategoryProductSectionProps) => {
  return (
    <section className="container mx-auto px-2 md:px-4">
      <div className="bg-white/50 rounded-sm overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-2.5 md:p-5 border-b border-gray-100 ">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <TitleBadge title={category.name} />
          </div>
          <Link href={`/shop/${category.slug}`} aria-label={`View all products in ${category.name}`}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5 font-bold">
              View All <ChevronRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>

        {/* Product Content - Wrapped in Suspense for Streaming */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 border-l border-gray-100 first:border-l-0">
                <ProductCardLoading />
              </div>
            ))}
          </div>
        }>
          <ProductList categoryId={category._id} />
        </Suspense>
      </div>
    </section>
  );
};

export default CategoryProductSection;
