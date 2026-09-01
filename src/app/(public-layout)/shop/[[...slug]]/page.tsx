import ShopPage from '@/components/Pages/ShopPage/shop-page';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug?: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = slug?.[0];

    const baseUrl = "https://www.mimisphere.com/shop";

    const formatName = (text: string) =>
        text
            ?.replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

    const name = category ? formatName(category) : "";

    const canonicalUrl = category
        ? `${baseUrl}/${category}`
        : baseUrl;

    // 🎯 SEO-optimized titles
    const title = category
        ? `${name} | Mimi Sphere`
        : "Shop All Products | Mimi Sphere";

    // 💖 Conversion-focused descriptions
    const description = category
        ? `Shop ${name.toLowerCase()} at Mimi Sphere. Authentic Korean cosmetics, cute bags & aesthetic lifestyle essentials. Everything you need, all in one place.`
        : "Explore curated collections of cosmetics, trendy bags & lifestyle essentials at Mimi Sphere. 100% authentic products.";

    return {
        title,
        description,

        keywords: [
            "mimi sphere",
            "korean cosmetics bangladesh",
            "korean bags bd",
            "korean skincare bd",
            "cute accessories bangladesh",
            category ? `${category} bangladesh` : "",
        ].filter(Boolean),

        alternates: {
            canonical: canonicalUrl,
        },

        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: "Mimi Sphere",
            images: [
                {
                    url: "https://www.mimisphere.com/og.png",
                    width: 1200,
                    height: 630,
                    alt: `${name || "Korean Cosmetics & Bags"} Bangladesh`,
                },
            ],
            locale: "en_US",
            type: "website",
        },
    };
}
export default async function Shop({ params, searchParams }: Props) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;

    // Extract category from either slug or searchParams (for backward compatibility if needed)
    const category = slug?.[0] || (resolvedSearchParams.category as string);

    const normalizedParams: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
        if (value !== undefined) {
            normalizedParams[key] = value;
        }
    }

    // Ensure category from slug is passed to the component
    if (category) {
        normalizedParams.category = category;
    }

    return <ShopPage searchParams={normalizedParams} />;
}
