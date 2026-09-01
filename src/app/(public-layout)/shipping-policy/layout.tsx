import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Shopping Cart BD",
  description: "Experience fast 48-72 hour home delivery across Bangladesh with Shopping Cart BD. No advance charges, easy tracking, and instant return policy.",
  keywords: ["shipping policy BD", "delivery times Bangladesh", "cash on delivery BD", "home delivery charges Bangladesh"],
  alternates: {
    canonical: "https://www.shoppingcart.bd/shipping-policy",
  },
};

export default function ShippingPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
