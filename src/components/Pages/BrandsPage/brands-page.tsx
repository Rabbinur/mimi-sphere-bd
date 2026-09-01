'use client';

import { ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  order: number;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface BrandsPageProps {
  initialBrands: Brand[];
  pagination: Pagination;
}

const BrandsPage: React.FC<BrandsPageProps> = ({ initialBrands, pagination }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [allBrands, setAllBrands] = useState<Brand[]>(initialBrands);
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(pagination.currentPage < pagination.totalPages);

  // Error handling for individual brand logos
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const handleLogoError = (brandId: string) => {
    setFailedLogos(prev => ({ ...prev, [brandId]: true }));
  };

  const loadMoreBrands = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const response = await fetch(`/api/brands?page=${nextPage}&limit=40`);
      const data = await response.json();

      if (data.success) {
        const newBrands = data.data.brands || [];
        setAllBrands(prev => [...prev, ...newBrands]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < (data.data.pagination?.totalPages || 0));
      }
    } catch (error) {
      console.error("Error loading more brands:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filteredBrands = allBrands.filter(brand => !failedLogos[brand._id]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 sm:pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 py-3 md:py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Explore Our <span className="text-primary">Brands</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-lg mb-0 px-4">
              Discover authentic products from our premium brands. Found {pagination.totalItems} brands.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 sm:px-4 mt-3 md:mt-4 pb-4 md:pb-6">
        <main className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
          {filteredBrands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 border-l border-t border-slate-100">
              {filteredBrands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/brands/${brand.slug}`}
                  className="group relative bg-white border-r border-b border-slate-100 p-6 sm:p-10 transition-all duration-300 hover:bg-slate-50/50 flex items-center justify-center min-h-[120px] sm:min-h-[160px]"
                >
                  {brand.logoUrl ? (
                    <div className="relative w-full h-12 sm:h-20 transition-all duration-500 transform group-hover:scale-105">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.name}
                        fill
                        onError={() => handleLogoError(brand._id)}
                        className="object-contain"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-sm sm:text-xl font-bold text-slate-400 group-hover:text-primary transition-colors uppercase tracking-tight">
                        {brand.name}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 duration-300">
                    <ChevronRight className="h-4 w-4 text-primary/40" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-3xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No brands found</h3>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="p-8 text-center border-t border-slate-100 bg-slate-50/30">
              <button
                onClick={loadMoreBrands}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Brands
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>

  );
};

export default BrandsPage;
