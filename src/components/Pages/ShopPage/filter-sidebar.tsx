"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { Check, ChevronDown, ChevronRight, CornerDownRight, Minus, Plus, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Category {
    _id: string;
    name: string;
    count?: number;
    slug: string;
    parent_category_id?: string | null;
    sub_categories?: Category[];
}

interface FilterValue {
    value: string;
    count: number;
    logoUrl?: string;
    slug?: string;
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
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        category: true,
        brand: true,
        sort: true,
        ...Object.fromEntries((productFilters?.variants ?? []).map((filter) => [filter.name, true])),
    });
    const [showSidebar, setShowSidebar] = useState(false);

    // Auto-expand the category if it or one of its subcategories is active
    useEffect(() => {
        if (!activeCategory || !categories) return;

        categories.forEach((cat) => {
            const isParentActive = cat.slug === activeCategory;
            const isChildActive = cat.sub_categories?.some((sub) => sub.slug === activeCategory);
            if (isParentActive || isChildActive) {
                setExpandedCategories((prev) => ({
                    ...prev,
                    [cat.slug]: true,
                }));
            }
        });
    }, [activeCategory, categories]);

    const toggleCategoryExpand = (slug: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedCategories((prev) => ({
            ...prev,
            [slug]: !prev[slug],
        }));
    };

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
                                ? "bg-primary text-white shadow-primary/30"
                                : "text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <span>All Products</span>
                        {activeCategory === null && <span className="text-[10px] font-black opacity-70">✓</span>}
                    </button>

                    <div className="space-y-1 mt-1.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {categories?.map((cat) => {
                            const isParentActive = activeCategory === cat.slug;
                            const hasSubs = Array.isArray(cat.sub_categories) && cat.sub_categories.length > 0;
                            const isChildActive = hasSubs && cat.sub_categories!.some((sub) => sub.slug === activeCategory);
                            const isExpanded = expandedCategories[cat.slug] ?? (isParentActive || isChildActive);

                            return (
                                <div key={cat.slug} className="space-y-0.5">
                                    {/* Parent Category Row */}
                                    <div
                                        className={clsx(
                                            "w-full flex items-center justify-between rounded-lg text-sm transition-all duration-200 group",
                                            isParentActive
                                                ? "bg-primary/10 text-primary font-bold shadow-2xs"
                                                : isChildActive
                                                ? "bg-amber-50/50 text-slate-800 font-semibold"
                                                : "text-slate-600 hover:bg-slate-100 font-medium"
                                        )}
                                    >
                                        <button
                                            onClick={() => handleCategoryChange(cat.slug)}
                                            className="flex-1 flex items-center justify-between px-3 py-2 text-left truncate"
                                        >
                                            <span className="truncate flex-1">{cat.name}</span>
                                            {isParentActive && (
                                                <span className="text-[11px] font-black text-primary ml-1.5">✓</span>
                                            )}
                                        </button>

                                        {hasSubs && (
                                            <button
                                                type="button"
                                                onClick={(e) => toggleCategoryExpand(cat.slug, e)}
                                                className="px-2 py-2 text-slate-400 hover:text-slate-700 transition-colors flex items-center"
                                                title={isExpanded ? "Collapse subcategories" : "Expand subcategories"}
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                ) : (
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Indented Subcategories */}
                                    {hasSubs && isExpanded && (
                                        <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-slate-100 ml-3.5 my-0.5">
                                            {cat.sub_categories!.map((sub) => {
                                                const isSubActive = activeCategory === sub.slug;
                                                return (
                                                    <button
                                                        key={sub.slug}
                                                        onClick={() => handleCategoryChange(sub.slug)}
                                                        className={clsx(
                                                            "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all duration-200",
                                                            isSubActive
                                                                ? "bg-amber-500 text-white font-bold shadow-xs"
                                                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 font-medium"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-1.5 truncate flex-1 text-left">
                                                            <span className={clsx("text-[10px]", isSubActive ? "text-amber-200" : "text-amber-500")}>↳</span>
                                                            <span className="truncate">{sub.name}</span>
                                                        </div>
                                                        {isSubActive && (
                                                            <span className="text-[10px] font-black text-white ml-1">✓</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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
                                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                            activeBrand === brand.value
                                                ? "bg-primary/10 text-primary font-semibold"
                                                : "text-slate-600 hover:bg-slate-100 font-normal"
                                        )}
                                    >
                                        {/* Brand Logo */}
                                        {brand.logoUrl ? (
                                            <img
                                                src={brand.logoUrl}
                                                alt={brand.value}
                                                className="w-6 h-6 rounded object-contain flex-shrink-0 bg-white border border-slate-100"
                                            />
                                        ) : (
                                            <span className={clsx(
                                                "w-6 h-6 rounded flex items-center justify-center text-[10px] font-black flex-shrink-0",
                                                activeBrand === brand.value ? "bg-primary/20 text-primary" : "bg-slate-100 text-slate-400"
                                            )}>
                                                {brand.value.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                        <span className="truncate flex-1 text-left">{brand.value}</span>
                                        <div className="flex items-center gap-1.5 ml-2">
                                            {brand.count > 0 && (
                                                <span className={clsx(
                                                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                                                    activeBrand === brand.value
                                                        ? "bg-primary/20 text-primary"
                                                        : "bg-slate-100 text-slate-400"
                                                )}>
                                                    {brand.count}
                                                </span>
                                            )}
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