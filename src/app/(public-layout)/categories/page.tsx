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

import { fetchData, getCategories } from "@/lib/server-api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getProductsBySlug(slug: string) {
    return fetchData(`${API_BASE}/products?category=${slug}&limit=30`, 60);
}

export default async function CategoryPage(props: { searchParams: Promise<{ cat?: string }> }) {
    const { cat } = await props.searchParams;
    const categories = await getCategories();

    let selectedSlug = cat;
    if (!selectedSlug && categories.length > 0) {
        selectedSlug = categories[0].slug;
    }

    const initialProducts = selectedSlug ? await getProductsBySlug(selectedSlug) : [];

    return (
        <CategoriesClient
            initialCategories={categories}
            initialProducts={initialProducts}
            initialSlug={selectedSlug}
        />
    );
}