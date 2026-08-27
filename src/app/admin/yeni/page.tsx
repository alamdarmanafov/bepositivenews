import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/adminAuth";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-black tracking-tight">Yeni xəbər</h1>
      <ArticleForm mode="create" />
    </div>
  );
}
