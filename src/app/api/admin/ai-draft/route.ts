import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { isAuthenticated } from "@/lib/adminAuth";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/content/types";

const MAX_SOURCE_LENGTH = 20000;
const MAX_HTML_BYTES = 3 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10000;
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const CATEGORY_ENUM = CATEGORY_ORDER as unknown as [string, ...string[]];

const DraftSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  body: z.array(z.string()).min(2),
  category: z.enum(CATEGORY_ENUM),
  readingMinutes: z.number().int().min(1).max(10),
});

function htmlToReadableText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(nav|header|footer|form|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

function hostnameToSourceName(url: string): string {
  const host = new URL(url).hostname.replace(/^www\./, "");
  return host.charAt(0).toUpperCase() + host.slice(1);
}

async function fetchSourceText(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": BROWSER_USER_AGENT, Accept: "text/html" },
      signal: controller.signal,
    });
  } catch {
    throw new Error("Link açılmadı. Ünvanı yoxlayıb yenidən cəhd edin.");
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new Error(`Sayt cavab vermədi (HTTP ${res.status}).`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("Sayt məzmunu oxuna bilmədi.");

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_HTML_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.byteLength;
    }
  }
  await reader.cancel().catch(() => {});

  const html = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf-8");
  const text = htmlToReadableText(html);

  if (!text) throw new Error("Səhifədən mətn çıxarıla bilmədi.");
  return text.slice(0, MAX_SOURCE_LENGTH);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Giriş tələb olunur." }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY mühit dəyişəni təyin olunmayıb." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const sourceUrlInput = typeof body?.sourceUrl === "string" ? body.sourceUrl.trim() : "";
  const sourceTextInput = typeof body?.sourceText === "string" ? body.sourceText : "";

  let sourceText = sourceTextInput;
  let derivedSourceUrl: string | undefined;
  let derivedSourceName: string | undefined;
  let isFromUrl = false;

  if (sourceUrlInput) {
    let parsed: URL;
    try {
      parsed = new URL(sourceUrlInput);
    } catch {
      return NextResponse.json({ error: "Keçərsiz link." }, { status: 400 });
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return NextResponse.json({ error: "Keçərsiz link." }, { status: 400 });
    }

    try {
      sourceText = await fetchSourceText(parsed.toString());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Link oxuna bilmədi.";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    derivedSourceUrl = parsed.toString();
    derivedSourceName = hostnameToSourceName(parsed.toString());
    isFromUrl = true;
  }

  if (!sourceText.trim()) {
    return NextResponse.json({ error: "Mənbə mətni və ya link tələb olunur." }, { status: 400 });
  }
  if (sourceText.length > MAX_SOURCE_LENGTH) {
    return NextResponse.json(
      { error: `Mənbə mətni ${MAX_SOURCE_LENGTH} simvoldan uzun ola bilməz.` },
      { status: 400 },
    );
  }

  const categoryList = CATEGORY_ORDER.map((key) => `${key} (${CATEGORY_LABELS[key]})`).join(", ");

  const instructions = isFromUrl
    ? 'Sən "bepositive NEWS" adlı Azərbaycan dilli xəbər saytı üçün redaktorsan. Sənə bir veb-səhifədən çıxarılmış xam mətn verilib — bu, tək bir xəbər məqaləsi ola bilər, ya da bir neçə xəbər başlığı olan sayt səhifəsi (əsas səhifə, kateqoriya siyahısı və s.). Əgər mətndə bir neçə fərqli xəbər var, ən aktual və maraqlı olanı seç. Seçdiyin xəbərə əsasən Azərbaycan dilində orijinal, öz sözlərinlə yazılmış (birbaşa köçürülməmiş) qısa xəbər hazırla. Faktları, rəqəmləri və adları dəyişmə və uydurma. Başlıq qısa və dəqiq olsun, qısa təsvir 1-2 cümlə olsun, mətn 2-4 paraqrafdan ibarət olsun. Mümkün kateqoriyalar: ' +
      categoryList +
      ". Ən uyğun kateqoriyanı seç."
    : 'Sən "bepositive NEWS" adlı Azərbaycan dilli xəbər saytı üçün redaktorsan. Sənə verilən mənbə mətni əsasında Azərbaycan dilində orijinal, öz sözlərinlə yazılmış (birbaşa köçürülməmiş) qısa xəbər hazırla. Faktları, rəqəmləri və adları dəyişmə və uydurma. Başlıq qısa və dəqiq olsun, qısa təsvir 1-2 cümlə olsun, mətn 2-4 paraqrafdan ibarət olsun. Mümkün kateqoriyalar: ' +
      categoryList +
      ". Mətnə ən uyğun kateqoriyanı seç.";

  try {
    const client = new OpenAI();
    const response = await client.responses.parse({
      model: "gpt-5.1",
      instructions,
      input: sourceText,
      text: { format: zodTextFormat(DraftSchema, "article_draft") },
    });

    if (!response.output_parsed) {
      return NextResponse.json({ error: "AI cavabı emal edilmədi. Yenidən cəhd edin." }, { status: 502 });
    }

    return NextResponse.json({
      ...response.output_parsed,
      sourceUrl: derivedSourceUrl,
      sourceName: derivedSourceName,
    });
  } catch (error) {
    console.error("AI draft error:", error);
    return NextResponse.json({ error: "AI xəbəri hazırlaya bilmədi." }, { status: 502 });
  }
}
