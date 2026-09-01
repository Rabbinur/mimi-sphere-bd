"use client";

import { useFeaturedProductQuery } from "@/components/Redux/RTK/productApi";
import { ItemCardClient as ItemCard } from "@/components/ui/ItemCardClient";
import { TProduct } from "@/types";

const RECENT_PRODUCTS = [
    { id: 1, price: 79, oldPrice: 160, discount: 51 },
    { id: 2, price: 89, oldPrice: 300, discount: 70 },
    { id: 3, price: 69, oldPrice: 126, discount: 45 },
    { id: 4, price: 99, oldPrice: 200, discount: 50 },
    { id: 5, price: 99, oldPrice: 200, discount: 50 },
    { id: 6, price: 99, oldPrice: 200, discount: 50 },
];

export default function RecentlyViewed() {

    const { data, isLoading } = useFeaturedProductQuery(undefined);
    const products: TProduct[] = data?.data || [];
    const suggestedProducts = products.slice(0, 4);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-800">Recently Added</h3>


            </div>

            {/* 2. Product Recommendations Section */}
            <div className="max-w-7xl mx-auto ">

                {isLoading ? (
                    // Simple Skeleton Loader
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl h-[300px] animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-6">
                        {suggestedProducts.map((product) => (
                            <ItemCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>


        </div>
    );
}
