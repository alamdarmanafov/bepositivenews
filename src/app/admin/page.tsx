import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/adminAuth";
import { readArticlesFile } from "@/lib/github";
import { CATEGORY_LABELS } from "@/content/types";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  let articles: Awaited<ReturnType<typeof readArticlesFile>>["articles"] = [];
  let loadError: string | null = null;
  try {
    ({ articles } = await readArticlesFile());
  } catch (err) {
    loadError = (err as Error).message;
  }

  const sorted = [...articles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-black tracking-tight">Xəbər idarəetməsi</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/yeni"
            className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground hover:opacity-90"
          >
            + Yeni xəbər
          </Link>
          <LogoutButton />
        </div>
      </div>

      {loadError && (
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError} GITHUB_TOKEN və GITHUB_REPO mühit dəyişənlərinin düzgün təyin olunduğunu yoxlayın.
        </p>
      )}

      <div className="flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-surface">
        {sorted.map((article) => (
          <div key={article.slug} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{article.title}</p>
              <p className="text-xs text-foreground/50">
                {CATEGORY_LABELS[article.category]} · {article.publishedAt}
                {article.featured ? " · Əsas xəbər" : ""}
              </p>
            </div>
            <Link
              href={`/admin/${article.slug}`}
              className="shrink-0 text-sm font-semibold text-primary hover:underline"
            >
              Redaktə et
            </Link>
          </div>
        ))}
        {sorted.length === 0 && !loadError && (
          <p className="px-4 py-6 text-sm text-foreground/50">Hələ xəbər yoxdur.</p>
        )}
      </div>
    </div>
  );
}
