import { getCollections } from "@/lib/server-api";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Collections | Mimi Sphere",
  description: "Explore our curated collections — from Eid specials to seasonal picks and best sellers at Mimi Sphere Bangladesh.",
  alternates: { canonical: "https://www.mimisphere.com/collections" },
};

const GRADIENT_FALLBACKS = [
  "from-violet-900 via-purple-800 to-indigo-900",
  "from-rose-900 via-pink-800 to-orange-800",
  "from-emerald-900 via-teal-800 to-cyan-900",
  "from-amber-900 via-orange-800 to-yellow-800",
  "from-sky-900 via-blue-800 to-indigo-900",
  "from-slate-900 via-gray-800 to-zinc-900",
  "from-fuchsia-900 via-purple-800 to-pink-900",
  "from-lime-900 via-green-800 to-emerald-900",
];

export default async function CollectionsPage() {
  const data = await getCollections(50);
  const allCollections: any[] = data?.collections ?? (Array.isArray(data) ? data : []);
  const activeCollections = allCollections.filter((c) => c.isActive !== false);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16 antialiased">
      {/* Page Hero */}
      <div className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-transparent to-purple-950/30" />
        <div className="relative container mx-auto px-4 py-10 sm:py-16">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Curated For You</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
            All Collections
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl">
            Hand-picked collections for every season, occasion, and style — from Eid specials to everyday essentials.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="container mx-auto px-3 sm:px-4 mt-8 sm:mt-12">
        {activeCollections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package className="w-14 h-14 text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">No Collections Yet</h2>
            <p className="text-slate-400 text-sm max-w-xs">
              Our team is curating something special. Check back soon!
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-slate-700 transition-colors"
            >
              Browse All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              {activeCollections.length} collection{activeCollections.length !== 1 ? "s" : ""} available
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {activeCollections.map((col: any, i: number) => {
                const gradient = GRADIENT_FALLBACKS[i % GRADIENT_FALLBACKS.length];
                return (
                  <Link
                    key={col._id}
                    href={`/collections/${col.slug}`}
                    className="group relative overflow-hidden rounded-2xl block h-[220px] sm:h-[260px]"
                  >
                    {/* Background */}
                    {col.bannerImage ? (
                      <img
                        src={col.bannerImage}
                        alt={col.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                    )}

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/75 transition-all duration-300" />
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

                    {/* Shine on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                          Collection
                        </span>
                      </div>

                      <h2 className="text-white font-black text-xl sm:text-2xl leading-tight mb-1.5 group-hover:text-amber-300 transition-colors drop-shadow-md">
                        {col.heroTitle || col.name}
                      </h2>

                      {col.heroDescription && (
                        <p className="text-white/65 text-xs leading-relaxed line-clamp-2 mb-3">
                          {col.heroDescription}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/90 group-hover:text-amber-300 transition-colors">
                          <span>Explore Collection</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
