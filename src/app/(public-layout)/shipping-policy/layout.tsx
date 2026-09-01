import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Mimi Sphere",
  description: "Experience fast 48-72 hour home delivery across Bangladesh with Mimi Sphere. No hidden charges, easy tracking, and reliable service.",
  keywords: ["shipping policy", "delivery times Bangladesh", "cash on delivery BD", "mimi sphere shipping"],
  alternates: {
    canonical: "https://www.mimisphere.com/shipping-policy",
  },
};

export default function ShippingPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
