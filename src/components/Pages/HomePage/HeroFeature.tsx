import { THeroFeature } from "@/types";
import Image from "next/image";
import Link from "next/link";

const defaultFeatures: THeroFeature[] = [
    {
        title: "New summer Fashion",
        subtitle: "Handbag",
        image: "/hero/right-1.png",
        link: "/shop",
    },
    {
        title: "Vibrant Avocado Hand Cream",
        subtitle: "Cream",
        image: "/hero/right-2.png",
        link: "/shop",
    }
];

export const HeroFeature = ({ features }: { features?: THeroFeature[] }) => {
    const displayFeatures = features?.length ? features : defaultFeatures;

    return (
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4 h-auto">
            {displayFeatures.map((feature, idx) => (
                <Link
                    key={idx}
                    href={feature.link || "#"}
                    aria-label={`View details for ${feature.title}`}
                    className="relative rounded-lg overflow-hidden min-h-[100px] sm:min-h-[140px] lg:flex-1 p-4 sm:p-6 group"
                >
                    <div className="relative z-10 text-primary">
                        <h2 className="text-[12px] sm:text-xl font-bold leading-tight w-[100px] sm:w-full">
                            {feature.title}
                        </h2>
                        <p className="text-secondary text-[11px] sm:text-sm font-bold mb-1">
                            {feature.subtitle}
                        </p>
                    </div>
                    <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>
            ))}
        </div>
    );
};