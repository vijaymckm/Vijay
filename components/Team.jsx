"use client";

import { motion } from "framer-motion";
import { team } from "@/lib/content";
import { RichText } from "@/lib/richText";

export default function Team() {
  return (
    <section
      id="team"
      className="relative z-10 overflow-hidden py-32 md:py-44"
    >
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-cyanglow" />
              <span className="text-xs uppercase tracking-[0.5em] text-cyanglow">
                {team.sectionNumber} — {team.sectionLabel}
              </span>
            </div>
            <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-ultratight md:text-7xl">
              <RichText text={team.heading.rich} />
            </h2>
          </div>
          <p className="font-cabinet text-base leading-relaxed text-white/60 md:col-span-4 md:col-start-9 md:text-lg">
            {team.description}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.members.map((m, i) => (
            <Member key={m.name} index={i} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Member({ name, role, gradient, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.9,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] transition-colors hover:border-white/25"
      data-cursor="hover"
    >
      {/* Portrait stand-in (gradient + noise) */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_55%)] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[conic-gradient(from_120deg_at_50%_50%,rgba(0,0,0,0.4),transparent_30%,rgba(0,0,0,0.5)_70%)] mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 noise-layer opacity-40" />

        {/* Subtle grain shimmer on hover */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(125,249,255,0.35),transparent_50%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />

        {/* Big initials overlay */}
        <span className="absolute inset-0 flex items-center justify-center font-display text-[18vw] font-medium leading-none tracking-ultratight text-white/15 sm:text-[12vw] lg:text-[8vw]">
          {name
            .split(" ")
            .filter(Boolean)
            .map((p) => p[0])
            .join("")
            .slice(0, 2)}
        </span>

        {/* Role badge */}
        <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/85">
            0{index + 1}
          </span>
        </div>
      </div>

      {/* Name + role */}
      <div className="flex items-center justify-between gap-4 p-6">
        <div>
          <h3 className="font-display text-2xl font-medium tracking-tight text-white md:text-3xl">
            {name}
          </h3>
          <p className="mt-1 font-cabinet text-xs uppercase tracking-[0.3em] text-white/55">
            {role}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all group-hover:border-cyanglow/60 group-hover:bg-cyanglow/10">
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className="h-3 w-3 text-white"
            aria-hidden
          >
            <path
              d="M2 10L10 2M10 2H4M10 2V8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </motion.article>
  );
}
