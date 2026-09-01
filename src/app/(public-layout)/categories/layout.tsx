import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop by Category | Shopping Cart BD Fashion & More",
  description: "Explore our diverse categories from Girls Fashion to Mom & Baby care. Trendy Korean and Chinese products delivered anywhere in Bangladesh.",
  keywords: ["shop by category BD", "fashion categories BD", "Korean accessories online", "trendy girls fashion", "Shopping Cart BD categories"],
  alternates: {
    canonical: "https://www.shoppingcart.bd/categories",
  },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
