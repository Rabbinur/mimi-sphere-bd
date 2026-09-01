import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Tag,
  User,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getBlog(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/blogs/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getRelatedProducts(category?: string) {
  try {
    const url = category
      ? `${API_BASE}/products?category=${category}&limit=4`
      : `${API_BASE}/products?limit=4`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getNewCollectionProducts() {
  try {
    const res = await fetch(
      `${API_BASE}/products?category=new-collection&limit=4`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getRecentBlogs(currentSlug: string) {
  try {
    const res = await fetch(`${API_BASE}/blogs?limit=4`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || [])
      .filter((b: any) => b.slug !== currentSlug)
      .slice(0, 3);
  } catch {
    return [];
  }
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

export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Blog Not Found" };

  const title = `${blog.title} | Shopping Cart BD`;
  const plainText = blog.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const description = truncateText(plainText, 155);

  return {
    title,
    description,
    alternates: { canonical: `/blogs/${slug}` },
    openGraph: {
      title,
      description,
      images: blog.thumbnail ? [{ url: blog.thumbnail }] : [],
      type: "article",
    },
  };
}

// ─── Product Spotlight Banner ────────────────────────────────────────────────
function ProductSpotlight({ product }: { product: any }) {
  const price = product.product_price || 0;
  return (
    <div className="my-10 rounded-2xl overflow-hidden border border-pink-100 bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="px-5 pt-4 pb-1">
        <p className="text-[10px] uppercase tracking-widest text-pink-400 font-bold">
          Featured Product
        </p>
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-44 relative aspect-square sm:aspect-auto flex-shrink-0 bg-white">
          <Image
            src={product.thumbnail || "/logo.png"}
            fill
            alt={product.product_title}
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-snug mb-2">
              {product.product_title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.product_description
                ?.replace(/<[^>]*>/g, "")
                .substring(0, 100)}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-lg font-bold text-gray-900">
              ৳{price.toLocaleString()}
            </span>
            <Link
              href={`/products/${product.url_handle || product._id}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-pink-500 hover:bg-pink-600 transition-colors px-4 py-2 rounded-lg"
            >
              Shop Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const [blog, recentBlogs, newCollection] = await Promise.all([
    getBlog(slug),
    getRecentBlogs(slug),
    getNewCollectionProducts(),
  ]);

  if (!blog) notFound();

  const relatedProducts = await getRelatedProducts(blog.category);

  const htmlContent: string = blog.content ?? "";
  const splitAt = Math.floor(htmlContent.length / 2);
  const breakPoint = htmlContent.indexOf("</p>", splitAt);
  const contentFirst =
    breakPoint > -1 ? htmlContent.slice(0, breakPoint + 4) : htmlContent;
  const contentSecond =
    breakPoint > -1 ? htmlContent.slice(breakPoint + 4) : "";

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* ── Breadcrumb bar ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-2 md:px-4  py-4 md:py-8 bg-white">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link
              href="/blogs"
              className="hover:text-gray-600 transition-colors"
            >
              Blogs
            </Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-gray-600 truncate max-w-[180px] md:max-w-sm font-bn">
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="container mx-auto px-2 md:px-4  py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">

          {/* ── Article column ── */}
          <article className="flex-1 min-w-0 w-full">

            {/* Category pill */}
            {blog.category && (
              <Link
                href={`/blogs?category=${blog.category}`}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-pink-500 bg-pink-50 border border-pink-100 px-3 py-1 rounded-full mb-4 hover:bg-pink-100 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {blog.category}
              </Link>
            )}

            {/* Title */}
            <h1 className="blog-content text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4 font-bn">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400 py-2 border-b border-gray-100 mb-4">
              <span className="inline-flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {blog.author}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Hero image */}
            {blog.thumbnail && (
              <div className="aspect-video relative rounded-2xl overflow-hidden mb-8 shadow-sm">
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content — first half */}
            <div
              className="blog-content prose prose-base md:prose-lg max-w-none text-gray-700 leading-relaxed
                prose-headings:font-bold prose-headings:text-gray-900
                prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-sm
                prose-blockquote:border-l-pink-400 prose-blockquote:bg-pink-50
                prose-blockquote:rounded-r-lg prose-blockquote:py-1"
              dangerouslySetInnerHTML={{ __html: contentFirst }}
            />

            {/* Mid-article product spotlight */}
            {relatedProducts.length > 0 && (
              <ProductSpotlight product={relatedProducts[0]} />
            )}

            {/* Content — second half */}
            {contentSecond && (
              <div
                className="blog-content prose prose-base md:prose-lg max-w-none text-gray-700 leading-relaxed
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:shadow-sm
                  prose-blockquote:border-l-pink-400 prose-blockquote:bg-pink-50
                  prose-blockquote:rounded-r-lg prose-blockquote:py-1"
                dangerouslySetInnerHTML={{ __html: contentSecond }}
              />
            )}
          </article>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6 lg:sticky lg:top-6 self-start">

            {/* New Arrivals */}
            {newCollection.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-pink-500" />
                  New Arrivals
                </h3>
                <div className="divide-y divide-gray-50">
                  {newCollection.map((product: any) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.url_handle || product._id}`}
                      className="flex items-center gap-3 group py-3 first:pt-0 last:pb-0"
                    >
                      <div className="w-14 h-14 flex-shrink-0 relative rounded-xl overflow-hidden bg-gray-50">
                        <Image
                          src={
                            product.thumbnail || "/logo.png"
                          }
                          fill
                          alt={product.product_title}
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 line-clamp-2 group-hover:text-pink-500 transition-colors leading-snug">
                          {product.product_title}
                        </p>
                        <p className="text-xs font-bold text-gray-900 mt-1">
                          ৳{(product.product_price || 0).toLocaleString()}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 group-hover:text-pink-500 transition-colors" />
                    </Link>
                  ))}
                </div>
                <Link
                  href="/shop/new-collection"
                  className="mt-5 w-full flex items-center justify-center gap-2 text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 transition-colors py-2.5 rounded-xl"
                >
                  View Collection <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Recent Articles */}
            {recentBlogs.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4">
                  Read Next
                </h3>
                <ul className="divide-y divide-gray-50">
                  {recentBlogs.map((rb: any) => (
                    <li key={rb._id} className="py-3 first:pt-0 last:pb-0">
                      <Link
                        href={`/blogs/${rb.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
                          <Image
                            src={rb.thumbnail || "/blog/blog1.png"}
                            fill
                            alt={rb.title}
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                            {new Date(rb.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </p>
                          <p className="text-xs font-semibold text-gray-700 line-clamp-2 group-hover:text-pink-500 transition-colors leading-snug">
                            {rb.title}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}