import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import { getFeaturedArticle, getLatestArticles } from "@/content/articles";
import { CATEGORY_LABELS, CategoryKey } from "@/content/types";
import Link from "next/link";

const categoryEntries = Object.entries(CATEGORY_LABELS) as [CategoryKey, string][];

export default function Home() {
  const featured = getFeaturedArticle();
  const latest = getLatestArticles(featured.slug).slice(0, 6);

  return (
    <Container className="flex flex-col gap-16 py-10 sm:py-14">
      <section className="flex flex-col gap-6 text-center">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-surface-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
          Bu günün xoş xəbəri
        </span>
        <h1 className="mx-auto max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          Yaxşı şeylər baş verir. Biz onları axtarırıq.
        </h1>
        <p className="mx-auto max-w-xl text-base text-foreground/70 sm:text-lg">
          Elm, sağlamlıq, ətraf mühit, cəmiyyət və mədəniyyət sahələrindən təsdiqlənmiş, ürəkaçan xəbərlər.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground/50">Seçilmiş xəbər</h2>
        <ArticleCard article={featured} size="large" />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">Son xəbərlər</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground/50">
          Bütün kateqoriyalara bax
        </h2>
        <div className="flex flex-wrap gap-3">
          {categoryEntries.map(([key, label]) => (
            <Link
              key={key}
              href={`/kateqoriya/${key}`}
              className="rounded-full border border-border-subtle bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />
    </Container>
  );
}
