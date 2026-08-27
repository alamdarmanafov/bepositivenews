export type CategoryKey =
  | "environment"
  | "health"
  | "technology"
  | "community"
  | "science"
  | "culture";

export type Article = {
  slug: string;
  category: CategoryKey;
  title: string;
  excerpt: string;
  body: string[];
  publishedAt: string;
  readingMinutes: number;
  featured?: boolean;
  gradient: string;
  emoji: string;
};

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  environment: "Ətraf mühit",
  health: "Sağlamlıq",
  technology: "Texnologiya",
  community: "Cəmiyyət",
  science: "Elm",
  culture: "Mədəniyyət",
};
