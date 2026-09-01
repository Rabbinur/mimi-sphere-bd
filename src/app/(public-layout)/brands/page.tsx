import BrandsPage from '@/components/Pages/BrandsPage/brands-page';
import { getBrands } from '@/lib/server-api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Brands | Shopping Cart BD',
  description: 'Explore our wide range of authentic Korean brands, bags, and accessories. Shop by your favorite brand at Shopping Cart BD.',
  keywords: ['korean brands', 'authentic brands', 'shopping cart bd brands', 'korean cosmetics brands'],
  alternates: {
    canonical: 'https://www.shoppingcart.bd/brands',
  },
  openGraph: {
    title: 'Our Brands | Shopping Cart BD',
    description: 'Explore our wide range of authentic Korean brands, bags, and accessories.',
    url: 'https://www.shoppingcart.bd/brands',
    siteName: 'Shopping Cart BD',
    images: [
      {
        url: 'https://www.shoppingcart.bd/og-brands.jpg',
        width: 1200,
        height: 630,
        alt: 'Our Brands - Shopping Cart BD',
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
