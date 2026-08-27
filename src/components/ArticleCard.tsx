import Link from "next/link";
import { Article } from "@/content/types";
import { formatDateAz } from "@/lib/format";
import CategoryBadge from "./CategoryBadge";

export default function ArticleCard({
  article,
  size = "default",
}: {
  article: Article;
  size?: "default" | "large";
}) {
  const isLarge = size === "large";
  const href = `/meqale/${article.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <div
          className={`flex items-center justify-center bg-gradient-to-br ${article.gradient} ${
            isLarge ? "h-56 sm:h-72" : "h-40"
          }`}
        >
          <span className={isLarge ? "text-6xl" : "text-4xl"} aria-hidden>
            {article.emoji}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <CategoryBadge category={article.category} className="self-start" />
        <Link href={href} className="flex flex-1 flex-col gap-3">
          <h3
            className={`font-bold leading-snug tracking-tight group-hover:text-accent ${
              isLarge ? "text-2xl sm:text-3xl" : "text-lg"
            }`}
          >
            {article.title}
          </h3>
          <p className={`text-foreground/70 ${isLarge ? "text-base" : "text-sm"} line-clamp-3`}>
            {article.excerpt}
          </p>
          <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-foreground/50">
            <time dateTime={article.publishedAt}>{formatDateAz(article.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{article.readingMinutes} dəqiqəlik oxu</span>
          </div>
        </Link>
      </div>
    </article>
  );
}
