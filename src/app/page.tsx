import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import HeroSlider from "@/components/HeroSlider";
import CategoryTabs from "@/components/CategoryTabs";
import Newsletter from "@/components/Newsletter";
import { getLatestArticles } from "@/content/articles";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const latest = getLatestArticles();
  const heroSlides = latest.slice(0, 4);
  const sideCards = latest.slice(4, 7);
  const gridArticles = latest.slice(7, 13);

  return (
    <Container className="flex flex-col gap-10 py-6 sm:py-10">
      <h1 className="sr-only">Be Positive News — Azərbaycan və dünyadan yoxlanılmış yaxşı xəbərlər</h1>

      <section className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
        <div className="h-72 sm:h-96 lg:h-auto lg:col-span-2">
          <HeroSlider slides={heroSlides} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {sideCards.map((article) => (
            <ArticleCard key={article.slug} article={article} size="side" />
          ))}
        </div>
      </section>

      <section id="kateqoriyalar" className="scroll-mt-20">
        <CategoryTabs />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">Son xəbərlər</h2>
          <Link href="/xeberler" className="text-sm font-semibold text-primary hover:underline">
            Hamısına bax →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <Newsletter />
    </Container>
  );
}
