import Link from "next/link";
import Container from "./Container";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/content/types";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border-subtle bg-surface pb-20 lg:pb-0">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-mark-bg text-base text-brand-mark-foreground">
              ✌️
            </span>
            <span>
              <span className="text-foreground">bepositive</span> <span className="text-primary">NEWS</span>
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">Bölmələr</h3>
          <ul className="mt-3 space-y-2">
            {CATEGORY_ORDER.map((key) => (
              <li key={key}>
                <Link href={`/kateqoriya/${key}`} className="text-sm text-foreground/80 hover:text-primary">
                  {CATEGORY_LABELS[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">Şirkət</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/haqqimizda" className="text-sm text-foreground/80 hover:text-primary">
                Haqqımızda
              </Link>
            </li>
            <li>
              <Link href="/axtar" className="text-sm text-foreground/80 hover:text-primary">
                Axtarış
              </Link>
            </li>
            <li>
              <Link href="/#abune" className="text-sm text-foreground/80 hover:text-primary">
                Bülletenə abunə ol
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/60">Dil</h3>
          <p className="mt-3 text-sm text-foreground/80">Azərbaycan dili</p>
        </div>
      </Container>

      <div className="border-t border-border-subtle py-6">
        <Container className="flex items-center justify-center text-xs text-foreground/60">
          <p>© {new Date().getFullYear()} bepositive NEWS. Bütün hüquqlar qorunur.</p>
        </Container>
      </div>
    </footer>
  );
}
