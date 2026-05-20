"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { faq } from "@/lib/content";
import { RichText } from "@/lib/richText";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section
      id="faq"
      className="relative z-10 overflow-hidden py-32 md:py-44"
    >
      <div className="mx-auto w-full max-w-[1480px] px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-cyanglow" />
              <span className="text-xs uppercase tracking-[0.5em] text-cyanglow">
                {faq.sectionNumber} — {faq.sectionLabel}
              </span>
            </div>
            <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-ultratight md:text-7xl">
              <RichText text={faq.heading.rich} />
            </h2>
          </div>
        </div>

        {/* Accordion */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-md">
          {faq.items.map((item, i) => (
            <AccordionItem
              key={item.q}
              index={i}
              total={faq.items.length}
              q={item.q}
              a={item.a}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AccordionItem({ q, a, isOpen, onToggle, index, total }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.7,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={index < total - 1 ? "border-b border-white/10" : ""}
    >
      <button
        type="button"
        onClick={onToggle}
        data-cursor="hover"
        className="group flex w-full items-center justify-between gap-6 px-6 py-7 text-left transition-colors hover:bg-white/[0.02] md:px-9 md:py-9"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-5">
          <span className="font-display text-xs uppercase tracking-[0.4em] text-cyanglow/80">
            0{index + 1}
          </span>
          <span className="font-display text-xl font-medium tracking-tight text-white md:text-2xl">
            {q}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isOpen
              ? "border-cyanglow/60 bg-cyanglow/10 text-cyanglow"
              : "border-white/15 bg-white/5 text-white"
          }`}
        >
          <Plus className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 md:px-9 md:pb-10">
              <div className="ml-0 max-w-2xl pl-12 font-cabinet text-base leading-relaxed text-white/65 md:text-lg">
                {a}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
