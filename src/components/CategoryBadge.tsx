import Link from "next/link";
import { CATEGORY_LABELS, CategoryKey } from "@/content/types";

export default function CategoryBadge({
  category,
  className = "",
  asLink = true,
}: {
  category: CategoryKey;
  className?: string;
  asLink?: boolean;
}) {
  const classes = `inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground ${className}`;

  if (!asLink) {
    return <span className={classes}>{CATEGORY_LABELS[category]}</span>;
  }

  return (
    <Link href={`/kateqoriya/${category}`} className={`${classes} hover:opacity-90`}>
      {CATEGORY_LABELS[category]}
    </Link>
  );
}
