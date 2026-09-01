"use client";

import { Badge } from "@/components/ui/badge";
import useEmblaCarousel from "embla-carousel-react";
import { Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export interface RecentOrder {
    _id: string;
    order_id: string;
    products: any[];
    total_price: number;
    order_status: string;
    createdAt: string;
}

interface RecentOrderSliderProps {
    recentOrders: RecentOrder[];
}

export default function RecentOrderSlider({ recentOrders }: RecentOrderSliderProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on("select", onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    if (!recentOrders || recentOrders.length === 0) {
        return null;
    }

    return (
        <div className="mt-2 bg-white">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                <Truck className="h-5 w-5 text-gray-500" />
                <span className="text-[15px] font-medium text-gray-700">Track Orders</span>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {recentOrders.map((order) => {
                        const firstProduct = order.products[0] || {};
                        const statusMap: Record<string, string> = {
                            "delivered": "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100",
                            "canceled": "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100",
                            "shipped": "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100",
                            "processing": "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
                            "pending": "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100",
                            "failed_delivery": "bg-orange-50 text-orange-800 border-orange-100 hover:bg-orange-100",
                            "out_for_delivery": "bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100",
                            "returned": "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100",
                        };

                        const statusColor =
                            statusMap[order.order_status] ||
                            "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100";

                        return (
                            <div key={order._id} className="flex-[0_0_100%] min-w-0 p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[13px] text-gray-500 truncate max-w-[200px]">
                                        Order No: # {order.order_id}
                                    </span>
                                    <Link
                                        href={`/user-account/orders/${order.order_id}`}
                                        className="text-[13px] text-blue-500 font-medium"
                                    >
                                        View Details
                                    </Link>
                                </div>

                                <div className="flex gap-4">
                                    <div className="h-20 w-20 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden relative flex-shrink-0">
                                        <Image
                                            src={firstProduct.thumbnail || "/placeholder.svg"}
                                            alt={firstProduct.title || "Product"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[13px] text-gray-700 leading-snug line-clamp-2 mb-1 font-medium">
                                            {firstProduct.title}
                                            {order.products.length > 1 && ` (+${order.products.length - 1} more)`}
                                        </h4>
                                        <p className="text-[13px] text-gray-400 mb-1">
                                            ৳ {firstProduct.price?.toLocaleString()} x {firstProduct.quantity} (qty)
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-900 text-base">
                                                ৳ {order.total_price?.toLocaleString()}
                                            </span>
                                            <Badge className={`rounded-sm shadow-none  text-[11px] font-bold px-2.5 py-1 border ${statusColor}`}>
                                                {order.order_status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination Dots */}
            {scrollSnaps.length > 1 && (
                <div className="flex justify-center gap-1.5 pb-5">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi?.scrollTo(index)}
                            className={`h-1 transition-all duration-300 rounded-full ${index === selectedIndex ? "w-5 bg-primary" : "w-5 bg-gray-200"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
