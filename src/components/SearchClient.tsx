"use client";

import { useMemo, useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/content/articles";
import { CATEGORY_LABELS } from "@/content/types";

export default function SearchClient() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("az");
    if (!q) return [];
    return articles.filter((article) => {
      const haystack = `${article.title} ${article.excerpt} ${CATEGORY_LABELS[article.category]}`.toLocaleLowerCase(
        "az",
      );
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <>
      <label htmlFor="search-input" className="sr-only">
        Axtarış
      </label>
      <input
        id="search-input"
        type="search"
        autoFocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Başlıq, kateqoriya və ya açar söz yazın…"
        className="w-full max-w-xl rounded-full border border-border-subtle bg-surface px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {query.trim() === "" ? (
        <p className="text-sm text-foreground/60">Axtarışa başlamaq üçün yuxarıya yazın.</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-foreground/60">&ldquo;{query}&rdquo; üçün nəticə tapılmadı.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </>
  );
}
