import { getServerSideSitemap } from "next-sitemap";
import { ISitemapField } from "next-sitemap";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shoppingcart.bd";

  // Fetch products
  let products = [];
  try {
    const res = await fetch(`${API_BASE}/products?limit=1000`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    const json = await res.json();
    products = json.data || [];
  } catch (e) {
    console.error("Sitemap: Failed to fetch products", e);
  }

  // Fetch blogs
  let blogs = [];
  try {
    const res = await fetch(`${API_BASE}/blogs?limit=1000`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    const json = await res.json();
    blogs = json.data || [];
  } catch (e) {
    console.error("Sitemap: Failed to fetch blogs", e);
  }

  // Fetch brands
  let brands = [];
  try {
    const res = await fetch(`${API_BASE}/brands?limit=1000`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    brands = json.data?.brands || [];
  } catch (e) {
    console.error("Sitemap: Failed to fetch brands", e);
  }

  // Fetch collections
  let collections = [];
  try {
    const res = await fetch(`${API_BASE}/collections?limit=1000`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    collections = json.data?.collections || [];
  } catch (e) {
    console.error("Sitemap: Failed to fetch collections", e);
  }

  const fields: ISitemapField[] = [
    ...products.map((p: any) => ({
      loc: `${siteUrl}/products/${p.url_handle}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily" as const,
      priority: 0.7,
    })),
    ...blogs.map((b: any) => ({
      loc: `${siteUrl}/blogs/${b.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.6,
    })),
    ...brands.map((b: any) => ({
      loc: `${siteUrl}/brands/${b.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.6,
    })),
    ...collections.map((c: any) => ({
      loc: `${siteUrl}/collections/${c.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.6,
    })),
  ];

  return getServerSideSitemap(fields);
}
