import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "bpn_admin";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const attemptsByKey = new Map<string, { count: number; resetAt: number }>();

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function sessionToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return crypto.createHmac("sha256", password || "unset").update("bpn-admin-session").digest("hex");
}

/** Naive per-instance throttle: blocks sustained scripted brute-forcing from one IP within a warm function instance. Not a substitute for a strong ADMIN_PASSWORD. */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attemptsByKey.get(key);
  if (!entry || now > entry.resetAt) return false;
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = attemptsByKey.get(key);
  if (!entry || now > entry.resetAt) {
    attemptsByKey.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearAttempts(key: string): void {
  attemptsByKey.delete(key);
}

export function verifyPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return timingSafeEqual(input, password);
}

export function verifyEmail(input: string): boolean {
  const email = process.env.ADMIN_EMAIL;
  if (!email) return false;
  return timingSafeEqual(input.trim().toLowerCase(), email.trim().toLowerCase());
}

export async function isAuthenticated(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return timingSafeEqual(token, sessionToken());
}

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
