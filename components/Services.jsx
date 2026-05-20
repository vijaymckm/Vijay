"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Sparkles,
  MonitorSmartphone,
  Film,
  Megaphone,
  Code2,
  Building2,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Branding",
    body: "Identity systems, naming, visual languages and brand films designed to resonate at any scale.",
    tags: ["Logo", "Identity", "Strategy"],
    accent: "from-cyanglow/30 to-bluepulse/0",
    glow: "rgba(125,249,255,0.55)",
  },
  {
    icon: MonitorSmartphone,
    title: "Web Design",
    body: "Cinematic websites engineered with shaders, choreography, and a relentless attention to craft.",
    tags: ["UX", "UI", "WebGL"],
    accent: "from-bluepulse/30 to-violet/0",
    glow: "rgba(59,130,246,0.55)",
  },
  {
    icon: Film,
    title: "Motion Graphics",
    body: "Frame-by-frame storytelling — title sequences, brand films, and interactive motion systems.",
    tags: ["Film", "3D", "AE"],
    accent: "from-violet/30 to-cyanglow/0",
    glow: "rgba(139,92,246,0.55)",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    body: "Content engines, paid creative, and performance systems that turn campaigns into culture.",
    tags: ["Performance", "Content", "Strategy"],
    accent: "from-cyanglow/25 to-violet/0",
    glow: "rgba(125,249,255,0.5)",
  },
  {
    icon: Code2,
    title: "Creative Development",
    body: "Custom WebGL, generative graphics, real-time interaction and bespoke creative tooling.",
    tags: ["R3F", "GLSL", "GSAP"],
    accent: "from-bluepulse/35 to-cyanglow/0",
    glow: "rgba(59,130,246,0.6)",
  },
  {
    icon: Building2,
    title: "Studio Rental",
    body: "Cinematic stages with cyc walls, motion control, LED volumes and a full creative crew on call.",
    tags: ["Stage", "Crew", "Gear"],
    accent: "from-violet/30 to-bluepulse/0",
    glow: "rgba(139,92,246,0.55)",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative z-10 overflow-hidden py-32 md:py-44"
    >
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-cyanglow" />
              <span className="text-xs uppercase tracking-[0.5em] text-cyanglow">
                02 — Services
              </span>
            </div>
            <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-ultratight md:text-7xl">
              Six disciplines.<br />
              <span className="gradient-text italic">One choreography.</span>
            </h2>
          </div>
          <p className="font-cabinet text-base leading-relaxed text-white/60 md:col-span-5 md:col-start-8 md:text-lg">
            From the first conceptual spark to the final pixel, every
            discipline at JAS Studios moves in sync — composed by directors,
            choreographed by designers, shipped by engineers.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.title} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, body, tags, accent, glow, index }) {
  const ref = useRef(null);

  // Tilt
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  // Highlight position
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const bgX = useTransform(mx, (v) => `${v}%`);
  const bgY = useTransform(my, (v) => `${v}%`);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rx.set((py - 0.5) * -10);
    ry.set((px - 0.5) * 10);
    mx.set(px * 100);
    my.set(py * 100);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.9,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1200,
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition-colors hover:border-white/25 md:p-9"
      data-cursor="hover"
    >
      {/* Mouse-tracking radial glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${bgX} ${bgY}, ${glow}, transparent 60%)`,
        }}
      />

      {/* Moving gradient slab */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br ${accent} opacity-30 transition-opacity duration-500 group-hover:opacity-70`}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between gap-12">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-black/30 backdrop-blur-md">
            <Icon className="h-5 w-5 text-cyanglow" strokeWidth={1.5} />
          </div>
          <span className="font-display text-xs uppercase tracking-[0.3em] text-white/30">
            0{index + 1}
          </span>
        </div>

        <div>
          <h3 className="font-display text-3xl font-medium tracking-tight text-white md:text-4xl">
            {title}
          </h3>
          <p className="mt-3 font-cabinet text-sm leading-relaxed text-white/60 md:text-base">
            {body}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/55"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="font-cabinet text-sm text-white/45">
              Explore discipline
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all group-hover:border-cyanglow/60 group-hover:bg-cyanglow/10 group-hover:shadow-[0_0_24px_rgba(125,249,255,0.4)]">
              <ArrowUpRight className="h-4 w-4 text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
