"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { brand, nav } from "@/lib/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 top-0 z-[60] flex justify-center px-4 pt-4 md:px-8 md:pt-6"
      >
        <nav
          className={`flex w-full max-w-[1480px] items-center justify-between rounded-full border border-white/10 px-4 py-3 transition-all duration-500 md:px-6 md:py-4 ${
            scrolled
              ? "bg-black/40 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
              : "bg-white/[0.03] backdrop-blur-md"
          }`}
        >
          {/* Logo */}
          <a
            href="#top"
            className="group flex items-center gap-3"
            data-cursor="hover"
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-cyanglow/40 bg-gradient-to-br from-bluepulse/40 to-violet/40">
              <span className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,rgba(125,249,255,0.6)_60deg,transparent_120deg)]" />
              <span className="relative font-display text-sm font-bold">
                {brand.logoMark}
              </span>
            </span>
            <div className="leading-tight">
              <div className="font-display text-base font-medium tracking-tight">
                {brand.name}
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                {brand.kicker}
              </div>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="hover"
                className="group relative rounded-full px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
              >
                <span className="relative z-10">{l.label}</span>
                <span className="absolute inset-0 z-0 scale-90 rounded-full bg-white/0 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:bg-white/10 group-hover:opacity-100" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <MagneticButton
              as="a"
              href={nav.cta.href}
              data-cursor="hover"
              className="text-sm"
            >
              <span className="group inline-flex items-center gap-2 rounded-full border border-cyanglow/40 bg-gradient-to-r from-cyanglow/15 to-bluepulse/15 px-5 py-2.5 font-medium text-white transition-all hover:border-cyanglow/80 hover:shadow-[0_0_30px_rgba(125,249,255,0.35)]">
                {nav.cta.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </MagneticButton>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 md:hidden"
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="absolute inset-0 noise-layer" />
            <div className="relative flex h-full flex-col items-start justify-center gap-6 px-8">
              {nav.links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.05 * i,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display text-5xl font-medium tracking-tight text-white"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href={nav.cta.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyanglow/40 bg-cyanglow/10 px-5 py-3 text-sm font-medium"
              >
                {nav.cta.label} <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
