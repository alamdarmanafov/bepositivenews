"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Ana səhifə", href: "/", icon: "🏠" },
  { label: "Kateqoriyalar", href: "/#kateqoriyalar", icon: "🗂️" },
  { label: "Axtarış", href: "/axtar", icon: "🔍" },
  { label: "Abunə", href: "/#abune", icon: "🔔" },
] as const;

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors ${
                active ? "bg-primary text-primary-foreground" : "text-foreground/60"
              }`}
            >
              <span className="text-base" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
