import Image from "next/image";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getRelatedProducts(categoryId: string) {
  if (!categoryId) return [];
  try {
    const res = await fetch(`${API_BASE}/products/by-category/${categoryId}?limit=6`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.products || [];
  } catch (error) {
    return [];
  }
}

async function getTrendyProducts() {
  try {
    const res = await fetch(`${API_BASE}/products/trendy`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (error) {
    return [];
  }
}

function MiniProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.url_handle}`} className="flex gap-3 group">
      <div className="h-16 w-16 relative bg-gray-50 rounded border border-gray-100 overflow-hidden flex-shrink-0">
        <Image src={product.thumbnail || "/placeholder.svg"} alt="" fill sizes="64px" className="object-cover group-hover:scale-110 transition-transform" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[12px] font-medium text-gray-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {product.product_title}
        </h4>
        <p className="text-[13px] font-bold text-gray-900 mt-1">৳ {product.product_price}</p>
      </div>
    </Link>
  );
}

export default async function SuggestedProducts({
  categoryId,
  currentProductId,
  categorySlug
}: {
  categoryId?: string,
  currentProductId: string,
  categorySlug?: string
}) {
  let sidebarProducts = await getRelatedProducts(categoryId!);
  let sidebarTitle = "Related Products";

  sidebarProducts = sidebarProducts.filter((p: any) => p._id !== currentProductId);

  if (sidebarProducts.length === 0) {
    sidebarProducts = await getTrendyProducts();
    sidebarTitle = "Trending Products";
  }

  const finalSidebarProducts = sidebarProducts.slice(0, 8);

  if (finalSidebarProducts.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-primary rounded-full"></span>
        {sidebarTitle}
      </h3>
      <div className="space-y-6">
        {finalSidebarProducts.map((rp: any) => (
          <MiniProductCard key={rp._id} product={rp} />
        ))}
      </div>

      <Link
        href={`/shop/${categorySlug || ''}`}
        className="mt-8 flex items-center justify-center w-full py-2.5 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-primary transition-all"
      >
        View All Products
      </Link>
    </div>
  );
}
