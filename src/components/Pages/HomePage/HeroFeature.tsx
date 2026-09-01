import { THeroFeature } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const defaultFeatures: THeroFeature[] = [
    {
        title: "Smart Kids Gadgets",
        subtitle: "LCD Drawing & Learning Tablets 📱",
        image: "/hero/kids-gadget-tablet.jpg",
        link: "/shop",
    },
    {
        title: "Creative STEM Toys",
        subtitle: "Montessori & Sensory Play Kits 🧸",
        image: "/hero/banner-kids-2.jpg",
        link: "/shop",
    }
];

export const HeroFeature = ({ features }: { features?: THeroFeature[] }) => {
    const displayFeatures = features?.length ? features : defaultFeatures;

    return (
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4 h-full">
            {displayFeatures.slice(0, 2).map((feature, idx) => (
                <Link
                    key={idx}
                    href={feature.link || "/shop"}
                    aria-label={`View details for ${feature.title}`}
                    className="relative overflow-hidden rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 group shadow-md border border-slate-100 bg-slate-900 flex flex-col justify-between min-h-[130px] sm:min-h-[160px] lg:h-full"
                >
                    {/* Background Product Image */}
                    <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                    />

                    {/* Scrim Gradient for crystal clear text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

                    {/* Top Tag */}
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                            <Sparkles className="w-2.5 h-2.5" />
                            {idx === 0 ? "Smart Tech" : "Creative Play"}
                        </span>
                    </div>

                    {/* Bottom Content */}
                    <div className="relative z-10 mt-auto pt-4">
                        <h2 className="text-sm sm:text-base md:text-lg font-black text-white leading-tight drop-shadow-md line-clamp-1 group-hover:text-amber-300 transition-colors">
                            {feature.title}
                        </h2>
                        <p className="text-[11px] sm:text-xs font-semibold text-slate-200 drop-shadow line-clamp-1 mt-0.5 mb-2">
                            {feature.subtitle}
                        </p>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
                            <span>Shop Now</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
