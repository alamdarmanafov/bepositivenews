"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Article } from "@/content/types";
import { formatDateAz } from "@/lib/format";
import CategoryBadge from "./CategoryBadge";

export default function HeroSlider({ slides }: { slides: Article[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const active = slides[index];
  if (!active) return null;

  return (
    <div
      className="relative h-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.slug}
          className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-br p-6 transition-opacity duration-700 sm:p-8 ${
            slide.gradient
          } ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <span className="absolute right-6 top-6 text-7xl opacity-30 sm:text-8xl" aria-hidden>
            {slide.emoji}
          </span>

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                Əsas xəbər
              </span>
              <CategoryBadge category={slide.category} />
            </div>
            <Link href={`/meqale/${slide.slug}`} className="group">
              <h2 className="text-2xl font-black leading-tight text-white group-hover:underline sm:text-4xl">
                {slide.title}
              </h2>
            </Link>
            <p className="max-w-xl text-sm text-white/80 sm:text-base">{slide.excerpt}</p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/meqale/${slide.slug}`}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
              >
                Tam oxu →
              </Link>
              <span className="text-xs text-white/70">
                {formatDateAz(slide.publishedAt)} · {slide.readingMinutes} dəq oxu
              </span>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 sm:bottom-6 sm:right-8">
          {slides.map((slide, i) => (
            <button
              key={slide.slug}
              type="button"
              aria-label={`${i + 1}-ci xəbərə keç`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-accent" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
