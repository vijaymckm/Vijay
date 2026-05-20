"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { about } from "@/lib/content";
import { RichText } from "@/lib/richText";

const positionClasses = {
  tl: "left-6 top-6",
  tr: "right-6 top-6",
  bl: "left-6 bottom-24",
  br: "right-6 bottom-6",
};

export default function About() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0.1, 0.6], [1.25, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const labelY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 overflow-hidden py-32 md:py-44"
    >
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10">
        {/* Section label */}
        <motion.div
          style={{ y: labelY }}
          className="mb-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-cyanglow" />
            <span className="text-xs uppercase tracking-[0.5em] text-cyanglow">
              {about.sectionNumber} — {about.sectionLabel}
            </span>
          </div>
          <span className="font-cabinet text-sm text-white/50">
            {about.meta}
          </span>
        </motion.div>

        {/* Sticky storytelling: pinned visual with split text */}
        <div className="relative grid grid-cols-1 gap-16 md:grid-cols-12">
          {/* Sticky visual block */}
          <div className="md:col-span-6 md:sticky md:top-24 md:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-bluepulse/20 via-ink-800 to-violet/20">
              <motion.div
                style={{ scale: imgScale, y: imgY }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(125,249,255,0.45),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.4),transparent_55%)]" />
                <div className="absolute inset-0 bg-[conic-gradient(from_120deg_at_50%_50%,rgba(125,249,255,0.18),transparent_30%,rgba(59,130,246,0.18)_60%,transparent_75%)] mix-blend-screen" />
              </motion.div>

              <div className="absolute inset-0 noise-layer opacity-30" />

              {/* Floating cards over visual */}
              {about.floatingCards.map((card, i) => (
                <FloatingCard
                  key={card.title}
                  className={positionClasses[card.position] || "left-6 top-6"}
                  title={card.title}
                  value={card.value}
                  accent={card.accent}
                  delay={0.1 + i * 0.15}
                />
              ))}

              {/* HUD label */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyanglow" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                  {about.liveBadge}
                </span>
              </div>
            </div>
          </div>

          {/* Text + timeline */}
          <div className="md:col-span-6 md:pl-6">
            <Reveal>
              <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-ultratight text-white md:text-7xl">
                <RichText text={about.heading.rich} />
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-xl font-cabinet text-base leading-relaxed text-white/65 md:text-lg">
                {about.paragraph}
              </p>
            </Reveal>

            {/* Counters */}
            <div className="mt-14 grid grid-cols-2 gap-6 md:gap-8">
              {about.stats.map((s, i) => (
                <Counter key={i} {...s} delay={i * 0.1} />
              ))}
            </div>

            {/* Timeline */}
            <div className="mt-20">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-8 bg-white/40" />
                <span className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Timeline
                </span>
              </div>
              <ol className="relative border-l border-white/10 pl-6">
                {about.timeline.map((t, i) => (
                  <TimelineItem key={t.year} index={i} {...t} />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ className = "", title, value, accent, delay = 0 }) {
  const accentColor = {
    cyanglow: "border-cyanglow/40 text-cyanglow",
    bluepulse: "border-bluepulse/40 text-bluepulse",
    violet: "border-violet/40 text-violet",
  }[accent] || "border-cyanglow/40 text-cyanglow";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute z-10 flex flex-col gap-1 rounded-2xl border ${accentColor} bg-black/40 px-4 py-3 backdrop-blur-xl ${className}`}
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
        {title}
      </span>
      <span className="font-display text-sm font-medium text-white">
        {value}
      </span>
    </motion.div>
  );
}

function Counter({ value, suffix, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const dur = 1500;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.floor(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setN(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
    >
      <div className="font-display text-5xl font-medium leading-none tracking-ultratight text-white md:text-6xl">
        {n}
        <span className="text-cyanglow">{suffix}</span>
      </div>
      <div className="mt-3 text-xs uppercase tracking-[0.3em] text-white/50">
        {label}
      </div>
    </motion.div>
  );
}

function TimelineItem({ year, title, body, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative pb-10 last:pb-0"
    >
      <span className="absolute -left-[33px] top-1.5 flex h-4 w-4 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-cyanglow/40" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-cyanglow shadow-[0_0_12px_rgba(125,249,255,0.8)]" />
      </span>
      <div className="font-display text-xs uppercase tracking-[0.4em] text-cyanglow">
        {year}
      </div>
      <div className="mt-2 font-display text-2xl font-medium tracking-tight text-white">
        {title}
      </div>
      <p className="mt-2 max-w-md font-cabinet text-sm leading-relaxed text-white/55">
        {body}
      </p>
    </motion.li>
  );
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
