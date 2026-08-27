import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminAuth";
import { readArticlesFile, writeArticlesFile } from "@/lib/github";
import { validateArticle } from "@/lib/validateArticle";
import type { Article } from "@/content/types";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as Partial<Article> | null;
  if (!payload) {
    return NextResponse.json({ error: "Yanlış sorğu." }, { status: 400 });
  }

  const validationError = validateArticle(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const { articles, sha } = await readArticlesFile();

    if (articles.some((a) => a.slug === payload.slug)) {
      return NextResponse.json({ error: "Bu slug artıq mövcuddur." }, { status: 409 });
    }

    let next = [...articles, payload as Article];
    if (payload.featured) {
      next = next.map((a) => (a.slug === payload.slug ? a : { ...a, featured: false }));
    }

    await writeArticlesFile(next, sha, `Xəbər əlavə edildi: ${payload.title}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
