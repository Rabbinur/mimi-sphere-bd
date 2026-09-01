import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | Mimi Sphere",
  description: "Securely complete your purchase at Mimi Sphere. Fast and reliable online shopping with secure payment options.",
  alternates: {
    canonical: "https://www.mimisphere.com/checkout",
  },
  robots: {
    index: false,
    follow: false,
  }
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
