import Link from "next/link";
import { CATEGORY_LABELS, CategoryKey } from "@/content/types";

export default function CategoryBadge({ category, className = "" }: { category: CategoryKey; className?: string }) {
  return (
    <Link
      href={`/kateqoriya/${category}`}
      className={`inline-flex items-center rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent hover:opacity-80 ${className}`}
    >
      {CATEGORY_LABELS[category]}
    </Link>
  );
}
