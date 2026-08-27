import Link from "next/link";
import { Article } from "@/content/types";
import { formatDateAz } from "@/lib/format";
import CategoryBadge from "./CategoryBadge";

export default function ArticleCard({
  article,
  size = "default",
}: {
  article: Article;
  size?: "default" | "large" | "side";
}) {
  const isLarge = size === "large";
  const isSide = size === "side";
  const href = `/meqale/${article.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} className="relative block">
        <div
          className={`flex items-center justify-center bg-gradient-to-br ${article.gradient} ${
            isLarge ? "h-56 sm:h-72" : isSide ? "h-24" : "h-40"
          }`}
        >
          <span className={isLarge ? "text-6xl" : isSide ? "text-2xl" : "text-4xl"} aria-hidden>
            {article.emoji}
          </span>
        </div>
        <CategoryBadge category={article.category} asLink={false} className="absolute left-3 top-3" />
      </Link>

      <div className={`flex flex-1 flex-col gap-2 ${isSide ? "p-3" : "p-5"}`}>
        <Link href={href} className="flex flex-1 flex-col gap-2">
          <h3
            className={`font-bold leading-snug tracking-tight group-hover:text-primary ${
              isLarge ? "text-2xl sm:text-3xl" : isSide ? "text-sm" : "text-lg"
            }`}
          >
            {article.title}
          </h3>
          {!isSide && (
            <p className={`text-foreground/70 ${isLarge ? "text-base" : "text-sm"} line-clamp-3`}>
              {article.excerpt}
            </p>
          )}
          <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-foreground/50">
            <time dateTime={article.publishedAt}>{formatDateAz(article.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{article.readingMinutes} dəq oxu</span>
          </div>
        </Link>
      </div>
    </article>
  );
}
