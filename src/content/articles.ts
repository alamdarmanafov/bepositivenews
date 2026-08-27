import { Article } from "./types";
import data from "./articles.json";

export const articles: Article[] = data as Article[];

export function getFeaturedArticle(): Article {
  return articles.find((a) => a.featured) ?? articles[0];
}

export function getLatestArticles(excludeSlug?: string): Article[] {
  return articles
    .filter((a) => a.slug !== excludeSlug)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles
    .filter((a) => a.category === category)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
