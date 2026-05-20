"use client";

import { Star } from "lucide-react";
import { marquee } from "@/lib/content";

export default function MarqueeBand() {
  return (
    <section
      aria-hidden
      className="relative z-10 -mt-px overflow-hidden border-y border-white/10 bg-black/30 py-6 backdrop-blur-md"
    >
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {[...Array(2)].map((_, dup) => (
          <div key={dup} className="flex shrink-0 items-center gap-12 px-8">
            {marquee.items.map((t, i) => (
              <div key={`${dup}-${i}`} className="flex items-center gap-12">
                <span className="font-display text-3xl font-medium tracking-tight text-white/85 md:text-5xl">
                  {t}
                </span>
                <Star
                  className="h-6 w-6 shrink-0 text-cyanglow"
                  strokeWidth={1.5}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
