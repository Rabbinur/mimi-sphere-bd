import { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
    title: "Categories | Mimi Sphere",
    description: "Browse products by categories on Mimi Sphere. Find the best deals across various curated categories.",
    keywords: ["categories", "shopping", "products", "deals", "mimi sphere"],
    alternates: {
        canonical: "/categories",
    },
};

import { fetchData } from "@/lib/server-api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getCategoriesWithSubs() {
    try {
        const res = await fetch(`${API_BASE}/categories?sub_categories=true`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.data ?? json ?? [];
    } catch {
        return [];
    }
}

async function getProductsBySlug(slug: string) {
    return fetchData(`${API_BASE}/products?category=${slug}&limit=30`, 60);
}

export default async function CategoryPage(props: { searchParams: Promise<{ cat?: string }> }) {
    const { cat } = await props.searchParams;
    const categories = await getCategoriesWithSubs();

    // Find selected category (root only)
    const rootCategories = categories.filter((c: any) => !c.parent_category_id);
    let selectedSlug = cat;
    if (!selectedSlug && rootCategories.length > 0) {
        selectedSlug = rootCategories[0].slug;
    }

    // Find selected category object to check if it has subcategories
    const selectedCat = rootCategories.find((c: any) => c.slug === selectedSlug);
    const hasSubs = Array.isArray(selectedCat?.sub_categories) && selectedCat.sub_categories.length > 0;

    // Only fetch products if category has NO subcategories
    const initialProducts = (!hasSubs && selectedSlug) ? await getProductsBySlug(selectedSlug) : [];

    return (
        <CategoriesClient
            initialCategories={categories}
            initialProducts={initialProducts || []}
            initialSlug={selectedSlug}
        />
    );
}