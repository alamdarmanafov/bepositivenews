export type CategoryKey =
  | "azerbaycan"
  | "dunya"
  | "biznes"
  | "texnologiya"
  | "ai"
  | "sosial-media"
  | "marketinq";

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
};

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  azerbaycan: "Azərbaycan",
  dunya: "Dünya",
  biznes: "Biznes",
  texnologiya: "Texnologiya",
  ai: "AI",
  "sosial-media": "Sosial Media",
  marketinq: "Marketinq",
};

export const CATEGORY_ICONS: Record<CategoryKey, string> = {
  azerbaycan: "🇦🇿",
  dunya: "🌍",
  biznes: "💼",
  texnologiya: "💻",
  ai: "🤖",
  "sosial-media": "📱",
  marketinq: "📣",
};

export const CATEGORY_ORDER: CategoryKey[] = [
  "azerbaycan",
  "dunya",
  "biznes",
  "texnologiya",
  "ai",
  "sosial-media",
  "marketinq",
];
