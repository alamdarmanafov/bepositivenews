import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface-muted/40">
      <header className="border-b border-border-subtle bg-surface">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <span className="text-sm font-extrabold tracking-tight">
            <span className="text-foreground">be positive</span> <span className="text-primary">NEWS</span>{" "}
            <span className="text-foreground/40">· admin</span>
          </span>
          <Link href="/" className="text-sm font-medium text-foreground/60 hover:text-primary">
            ← Sayta qayıt
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
