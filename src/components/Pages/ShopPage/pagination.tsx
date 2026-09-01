"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
}: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (page: number) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page.toString());
            return params.toString();
        },
        [searchParams]
    );

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        const qs = createQueryString(page);
        router.push(`${pathname}?${qs}`, { scroll: true });
    };

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        const showMax = 5;

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push("...");
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 px-2 py-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400">
                Showing page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
                <span className="mx-2 text-slate-200">|</span>
                Total <span className="text-slate-900">{totalItems}</span> products
            </p>

            <nav className="flex items-center gap-1.5" aria-label="Pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600",
                        currentPage === 1 && "cursor-not-allowed"
                    )}
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1.5">
                    {pages.map((page, i) => (
                        <div key={i} className="flex items-center">
                            {page === "..." ? (
                                <span className="flex items-center justify-center w-9 h-9 text-slate-300">
                                    <MoreHorizontal size={14} />
                                </span>
                            ) : (
                                <button
                                    onClick={() => handlePageChange(page as number)}
                                    className={cn(
                                        "flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold transition-all duration-300",
                                        currentPage === page
                                            ? "bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2"
                                            : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                                    )}
                                >
                                    {page}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600",
                        currentPage === totalPages && "cursor-not-allowed"
                    )}
                >
                    <ChevronRight size={18} />
                </button>
            </nav>
        </div>
    );
}
