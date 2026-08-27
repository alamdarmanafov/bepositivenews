import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/Container";
import ArticleCard from "@/components/ArticleCard";
import CategoryBadge from "@/components/CategoryBadge";
import { articles, getArticleBySlug, getArticlesByCategory } from "@/content/articles";
import { CATEGORY_LABELS } from "@/content/types";
import { formatDateAz } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getArticlesByCategory(article.category)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <Container className="flex flex-col gap-10 py-10 sm:py-14">
      <div>
        <Link href="/" className="text-sm font-medium text-foreground/60 hover:text-accent">
          ← Ana səhifəyə qayıt
        </Link>
      </div>

      <article className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <CategoryBadge category={article.category} className="self-start" />
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{article.title}</h1>
        <div className="flex items-center gap-2 text-sm text-foreground/50">
          <time dateTime={article.publishedAt}>Nəşr tarixi: {formatDateAz(article.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{article.readingMinutes} dəqiqəlik oxu</span>
        </div>

        <div
          className={`flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br sm:h-80 ${article.gradient}`}
        >
          <span className="text-7xl" aria-hidden>
            {article.emoji}
          </span>
        </div>

        <div className="flex flex-col gap-5 text-lg leading-relaxed text-foreground/90">
          {article.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto w-full max-w-5xl">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground/50">
            {CATEGORY_LABELS[article.category]} bölməsindən daha çox
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
