"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Instagram, Twitter, Youtube, Linkedin, Github } from "lucide-react";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Youtube, label: "Vimeo", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
];

const cols = [
  {
    title: "Studio",
    links: ["About", "Process", "Careers", "Press", "Sustainability"],
  },
  {
    title: "Work",
    links: ["Selected", "Archive", "Awards", "Reel ’26", "Case Studies"],
  },
  {
    title: "Contact",
    links: ["hello@jasstudios.co", "Mumbai HQ", "Berlin Lab", "NYC Outpost", "Press kit"],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/10 bg-ink-950/80 backdrop-blur-2xl">
      {/* Floating gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-[40vh] w-[40vh] rounded-full bg-bluepulse/20 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[36vh] w-[36vh] rounded-full bg-violet/20 blur-[120px]" />
      </div>

      {/* Big closing wordmark */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative px-4 pb-2 pt-20 text-center md:px-10 md:pt-32"
        >
          <h3 className="font-display text-[22vw] font-medium leading-[0.86] tracking-ultratight">
            <span className="gradient-text">JAS</span>{" "}
            <span className="text-stroke italic">Studios</span>
          </h3>
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      {/* Content row */}
      <div className="relative mx-auto w-full max-w-[1480px] px-6 pb-10 pt-12 md:px-10 md:pt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h4 className="font-display text-3xl font-medium tracking-tight md:text-5xl">
              Let’s build the next icon together.
            </h4>
            <a
              href="#contact"
              data-cursor="hover"
              className="group mt-6 inline-flex items-center gap-3 rounded-full border border-cyanglow/40 bg-cyanglow/10 px-5 py-3 text-sm font-medium hover:border-cyanglow hover:bg-cyanglow/20"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="mb-4 text-xs uppercase tracking-[0.3em] text-white/40">
                  {c.title}
                </div>
                <ul className="flex flex-col gap-2">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        data-cursor="hover"
                        className="font-cabinet text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Socials */}
        <div className="mt-14 flex flex-wrap items-center gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              data-cursor="hover"
              className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.03] transition-all hover:border-cyanglow/60 hover:bg-cyanglow/10"
            >
              <Icon className="h-4 w-4 text-white/80 transition-colors group-hover:text-cyanglow" />
              <span className="pointer-events-none absolute inset-0 -translate-y-full bg-gradient-to-b from-cyanglow/20 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.3em] text-white/40 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} JAS Studios — All rights reserved.</span>
          <span>Crafted with light, motion & shaders.</span>
          <span>v 26.05 · Mumbai HQ</span>
        </div>
      </div>
    </footer>
  );
}
