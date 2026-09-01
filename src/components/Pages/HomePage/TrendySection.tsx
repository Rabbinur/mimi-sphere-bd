"use client";

import useIsMobile from "@/components/hooks/useIsMobile";
import { ItemCardClient as ItemCard } from "@/components/ui/ItemCardClient";
import TitleBadge from "@/components/ui/TitleBadge";
import { TProduct } from "@/types";
import { Timer } from "lucide-react";
import Image from "next/image";

interface TrendySectionProps {
  products?: TProduct[];
}

const TrendySection = ({ products }: TrendySectionProps) => {
  const isMobile = useIsMobile()
  return (
    <section className="container mx-auto px-2 md:px-4">
      <div className="bg-white rounded-sm overflow-hidden border border-gray-100 ">
        {/* 🔹 Header with Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-2 md:p-4 bg-white border-b border-gray-100 gap-4">
          <div className="flex items-center gap-2 text-red-700 font-bold uppercase tracking-tight">
            <Timer size={20} className="animate-pulse" />
            <h2 className="text-sm md:text-base font-bold uppercase tracking-tight">
              <TitleBadge title="Trending Now" />
            </h2>
          </div>
        </div>

        {/* 🔹 Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
          {/* <div className="  lg:col-span-1 relative  min-h-[80px] md:min-h-[300px] lg:min-h-full rounded-md overflow-hidden group">
                        <Image
                            src={isMobile ? "/assets/hot-deals-sm.png" : "/assets/hot-deals.png"}
                            alt="Promotion Banner"
                            fill
                            sizes="(max-width: 1024px) 100vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            priority
                            fetchPriority="high"
                        />
                    </div> */}
          {/* Left Side: Big Promotion Banner */}
          <div className="   lg:col-span-1 relative  min-h-[80px] md:min-h-[300px] lg:min-h-full overflow-hidden group">
            <Image
              src={isMobile ? "/assets/hot-deals-sm.png" : "/assets/treandings.png"}
              alt="Promotion Banner"
              fill
              sizes="(max-width: 1024px) 100vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>

          {/* Right Side: Product Grid (4 items) */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products?.length === 0
              ? <>

              </>
              : products?.slice(0, 4).map((product: TProduct) => (
                <div key={product._id} className="border-l border-b md:border-b-0 border-gray-100">
                  <ItemCard product={product} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendySection;