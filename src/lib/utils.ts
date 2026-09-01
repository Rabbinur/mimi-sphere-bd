import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getProxiedUrl = (url: string | undefined) => {
  if (!url) return "";
  // If it's already a data URL, localhost, or already proxied, return as is
  if (url.startsWith("data:") || url.includes("localhost") || url.includes("proxy?url=")) return url;

  // List of domains that are typically blocked or have CORS issues
  const blockedDomains = ["alicdn.com", "1688.com", "alicdn"];
  const shouldProxy = blockedDomains.some(domain => url.includes(domain));

  if (shouldProxy) {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1/";
    const baseUrl = API_URL.endsWith("/") ? API_URL : `${API_URL}/`;
    return `${baseUrl}file/proxy?url=${encodeURIComponent(url)}`;
  }

  return url;
};

/**
 * Checks if a product is a pre-order product either by its flag or its category.
 */
export function isProductPreOrder(product: any): boolean {
  if (!product) return false;
  
  if (product.is_pre_order) return true;

  // Check product_categories if they are populated objects
  if (Array.isArray(product.product_categories)) {
    return product.product_categories.some((cat: any) => {
      if (typeof cat === "object" && cat !== null) {
        return cat.slug === "pre-order";
      }
      return false;
    });
  }

  // Check single category if populated
  if (product.category && typeof product.category === "object") {
    return product.category.slug === "pre-order";
  }

  return false;
}
