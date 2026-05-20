"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Compass,
  Lightbulb,
  Pen,
  Rocket,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "Strategy",
    sub: "Phase 01",
    body: "Discovery, audits, narrative architecture and a north-star creative brief.",
  },
  {
    icon: Lightbulb,
    title: "Creative Direction",
    sub: "Phase 02",
    body: "Mood, tone, type, light. We pre-visualize the entire experience as a film.",
  },
  {
    icon: Pen,
    title: "Design",
    sub: "Phase 03",
    body: "High-fidelity systems, motion choreography, prototypes and live shaders.",
  },
  {
    icon: Rocket,
    title: "Launch",
    sub: "Phase 04",
    body: "Production-grade engineering, performance hardening, and a cinematic release.",
  },
  {
    icon: TrendingUp,
    title: "Scale",
    sub: "Phase 05",
    body: "Live optimization, content engines, season drops and continuous evolution.",
  },
];

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Drives the glowing line that traces between nodes
  const lineProgress = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  return (
    <section
      ref={ref}
      id="process"
      className="relative z-10 overflow-hidden py-32 md:py-44"
    >
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-cyanglow" />
              <span className="text-xs uppercase tracking-[0.5em] text-cyanglow">
                05 — Process
              </span>
            </div>
            <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-ultratight md:text-7xl">
              A choreography in <span className="gradient-text italic">five</span> movements.
            </h2>
          </div>
          <p className="font-cabinet text-base leading-relaxed text-white/60 md:col-span-4 md:col-start-9 md:text-lg">
            Every JAS engagement runs through this five-phase system —
            structured for clarity, designed for surprise.
          </p>
        </div>

        {/* Vertical timeline with glowing trace */}
        <div className="relative">
          {/* Line track */}
          <div
            aria-hidden
            className="absolute left-6 top-0 hidden h-full w-px bg-white/10 md:left-1/2 md:block md:-translate-x-1/2"
          />
          {/* Animated glowing trace */}
          <motion.div
            aria-hidden
            style={{ scaleY: lineProgress, transformOrigin: "top" }}
            className="absolute left-6 top-0 hidden h-full w-px md:left-1/2 md:block md:-translate-x-1/2"
          >
            <div className="h-full w-full bg-gradient-to-b from-cyanglow via-bluepulse to-violet shadow-[0_0_24px_rgba(125,249,255,0.55)]" />
          </motion.div>

          <ol className="flex flex-col gap-16 md:gap-32">
            {steps.map((s, i) => (
              <Step key={s.title} index={i} {...s} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({ icon: Icon, title, sub, body, index }) {
  const isLeft = index % 2 === 0;

  return (
    <motion.li
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2"
    >
      {/* Center node */}
      <div className="absolute left-6 top-6 z-20 hidden -translate-x-1/2 md:left-1/2 md:block">
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-cyanglow/40" />
          <span className="relative h-3 w-3 rounded-full bg-cyanglow shadow-[0_0_18px_rgba(125,249,255,0.9)]" />
        </span>
      </div>

      {/* Card on the appropriate side */}
      <div
        className={`relative ${
          isLeft ? "md:pr-16 md:text-right" : "md:order-2 md:pl-16"
        }`}
      >
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md transition-colors hover:border-cyanglow/30 md:p-9">
          <div
            className={`mb-5 flex items-center gap-4 ${
              isLeft ? "md:justify-end" : "md:justify-start"
            }`}
          >
            <span className="text-xs uppercase tracking-[0.4em] text-cyanglow">
              {sub}
            </span>
            <span className="h-px w-10 bg-cyanglow/50" />
          </div>
          <div
            className={`flex flex-col gap-4 ${
              isLeft ? "md:items-end" : "md:items-start"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-black/30">
              <Icon className="h-6 w-6 text-cyanglow" strokeWidth={1.4} />
            </div>
            <h3 className="font-display text-3xl font-medium tracking-tight text-white md:text-4xl">
              {title}
            </h3>
            <p
              className={`max-w-md font-cabinet text-sm leading-relaxed text-white/60 md:text-base ${
                isLeft ? "md:text-right" : "md:text-left"
              }`}
            >
              {body}
            </p>
          </div>

          {/* moving gradient on hover */}
          <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-tr from-cyanglow/0 via-cyanglow/0 to-violet/0 opacity-0 transition-opacity duration-700 group-hover:from-cyanglow/15 group-hover:to-violet/15 group-hover:opacity-100" />
        </div>
      </div>

      {/* Big phase number on the other side */}
      <div
        className={`relative hidden md:block ${
          isLeft ? "md:pl-16" : "md:order-1 md:pr-16 md:text-right"
        }`}
      >
        <span className="font-display text-[12vw] font-medium leading-[0.86] tracking-ultratight text-stroke">
          0{index + 1}
        </span>
      </div>
    </motion.li>
  );
}
