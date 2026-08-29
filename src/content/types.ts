export type CategoryKey = "biznes" | "texnologiya" | "ai" | "sosial-media" | "marketinq";

export type Article = {
  slug: string;
  category: CategoryKey;
  title: string;
  excerpt: string;
  body: string[];
  publishedAt: string;
  readingMinutes: number;
  featured?: boolean;
  /** Cover photo path (e.g. "/uploads/slug-169.jpg"). Required for new articles. */
  image?: string;
  /** Legacy fallback visuals, used only when image is absent. */
  gradient?: string;
  emoji?: string;
  /** Original source, shown as an attribution link at the end of the article. */
  sourceUrl?: string;
  sourceName?: string;
};

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  biznes: "Biznes",
  texnologiya: "Texnologiya",
  ai: "AI",
  "sosial-media": "Sosial Media",
  marketinq: "Marketinq",
};

export const CATEGORY_ORDER: CategoryKey[] = ["texnologiya", "ai", "marketinq", "biznes", "sosial-media"];
