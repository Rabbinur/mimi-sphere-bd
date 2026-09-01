import { Suspense } from "react";
import FilterSidebar from "./filter-sidebar";
import ProductGrid from "./product-grid";
import ShopHeader from "./shop-header";

// ✅ REMOVED force-dynamic to allow Next.js to optimize
// export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: {
    category?: string | string[];
    sort?: string | string[];
    brand?: string | string[];
    [key: string]: string | string[] | undefined;
  };
}

const features = [
  { icon: "🚚", title: "Free Shipping", description: "Free shipping all over" },
  { icon: "✨", title: "100% Satisfaction", description: "Quality guarantee" },
  { icon: "🔒", title: "Secure Payments", description: "Safe checkout" },
  { icon: "💬", title: "24/7 Support", description: "Anytime support" },
];

async function getCategories() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) return [];
  const baseUrl = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

  // ✅ Increase revalidate to 1 hour (3600s) for better performance
  const res = await fetch(`${baseUrl}/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? json ?? [];
}

async function getProductFilters() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) return { variants: [], brands: [] };
  const baseUrl = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

  // ✅ Add revalidation for filters (rarely change)
  const res = await fetch(`${baseUrl}/products/filters`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { variants: [], brands: [] };
  const json = await res.json();
  return json.data ?? { variants: [], brands: [] };
}

async function getProducts({
  category,
  sort,
  brand,
  variantFilters,
  page = 1,
}: {
  category: string | null;
  sort: string;
  brand: string | null;
  variantFilters: Record<string, string[]>;
  page?: number;
}) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) return { data: [], pagination: null };

  const baseUrl = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
  const params = new URLSearchParams({ page: page.toString(), limit: "12", sort });
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  Object.entries(variantFilters).forEach(([name, values]) => {
    values.forEach((val) => {
      if (val) params.append(`variant_${name.toLowerCase()}`, val);
    });
  });

  // ✅ Use a short revalidate (e.g. 1 min) instead of no-store for better TTFB
  const res = await fetch(
    `${baseUrl}/products?${params}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return { data: [], pagination: null };
  return res.json();
}

/** 
 * 🚀 Separate Component for Streaming Products
 * This prevents the whole page from blocking while products load.
 */
async function ProductListContainer({
  category,
  sort,
  brand,
  variantFilters,
  page
}: any) {
  const productsRes = await getProducts({ category, sort, brand, variantFilters, page });
  const products = productsRes?.data ?? [];

  return (
    <>
      <ShopHeader
        category={category}
        sort={sort}
        totalProducts={productsRes?.pagination?.totalItems || 0}
      />
      <div className="mt-4">
        <ProductGrid
          products={products}
          category={category}
          brand={brand}
          variantFilters={variantFilters}
          sort={sort}
          pagination={productsRes?.pagination}
        />
      </div>
    </>
  );
}

// ─── Page (Server Component) ─────────────────────────────────────────────────
export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams.category;
  const category = (Array.isArray(categoryParam) ? categoryParam[0] : categoryParam) ?? null;
  const sort = (resolvedSearchParams.sort as string) ?? "latest";
  const brand = (resolvedSearchParams.brand as string) ?? null;
  const page = parseInt((resolvedSearchParams.page as string) ?? "1") || 1;

  const variantFilters = Object.entries(resolvedSearchParams).reduce<Record<string, string[]>>(
    (acc, [key, value]) => {
      if (key.startsWith("variant_") && value) {
        const values = Array.isArray(value) ? value : [value];
        acc[key.replace("variant_", "").toLowerCase()] = Array.from(new Set(values));
      }
      return acc;
    },
    {}
  );

  // ⚡ Fast data fetched in parallel
  const [categories, productFilters] = await Promise.all([
    getCategories(),
    getProductFilters(),
  ]);

  return (
    <>
      <div className="min-h-screen bg-slate-50/60">
        <div className="container mx-auto px-3 md:px-6 py-4 md:py-6">
          <div className="flex flex-col lg:flex-row md:gap-4 ">
            {/* Sidebar - Renders instantly */}
            <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <FilterSidebar
                  categories={categories}
                  productFilters={productFilters}
                  activeCategory={category}
                  activeBrand={brand}
                  activeVariantFilters={variantFilters}
                  sortValue={sort}
                  totalProducts={0} // Will be updated by client state or re-render
                />
              </div>
            </div>

            {/* Content - Streamed via Suspense */}
            <div className="flex-1 min-w-0">
              <Suspense key={`${category}-${sort}-${brand}-${page}`} fallback={<ProductGridSkeleton />}>
                <ProductListContainer
                  category={category}
                  sort={sort}
                  brand={brand}
                  variantFilters={variantFilters}
                  page={page}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      {/* <FeaturesSection features={features} /> */}
    </>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-slate-100" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
            <div className="h-8 bg-slate-100 rounded mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

