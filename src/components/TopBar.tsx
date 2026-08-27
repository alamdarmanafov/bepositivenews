"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatFullDateAz } from "@/lib/format";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: "facebook" as const },
  { label: "Instagram", href: "#", icon: "instagram" as const },
  { label: "YouTube", href: "#", icon: "youtube" as const },
  { label: "Telegram", href: "#", icon: "telegram" as const },
];

function SocialIcon({ icon }: { icon: (typeof SOCIAL_LINKS)[number]["icon"] }) {
  const common = "h-4 w-4 fill-current";
  switch (icon) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path d="M12 2.2c2.7 0 3 .01 4.1.06 1.05.05 1.62.22 2 .37.5.2.86.43 1.24.8.37.38.6.74.8 1.24.15.38.32.95.37 2 .05 1.1.06 1.4.06 4.1s-.01 3-.06 4.1c-.05 1.05-.22 1.62-.37 2-.2.5-.43.86-.8 1.24-.38.37-.74.6-1.24.8-.38.15-.95.32-2 .37-1.1.05-1.4.06-4.1.06s-3-.01-4.1-.06c-1.05-.05-1.62-.22-2-.37a3.3 3.3 0 0 1-1.24-.8 3.3 3.3 0 0 1-.8-1.24c-.15-.38-.32-.95-.37-2C2.21 15 2.2 14.7 2.2 12s.01-3 .06-4.1c.05-1.05.22-1.62.37-2 .2-.5.43-.86.8-1.24.38-.37.74-.6 1.24-.8.38-.15.95-.32 2-.37C9.9 2.21 10.2 2.2 12 2.2Zm0 1.8c-2.65 0-2.97.01-4.02.06-.86.04-1.32.18-1.63.3-.41.16-.7.35-1.01.66-.31.31-.5.6-.66 1.01-.12.31-.26.77-.3 1.63C4.33 9 4.32 9.32 4.32 12s.01 3 .06 4.02c.04.86.18 1.32.3 1.63.16.41.35.7.66 1.01.31.31.6.5 1.01.66.31.12.77.26 1.63.3 1.05.05 1.37.06 4.02.06s2.97-.01 4.02-.06c.86-.04 1.32-.18 1.63-.3.41-.16.7-.35 1.01-.66.31-.31.5-.6.66-1.01.12-.31.26-.77.3-1.63.05-1.02.06-1.37.06-4.02s-.01-2.97-.06-4.02c-.04-.86-.18-1.32-.3-1.63a2.7 2.7 0 0 0-.66-1.01 2.7 2.7 0 0 0-1.01-.66c-.31-.12-.77-.26-1.63-.3C14.97 4.01 14.65 4 12 4Zm0 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm4.7-2a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path d="M21.6 7.2s-.21-1.5-.87-2.16c-.83-.87-1.76-.87-2.19-.92C15.44 4 12 4 12 4h-.01s-3.44 0-6.55.12c-.43.05-1.36.05-2.19.92-.66.66-.87 2.16-.87 2.16S2.16 8.94 2.16 10.68v1.63c0 1.74.22 3.48.22 3.48s.21 1.5.87 2.16c.83.87 1.92.84 2.4.93 1.75.17 7.35.22 7.35.22s3.44-.01 6.55-.13c.43-.05 1.36-.05 2.19-.92.66-.66.87-2.16.87-2.16s.22-1.74.22-3.48v-1.63c0-1.74-.22-3.48-.22-3.48ZM9.96 14.6V8.9l5.4 2.86-5.4 2.84Z" />
        </svg>
      );
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path d="M21.7 4.3 3.4 11.4c-.9.36-.9 1.65.02 1.98l4.4 1.53 1.7 5.44c.24.76 1.22.97 1.76.38l2.4-2.6 4.5 3.3c.75.55 1.83.14 2.02-.77l3.2-15.1c.2-1.02-.83-1.83-1.7-1.28Zm-3.05 3.5-8.36 7.53-.32 3.4-1.5-4.85 9.9-6.4c.3-.2.6.19.28.32Z" />
        </svg>
      );
  }
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // Reading browser-only APIs (localStorage/matchMedia) after mount to avoid SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(stored ? stored === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    if (isDark === null) return;
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      type="button"
      aria-label={isDark ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}
      onClick={() => setIsDark((v) => !v)}
      className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-surface-muted"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

export default function TopBar({ trend }: { trend: string }) {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    // Computed after mount (not during render) so the static build-time date never
    // conflicts with the visitor's actual current date, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(formatFullDateAz(new Date()));
  }, []);

  return (
    <div className="hidden border-b border-border-subtle bg-surface text-xs text-foreground/70 lg:block">
      <div className="mx-auto flex h-9 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <span suppressHydrationWarning>{today ?? " "}</span>
          <span className="flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 font-medium">
            <span className="text-primary">Trend:</span>
            <span className="max-w-xs truncate">{trend}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-surface-muted hover:text-primary"
              >
                <SocialIcon icon={social.icon} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
