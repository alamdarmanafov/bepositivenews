"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORY_ORDER } from "@/content/types";

export default function CategoryTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-border-subtle bg-surface p-2 sm:gap-3 sm:p-3">
      {CATEGORY_ORDER.map((key) => {
        const active = pathname === `/kateqoriya/${key}`;
        return (
          <Link
            key={key}
            href={`/kateqoriya/${key}`}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
              active ? "bg-surface-muted text-primary" : "text-foreground/70 hover:bg-surface-muted"
            }`}
          >
            <span aria-hidden>{CATEGORY_ICONS[key]}</span>
            <span
              className={active ? "border-b-2 border-accent pb-0.5" : ""}
            >
              {CATEGORY_LABELS[key]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
