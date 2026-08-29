"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Article, CATEGORY_LABELS, CATEGORY_ORDER, CategoryKey } from "@/content/types";
import { slugify } from "@/lib/slug";

type Props = { mode: "create" } | { mode: "edit"; initial: Article };

const inputClass =
  "w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary";
const labelClass = "text-sm font-semibold";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_ORIGINAL_BYTES = 20 * 1024 * 1024;
const MAX_DIMENSION = 1600;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Şəkil oxuna bilmədi."));
    };
    img.src = url;
  });
}

/** Downscales to at most MAX_DIMENSION and re-encodes as JPEG so uploads stay small. */
async function compressImage(file: File): Promise<File> {
  const img = await loadImageElement(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);

  const toBlob = (quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));

  let blob = await toBlob(0.82);
  if (blob && blob.size > MAX_IMAGE_BYTES) blob = await toBlob(0.6);
  if (!blob) return file;

  const name = file.name.replace(/\.[^./]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}

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
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [sourceUrl, setSourceUrl] = useState(initial?.sourceUrl ?? "");
  const [sourceName, setSourceName] = useState(initial?.sourceName ?? "");

  const [existingImage, setExistingImage] = useState(initial?.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressingImage, setCompressingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const [aiSourceUrl, setAiSourceUrl] = useState("");
  const [aiSourceText, setAiSourceText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  async function handleAiDraft() {
    if (!aiSourceUrl.trim() && !aiSourceText.trim()) {
      setAiError("Link və ya mənbə mətnini daxil edin.");
      return;
    }
    setAiLoading(true);
    setAiError("");

    const res = await fetch("/api/admin/ai-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceUrl: aiSourceUrl, sourceText: aiSourceText }),
    });

    setAiLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setAiError(data.error ?? "AI xəbəri hazırlaya bilmədi.");
      return;
    }

    const draft = (await res.json()) as {
      title: string;
      excerpt: string;
      body: string[];
      category: CategoryKey;
      readingMinutes: number;
      sourceUrl?: string;
      sourceName?: string;
    };

    handleTitleChange(draft.title);
    setExcerpt(draft.excerpt);
    setBody(draft.body.join("\n\n"));
    setCategory(draft.category);
    setReadingMinutes(draft.readingMinutes);
    if (draft.sourceUrl) setSourceUrl(draft.sourceUrl);
    if (draft.sourceName) setSourceName(draft.sourceName);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Yalnız JPG, PNG və ya WEBP şəkillərinə icazə var.");
      return;
    }
    if (file.size > MAX_ORIGINAL_BYTES) {
      setError("Şəkil 20MB-dan kiçik olmalıdır.");
      return;
    }

    setError("");
    setCompressingImage(true);
    let compressed: File;
    try {
      compressed = await compressImage(file);
    } catch {
      setCompressingImage(false);
      setError("Şəkil emal edilə bilmədi.");
      return;
    }
    setCompressingImage(false);

    if (compressed.size > MAX_IMAGE_BYTES) {
      setError("Şəkil sıxıldıqdan sonra da çox böyükdür — daha kiçik ölçülü şəkil sınayın.");
      return;
    }

    setImageFile(compressed);
    setImagePreview(await readFileAsDataUrl(compressed));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!imageFile && !existingImage) {
      setError("Şəkil seçin.");
      return;
    }

    setSubmitting(true);
    let image = existingImage;

    if (imageFile) {
      setUploadingImage(true);
      const dataUrl = await readFileAsDataUrl(imageFile);
      const contentBase64 = dataUrl.split(",")[1];

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, mimeType: imageFile.type, contentBase64 }),
      });
      setUploadingImage(false);

      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        setError(data.error ?? "Şəkil yüklənmədi.");
        setSubmitting(false);
        return;
      }
      const uploadData = (await uploadRes.json()) as { path: string };
      image = uploadData.path;
    }

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
      image,
      gradient: initial?.gradient,
      emoji: initial?.emoji,
      featured,
      sourceUrl: sourceUrl.trim() || undefined,
      sourceName: sourceName.trim() || undefined,
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

  const displayedImage = imagePreview ?? existingImage;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {props.mode === "create" && (
        <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4">
          <label htmlFor="aiSourceUrl" className={labelClass}>
            AI ilə yaz — xəbər linki və ya mətn
          </label>
          <input
            id="aiSourceUrl"
            type="url"
            value={aiSourceUrl}
            onChange={(event) => setAiSourceUrl(event.target.value)}
            placeholder="https://... (xəbər saytının linki)"
            className={inputClass}
          />
          <p className="text-center text-xs text-foreground/40">— və ya —</p>
          <textarea
            id="aiSourceText"
            rows={5}
            value={aiSourceText}
            onChange={(event) => setAiSourceText(event.target.value)}
            placeholder="Xəbərin orijinal mətnini (və ya qısa təsvirini) bura yapışdırın…"
            className={inputClass}
          />
          {aiError && <p className="text-sm text-red-600">{aiError}</p>}
          <button
            type="button"
            onClick={handleAiDraft}
            disabled={aiLoading}
            className="self-start rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {aiLoading ? "Yazılır…" : "AI ilə xəbər yaz"}
          </button>
          <p className="text-xs text-foreground/50">
            Link versən, AI səhifəni açıb ən aktual xəbəri özü seçəcək. Aşağıdakı sahələr avtomatik
            dolacaq — dərc etməzdən əvvəl mütləq oxuyub yoxlayın.
          </p>
        </div>
      )}

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

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Şəkil</label>
        {compressingImage ? (
          <div className="flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-border-subtle text-sm text-foreground/50">
            Şəkil sıxılır…
          </div>
        ) : displayedImage ? (
          <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border-subtle">
            <Image src={displayedImage} alt="" fill unoptimized className="object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white hover:bg-black/80"
            >
              Sil
            </button>
          </div>
        ) : (
          <label
            htmlFor="image"
            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border-subtle text-sm text-foreground/50 hover:border-primary hover:text-primary"
          >
            <span>Şəkil seçmək üçün klikləyin</span>
            <span className="text-xs">JPG, PNG və ya WEBP · avtomatik sıxılacaq</span>
          </label>
        )}
        <input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect}
          className="hidden"
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sourceUrl" className={labelClass}>
            Mənbə linki (istəyə bağlı)
          </label>
          <input
            id="sourceUrl"
            type="url"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sourceName" className={labelClass}>
            Mənbə adı (istəyə bağlı)
          </label>
          <input
            id="sourceName"
            value={sourceName}
            onChange={(event) => setSourceName(event.target.value)}
            placeholder="məs. Baku.ws"
            className={inputClass}
          />
        </div>
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
          {uploadingImage
            ? "Şəkil yüklənir…"
            : submitting
              ? "Yadda saxlanılır…"
              : props.mode === "create"
                ? "Dərc et"
                : "Yadda saxla"}
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
