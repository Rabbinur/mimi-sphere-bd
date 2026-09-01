import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Mimi Sphere",
  description: "Learn about Mimi Sphere's mission: Everything You Need, All in One Place.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
