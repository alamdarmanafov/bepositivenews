import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import HeroSlider from "@/components/HeroSlider";
import CategoryTabs from "@/components/CategoryTabs";
import Newsletter from "@/components/Newsletter";
import { getLatestArticles } from "@/content/articles";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const latest = getLatestArticles();
  // With few articles, spread them across hero/side/grid instead of dumping
  // everything into the hero slider and leaving the rest of the page empty.
  const heroCount = latest.length >= 10 ? 10 : latest.length >= 4 ? Math.ceil(latest.length / 2) : latest.length;
  const heroSlides = latest.slice(0, heroCount);
  const afterHero = latest.slice(heroCount);
  const sideCount = Math.min(3, afterHero.length);
  const sideCards = afterHero.slice(0, sideCount);
  const gridArticles = afterHero.slice(sideCount, sideCount + 6);

  return (
    <Container className="flex flex-col gap-10 py-6 sm:py-10">
      <h1 className="sr-only">{SITE_NAME} — Texnologiya, süni intellekt və marketinq xəbərləri</h1>

      <section className={`grid gap-4 ${sideCards.length > 0 ? "lg:grid-cols-3 lg:items-stretch" : ""}`}>
        <div className={`h-72 sm:h-96 lg:h-[26rem] ${sideCards.length > 0 ? "lg:col-span-2" : ""}`}>
          <HeroSlider slides={heroSlides} />
        </div>
        {sideCards.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {sideCards.map((article) => (
              <ArticleCard key={article.slug} article={article} size="side" />
            ))}
          </div>
        )}
      </section>

      <section id="kateqoriyalar" className="scroll-mt-20">
        <CategoryTabs />
      </section>

      {gridArticles.length > 0 && (
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
      )}

      <Newsletter />
    </Container>
  );
}
