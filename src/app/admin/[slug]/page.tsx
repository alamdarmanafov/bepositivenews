import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/adminAuth";
import { readArticlesFile } from "@/lib/github";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const { slug } = await params;

  let articles: Awaited<ReturnType<typeof readArticlesFile>>["articles"] = [];
  let loadError: string | null = null;
  try {
    ({ articles } = await readArticlesFile());
  } catch (err) {
    loadError = (err as Error).message;
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>
      </div>
    );
  }

  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-black tracking-tight">Xəbəri redaktə et</h1>
      <ArticleForm mode="edit" initial={article} />
    </div>
  );
}
