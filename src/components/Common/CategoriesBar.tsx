import { Suspense } from "react";
import CategoriesBarClient from "./CategoriesBarClient";

async function getCategories() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) return [];

        const res = await fetch(`${baseUrl}/categories?sub_categories=false`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) return [];
        const data = await res.json();
        return (data && data.length > 0) ? data : [];

    } catch (error) {
        console.error("Error fetching categories for SSR:", error);
        return [];
    }
}

const CategoriesBarSkeleton = () => (
    <div className="w-full border-b border-gray-100 bg-white shadow-sm">
        <div className="container mx-auto px-4 h-12 flex items-center gap-4">
            <div className="h-9 w-32 bg-gray-100 rounded-full animate-pulse" />
            <div className="flex gap-6 flex-1 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-4 w-20 bg-gray-100 rounded animate-pulse shrink-0" />
                ))}
            </div>
        </div>
    </div>
);

async function getInitialProducts(categorySlug: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl || !categorySlug) return [];

        const res = await fetch(`${baseUrl}/products?category=${categorySlug}&limit=30`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return [];
        const json = await res.json();
        return json.data ?? [];
    } catch (error) {
        console.error("Error fetching initial products for mega-menu:", error);
        return [];
    }
}

const CategoriesBarContent = async () => {
    const categories = await getCategories();
    const firstCategory = categories?.[0];
    const initialProducts = firstCategory ? await getInitialProducts(firstCategory.slug) : [];
    
    return (
        <CategoriesBarClient 
            categories={categories} 
            initialProducts={initialProducts}
            initialCategorySlug={firstCategory?.slug}
        />
    );
}

const CategoriesBar = () => {
    return (
        <Suspense fallback={<CategoriesBarSkeleton />}>
            <CategoriesBarContent />
        </Suspense>
    );
};

export default CategoriesBar;