import { TCategory } from "@/types";
import CategoryProductSection from "./CategoryProductSection";

interface HomeCategorySectionsProps {
  categories: TCategory[];
}

const HomeCategorySections = ({ categories }: HomeCategorySectionsProps) => {
  // Only main categories
  const mainCategories = categories?.filter(cat => !cat.parent_category_id) || [];

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-10">
      {mainCategories.map((category) => (
        <CategoryProductSection key={category._id} category={category} />
      ))}
    </div>
  );
};

export default HomeCategorySections;
