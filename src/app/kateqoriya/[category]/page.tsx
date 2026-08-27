import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory } from "@/content/articles";
import { CATEGORY_LABELS, CategoryKey } from "@/content/types";

type Props = { params: Promise<{ category: string }> };

function isCategoryKey(value: string): value is CategoryKey {
  return value in CATEGORY_LABELS;
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_LABELS).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isCategoryKey(category)) return {};
  return { title: CATEGORY_LABELS[category] };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategoryKey(category)) notFound();

  const articles = getArticlesByCategory(category);

  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">Kateqoriya</span>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          {CATEGORY_LABELS[category]} bölməsindəki xəbərlər
        </h1>
      </div>

      {articles.length === 0 ? (
        <p className="text-foreground/60">Bu kateqoriyada hələ xəbər yoxdur — tezliklə yenilənəcək.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </Container>
  );
}
