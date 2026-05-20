"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import { showreel } from "@/lib/content";
import { RichText } from "@/lib/richText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Showreel() {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!section || !frame || !inner) return;

    const ctx = gsap.context(() => {
      // Frame expands from windowed to fullscreen as you scroll
      gsap.fromTo(
        frame,
        { borderRadius: "32px", scale: 0.84 },
        {
          borderRadius: "0px",
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "center 35%",
            scrub: true,
          },
        }
      );

      // Inner content gentle parallax
      gsap.fromTo(
        inner,
        { yPercent: 14 },
        {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Headline lines stagger reveal
      gsap.utils.toArray(".showreel-line").forEach((el, i) => {
        gsap.fromTo(
          el.querySelector(".showreel-line-inner"),
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.04,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showreel"
      className="relative z-10 overflow-hidden py-32 md:py-44"
    >
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10">
        <div className="mb-12 flex items-end justify-between md:mb-16">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-cyanglow" />
              <span className="text-xs uppercase tracking-[0.5em] text-cyanglow">
                {showreel.sectionNumber} — {showreel.sectionLabel}
              </span>
            </div>
            <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-ultratight md:text-7xl">
              {showreel.heading.prefix}
              <RichText text={showreel.heading.suffixRich} />
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <div className="font-cabinet text-xs uppercase tracking-[0.3em] text-white/50">
              {showreel.director}
            </div>
            <div className="mt-1 font-cabinet text-xs uppercase tracking-[0.3em] text-white/30">
              {showreel.spec}
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic frame that expands on scroll */}
      <div className="relative h-[110svh] w-full">
        <div className="sticky top-0 flex h-screen w-full items-center justify-center px-4 md:px-8">
          <div
            ref={frameRef}
            className="relative h-[78vh] w-full overflow-hidden border border-white/10 bg-black will-change-transform md:h-[88vh]"
          >
            {/* Background motion field */}
            <div ref={innerRef} className="absolute inset-0 will-change-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-bluepulse via-violet to-cyanglow opacity-80" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.4),transparent_55%)] mix-blend-overlay" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.55),transparent_55%)] mix-blend-multiply" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 noise-layer opacity-50" />
            </div>

            {/* Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

            {/* HUD */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-6 md:p-10">
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/85">
                  {showreel.recBadge}
                </span>
              </div>
              <div className="font-cabinet text-[10px] uppercase tracking-[0.3em] text-white/70">
                {showreel.cornerLabel}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-10">
              <div className="font-cabinet text-[10px] uppercase tracking-[0.3em] text-white/65">
                {showreel.timecode}
              </div>
              <div className="hidden font-cabinet text-[10px] uppercase tracking-[0.3em] text-white/65 md:block">
                {showreel.geo}
              </div>
            </div>

            {/* Center play button */}
            <button
              type="button"
              data-cursor="play"
              className="group absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4"
            >
              <span className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md md:h-36 md:w-36">
                <span className="absolute inset-0 animate-ping rounded-full border border-white/30" />
                <Play className="h-10 w-10 fill-white text-white transition-transform group-hover:scale-110 md:h-12 md:w-12" />
              </span>
              <span className="font-cabinet text-xs uppercase tracking-[0.4em] text-white/85">
                {showreel.playLabel}
              </span>
            </button>

            {/* Cinematic typography overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-12 flex flex-col px-6 md:bottom-24 md:px-12">
              {showreel.overlayLines.map((line, i) => (
                <div key={i} className="showreel-line overflow-hidden">
                  <span
                    className={`showreel-line-inner block font-display text-6xl font-medium leading-[0.95] tracking-ultratight md:text-[9vw] ${
                      i === 1 || i === 4
                        ? "text-stroke italic"
                        : "text-white"
                    }`}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
