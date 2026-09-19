import { TCategory } from "@/types";
import CategoryProductSection from "./CategoryProductSection";
import ParallaxBrandBanner from "./ParallaxBrandBanner";

interface HomeCategorySectionsProps {
  categories: TCategory[];
}

const HomeCategorySections = ({ categories }: HomeCategorySectionsProps) => {
  const getCategoryOrder = (category: TCategory) =>
    typeof category.order === "number" && !isNaN(category.order) && category.order > 0
      ? category.order
      : Number.MAX_SAFE_INTEGER;

  // Only active main categories, sorted by order ascending
  const mainCategories = (
    categories?.filter((cat) => !cat.parent_category_id && cat.isActive !== false) || []
  ).sort((a, b) => {
    const diff = getCategoryOrder(a) - getCategoryOrder(b);
    if (diff !== 0) return diff;
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeA - timeB;
  });

  if (mainCategories.length === 0) return null;

  // Split categories into two halves so ParallaxBrandBanner sits gracefully in the middle
  const midpoint = Math.max(1, Math.min(2, Math.floor(mainCategories.length / 2)));
  const firstBatch = mainCategories.slice(0, midpoint);
  const secondBatch = mainCategories.slice(midpoint);

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* First Batch of Categories (Alternating Left/Right) */}
      {firstBatch.map((category, index) => (
        <CategoryProductSection
          key={category._id}
          category={category}
          bannerPosition={index % 2 === 0 ? "left" : "right"}
          index={index}
        />
      ))}

      {/* 🌟 Parallax Mission & Lifestyle Banner in Between */}
      <ParallaxBrandBanner />

      {/* Second Batch of Categories (Continuing Alternating Left/Right) */}
      {secondBatch.map((category, index) => {
        const overallIndex = midpoint + index;
        return (
          <CategoryProductSection
            key={category._id}
            category={category}
            bannerPosition={overallIndex % 2 === 0 ? "left" : "right"}
            index={overallIndex}
          />
        );
      })}
    </div>
  );
};

export default HomeCategorySections;
