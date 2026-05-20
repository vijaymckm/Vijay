"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Play, ArrowRight, MoveDown } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { hero } from "@/lib/content";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const blurY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setPointer({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[110vh] w-full flex-col justify-end overflow-hidden pb-24 pt-32 md:pb-32 md:pt-40"
    >
      {/* Floating glow orbs (parallax to mouse) */}
      <motion.div
        aria-hidden
        style={{ y: blurY }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          animate={{
            x: pointer.x * 30,
            y: pointer.y * 30,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 80 }}
          className="absolute -left-32 top-1/4 h-[44vh] w-[44vh] rounded-full bg-bluepulse/40 blur-[140px]"
        />
        <motion.div
          animate={{
            x: -pointer.x * 40,
            y: -pointer.y * 40,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 80 }}
          className="absolute -right-32 top-1/3 h-[36vh] w-[36vh] rounded-full bg-cyanglow/30 blur-[140px]"
        />
        <motion.div
          animate={{ x: pointer.x * 20, y: -pointer.y * 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 80 }}
          className="absolute bottom-0 left-1/3 h-[30vh] w-[30vh] rounded-full bg-violet/30 blur-[140px]"
        />
      </motion.div>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto mb-8 flex w-full max-w-[1480px] items-center justify-between px-6 md:mb-12 md:px-10"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-cyanglow/70" />
            <span className="relative h-2 w-2 rounded-full bg-cyanglow" />
          </span>
          <span className="text-xs uppercase tracking-[0.4em] text-white/60">
            {hero.statusBadge}
          </span>
        </div>
        <div className="hidden items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/40 md:flex">
          {hero.cities.map((c, i) => (
            <span key={c} className="flex items-center gap-3">
              <span>{c}</span>
              {i < hero.cities.length - 1 && (
                <span className="h-px w-6 bg-white/20" />
              )}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Headline */}
      <motion.div
        style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
        className="relative z-10 mx-auto w-full max-w-[1480px] px-6 md:px-10"
      >
        <h1 className="font-display font-medium leading-[0.86] tracking-ultratight">
          {hero.headline.map((line, i) => (
            <LineReveal key={i} delay={1.2 + i * 0.12}>
              <span
                className={`block text-[18vw] sm:text-[16vw] md:text-[12.5vw] ${
                  i === 1
                    ? "gradient-text italic"
                    : i === 3
                    ? "text-stroke"
                    : "text-white"
                }`}
              >
                {line}
              </span>
            </LineReveal>
          ))}
        </h1>

        {/* Subtext + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-12"
        >
          <p className="font-cabinet text-base leading-relaxed text-white/70 md:col-span-5 md:text-lg">
            {hero.lead}
          </p>

          <div className="flex flex-wrap items-center gap-4 md:col-span-5 md:col-start-8">
            <MagneticButton
              as="a"
              href={hero.primaryCta.href}
              data-cursor="hover"
              className="text-base"
            >
              <span className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-display font-medium text-black transition-all hover:shadow-[0_0_50px_rgba(255,255,255,0.45)]">
                {hero.primaryCta.label}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:rotate-45">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </span>
            </MagneticButton>

            <MagneticButton
              as="a"
              href={hero.secondaryCta.href}
              data-cursor="play"
              className="text-base"
            >
              <span className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 font-display font-medium text-white transition-all hover:border-white/60">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/5">
                  <Play className="h-3.5 w-3.5 fill-white" />
                </span>
                {hero.secondaryCta.label}
              </span>
            </MagneticButton>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="relative z-10 mx-auto mt-16 flex w-full max-w-[1480px] items-center justify-between px-6 md:mt-24 md:px-10"
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/50">
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20"
          >
            <MoveDown className="h-4 w-4 text-white/70" />
          </motion.span>
          {hero.scrollLabel}
        </div>
        <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.4em] text-white/40 md:flex">
          {hero.awards.map((a, i) => (
            <span key={a} className="flex items-center gap-6">
              <span>{a}</span>
              {i < hero.awards.length - 1 && (
                <span className="h-px w-12 bg-white/20" />
              )}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function LineReveal({ children, delay = 0 }) {
  return (
    <span className="block overflow-hidden pb-[2vw]">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}
