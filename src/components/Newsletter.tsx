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
      className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-10 text-white sm:px-12 sm:py-14"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Həftədə bir yaxşı xəbər</h2>
        <p className="mt-3 text-sm text-white/90 sm:text-base">
          Həftənin ən ümidverici xəbərlərinin qısa və dürüst icmalını əldə edin — səs-küy yox, sadəcə doğru
          gedən şeylər.
        </p>

        {status === "submitted" ? (
          <p className="mt-6 rounded-full bg-white/15 px-5 py-3 text-sm font-medium">
            Təşəkkürlər! Abunəliyiniz qeydə alındı.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              E-poçt ünvanı
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="siz@numune.com"
              className="w-full rounded-full border-0 bg-white/95 px-5 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Abunə ol
            </button>
          </form>
        )}
        <p className="mt-3 text-xs text-white/70">Spam yoxdur. İstənilən vaxt abunəlikdən çıxa bilərsiniz.</p>
      </div>
    </section>
  );
}
