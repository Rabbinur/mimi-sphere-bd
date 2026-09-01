import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Status | Shopping Cart BD",
  description: "Check your payment status and order confirmation details at Shopping Cart BD.",
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
