import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order | Shopping Cart BD",
  description: "Track your international shipment in real-time. Check the live status of your trendy Korean & Chinese products with Shopping Cart BD's reliable tracking.",
  keywords: ["track order BD", "track international shipment", "order status Shopping Cart BD", "trendy products delivery", "online shopping BD tracking"],
  alternates: {
    canonical: "https://www.shoppingcart.bd/track-order",
  },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
