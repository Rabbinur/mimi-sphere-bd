import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface CollectionCardProps {
    collection: any;
    index: number;
}

const GRADIENT_FALLBACKS = [
    "from-violet-900 via-purple-800 to-indigo-900",
    "from-rose-900 via-pink-800 to-orange-800",
    "from-emerald-900 via-teal-800 to-cyan-900",
    "from-amber-900 via-orange-800 to-yellow-800",
    "from-sky-900 via-blue-800 to-indigo-900",
    "from-slate-900 via-gray-800 to-zinc-900",
];

function CollectionCard({ collection, index }: CollectionCardProps) {
    const gradient = GRADIENT_FALLBACKS[index % GRADIENT_FALLBACKS.length];

    return (
        <Link
            href={`/collections/${collection.slug}`}
            className="group relative overflow-hidden rounded-2xl block h-full min-h-[160px] sm:min-h-[200px]"
        >
            {/* Background image or gradient */}
            {collection.bannerImage ? (
                <img
                    src={collection.bannerImage}
                    alt={collection.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-300" />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-5">
                {/* Badge */}
                <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                        Collection
                    </span>
                </div>

                {/* Name */}
                <h3 className="text-white font-black text-lg sm:text-xl leading-tight mb-1.5 group-hover:text-amber-300 transition-colors drop-shadow-md">
                    {collection.heroTitle || collection.name}
                </h3>

                {/* Description */}
                {collection.heroDescription && (
                    <p className="text-white/70 text-xs leading-relaxed line-clamp-2 mb-3 hidden sm:block">
                        {collection.heroDescription}
                    </p>
                )}

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-white/90 group-hover:text-amber-300 transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>

            {/* Hover shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        </Link>
    );
}

interface CollectionsSectionProps {
    collections: any[];
}

export default function CollectionsSection({ collections }: CollectionsSectionProps) {
    // Only active collections
    const activeCollections = collections?.filter((c: any) => c.isActive !== false) ?? [];

    if (activeCollections.length === 0) return null;

    // Layout: first collection is large, rest are smaller
    const [featured, ...rest] = activeCollections;

    return (
        <section className="container mx-auto px-3 sm:px-4">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
                    <h2 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                        Featured Collections
                    </h2>
                </div>
                <Link
                    href="/collections"
                    className="text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1 group"
                >
                    View All
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Grid Layout */}
            {activeCollections.length === 1 ? (
                // Single collection — full width
                <div className="h-[200px] sm:h-[260px]">
                    <CollectionCard collection={featured} index={0} />
                </div>
            ) : activeCollections.length === 2 ? (
                // Two collections — equal split
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-[320px] sm:h-[220px]">
                    {activeCollections.map((col, i) => (
                        <CollectionCard key={col._id} collection={col} index={i} />
                    ))}
                </div>
            ) : (
                // 3+ collections — featured large + rest smaller
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Featured (large) */}
                    <div className="sm:col-span-2 lg:col-span-1 h-[200px] sm:h-[240px]">
                        <CollectionCard collection={featured} index={0} />
                    </div>
                    {/* Rest */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {rest.slice(0, 4).map((col, i) => (
                            <div key={col._id} className="h-[160px] sm:h-auto sm:min-h-[110px]">
                                <CollectionCard collection={col} index={i + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
