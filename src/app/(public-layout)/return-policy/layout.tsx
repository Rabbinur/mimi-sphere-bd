import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Shopping Cart BD",
  description: "Experience hassle-free returns and exchanges at Shopping Cart BD. Learn about our easy return process for trendy products in Bangladesh.",
  keywords: ["return policy BD", "exchange policy Shopping Cart BD", "easy returns Bangladesh", "online shopping BD returns"],
  alternates: {
    canonical: "https://www.shoppingcart.bd/return-policy",
  },
};

export default function ReturnPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
