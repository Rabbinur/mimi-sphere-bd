import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Status | Mimi Sphere",
  description: "Check your payment status and order confirmation details at Mimi Sphere.",
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
