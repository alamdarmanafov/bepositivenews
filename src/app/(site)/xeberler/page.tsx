import type { Metadata } from "next";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import { getLatestArticles } from "@/content/articles";

const description = "Be Positive News-də dərc olunan bütün xəbərlərin siyahısı.";

export const metadata: Metadata = {
  title: "Bütün xəbərlər",
  description,
  alternates: {
    canonical: "/xeberler",
  },
  openGraph: {
    title: "Bütün xəbərlər · Be Positive News",
    description,
    url: "/xeberler",
  },
};

export default function AllArticlesPage() {
  const articles = getLatestArticles();

  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">Arxiv</span>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Bütün xəbərlər</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </Container>
  );
}
