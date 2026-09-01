import BrandsPage from '@/components/Pages/BrandsPage/brands-page';
import { getBrands } from '@/lib/server-api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Brands | Mimi Sphere',
  description: 'Explore our wide range of authentic global & Korean brands, cosmetics, and accessories. Shop by your favorite brand at Mimi Sphere.',
  keywords: ['mimi sphere brands', 'korean brands', 'authentic brands', 'korean cosmetics brands'],
  alternates: {
    canonical: 'https://www.mimisphere.com/brands',
  },
  openGraph: {
    title: 'Our Brands | Mimi Sphere',
    description: 'Explore our wide range of authentic global brands, cosmetics, and accessories at Mimi Sphere.',
    url: 'https://www.mimisphere.com/brands',
    siteName: 'Mimi Sphere',
    images: [
      {
        url: 'https://www.mimisphere.com/og.png',
        width: 1200,
        height: 630,
        alt: 'Our Brands - Mimi Sphere',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function Brands({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const brandsData = await getBrands(page, 40, search);

  const brands = Array.isArray(brandsData?.brands) ? brandsData.brands : [];
  const pagination = brandsData?.pagination || {
    totalItems: brandsData?.total || 0,
    totalPages: Math.ceil((brandsData?.total || 0) / 40),
    currentPage: page,
  };

  return <BrandsPage initialBrands={brands} pagination={pagination} />;
}
