import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Shopping Cart BD",
  description: "Join Shopping Cart BD today. Create an account to start sourcing premium products from around the world.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
