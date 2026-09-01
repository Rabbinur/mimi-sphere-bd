import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order | Mimi Sphere",
  description: "Track your shipment in real-time. Check live order and delivery status with Mimi Sphere.",
  keywords: ["track order BD", "track shipment", "order status Mimi Sphere", "mimi sphere delivery"],
  alternates: {
    canonical: "https://www.mimisphere.com/track-order",
  },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
