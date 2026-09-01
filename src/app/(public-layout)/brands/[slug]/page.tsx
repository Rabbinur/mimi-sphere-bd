import ProductCard from "@/components/ui/ProductCard";
import { getBrandBySlug } from "@/lib/server-api";
import { BookOpen, ChevronDown, ChevronRight, HelpCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return {
      title: "Brand Not Found | Mimi Sphere",
    };
  }

  const title = brand.metaTitle || `${brand.name} Products | Mimi Sphere`;
  const description = brand.metaDescription || `Shop authentic products from ${brand.name} at Mimi Sphere. Find skincare, cosmetics, and lifestyle essentials.`;
  const keywords = brand.metaKeywords ? brand.metaKeywords.split(",").map((k: string) => k.trim()) : [brand.name, "korean cosmetics", "authentic", "mimi sphere"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://www.mimisphere.com/brands/${brand.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.mimisphere.com/brands/${brand.slug}`,
      siteName: "Mimi Sphere",
      images: [
        {
          url: brand.ogImage || brand.logoUrl || "https://www.mimisphere.com/og.png",
          alt: brand.name,
        },
      ],
      type: "website",
    },
  };
}

export default async function BrandSlugPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand || brand.isActive === false) {
    notFound();
  }

  let products = brand.featuredProducts || [];
  if (products.length === 0) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?brand=${encodeURIComponent(brand.name)}&limit=40`,
        { next: { revalidate: 60 } }
      );
      if (res.ok) {
        const json = await res.json();
        products = json.data || [];
      }
    } catch (err) {
      console.error("Error fetching fallback brand products:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10 sm:pb-20 antialiased selection:bg-indigo-600 selection:text-white">
      {/* Brand Hero Cover Banner */}
      <div className="relative w-full h-[180px] sm:h-[320px] bg-slate-950 overflow-hidden flex items-center">
        {brand.coverImage ? (
          <>
            <img
              src={brand.coverImage}
              alt={brand.name}
              className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-blue-950 to-slate-900" />
        )}

        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 container mx-auto px-3 sm:px-4 w-full">
          <div className="flex items-center gap-3 sm:gap-6">
            {brand.logoUrl && (
              <div className="w-14 h-14 sm:w-28 sm:h-28 bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-3 shadow-xl flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div className="space-y-0.5 sm:space-y-2 max-w-xl">
              <h1 className="text-base sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-sm ">
                {brand.heroTitle || brand.name}
              </h1>
              {brand.heroDescription && (
                <p className="text-xxs sm:text-base text-slate-200 font-normal leading-relaxed line-clamp-2 sm:line-clamp-none drop-shadow-sm">
                  {brand.heroDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container mx-auto px-3 sm:px-4 mt-5 sm:mt-10 space-y-8 sm:space-y-14">

        {/* Rich Text CMS Brand Description */}
        {brand.content && (
          <section className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
            <div className="flex items-center gap-2 mb-2.5 sm:mb-4 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight">
                About {brand.name}
              </h2>
            </div>
            <div
              className="prose prose-slate max-w-none text-slate-600 text-xs sm:text-sm leading-relaxed prose-p:my-1.5 sm:prose-p:my-3 prose-strong:text-slate-900 prose-ul:my-2 prose-li:my-0.5"
              dangerouslySetInnerHTML={{ __html: brand.content }}
            />
          </section>
        )}

        {/* Product Grid Section */}
        <section className="space-y-4">
          <div className="flex items-end justify-between border-b border-slate-200/80 pb-2.5 sm:pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-slate-900 hidden sm:block" />
              <h2 className="text-base sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                {brand.name} Collection
              </h2>
            </div>
            <span className="text-xxs sm:text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 sm:py-1 rounded-full">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-5">
              {products.map((prod: any, idx: number) => (
                <div
                  key={`${prod._id}-${idx}`}
                  className="bg-white rounded-lg sm:rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200"
                >
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 sm:p-16 text-center text-slate-400 text-xs sm:text-base font-medium">
              No products found in this brand collection.
            </div>
          )}
        </section>

        {/* FAQs Section */}
        {brand.FAQs && brand.FAQs.length > 0 && (
          <section className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5 sm:pb-4">
              <HelpCircle className="w-5 h-5 text-slate-900 hidden sm:block" />
              <h2 className="text-base sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="divide-y divide-slate-100 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
              {brand.FAQs.map((faq: any, idx: number) => (
                <details
                  key={idx}
                  className="group cursor-pointer transition-all duration-200"
                >
                  <summary className="flex items-center justify-between text-xs sm:text-base font-bold text-slate-800 list-none p-3.5 sm:p-5 hover:bg-slate-50/60 select-none">
                    <span className="pr-4 tracking-tight">{faq.question}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 transition-transform duration-300 ease-out group-open:rotate-180 group-open:text-indigo-600" />
                  </summary>
                  <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 text-slate-600 text-xxs sm:text-sm leading-relaxed bg-slate-50/30">
                    <div className="border-t border-slate-100/80 pt-2.5 sm:pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Articles & Buying Guides Grid */}
        {brand.featuredBlogs && brand.featuredBlogs.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5 sm:pb-4">
              <BookOpen className="w-5 h-5 text-slate-900 hidden sm:block" />
              <h2 className="text-base sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                Related Articles & Guides
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {brand.featuredBlogs.map((blog: any) => (
                <article
                  key={blog._id}
                  className="group bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  {blog.thumbnail && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      />
                    </div>
                  )}
                  <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-xs sm:text-base font-bold text-slate-900 line-clamp-2 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-slate-400 text-xxs sm:text-xs font-medium">
                        By {blog.author || "Admin"} • {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 w-fit transition-colors group/link"
                    >
                      Read Article
                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}