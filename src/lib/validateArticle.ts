import { Article, CATEGORY_ORDER } from "@/content/types";

export function validateArticle(payload: Partial<Article>): string | null {
  if (!payload.slug || !/^[a-z0-9-]+$/.test(payload.slug)) {
    return "Slug yalnız kiçik latın hərfləri, rəqəm və tire ola bilər.";
  }
  if (!payload.title?.trim()) return "Başlıq tələb olunur.";
  if (!payload.excerpt?.trim()) return "Qısa təsvir tələb olunur.";
  if (!Array.isArray(payload.body) || payload.body.length === 0) return "Mətn tələb olunur.";
  if (!payload.category || !CATEGORY_ORDER.includes(payload.category)) return "Kateqoriya düzgün deyil.";
  if (!payload.publishedAt || !/^\d{4}-\d{2}-\d{2}$/.test(payload.publishedAt)) return "Tarix düzgün deyil.";
  if (!payload.readingMinutes || payload.readingMinutes < 1) return "Oxu müddəti düzgün deyil.";
  if (!payload.gradient?.trim()) return "Fon rəngi seçin.";
  if (!payload.emoji?.trim()) return "Emoji tələb olunur.";
  return null;
}
