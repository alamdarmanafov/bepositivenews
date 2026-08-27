import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminAuth";
import { uploadBinaryFile } from "@/lib/github";
import { slugify } from "@/lib/slug";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_BASE64_LENGTH = 2_700_000; // ~2MB raw file, base64-encoded

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "İcazə yoxdur." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    slug?: string;
    mimeType?: string;
    contentBase64?: string;
  } | null;

  if (!payload?.contentBase64 || !payload.mimeType) {
    return NextResponse.json({ error: "Şəkil məlumatı əskikdir." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[payload.mimeType];
  if (!extension) {
    return NextResponse.json({ error: "Yalnız JPG, PNG və ya WEBP şəkillərinə icazə var." }, { status: 400 });
  }

  if (payload.contentBase64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json({ error: "Şəkil 2MB-dan böyük ola bilməz." }, { status: 400 });
  }

  const base = slugify(payload.slug ?? "sekil") || "sekil";
  const fileName = `${base}-${Date.now()}.${extension}`;
  const repoPath = `public/uploads/${fileName}`;

  try {
    await uploadBinaryFile(repoPath, payload.contentBase64, `Şəkil əlavə edildi: ${fileName}`);
    return NextResponse.json({ path: `/uploads/${fileName}` });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
