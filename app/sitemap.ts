import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts().filter((p) => p.available);
  return [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/produtos`, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({
      url: `${site.url}/produtos/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(p.image ? { images: [`${site.url}${p.image}`] } : {}),
    })),
  ];
}
