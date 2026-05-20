"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    n: "01",
    title: "Lumen / Brand Universe",
    client: "Lumen Aerospace",
    year: "2026",
    discipline: "Identity · Web · Film",
    gradient: "from-bluepulse via-cyanglow to-violet",
    accent: "rgba(125,249,255,0.55)",
  },
  {
    n: "02",
    title: "Nightglass — Album Site",
    client: "Akari Studio",
    year: "2026",
    discipline: "WebGL · Direction",
    gradient: "from-violet via-bluepulse to-cyanglow",
    accent: "rgba(139,92,246,0.55)",
  },
  {
    n: "03",
    title: "ORB / Mobility Identity",
    client: "ORB Mobility",
    year: "2025",
    discipline: "Brand · Motion",
    gradient: "from-cyanglow via-bluepulse to-violet",
    accent: "rgba(59,130,246,0.55)",
  },
  {
    n: "04",
    title: "Atlas — Spatial Campaign",
    client: "Atlas & Co.",
    year: "2025",
    discipline: "Campaign · 3D",
    gradient: "from-bluepulse via-violet to-cyanglow",
    accent: "rgba(125,249,255,0.5)",
  },
  {
    n: "05",
    title: "Form / Generative System",
    client: "Form Type Foundry",
    year: "2024",
    discipline: "Creative Dev · Tools",
    gradient: "from-violet via-cyanglow to-bluepulse",
    accent: "rgba(139,92,246,0.5)",
  },
  {
    n: "06",
    title: "Arc — Studio Reel",
    client: "JAS Studios",
    year: "2024",
    discipline: "Direction · Edit · Score",
    gradient: "from-cyanglow via-violet to-bluepulse",
    accent: "rgba(125,249,255,0.55)",
  },
];

export default function Portfolio() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getDistance = () =>
        track.scrollWidth - window.innerWidth + 80; // 80 = padding compensation

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Per-card scrub: subtle scale + opacity curve as it crosses center
      gsap.utils.toArray(".portfolio-card").forEach((card) => {
        gsap.fromTo(
          card.querySelector(".portfolio-media"),
          { scale: 1.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative z-10 overflow-hidden"
    >
      {/* Section header (not pinned, lives above the pinned area) */}
      <div className="relative pt-32 md:pt-44">
        <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10">
          <div className="mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-12 bg-cyanglow" />
                <span className="text-xs uppercase tracking-[0.5em] text-cyanglow">
                  03 — Selected Work
                </span>
              </div>
              <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-ultratight md:text-7xl">
                Cinematic chapters,<br />
                <span className="text-stroke">scrolled into reality.</span>
              </h2>
            </div>
            <span className="font-cabinet text-sm text-white/45 md:max-w-xs">
              Drag → scroll horizontally to step through six recent films &
              experiences.
            </span>
          </div>
        </div>

        {/* Horizontal track */}
        <div
          className="relative h-[100svh] w-full overflow-hidden"
          data-cursor="drag"
        >
          <div
            ref={trackRef}
            className="absolute left-0 top-0 flex h-full items-center gap-8 pl-[5vw] pr-[10vw] will-change-transform"
          >
            {projects.map((p, i) => (
              <ProjectCard key={p.n} index={i} {...p} />
            ))}

            {/* End slab */}
            <div className="flex h-[78vh] w-[30vw] min-w-[420px] flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md md:p-10">
              <span className="text-xs uppercase tracking-[0.4em] text-white/45">
                Archive
              </span>
              <div>
                <h3 className="font-display text-4xl font-medium tracking-tight text-white md:text-5xl">
                  + 60<span className="text-cyanglow">.</span> case studies in
                  the vault.
                </h3>
                <p className="mt-3 max-w-sm font-cabinet text-sm leading-relaxed text-white/55">
                  Request the full archive — branded films, type systems,
                  generative tools and live experiences.
                </p>
                <a
                  href="#contact"
                  data-cursor="hover"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyanglow/40 bg-cyanglow/10 px-5 py-3 text-sm font-medium hover:bg-cyanglow/20"
                >
                  Request Archive
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-ink-950 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-ink-950 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ n, title, client, year, discipline, gradient, accent }) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="portfolio-card group relative flex h-[78vh] w-[78vw] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-ink-900/50 backdrop-blur-md md:w-[60vw] lg:w-[44vw]"
      data-cursor="view"
    >
      {/* Media background */}
      <div className="portfolio-media absolute inset-0 will-change-transform">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_55%)] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_60%_40%,rgba(255,255,255,0.2),transparent_30%,rgba(0,0,0,0.5)_70%)] mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 noise-layer opacity-40" />
      </div>

      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at 50% 100%, ${accent}, transparent 60%)` }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col justify-between p-8 md:p-12">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className="font-display text-xs uppercase tracking-[0.4em] text-white/70">
            {n} / Project
          </span>
          <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1 font-cabinet text-[10px] uppercase tracking-[0.3em] text-white/80 backdrop-blur-md">
            {year}
          </span>
        </div>

        {/* Title block */}
        <div className="max-w-2xl">
          <span className="font-cabinet text-xs uppercase tracking-[0.4em] text-white/70">
            {client} — {discipline}
          </span>
          <h3 className="mt-3 font-display text-4xl font-medium leading-[1] tracking-ultratight text-white md:text-6xl">
            {title}
          </h3>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/30 bg-black/30 px-4 py-2 backdrop-blur-md transition-all group-hover:border-white/70 group-hover:bg-black/50">
            <span className="text-xs uppercase tracking-[0.3em] text-white">
              View Case
            </span>
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
