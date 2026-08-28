"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "./Container";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/content/types";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-lg text-accent-foreground">
            ✌️
          </span>
          <span className="leading-none">
            <span className="block text-foreground">BE POSITIVE</span>
            <span className="block text-primary">NEWS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          <Link
            href="/"
            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:bg-surface-muted ${
              pathname === "/" ? "text-primary" : "text-foreground/80"
            }`}
          >
            Ana səhifə
          </Link>
          {CATEGORY_ORDER.map((key) => (
            <Link
              key={key}
              href={`/kateqoriya/${key}`}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:bg-surface-muted ${
                pathname === `/kateqoriya/${key}` ? "text-primary" : "text-foreground/80"
              }`}
            >
              {CATEGORY_LABELS[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/axtar"
            aria-label="Axtarış"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-surface-muted"
          >
            🔍
          </Link>
          <Link
            href="/#abune"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90 sm:inline-block"
          >
            Abunə ol
          </Link>
          <button
            type="button"
            aria-label="Menyunu aç"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle xl:hidden"
          >
            <span className="sr-only">Menyu</span>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border-subtle bg-surface xl:hidden">
          <Container className="flex flex-col gap-1 py-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
            >
              Ana səhifə
            </Link>
            {CATEGORY_ORDER.map((key) => (
              <Link
                key={key}
                href={`/kateqoriya/${key}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
              >
                {CATEGORY_LABELS[key]}
              </Link>
            ))}
            <Link
              href="/haqqimizda"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
            >
              Haqqımızda
            </Link>
            <Link
              href="/#abune"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-accent px-3 py-2 text-center text-sm font-bold text-accent-foreground"
            >
              Abunə ol
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
