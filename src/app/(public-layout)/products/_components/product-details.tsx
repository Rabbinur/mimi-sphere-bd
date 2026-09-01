// components/ProductDetailTabs.tsx
"use client";

import { useState } from "react";
import { Truck, Star, User, Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProxiedUrl } from "@/lib/utils";
import type { TProduct } from "@/types";
import { useCurrentUserInfo } from "@/components/Redux/Slice/authSlice";
import { useAppSelector } from "@/components/Redux/hooks";
import {
  useCreateReviewMutation,
  useGetReviewsByProductQuery,
} from "@/components/Redux/RTK/reviewApi";
import { toast } from "sonner";
import Link from "next/link";

interface ProductDetailTabsProps {
  product: TProduct | undefined;
  compact?: boolean;
}

export default function ProductDetailTabs({
  product,
  compact = false,
}: ProductDetailTabsProps) {
  const mt = compact ? "mt-2" : "mt-4";
  const pt = compact ? "pt-2" : "pt-4";
  const tabsMb = compact ? "mb-1" : "mb-2";
  const triggerText = compact ? "text-sm" : "text-sm md:text-base";
  const sectionGap = compact ? "space-y-2" : "space-y-3";
  const contentPt = compact ? "pt-1" : "pt-2";
  const smallText = compact ? "text-sm" : "text-sm";

  const description =
    product?.product_description?.replace(
      /(src|href)="([^"]+)"/g,
      (match, attr, url) => {
        return `${attr}="${getProxiedUrl(url)}"`;
      },
    ) || "No detailed description available.";

  const specs = [
    {
      label: "Category",
      value: (product?.product_categories as any[])
        ?.map((c) => (typeof c === "string" ? c : c.name))
        .join(", "),
    },
    { label: "SKU", value: product?.sku },
    { label: "Vendor", value: product?.product_vendor },
    { label: "Country of Origin", value: product?.country_of_origin },
    ...(product?.product_attributes || []),
  ];

  return (
    <div>
      <div className={`${mt} border-t border-gray-200 ${pt}`}>
        <Tabs defaultValue="description" className="w-full">
          <TabsList
            className={`w-full border-b border-gray-200 rounded-none bg-white h-auto p-0 ${tabsMb} justify-start overflow-x-auto`}
          >
            <TabsTrigger
              value="description"
              className={`py-2 px-3 rounded-none font-semibold ${triggerText} text-gray-600
                data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none`}
            >
              Description
            </TabsTrigger>

            <TabsTrigger
              value="details"
              className={`py-2 px-3 rounded-none font-semibold ${triggerText} text-gray-600
                data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none`}
            >
              Specifications
            </TabsTrigger>

            <TabsTrigger
              value="shipping"
              className={`py-2 px-3 rounded-none font-semibold ${triggerText} text-gray-600
                data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none`}
            >
              Shipping
            </TabsTrigger>

            <TabsTrigger
              value="reviews"
              className={`py-2 px-3 rounded-none font-semibold ${triggerText} text-gray-600
                data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none`}
            >
              Reviews ({product?.total_reviews || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className={`p-0 ${contentPt}`}>
            <div className="prose max-w-none">
              <div
                className={`text-gray-700 leading-normal ${smallText} product-table`}
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="details" className={`p-0 ${contentPt}`}>
            <div className={`${sectionGap}`}>
              <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
                {specs.map(
                  (item, index) =>
                    item?.value && (
                      <div
                        key={index}
                        className="grid grid-cols-3 px-3 py-2 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="col-span-1 text-sm text-gray-500 font-medium">
                          {item.label} :
                        </span>
                        <span className="col-span-2 text-sm text-gray-800">
                          {item.value}
                        </span>
                      </div>
                    ),
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="p-0 pt-2">
            <div className="space-y-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-2 flex items-center text-gray-800">
                  <Truck className="h-4 w-4 mr-2 text-primary" />
                  Shipping Information
                </h3>

                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>Inside Dhaka: Delivery within 1–2 days</li>
                  <li>Outside Dhaka: Delivery within 2–3 days</li>
                  <li>Pre-order: Delivery within 10–25 days</li>
                </ul>

                <p className="text-xs text-gray-500 mt-2">
                  Delivery time may vary depending on product availability and
                  location.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="p-0 pt-4">
            <ProductReviewsSection product={product} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProductReviewsSection({ product }: { product: TProduct | undefined }) {
  const userInfo = useAppSelector(useCurrentUserInfo);
  const identifier = product?.url_handle || product?._id;
  const { data: reviewsData, isLoading } = useGetReviewsByProductQuery(
    identifier,
    { skip: !identifier },
  );
  const reviews = reviewsData?.data || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
      {/* Left Side: Reviews List */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Customer Reviews
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-gray-500 text-sm">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          reviews.map((review: any) => (
            <div
              key={review._id}
              className="border-b border-gray-100 pb-6 last:border-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                  {review.user_id?.image || review.reviewer_image ? (
                    <img
                      src={review.user_id?.image || review.reviewer_image}
                      className="h-full w-full rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <User className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h4 className="font-bold text-sm text-gray-900">
                      {review.user_id?.name ||
                        review.reviewer_name ||
                        "Verified Customer"}
                    </h4>
                    <span className="text-[11px] text-gray-500">
                      {review.createdAt
                        ? format(new Date(review.createdAt), "MMMM dd, yyyy")
                        : ""}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Side: Submit Review Form */}
      <div className="lg:col-span-1">
        <div className="bg-white border rounded-xl md:p-6 p-3 shadow-sm sticky top-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Write a Review
          </h3>
          {userInfo ? (
            <ReviewForm product={product} />
          ) : (
            <div className="text-center space-y-3 py-4">
              <p className="text-sm text-gray-600 italic">
                Please login to share your experience with this product.
              </p>
              <Link href="/login">
                <button className="w-full py-2 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90 transition">
                  Login Now
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewForm({ product }: { product: TProduct | undefined }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Please enter a comment");

    try {
      await createReview({
        product_id: product?._id,
        rating,
        comment,
      }).unwrap();

      toast.success("Review submitted! It will appear once approved.");
      setComment("");
      setRating(5);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="hover:scale-110 transition p-1"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
          Comment
        </label>
        <textarea
          required
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition resize-none"
          placeholder="Share your thoughts about this product..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Submit Review
      </button>
    </form>
  );
}
