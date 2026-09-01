import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Mimi Sphere",
  description: "Learn how Mimi Sphere collects, uses, and protects your personal information. We are committed to ensuring your privacy and data security.",
  keywords: ["privacy policy", "data protection", "mimi sphere privacy"],
  alternates: {
    canonical: "https://www.mimisphere.com/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
