import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { listSupplierSlugs } from "@/lib/data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listSupplierSlugs();
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/suppliers", priority: 0.9 },
    { path: "/categories", priority: 0.8 },
    { path: "/products", priority: 0.8 },
    { path: "/for-suppliers", priority: 0.7 },
    { path: "/register-business", priority: 0.7 },
    { path: "/how-it-works", priority: 0.5 },
    { path: "/about", priority: 0.4 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route.priority,
    })),
    ...CATEGORIES.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...slugs.map((slug) => ({
      url: `${baseUrl}/suppliers/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
