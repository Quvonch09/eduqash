import { MetadataRoute } from "next";
import { initialCenters } from "@/data/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eduqash.uz";

  const centerUrls = initialCenters.map((center) => ({
    url: `${baseUrl}/?center=${center.id}`,
    lastModified: new Date(center.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...centerUrls,
  ];
}
