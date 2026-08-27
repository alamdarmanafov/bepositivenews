import Link from "next/link";
import Container from "./Container";
import { CATEGORY_LABELS, CategoryKey } from "@/content/types";

const categoryEntries = Object.entries(CATEGORY_LABELS) as [CategoryKey, string][];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border-subtle bg-surface">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm text-accent-foreground">
              ✦
            </span>
            Be Positive News
          </div>
          <p className="mt-3 max-w-xs text-sm text-foreground/70">
            Yoxlanılmış, ürəkaçan xəbərlər — elm, sağlamlıq, ətraf mühit, cəmiyyət və mədəniyyət sahələrindən.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">Bölmələr</h3>
          <ul className="mt-3 space-y-2">
            {categoryEntries.map(([key, label]) => (
              <li key={key}>
                <Link href={`/kateqoriya/${key}`} className="text-sm text-foreground/80 hover:text-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">Şirkət</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/haqqimizda" className="text-sm text-foreground/80 hover:text-accent">
                Haqqımızda
              </Link>
            </li>
            <li>
              <Link href="/#abune" className="text-sm text-foreground/80 hover:text-accent">
                Bülletenə abunə ol
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">Dil</h3>
          <p className="mt-3 text-sm text-foreground/80">Azərbaycan dili</p>
          <p className="mt-1 text-xs text-foreground/50">İngilis dili tezliklə əlavə olunacaq.</p>
        </div>
      </Container>

      <div className="border-t border-border-subtle py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Be Positive News. Bütün hüquqlar qorunur.</p>
          <p>Yoxlanılmış yaxşı xəbərlər.</p>
        </Container>
      </div>
    </footer>
  );
}
