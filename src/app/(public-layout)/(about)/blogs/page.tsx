import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CalendarDays, Search, Tag, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blogs & Insights | Shopping Cart BD",
  description:
    "Stay updated with the latest trends in global logistics, sourcing, and international trade with Shopping Cart BD.",
  alternates: {
    canonical: "/blogs",
  },
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getBlogs(category?: string) {
  try {
    const url = category
      ? `${API_BASE}/blogs?category=${category}`
      : `${API_BASE}/blogs`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/blog-categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products?category=new-collection&limit=4`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function BlogPost(props: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: selectedCategory } = await props.searchParams;
  const [blogs, categories, products] = await Promise.all([
    getBlogs(selectedCategory),
    getCategories(),
    getProducts()
  ]);

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-2 md:px-4  py-4 md:py-8">
          <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold mb-3">
            Journal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {selectedCategory ? (
              <>
                Insights on{" "}
                <span className="text-orange-500">{selectedCategory}</span>
              </>
            ) : (
              "Blogs & Insights"
            )}
          </h1>
          <p className="mt-2 text-gray-500 text-sm max-w-xl">
            Trends, guides, and stories on global logistics, sourcing, and
            international trade.
          </p>
        </div>
      </section>

      {/* Body */}
      <div className=" container mx-auto px-2 md:px-4  py-4 md:py-8 ">
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-10">
          {/* ── Main Feed ── */}
          <div className="flex-1 min-w-0">
            {/* Filter bar */}
            <div className="flex items-center justify-between">

              {selectedCategory && (
                <Link
                  href="/blogs"
                  className="text-xs font-medium text-orange-500 hover:text-orange-600 underline underline-offset-2 transition-colors"
                >
                  Clear filter
                </Link>
              )}
            </div>

            {/* Articles */}
            {blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                  <Tag className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-700">
                  No articles found
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Try a different category or check back later.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {blogs.map((blog: any, idx: number) => (
                  <article
                    key={blog._id}
                    className="py-8 first:pt-0 last:pb-0 group"
                  >
                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                      {/* Thumbnail */}
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="sm:w-52 lg:w-60 flex-shrink-0"
                      >
                        <div className="aspect-[4/3] sm:aspect-[3/2] relative rounded-xl overflow-hidden bg-gray-100">
                          <Image
                            src={
                              blog.thumbnail &&
                                (blog.thumbnail.startsWith("http") ||
                                  blog.thumbnail.startsWith("/"))
                                ? blog.thumbnail
                                : "/blog/blog1.png"
                            }
                            fill
                            alt={blog.title}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 240px, 320px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
                            <span className="inline-flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {blog.author}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {new Date(blog.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                            {blog.category && (
                              <Link
                                href={`/blogs?category=${blog.category}`}
                                className="text-orange-500 font-medium hover:text-orange-600 transition-colors"
                              >
                                {blog.category}
                              </Link>
                            )}
                          </div>

                          {/* Title */}
                          <h2 className="text-base md:text-lg font-bold text-gray-900 leading-snug group-hover:text-orange-500 transition-colors mb-2">
                            <Link href={`/blogs/${blog.slug}`}>
                              {blog.title}
                            </Link>
                          </h2>

                          {/* Excerpt */}
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {blog.content.replace(/<[^>]*>/g, "")}
                          </p>
                        </div>

                        {/* CTA */}
                        <div className="mt-4">
                          <Link
                            href={`/blogs/${blog.slug}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors group/link"
                          >
                            Read article
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-3 md:space-y-6">
            {/* New Arrivals Section - Added above search */}
            {products.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl  p-2 md:p-4  shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center justify-between">
                  New Arrivals
                  <Link href="/shop/new-collection" className="text-[10px] text-orange-500 font-bold hover:underline uppercase tracking-wider">
                    View All
                  </Link>
                </h3>
                <div className="space-y-4">
                  {products.map((p: any) => (
                    <Link key={p._id} href={`/products/${p.url_handle || p._id}`} className="flex items-center gap-3 group">
                      <div className="w-14 h-14 shrink-0 relative rounded-lg overflow-hidden bg-gray-50 border border-gray-50">
                        <Image src={p.thumbnail || "/logo.png"} fill alt={p.product_title} sizes="80px" className="object-cover transition-transform group-hover:scale-110" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-orange-500 transition-colors">
                          {p.product_title}
                        </p>
                        <p className="text-xs font-black text-gray-900 mt-1">৳{(p.product_price || 0).toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Search */}
            <div className="bg-white border border-gray-100 rounded-xl  p-2 md:p-4  shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Search
              </h3>
              <div className="relative flex">
                <Input
                  placeholder="Type a keyword…"
                  className="rounded-r-none border-r-0 bg-gray-50 text-sm focus-visible:ring-orange-400 placeholder:text-gray-400"
                />
                <Button
                  size="icon"
                  className="rounded-l-none bg-orange-500 hover:bg-orange-600 text-white flex-shrink-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-100 rounded-xl  p-2 md:p-4  shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Categories
              </h3>
              {categories.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  No categories yet.
                </p>
              ) : (
                <ul className="space-y-1">
                  {categories.map((cat: any) => {
                    const isActive = selectedCategory === cat.name;
                    return (
                      <li key={cat._id}>
                        <Link
                          href={`/blogs?category=${cat.name}`}
                          className={`flex items-center justify-between  p-2  border-b border-gray-100 rounded-lg text-sm font-medium transition-colors
                            ${isActive
                              ? "bg-orange-100 text-orange-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                          <span>{cat.name}</span>
                          <ArrowRight
                            className={`w-3.5 h-3.5 transition-transform ${isActive
                              ? "text-orange-500"
                              : "text-gray-300 group-hover:text-gray-500"
                              }`}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}