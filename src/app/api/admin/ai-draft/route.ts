import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { isAuthenticated } from "@/lib/adminAuth";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/content/types";

const MAX_SOURCE_LENGTH = 20000;

const CATEGORY_ENUM = CATEGORY_ORDER as unknown as [string, ...string[]];

const DraftSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  body: z.array(z.string()).min(2),
  category: z.enum(CATEGORY_ENUM),
  readingMinutes: z.number().int().min(1).max(10),
});

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Giriş tələb olunur." }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY mühit dəyişəni təyin olunmayıb." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const sourceText = body?.sourceText;

  if (typeof sourceText !== "string" || !sourceText.trim()) {
    return NextResponse.json({ error: "Mənbə mətni tələb olunur." }, { status: 400 });
  }
  if (sourceText.length > MAX_SOURCE_LENGTH) {
    return NextResponse.json(
      { error: `Mənbə mətni ${MAX_SOURCE_LENGTH} simvoldan uzun ola bilməz.` },
      { status: 400 },
    );
  }

  const categoryList = CATEGORY_ORDER.map((key) => `${key} (${CATEGORY_LABELS[key]})`).join(", ");

  try {
    const client = new OpenAI();
    const response = await client.responses.parse({
      model: "gpt-5.1",
      instructions:
        'Sən "bepositive NEWS" adlı Azərbaycan dilli xəbər saytı üçün redaktorsan. Sənə verilən mənbə mətni əsasında Azərbaycan dilində orijinal, öz sözlərinlə yazılmış (birbaşa köçürülməmiş) qısa xəbər hazırla. Faktları, rəqəmləri və adları dəyişmə və uydurma. Başlıq qısa və dəqiq olsun, qısa təsvir 1-2 cümlə olsun, mətn 2-4 paraqrafdan ibarət olsun. Mümkün kateqoriyalar: ' +
        categoryList +
        ". Mətnə ən uyğun kateqoriyanı seç.",
      input: sourceText,
      text: { format: zodTextFormat(DraftSchema, "article_draft") },
    });

    if (!response.output_parsed) {
      return NextResponse.json({ error: "AI cavabı emal edilmədi. Yenidən cəhd edin." }, { status: 502 });
    }

    return NextResponse.json(response.output_parsed);
  } catch (error) {
    console.error("AI draft error:", error);
    return NextResponse.json({ error: "AI xəbəri hazırlaya bilmədi." }, { status: 502 });
  }
}
