import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | Shopping Cart BD",
  description: "Securely complete your purchase at Shopping Cart BD. Fast and reliable online shopping BD with secure payment gateways.",
  alternates: {
    canonical: "https://www.shoppingcart.bd/checkout",
  },
  robots: {
    index: false,
    follow: false,
  }
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
