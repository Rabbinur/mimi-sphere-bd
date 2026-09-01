
const CategoriesSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-0 md:px-4 md:py-4">
        <div className="flex bg-white shadow-sm md:rounded-none overflow-hidden h-[calc(100vh-60px)] border-t md:border-none border-gray-100">

          {/* LEFT SIDEBAR SKELETON */}
          <aside className="w-[120px] sm:w-[130px] md:w-[240px] border-r border-gray-100 flex flex-col bg-gray-50/20">
            <div className="p-2 md:p-4 border-b border-gray-50 bg-white">
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <nav className="flex-1 overflow-y-auto no-scrollbar py-1 space-y-1">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="py-2 md:py-3 px-2 md:px-4">
                  <div className="h-3 md:h-4 w-full bg-gray-100 animate-pulse rounded"></div>
                </div>
              ))}
            </nav>
          </aside>

          {/* MAIN CONTENT SKELETON */}
          <main className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Header Skeleton */}
            <header className="px-4 py-3 md:px-8 md:py-5 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-10">
              <div className="h-5 md:h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </header>

            {/* Product Grid Skeleton */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-0 md:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-2 xl:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center p-2">
                    {/* Image Placeholder */}
                    <div className="relative aspect-square w-full mb-2 md:mb-3 overflow-hidden rounded-lg md:rounded-xl bg-gray-100 animate-pulse"></div>

                    {/* Title Placeholder */}
                    <div className="space-y-2 w-full">
                      <div className="h-3 w-full bg-gray-100 animate-pulse rounded"></div>
                      <div className="h-3 w-2/3 bg-gray-100 animate-pulse rounded"></div>
                      {/* Price Placeholder */}
                      <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default function Loading() {
  return <CategoriesSkeleton />;
}
