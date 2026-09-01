import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Order & Sourcing | Shopping Cart BD | Shopping Cart BD",
  description: "Request a custom product from any international store including Amazon, Taobao, or 1688. Shopping Cart BD handles the sourcing and logistics for you.",
  alternates: {
    canonical: "https://www.shoppingcart.bd/custom-order",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: ["custom order", "product sourcing", "international shopping", "Amazon", "Taobao", "1688", "Shopping Cart BD", "global logistics"],
};

export default function CustomOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
