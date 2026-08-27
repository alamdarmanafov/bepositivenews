"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Article, CATEGORY_LABELS, CATEGORY_ORDER, CategoryKey } from "@/content/types";
import { GRADIENT_PRESETS } from "@/lib/gradientPresets";
import { slugify } from "@/lib/slug";

type Props = { mode: "create" } | { mode: "edit"; initial: Article };

const inputClass =
  "w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary";
const labelClass = "text-sm font-semibold";

export default function ArticleForm(props: Props) {
  const router = useRouter();
  const initial = props.mode === "edit" ? props.initial : undefined;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(props.mode === "edit");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body.join("\n\n") ?? "");
  const [category, setCategory] = useState<CategoryKey>(initial?.category ?? CATEGORY_ORDER[0]);
  const [publishedAt, setPublishedAt] = useState(initial?.publishedAt ?? new Date().toISOString().slice(0, 10));
  const [readingMinutes, setReadingMinutes] = useState(initial?.readingMinutes ?? 3);
  const [emoji, setEmoji] = useState(initial?.emoji ?? "📰");
  const [gradient, setGradient] = useState(initial?.gradient ?? GRADIENT_PRESETS[0].value);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const payload: Article = {
      slug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      body: body
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
      category,
      publishedAt,
      readingMinutes: Number(readingMinutes),
      emoji: emoji.trim(),
      gradient,
      featured,
    };

    const url = props.mode === "create" ? "/api/admin/articles" : `/api/admin/articles/${initial!.slug}`;
    const method = props.mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Xəta baş verdi.");
    }
  }

  async function handleDelete() {
    if (props.mode !== "edit") return;
    if (!confirm("Bu xəbəri silmək istədiyinizə əminsiniz?")) return;

    setSubmitting(true);
    setError("");
    const res = await fetch(`/api/admin/articles/${initial!.slug}`, { method: "DELETE" });
    setSubmitting(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Xəta baş verdi.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={labelClass}>
          Başlıq
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className={labelClass}>
          Slug (URL)
        </label>
        <input
          id="slug"
          required
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          pattern="[a-z0-9-]+"
          className={inputClass}
        />
        <p className="text-xs text-foreground/50">/meqale/{slug || "…"}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="excerpt" className={labelClass}>
          Qısa təsvir
        </label>
        <textarea
          id="excerpt"
          required
          rows={2}
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className={labelClass}>
          Mətn
        </label>
        <textarea
          id="body"
          required
          rows={10}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Hər paraqrafı boş sətirlə ayırın."
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className={labelClass}>
            Kateqoriya
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value as CategoryKey)}
            className={inputClass}
          >
            {CATEGORY_ORDER.map((key) => (
              <option key={key} value={key}>
                {CATEGORY_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="publishedAt" className={labelClass}>
            Tarix
          </label>
          <input
            id="publishedAt"
            type="date"
            required
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="readingMinutes" className={labelClass}>
            Oxu müddəti (dəq)
          </label>
          <input
            id="readingMinutes"
            type="number"
            min={1}
            max={30}
            required
            value={readingMinutes}
            onChange={(event) => setReadingMinutes(Number(event.target.value))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="emoji" className={labelClass}>
            Emoji
          </label>
          <input
            id="emoji"
            required
            value={emoji}
            onChange={(event) => setEmoji(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="gradient" className={labelClass}>
          Fon rəngi
        </label>
        <select
          id="gradient"
          value={gradient}
          onChange={(event) => setGradient(event.target.value)}
          className={inputClass}
        >
          {GRADIENT_PRESETS.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>
        <div className={`mt-1 h-10 w-full rounded-lg bg-gradient-to-br ${gradient}`} />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={featured}
          onChange={(event) => setFeatured(event.target.checked)}
          className="h-4 w-4 rounded border-border-subtle"
        />
        Əsas səhifədə &ldquo;Əsas xəbər&rdquo; kimi göstər
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Yadda saxlanılır…" : props.mode === "create" ? "Dərc et" : "Yadda saxla"}
        </button>
        {props.mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="rounded-full border border-red-300 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Sil
          </button>
        )}
      </div>
    </form>
  );
}
