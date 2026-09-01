
const BrandsSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 sm:pb-20">
      {/* Hero Section Skeleton */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-12 sm:pt-10 sm:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-10 sm:h-12 w-64 sm:w-80 bg-slate-200 animate-pulse rounded-xl mx-auto mb-4"></div>
            <div className="h-4 sm:h-6 w-48 sm:w-64 bg-slate-100 animate-pulse rounded-lg mx-auto mb-8"></div>

            <div className="relative max-w-xl mx-auto">
              <div className="h-12 sm:h-14 w-full bg-slate-50 animate-pulse rounded-xl sm:rounded-2xl border border-slate-100"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 sm:px-4 mt-6 sm:mt-8">
        <div className="max-w-7xl mx-auto bg-white border border-slate-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 border-l border-t border-slate-100">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border-r border-b border-slate-100 p-6 sm:p-10 flex items-center justify-center h-32 sm:h-40"
              >
                <div className="w-full h-12 sm:h-16 bg-slate-50 animate-pulse rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Loading() {
  return <BrandsSkeleton />;
}
