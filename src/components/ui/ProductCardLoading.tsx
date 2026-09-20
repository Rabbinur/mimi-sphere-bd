const ProductCardLoading = () => {
  return (
    <div className="relative bg-white rounded-2xl flex flex-col h-full overflow-hidden"
      style={{ border: "1px solid rgba(226,232,240,0.9)", boxShadow: "0 2px 10px rgba(0,0,0,0.055)" }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skeleton-shine {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      {/* Image Skeleton */}
      <div className="skeleton-shine w-full" style={{ aspectRatio: "1 / 1" }} />

      {/* Content */}
      <div className="flex flex-col flex-grow px-3 pt-2.5 pb-3 gap-2">
        {/* Title */}
        <div className="skeleton-shine h-3.5 rounded-full w-4/5" />
        <div className="skeleton-shine h-3.5 rounded-full w-3/5" />

        <div className="flex-grow" />

        {/* Price + Cart Row */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex flex-col gap-1">
            <div className="skeleton-shine h-4 rounded-full w-16" />
            <div className="skeleton-shine h-3 rounded-full w-10" />
          </div>
          <div className="skeleton-shine w-9 h-9 rounded-full shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardLoading;

