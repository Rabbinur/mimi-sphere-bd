"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [dashOffset, setDashOffset] = useState(307); // Total circumference

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            const progress = (scrollTop / (fullHeight - windowHeight)) * 100;
            setScrollProgress(progress);

            // Calculate the dash offset dynamically based on circumference (~307.87)
            const circumference = 307.87;
            const newDashOffset = circumference * (1 - progress / 100);
            setDashOffset(newDashOffset);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleBackToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const isVisible = scrollProgress > 10;

    return (
        <div
            onClick={handleBackToTop}
            className={cn(
                "fixed left-6 z-[99] cursor-pointer rounded-full transition-all duration-300 ease-linear shadow-lg flex items-center justify-center bg-white/80 backdrop-blur-sm",
                "bottom-24 md:bottom-10 h-[46px] w-[46px]",
                isVisible ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible pointer-events-none"
            )}
            style={{
                boxShadow: "rgba(151, 139, 139, 0.4) 0px 0px 15px",
            }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox="-1 -1 102 102"
                fill="none"
                className="transform -rotate-90"
            >
                <path
                    d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
                    stroke="#e2e8f0" // Muted background track
                    strokeWidth="4"
                />
                <path
                    d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    strokeDasharray="307.87"
                    style={{
                        strokeDashoffset: dashOffset,
                        transition: "stroke-dashoffset 10ms linear",
                    }}
                    strokeLinecap="round"
                />
            </svg>

            {/* Arrow Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transform rotate-180"
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
            </div>
        </div>
    );
};

export default ScrollToTop;
