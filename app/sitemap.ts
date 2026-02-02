import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://guilhascarnes.com.br";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/produtos`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/eventos`,
      lastModified: new Date(),
    },
  ];
}