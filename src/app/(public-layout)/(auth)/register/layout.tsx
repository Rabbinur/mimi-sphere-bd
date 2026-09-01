import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Mimi Sphere",
  description: "Join Mimi Sphere today. Create an account to start shopping authentic products.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
