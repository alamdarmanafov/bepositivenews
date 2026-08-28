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

/** Verifies the file's magic bytes match the claimed MIME type, rather than trusting the client-supplied value. */
function detectedMimeType(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

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

  let buffer: Buffer;
  try {
    buffer = Buffer.from(payload.contentBase64, "base64");
  } catch {
    return NextResponse.json({ error: "Şəkil məlumatı düzgün deyil." }, { status: 400 });
  }

  if (detectedMimeType(buffer) !== payload.mimeType) {
    return NextResponse.json({ error: "Fayl həqiqi bir şəkil deyil və ya növü uyğun gəlmir." }, { status: 400 });
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
