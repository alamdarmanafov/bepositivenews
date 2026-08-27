import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { CATEGORY_ORDER } from "@/content/types";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/xeberler`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/haqqimizda`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_ORDER.map((category) => ({
    url: `${SITE_URL}/kateqoriya/${category}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/meqale/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
