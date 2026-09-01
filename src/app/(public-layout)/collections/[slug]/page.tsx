import ProductCard from "@/components/ui/ProductCard";
import { getCollectionBySlug } from "@/lib/server-api";
import { ChevronDown, HelpCircle, ShoppingBag, Sparkles } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: "Collection Not Found | Shopping Cart BD",
    };
  }

  const title = collection.metaTitle || `${collection.name} Collection | Shopping Cart BD`;
  const description = collection.metaDescription || `Explore our curated selection in the ${collection.name} collection on Shopping Cart BD.`;
  const keywords = collection.metaKeywords ? collection.metaKeywords.split(",").map((k: string) => k.trim()) : [collection.name, "collection", "trendy"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://www.shoppingcart.bd/collections/${collection.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.shoppingcart.bd/collections/${collection.slug}`,
      siteName: "Shopping Cart BD",
      images: [
        {
          url: collection.ogImage || collection.bannerImage || "https://www.shoppingcart.bd/og-image.jpg",
          alt: collection.name,
        },
      ],
      type: "website",
    },
  };
}

export default async function CollectionSlugPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection || collection.isActive === false) {
    notFound();
  }

  const products = collection.products || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10 sm:pb-20 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[160px] sm:h-[300px] bg-slate-950 overflow-hidden flex items-center">
        {collection.bannerImage ? (
          <>
            <img
              src={collection.bannerImage}
              alt={collection.name}
              className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900" />
        )}

        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 container mx-auto px-4 w-full">
          <div className="max-w-3xl space-y-1.5 sm:space-y-3">
            <h1 className="text-xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md uppercase">
              {collection.heroTitle || collection.name}
            </h1>
            {collection.heroDescription && (
              <p className="text-xs sm:text-base md:text-lg text-slate-200 font-normal max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none drop-shadow-sm">
                {collection.heroDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-3 sm:px-4 mt-5 sm:mt-10 space-y-8 sm:space-y-14">

        {/* Rich Text CMS Description */}
        {collection.content && (
          <section className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
            <div className="flex items-center gap-2 mb-2.5 sm:mb-4 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight">
                About This Collection
              </h2>
            </div>
            <div
              className="prose prose-slate max-w-none text-slate-600 text-xs sm:text-sm leading-relaxed prose-p:my-1.5 sm:prose-p:my-3 prose-strong:text-slate-900 prose-ul:my-2 prose-li:my-0.5"
              dangerouslySetInnerHTML={{ __html: collection.content }}
            />
          </section>
        )}

        {/* Product Grid Section */}
        <section className="space-y-4">
          <div className="flex items-end justify-between border-b border-slate-200/80 pb-2.5 sm:pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-900 hidden sm:block" />
              <h2 className="text-base sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                Collection Products
              </h2>
            </div>
            <span className="text-xxs sm:text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 sm:py-1 rounded-full">
              {products.length} {products.length === 1 ? 'item' : 'items'}
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
            <div className="bg-white rounded-xl sm:rounded-2xl border border-dashed border-slate-200 p-8 sm:p-16 text-center text-slate-400 text-xs sm:text-base font-medium">
              No products found in this collection.
            </div>
          )}
        </section>

        {/* FAQs Accordion */}
        {collection.FAQs && collection.FAQs.length > 0 && (
          <section className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5 sm:pb-4">
              <HelpCircle className="w-5 h-5 text-slate-900 hidden sm:block" />
              <h2 className="text-base sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                Questions & Answers
              </h2>
            </div>
            <div className="divide-y divide-slate-100 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
              {collection.FAQs.map((faq: any, idx: number) => (
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
      </div>
    </div>
  );
}