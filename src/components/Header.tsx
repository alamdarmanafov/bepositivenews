"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "./Container";
import { CATEGORY_LABELS, CategoryKey } from "@/content/types";

const categoryEntries = Object.entries(CATEGORY_LABELS) as [CategoryKey, string][];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle/70 bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
            ✦
          </span>
          Be Positive News
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {categoryEntries.map(([key, label]) => (
            <Link
              key={key}
              href={`/kateqoriya/${key}`}
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-muted ${
                pathname === `/kateqoriya/${key}` ? "text-accent" : "text-foreground/80"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/haqqimizda"
            className={`rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-muted ${
              pathname === "/haqqimizda" ? "text-accent" : "text-foreground/80"
            }`}
          >
            Haqqımızda
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#abune"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 sm:inline-block"
          >
            Abunə ol
          </Link>
          <button
            type="button"
            aria-label="Menyunu aç"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle lg:hidden"
          >
            <span className="sr-only">Menyu</span>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border-subtle bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {categoryEntries.map(([key, label]) => (
              <Link
                key={key}
                href={`/kateqoriya/${key}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-muted"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/haqqimizda"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-muted"
            >
              Haqqımızda
            </Link>
            <Link
              href="/#abune"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-accent px-3 py-2 text-center text-sm font-semibold text-accent-foreground"
            >
              Abunə ol
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
