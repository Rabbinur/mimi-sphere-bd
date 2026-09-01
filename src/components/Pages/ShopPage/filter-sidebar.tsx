"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { Check, Minus, Plus, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Category {
    _id: string;
    name: string;
    count: number;
    slug: string;
}

interface FilterValue {
    value: string;
    count: number;
}

interface ProductFilter {
    name: string;
    label: string;
    values: FilterValue[];
}

interface ProductFilters {
    variants: ProductFilter[];
    brands: FilterValue[];
}

interface Props {
    categories: Category[];
    productFilters: ProductFilters;
    activeCategory: string | null;
    activeBrand: string | null;
    activeVariantFilters: Record<string, string[]>;
    sortValue: string;
    totalProducts: number;
}

export default function FilterSidebar({
    categories,
    productFilters,
    activeCategory,
    activeBrand,
    activeVariantFilters,
    sortValue,
    totalProducts,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedCategory, setSelectedCategory] = useState(activeCategory);
    const [selectedBrand, setSelectedBrand] = useState(activeBrand);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>(activeVariantFilters);
    const [selectedSort, setSelectedSort] = useState(sortValue);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        category: true,
        brand: true,
        sort: true,
        ...Object.fromEntries((productFilters?.variants ?? []).map((filter) => [filter.name, true])),
    });
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSection = useCallback((section: string) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    }, []);

    useEffect(() => {
        setSelectedCategory(activeCategory);
        setSelectedBrand(activeBrand);
        setSelectedVariants(activeVariantFilters);
        setSelectedSort(sortValue);
    }, [activeCategory, activeBrand, activeVariantFilters, sortValue]);

    // All filter changes = URL push → triggers SSR re-render
    const navigate = ({
        category = selectedCategory,
        sort = selectedSort,
        brand = selectedBrand,
        variants = selectedVariants,
    }: {
        category?: string | null;
        sort?: string;
        brand?: string | null;
        variants?: Record<string, string[]>;
    }) => {
        setSelectedCategory(category);
        setSelectedBrand(brand);
        setSelectedVariants(variants);
        setSelectedSort(sort);

        const params = new URLSearchParams();
        // Category is now in the path, so we don't put it in searchParams
        if (brand) params.set("brand", brand);
        Object.entries(variants).forEach(([name, values]) => {
            const uniqueValues = Array.from(new Set(values));
            uniqueValues.forEach((val) => {
                if (val) params.append(`variant_${name.toLowerCase()}`, val);
            });
        });
        if (sort !== "latest") params.set("sort", sort);

        const qs = params.toString();
        const baseContentPath = category ? `/shop/${category}` : "/shop";
        router.push(qs ? `${baseContentPath}?${qs}` : baseContentPath);
        setShowSidebar(false);
    };

    const handleCategoryChange = (slug: string | null) => navigate({ category: slug });
    const handleBrandChange = (brand: string | null) => navigate({ brand });
    const handleSortChange = (value: string) => navigate({ sort: value });

    // Multi-select toggle for variants
    const handleVariantToggle = (name: string, value: string) => {
        const current = selectedVariants[name] ?? [];
        const exists = current.includes(value);
        const updated = exists ? current.filter((v) => v !== value) : [...current, value];
        const variants = { ...selectedVariants };
        if (updated.length > 0) variants[name] = updated;
        else delete variants[name];
        navigate({ variants });
    };

    const handleVariantClear = (name: string) => {
        const variants = { ...selectedVariants };
        delete variants[name];
        navigate({ variants });
    };

    const handleClearAll = () => { router.push("/shop"); setShowSidebar(false); };

    const activeCount = useMemo(
        () =>
            [
                activeCategory !== null,
                activeBrand !== null,
                sortValue !== "latest",
                ...Object.values(activeVariantFilters).flat().map(Boolean),
            ].filter(Boolean).length,
        [activeCategory, activeBrand, activeVariantFilters, sortValue],
    );

    const isVariantActive = (name: string, value: string) =>
        (activeVariantFilters[name] ?? []).includes(value);

    const hasActiveVariant = (name: string) =>
        (activeVariantFilters[name] ?? []).length > 0;

    const SORT_OPTIONS = [
        { value: "latest", label: "Latest" },
        { value: "titleAsc", label: "Alphabetically, A-Z" },
        { value: "titleDesc", label: "Alphabetically, Z-A" },
        { value: "lowToHigh", label: "Price: Low to High" },
        { value: "highToLow", label: "Price: High to Low" },
    ];


    const SidebarContent = () => (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-primary" />
                    <span className="font-bold text-slate-800 text-sm tracking-wide uppercase">Filters</span>
                    {activeCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-black bg-primary text-white rounded-full">
                            {activeCount}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pt-2 pb-32 lg:pb-8 scrollbar-thin">
                {/* Category */}

                <div className="lg:hidden">
                    <FilterSection
                        title="Sort By"
                        expanded={expandedSections.sort}
                        onToggle={() => toggleSection("sort")}
                    >
                        <RadioGroup value={sortValue} onValueChange={handleSortChange} className="space-y-0.5">
                            {SORT_OPTIONS.map(({ value, label }) => (
                                <label
                                    key={value}
                                    htmlFor={value}
                                    className={clsx(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 text-sm",
                                        sortValue === value
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-slate-600 hover:bg-slate-100"
                                    )}
                                >
                                    <RadioGroupItem value={value} id={value} className="border-slate-300 text-primary" />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </RadioGroup>
                    </FilterSection>
                </div>


                <FilterSection
                    title="Category"
                    expanded={expandedSections.category}
                    onToggle={() => toggleSection("category")}
                >
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={clsx(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                            activeCategory === null
                                ? "bg-primary text-white  shadow-primary/30"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <span>All Products</span>
                        {activeCategory === null && <span className="text-[10px] font-black opacity-70">✓</span>}
                    </button>

                    <div className="space-y-0.5 mt-1 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {categories?.map((cat) => (
                            <button
                                key={cat.slug}
                                onClick={() => handleCategoryChange(cat.slug)}
                                className={clsx(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                    activeCategory === cat.slug
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-slate-600 hover:bg-slate-100 font-normal"
                                )}
                            >
                                <span className="truncate flex-1 text-left">{cat.name}</span>
                                <div className="flex items-center gap-1.5 ml-2">
                                    {cat.count !== undefined && (
                                        <span className={clsx(
                                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                                            activeCategory === cat.slug
                                                ? "bg-primary/20 text-primary"
                                                : "bg-slate-100 text-slate-400"
                                        )}>
                                            {cat.count}
                                        </span>
                                    )}
                                    {activeCategory === cat.slug && (
                                        <span className="text-[10px] font-black text-primary">✓</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {productFilters?.brands?.length > 0 && (
                    <>
                        <div className="mx-5 my-1 border-t border-slate-100" />
                        <FilterSection
                            title="Brand"
                            expanded={expandedSections.brand}
                            onToggle={() => toggleSection("brand")}
                        >
                            <button
                                onClick={() => handleBrandChange(null)}
                                className={clsx(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                    activeBrand === null
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-slate-600 hover:bg-slate-100 font-normal"
                                )}
                            >
                                <span>All Brands</span>
                                {activeBrand === null && <span className="text-[10px] font-black text-primary">✓</span>}
                            </button>

                            <div className="space-y-0.5 mt-1 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                {productFilters.brands.map((brand) => (
                                    <button
                                        key={brand.value}
                                        onClick={() => handleBrandChange(brand.value)}
                                        className={clsx(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                            activeBrand === brand.value
                                                ? "bg-primary/10 text-primary font-semibold"
                                                : "text-slate-600 hover:bg-slate-100 font-normal"
                                        )}
                                    >
                                        <span className="truncate flex-1 text-left">{brand.value}</span>
                                        <div className="flex items-center gap-1.5 ml-2">
                                            <span className={clsx(
                                                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                                                activeBrand === brand.value
                                                    ? "bg-primary/20 text-primary"
                                                    : "bg-slate-100 text-slate-400"
                                            )}>
                                                {brand.count}
                                            </span>
                                            {activeBrand === brand.value && (
                                                <span className="text-[10px] font-black text-primary">✓</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </FilterSection>
                    </>
                )}

                {/* Dynamic variant filters — multi-select checkboxes */}
                {productFilters?.variants?.map((filter) => (
                    <div key={filter.name}>
                        <div className="mx-5 my-1 border-t border-slate-100" />
                        <FilterSection
                            title={filter.label}
                            expanded={expandedSections[filter.name] ?? true}
                            onToggle={() => toggleSection(filter.name)}
                        >
                            {/* Clear button for this filter group */}
                            {hasActiveVariant(filter.name) && (
                                <button
                                    onClick={() => handleVariantClear(filter.name)}
                                    className="w-full flex items-center justify-between px-3 py-1.5 mb-1 rounded-lg text-[11px] font-semibold text-primary hover:bg-primary/5 transition-all"
                                >
                                    <span>Clear {filter.label}</span>
                                    <X size={12} />
                                </button>
                            )}

                            <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                {filter.values.map((item) => {
                                    const active = isVariantActive(filter.name, item.value);
                                    return (
                                        <button
                                            key={`${filter.name}-${item.value}`}
                                            onClick={() => handleVariantToggle(filter.name, item.value)}
                                            className={clsx(
                                                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                                active
                                                    ? "bg-primary/10 text-primary font-semibold"
                                                    : "text-slate-600 hover:bg-slate-100 font-normal"
                                            )}
                                        >
                                            {/* Checkbox */}
                                            <span className={clsx(
                                                "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all duration-200",
                                                active
                                                    ? "bg-primary border-primary"
                                                    : "border-slate-300 bg-white"
                                            )}>
                                                {active && <Check size={10} className="text-white" strokeWidth={3} />}
                                            </span>

                                            <span className="truncate flex-1 text-left">{item.value}</span>

                                            <span className={clsx(
                                                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-2",
                                                active
                                                    ? "bg-primary/20 text-primary"
                                                    : "bg-slate-100 text-slate-400"
                                            )}>
                                                {item.count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </FilterSection>
                    </div>
                ))}


                {/* Sort */}

            </div>
        </div>
    );

    return (
        <div className="relative">
            {/* Mobile trigger - Redesigned to match screenshot */}
            <div className="lg:hidden ">
                <button
                    onClick={() => setShowSidebar(true)}
                    className="w-full flex items-center justify-between  px-3 py-3 md:py-4 bg-white border border-slate-100 rounded-sm  hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                    <div className="flex items-center gap-3">
                        <SlidersHorizontal size={18} className="text-slate-600" />
                        <span className="text-sm font-semibold text-slate-800 tracking-wide uppercase">Filter and Sort</span>
                    </div>

                </button>
            </div>

            {/* Desktop */}
            <aside className="hidden lg:flex flex-col w-full bg-white border border-slate-100 rounded-xl overflow-hidden  min-h-[400px]">
                <SidebarContent />
            </aside>

            {/* Mobile bottom sheet */}
            {showSidebar && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setShowSidebar(false)}
                    />
                    <aside className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col lg:hidden animate-in slide-in-from-bottom duration-300 overflow-hidden">
                        <div className="flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-10 h-1 rounded-full bg-slate-200" />
                        </div>
                        <button
                            className="absolute top-3 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                            onClick={() => setShowSidebar(false)}
                        >
                            <X size={16} className="text-slate-600" />
                        </button>
                        <SidebarContent />
                    </aside>
                </>
            )}
        </div>
    );
}

/* --- Sub Components --- */

interface FilterSectionProps {
    title: string;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function FilterSection({ title, expanded, onToggle, children }: FilterSectionProps) {
    return (
        <div className="px-3 py-2">
            <button
                onClick={onToggle}
                className="flex justify-between items-center w-full px-2 mb-2 group"
                aria-expanded={expanded}
            >
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
                    {title}
                </span>

                {expanded ? (
                    <Minus size={14} className="text-slate-400" />
                ) : (
                    <Plus size={14} className="text-slate-400" />
                )}
            </button>

            <div
                className={clsx(
                    "grid transition-all duration-300",
                    expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">{children}</div>
            </div>
        </div>
    );
}