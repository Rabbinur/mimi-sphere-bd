import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SuggestedProducts from "../_components/SuggestedProducts";
import ProductClient from "./ProductClient";

/* ─── API helper ─── */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getProduct(slug: string) {
  const res = await fetch(`${API_BASE}/products/slug/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.product ?? null;
}

function truncateText(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const truncated = text.slice(0, limit);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + "...";
  }
  return truncated + "...";
}

/* ─── Dynamic Metadata (SEO) ─── */

type PageProps = { params: Promise<{ slug: string }> };
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found | Mimi Sphere" };
  }

  const title = `${product.product_title} | Mimi Sphere`;
  const description = truncateText(
    `Buy ${product.product_title} online at Mimi Sphere Bangladesh. 100% authentic, cash on delivery & fast shipping. Order now!`,
    155
  );
  const image = product.thumbnail;

  return {
    title,
    description,
    keywords: [
      product.product_title,
      product?.product_categories?.[0]?.name,
      "mimi sphere",
      "authentic cosmetics",
    ].filter(Boolean),
    alternates: {
      canonical: `https://www.mimisphere.com/products/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.mimisphere.com/products/${slug}`,
      siteName: "Mimi Sphere",
      images: image ? [{ url: image, width: 800, height: 800, alt: product.product_title }] : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

/* ─── JSON-LD Structured Data ─── */

function ProductJsonLd({ product }: { product: any }) {
  const hasReviews =
    product.total_reviews &&
    product.total_reviews > 0 &&
    product.average_rating &&
    product.average_rating > 0;

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.product_title,
    image: [product.thumbnail, ...(product.product_images || [])].filter(Boolean),
    description: product.product_description?.replace(/<[^>]*>/g, "").slice(0, 500) || "",
    sku: product.sku || product._id,
    brand: product.product_vendor ? { "@type": "Brand", name: product.product_vendor } : undefined,
    category: product.product_categories?.[0]?.name,
    offers: {
      "@type": "Offer",
      url: `https://www.mimisphere.com/products/${product.url_handle || product.slug}`,
      priceCurrency: "BDT",
      price: product.product_price,
      availability: product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  if (hasReviews) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(product.average_rating),
      reviewCount: String(product.total_reviews),
    };
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

/* ─── Page (Server Component) ─── */

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const categoryId = product.product_categories?.[0]?._id;

  return (
    <div className="bg-white min-h-screen">
      <ProductJsonLd product={product} />

      {/* Breadcrumb */}
      <div className="hidden sm:block border-b border-gray-100">
        <div className="container mx-auto px-3 py-2">
          <div className="flex items-center text-xs text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer transition-colors">Home</span>
            <ChevronRight className="h-3 w-3 mx-1 text-gray-300" />
            <Link href={`/shop/${product?.product_categories?.[0]?.slug}`}>
              <span className="hover:text-gray-700 cursor-pointer transition-colors text-xs">
                {product?.product_categories?.[0]?.name || "Category"}
              </span>
            </Link>
            <ChevronRight className="h-3 w-3 mx-1 text-gray-300" />
            <span className="text-gray-900 font-medium truncate text-pretty text-xs">
              {product?.product_title}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 md:px-3 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-8 ">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <ProductClient product={product} />

            {/* Mobile/Tablet Suggested Products */}
            <div className="mt-12 lg:hidden border-t pt-8 pb-10">
              <SuggestedProducts
                categoryId={categoryId}
                currentProductId={product._id}
                categorySlug={product.product_categories?.[0]?.slug}
              />
            </div>
          </div>

          {/* Desktop Sidebar Suggested Products */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <SuggestedProducts
                categoryId={categoryId}
                currentProductId={product._id}
                categorySlug={product.product_categories?.[0]?.slug}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
