import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminAuth";
import { readArticlesFile, writeArticlesFile } from "@/lib/github";
import { validateArticle } from "@/lib/validateArticle";
import type { Article } from "@/content/types";

type Params = { params: Promise<{ slug: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  }
  const { slug } = await params;

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
    const index = articles.findIndex((a) => a.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: "Xəbər tapılmadı." }, { status: 404 });
    }
    if (payload.slug !== slug && articles.some((a) => a.slug === payload.slug)) {
      return NextResponse.json({ error: "Bu slug artıq mövcuddur." }, { status: 409 });
    }

    let next = [...articles];
    next[index] = payload as Article;
    if (payload.featured) {
      next = next.map((a, i) => (i === index ? a : { ...a, featured: false }));
    }

    await writeArticlesFile(next, sha, `Xəbər yeniləndi: ${payload.title}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  }
  const { slug } = await params;

  try {
    const { articles, sha } = await readArticlesFile();
    const next = articles.filter((a) => a.slug !== slug);
    if (next.length === articles.length) {
      return NextResponse.json({ error: "Xəbər tapılmadı." }, { status: 404 });
    }

    await writeArticlesFile(next, sha, `Xəbər silindi: ${slug}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
