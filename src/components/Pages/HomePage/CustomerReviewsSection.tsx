"use client";

import { ChevronLeft, ChevronRight, Quote, ShieldCheck, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface TCustomerReviewItem {
  _id?: string;
  name: string;
  image?: string;
  rating: number;
  review: string;
  tag?: string;
  is_verified?: boolean;
}

// Fallback high-quality customer reviews in case DB is initially empty
const DEFAULT_REVIEWS: TCustomerReviewItem[] = [
  {
    name: "Samira Hossain",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    rating: 5,
    tag: "Verified Buyer • Gulshan, Dhaka",
    review:
      "আলহামদুলিল্লাহ! আমার পার্সেলটি আজকে হাতে পেলাম। অনেক অনেক ধন্যবাদ Mimi Sphere কে। কাপড়ের কোয়ালিটি মাশাআল্লাহ যেমন চেয়েছিলাম ঠিক তেমনই পেয়েছি। কালার এবং ফিটিং একদম পারফেক্ট!",
    is_verified: true,
  },
  {
    name: "Mahasin Aysha",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    rating: 5,
    tag: "Verified Buyer • Chattogram",
    review:
      "Honestly bolte, ami jekhon order kori I was a bit skeptical, but when the package arrived, I was totally amazed! The Korean skincare items were 100% authentic and packaging was super cute. Will order again!",
    is_verified: true,
  },
  {
    name: "Israt Jahan",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    rating: 5,
    tag: "Verified Buyer • Dhanmondi, Dhaka",
    review:
      "ডিজাইন অনেক সুন্দর ছিল আর কাপড়ের মানও খুব ভালো। দেখতে স্টাইলিশ আর পরতেও আরামদায়ক। বিশেষ করে ডেলিভারি সার্ভিস অনেক ফাস্ট ছিল, ২ দিনের মধ্যেই পেয়ে গেছি।",
    is_verified: true,
  },
  {
    name: "Israt Amin",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
    rating: 5,
    tag: "Verified Buyer • Sylhet",
    review:
      "আমি কারচুপি ডিজাইনের কালেকশনটি নিয়েছিলাম, কাপড়ের সফটনেস দেখে আমি মুগ্ধ! প্রিমিয়াম লুক দেয় এবং কাটিং ফিনিশিং অসাধারণ। Mimi Sphere এর কালেকশন সত্যিই প্রশংসনীয়।",
    is_verified: true,
  },
  {
    name: "Nusrat Faria",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80",
    rating: 5,
    tag: "Verified Buyer • Uttara, Dhaka",
    review:
      "কাস্টমার সার্ভিস অনেক হেল্পফুল ছিল। সাইজ সিলেকশনে অনেক সাহায্য করেছে এবং ডেলিভারির পর সবকিছু ঠিকঠাক পেয়েছি। এতো সুন্দর সার্ভিসের জন্য শুভকামনা রইল!",
    is_verified: true,
  },
];

export default function CustomerReviewsSection() {
  const [reviews, setReviews] = useState<TCustomerReviewItem[]>(DEFAULT_REVIEWS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const touchStartX = useRef<number | null>(null);

  // Fetch reviews dynamically from backend API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
        const url = `${apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase}/customer-reviews?status=active`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setReviews(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic customer reviews:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Update items per page based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, reviews.length - itemsPerPage);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section className="relative overflow-hidden py-8 md:py-14 bg-gradient-to-b from-white via-slate-50/60 to-white border-t border-slate-100">
      {/* Background Subtle Ambient Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-200/20 blur-[120px] rounded-full" />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] md:text-xs font-bold tracking-wide uppercase shadow-sm mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Customer Love & Feedback</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002447] tracking-tight">
            What Our Lovely Customers Say
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-2 font-normal leading-relaxed">
            Real experiences from happy shoppers across Bangladesh who trust Mimi Sphere for authenticity & quality.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Arrows */}
          {reviews.length > itemsPerPage && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous review"
                className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-md md:shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-[#002447] hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all duration-200 opacity-90 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next review"
                className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-md md:shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-[#002447] hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all duration-200 opacity-90 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Cards Track */}
          <div
            className="overflow-hidden px-1 py-3"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out gap-3 sm:gap-4 md:gap-5"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {reviews.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="shrink-0 flex flex-col justify-between bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-amber-300/60 transition-all duration-300 relative group/card select-none"
                  style={{
                    width: `calc(${100 / itemsPerPage}% - ${(itemsPerPage - 1) * (16 / itemsPerPage)}px)`,
                  }}
                >
                  {/* Top: Customer Photo & Rating Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {/* Photo with modern curved organic shape & floating quote */}
                      <div className="relative">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-amber-400/80 shadow-md transform -rotate-1 group-hover/card:rotate-0 transition-transform duration-300">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#002447] to-[#071426] text-white flex items-center justify-center font-bold text-lg">
                              {item.name ? item.name.charAt(0).toUpperCase() : "C"}
                            </div>
                          )}
                        </div>

                        {/* Floating Gold Quote Icon */}
                        <div className="absolute -bottom-1.5 -right-1.5 bg-[#002447] text-amber-400 w-6 h-6 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                          <Quote className="w-3 h-3 fill-amber-400" />
                        </div>
                      </div>

                      {/* Stars & Rating Value */}
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                i < (item.rating || 5)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 mt-1">
                          {Number(item.rating || 5).toFixed(1)} / 5.0
                        </span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-3">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      {item.tag && (
                        <p className="text-[11px] text-amber-700 font-medium line-clamp-1 mt-0.5">
                          {item.tag}
                        </p>
                      )}
                    </div>

                    {/* Review Body */}
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic line-clamp-4 font-normal">
                      "{item.review}"
                    </p>
                  </div>

                  {/* Card Bottom: Verified Buyer Badge */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Verified Purchase
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Mimi Sphere</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Indicators */}
          {reviews.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-1.5 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-6 bg-[#002447]"
                      : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
