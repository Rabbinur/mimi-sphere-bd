import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop by Category | Mimi Sphere",
  description: "Explore our diverse categories from Fashion, Cosmetics, to Lifestyle essentials. Authentic products delivered anywhere in Bangladesh with Mimi Sphere.",
  keywords: ["shop by category BD", "fashion categories BD", "Korean accessories online", "Mimi Sphere categories"],
  alternates: {
    canonical: "https://www.mimisphere.com/categories",
  },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
