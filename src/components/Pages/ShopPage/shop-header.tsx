"use client";

import { cn } from "@/lib/utils";
import {
    ChevronDown,
    Grid3x3,
    LayoutGrid,
    LayoutPanelLeft,
    LayoutPanelTop
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const SORT_OPTIONS = [
    { value: "latest", label: "Latest" },
    { value: "titleAsc", label: "Alphabetically, A-Z" },
    { value: "titleDesc", label: "Alphabetically, Z-A" },
    { value: "lowToHigh", label: "Price: Low to High" },
    { value: "highToLow", label: "Price: High to Low" },
];

// List View (cols: 1) সরিয়ে দেওয়া হয়েছে
const LAYOUT_OPTIONS = [
    { cols: 2, Icon: LayoutPanelLeft, label: "2 Columns" }, // best
    { cols: 3, Icon: LayoutPanelTop, label: "3 Columns" },  // optional alt
    { cols: 4, Icon: LayoutGrid, label: "4 Columns" },
    { cols: 5, Icon: Grid3x3, label: "5 Columns" },
];
interface Props {
    category: string | null;
    sort: string;
    totalProducts: number;
}

export default function ShopHeader({ category, sort, totalProducts }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [gridLayout, setGridLayout] = useState(4);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            params.delete("page");
            return params.toString();
        },
        [searchParams]
    );

    const handleSortChange = (value: string) => {
        const qs = createQueryString("sort", value);
        router.push(`${pathname}?${qs}`, { scroll: false });
        setIsSortOpen(false);
    };

    const handleGridChange = (cols: number) => {
        setGridLayout(cols);
        window.dispatchEvent(new CustomEvent("grid-layout-change", { detail: cols }));
    };

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || "Sort by";

    return (
        <div className="md:space-y-4 space-y-2">
            <div className="hidden lg:flex bg-white rounded-xl border border-slate-100 px-4 md:px-6 py-3 shadow-sm flex-wrap items-center justify-between gap-4">

                {/* Left: Product Count */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                        {totalProducts}
                    </span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-tight">products</span>
                </div>

                {/* Center: Layout Toggles (List View Removed) */}
                <div className="hidden lg:flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                    {LAYOUT_OPTIONS.map(({ cols, Icon, label }) => (
                        <button
                            key={cols}
                            onClick={() => handleGridChange(cols)}
                            className={cn(
                                "w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200",
                                gridLayout === cols
                                    ? "bg-white shadow-sm text-primary border border-slate-100"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                            )}
                            title={label}
                        >
                            <Icon size={18} />
                        </button>
                    ))}
                </div>

                {/* Right: Sort Dropdown */}
                <div className="flex items-center gap-3 relative">
                    <span className="hidden sm:inline text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Sort by:
                    </span>
                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors duration-200 min-w-[160px] justify-between"
                        >
                            <span>{currentSortLabel}</span>
                            <ChevronDown size={16} className={cn("transition-transform duration-200", isSortOpen && "rotate-180")} />
                        </button>

                        {isSortOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsSortOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {SORT_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSortChange(option.value)}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 text-sm transition-colors duration-200",
                                                sort === option.value
                                                    ? "bg-primary/5 text-primary font-bold"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}