"use client";

import { FormEvent, useState } from "react";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitted");
  }

  return (
    <section
      id="abune"
      className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-border-subtle bg-surface p-6 sm:flex-row sm:p-8"
    >
      <div className="flex items-center gap-3 text-center sm:text-left">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-xl text-accent-foreground">
          ✌️
        </span>
        <div>
          <p className="text-lg font-extrabold">
            <span className="text-foreground">BE POSITIVE</span> <span className="text-primary">NEWS</span>
          </p>
          <p className="text-sm text-foreground/60">Xəbəri oxu, anla.</p>
        </div>
      </div>

      {status === "submitted" ? (
        <p className="rounded-full bg-surface-muted px-5 py-3 text-sm font-medium text-primary">
          Təşəkkürlər! Abunəliyiniz qeydə alındı.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            E-poçt ünvanı
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Email ünvanınız"
            className="w-full rounded-full border border-border-subtle bg-background px-5 py-3 text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Abunə ol
          </button>
        </form>
      )}
    </section>
  );
}
