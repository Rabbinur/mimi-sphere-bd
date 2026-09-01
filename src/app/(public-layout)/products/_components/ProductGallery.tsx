"use client";

import { getProxiedUrl } from "@/lib/utils";
import type { TProduct } from "@/types";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";


type Props = {
    product: TProduct;
    selectedImage?: string;
};

export default function ProductGallery({ product, selectedImage }: Props) {
    const images = useMemo(() => {
        return Array.from(
            new Set([product.thumbnail, ...(product.product_images || [])])
        )
            .filter(Boolean)
            .map(getProxiedUrl) as string[];
    }, [product.thumbnail, product.product_images]);

    const [activeImage, setActiveImage] = useState(images[0]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);

    // থাম্বনেইল কন্টেইনারের জন্য রেফারেন্স
    const thumbnailRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedImage) setActiveImage(selectedImage);
    }, [selectedImage]);

    // অ্যাক্টিভ ইমেজ চেঞ্জ হলে থাম্বনেইলকে স্ক্রল করে সামনে নিয়ে আসবে
    useEffect(() => {
        const activeThumb = document.getElementById(`thumb-${images.indexOf(activeImage)}`);
        if (activeThumb && thumbnailRef.current) {
            activeThumb.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
            });
        }
    }, [activeImage, images]);

    const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    const preventCapture = (e: React.MouseEvent | React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-start select-none w-full">

            {/* 1. Side Thumbnails - Fixed Height with Scroll for many images */}
            <div
                ref={thumbnailRef}
                className={clsx(
                    "flex lg:flex-col gap-3 w-full lg:w-20 overflow-x-auto lg:overflow-y-auto no-scrollbar py-1 scroll-smooth",
                    "lg:max-h-[640px] max-h-[80px]"
                )}
            >
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        id={`thumb-${idx}`}
                        onMouseEnter={() => setActiveImage(img)}
                        onClick={() => setActiveImage(img)}
                        onContextMenu={preventCapture}
                        className={clsx(
                            "relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded overflow-hidden border transition-all duration-200 scroll-mt-2",
                            activeImage === img ? "border-primary shadow-md" : "border-gray-100 hover:border-gray-300"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`thumb-${idx}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                            onDragStart={preventCapture}
                        />
                        {activeImage === img && (
                            <div className="absolute inset-0 border border-primary z-10" />
                        )}
                    </button>
                ))}
            </div>

            {/* 2. Main Image Container */}
            <div className="relative flex-1 w-full group" onContextMenu={preventCapture}>
                <div
                    onMouseMove={handleMove}
                    onTouchMove={handleMove}
                    onMouseEnter={() => setShowZoom(true)}
                    onMouseLeave={() => setShowZoom(false)}
                    onTouchStart={() => setShowZoom(true)}
                    onTouchEnd={() => setShowZoom(false)}
                    className="relative aspect-square w-full bg-white border border-gray-100 rounded overflow-hidden cursor-crosshair touch-pan-y"
                >
                    <div
                        key={activeImage}
                        className={clsx(
                            "relative h-full w-full transition-opacity duration-300 ease-in-out",
                            "opacity-100"
                        )}
                    >
                        <Image
                            src={activeImage}
                            alt={product.product_title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                            className={clsx(
                                "object-contain p-2 transition-opacity duration-300",
                                showZoom ? "opacity-0 lg:opacity-100" : "opacity-100"
                            )}
                            onDragStart={preventCapture}
                        />

                        {/* Mobile Inner Zoom */}
                        {showZoom && (
                            <div
                                className="absolute inset-0 lg:hidden block"
                                style={{
                                    backgroundImage: `url(${activeImage})`,
                                    backgroundSize: "220%",
                                    backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                                    backgroundRepeat: "no-repeat"
                                }}
                            />
                        )}
                    </div>

                    {/* Lens (Desktop) */}
                    {showZoom && (
                        <div
                            className="absolute hidden lg:block border border-gray-300 bg-black/5 pointer-events-none"
                            style={{
                                width: "35%",
                                height: "35%",
                                left: `${mousePos.x}%`,
                                top: `${mousePos.y}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    )}

                    {/* Bottom Badge / Frame */}
                    <div className="absolute bottom-0 left-0 z-10">
                        <Image
                            src="/card-frame.png"
                            alt="badge"
                            width={160}
                            height={50}
                            className="pointer-events-none object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* 3. Floating Zoom Preview (Desktop) */}
                <div
                    className={clsx(
                        "absolute hidden lg:block top-0 -right-[105%] w-full h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl z-50 pointer-events-none transition-all duration-200",
                        showZoom ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    )}
                >
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `url(${activeImage})`,
                            backgroundSize: "250%",
                            backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                img { user-select: none; -webkit-user-drag: none; }
            `}</style>
        </div>
    );
}