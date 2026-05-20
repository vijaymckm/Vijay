"use client";

import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { pricing } from "@/lib/content";
import { RichText } from "@/lib/richText";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative z-10 overflow-hidden py-32 md:py-44"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-bluepulse/15 blur-[140px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1480px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-cyanglow" />
              <span className="text-xs uppercase tracking-[0.5em] text-cyanglow">
                {pricing.sectionNumber} — {pricing.sectionLabel}
              </span>
            </div>
            <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-ultratight md:text-7xl">
              <RichText text={pricing.heading.rich} />
            </h2>
          </div>
          <p className="font-cabinet text-base leading-relaxed text-white/60 md:col-span-4 md:col-start-9 md:text-lg">
            {pricing.description}
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {pricing.plans.map((p, i) => (
            <Plan key={p.name} index={i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Plan({ name, price, tagline, features, cta, featured, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.9,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border p-7 backdrop-blur-md transition-colors md:p-9 ${
        featured
          ? "border-cyanglow/40 bg-gradient-to-br from-cyanglow/10 via-bluepulse/5 to-violet/10 shadow-[0_0_60px_rgba(125,249,255,0.18)]"
          : "border-white/10 bg-white/[0.025] hover:border-white/25"
      }`}
      data-cursor="hover"
    >
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]"
      />

      {/* "Recommended" tag for featured */}
      {featured && (
        <div className="absolute right-6 top-6 rounded-full border border-cyanglow/50 bg-cyanglow/15 px-3 py-1 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-[0.3em] text-cyanglow">
            Most chosen
          </span>
        </div>
      )}

      {/* Header */}
      <div className="relative">
        <div className="font-display text-xs uppercase tracking-[0.4em] text-white/40">
          0{index + 1} / Plan
        </div>
        <h3 className="mt-3 font-display text-4xl font-medium tracking-ultratight text-white md:text-5xl">
          {name}
        </h3>
        <p className="mt-2 font-cabinet text-sm text-white/60">{tagline}</p>
      </div>

      {/* Price */}
      <div className="relative mt-8 border-y border-white/10 py-6">
        <div className="font-display text-3xl font-medium tracking-tight text-white md:text-4xl">
          {price}
        </div>
      </div>

      {/* Features */}
      <ul className="relative mt-6 flex flex-1 flex-col gap-3">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-3 font-cabinet text-sm text-white/75"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                featured
                  ? "bg-cyanglow/20 text-cyanglow"
                  : "bg-white/10 text-white"
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={2.5} />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="relative mt-10">
        <MagneticButton as="a" href={cta.href} data-cursor="hover">
          <span
            className={`group inline-flex w-full items-center justify-between gap-3 rounded-full px-6 py-3.5 font-display font-medium transition-all ${
              featured
                ? "bg-white text-black hover:shadow-[0_0_50px_rgba(255,255,255,0.45)]"
                : "border border-white/20 text-white hover:border-white/60"
            }`}
          >
            {cta.label}
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform group-hover:rotate-45 ${
                featured ? "bg-black text-white" : "border border-white/30"
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </span>
        </MagneticButton>
      </div>
    </motion.article>
  );
}
