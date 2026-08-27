"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
    >
      Çıxış
    </button>
  );
}
