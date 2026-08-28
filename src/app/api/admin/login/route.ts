import { NextRequest, NextResponse } from "next/server";
import { clearAttempts, isRateLimited, recordFailedAttempt, setSessionCookie, verifyPassword } from "@/lib/adminAuth";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clientKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);

  // Slow down scripted brute-forcing regardless of outcome.
  await delay(400);

  if (isRateLimited(key)) {
    return NextResponse.json({ error: "Çox sayda cəhd. Bir neçə dəqiqədən sonra yenidən cəhd edin." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== "string" || !verifyPassword(password)) {
    recordFailedAttempt(key);
    return NextResponse.json({ error: "Yanlış parol." }, { status: 401 });
  }

  clearAttempts(key);
  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
