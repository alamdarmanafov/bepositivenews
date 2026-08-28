import { ImageResponse } from "next/og";
import { articles, getArticleBySlug } from "@/content/articles";
import { CATEGORY_LABELS } from "@/content/types";
import { gradientToCssStops } from "@/lib/ogGradient";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticleOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const [from, via, to] = gradientToCssStops(article?.gradient ?? "");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: `linear-gradient(135deg, ${from} 0%, ${via} 50%, ${to} 100%)`,
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.18)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 140,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
          }}
        />
        <span
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "#facc15",
            color: "#0f172a",
            fontSize: 24,
            fontWeight: 700,
            padding: "8px 24px",
            borderRadius: 999,
            marginBottom: 28,
            textTransform: "uppercase",
          }}
        >
          {article ? CATEGORY_LABELS[article.category] : SITE_NAME}
        </span>
        <span style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.15, maxWidth: 1000 }}>
          {article?.title ?? SITE_NAME}
        </span>
      </div>
    ),
    size,
  );
}
