"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { contact } from "@/lib/content";
import { RichText } from "@/lib/richText";
import { getIcon } from "@/lib/icons";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [picked, setPicked] = useState([contact.defaultPickedService]);
  const [budget, setBudget] = useState(contact.defaultBudget);
  const [submitted, setSubmitted] = useState(false);

  const togglePick = (s) =>
    setPicked((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const onSubmit = (e) => {
    e.preventDefault();
    // Demo only — wire up to your backend (e.g. Resend, Formspree, custom API)
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative z-10 overflow-hidden py-32 md:py-44"
    >
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-[60vh] w-[60vh] rounded-full bg-bluepulse/25 blur-[140px]" />
        <div className="absolute -right-32 bottom-0 h-[60vh] w-[60vh] rounded-full bg-violet/25 blur-[140px]" />
        <div className="absolute left-1/2 top-1/3 h-[40vh] w-[40vh] -translate-x-1/2 rounded-full bg-cyanglow/15 blur-[140px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1480px] px-6 md:px-10">
        {/* Massive CTA headline */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:mb-24 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-cyanglow" />
              <span className="text-xs uppercase tracking-[0.5em] text-cyanglow">
                {contact.sectionNumber} — {contact.sectionLabel}
              </span>
            </div>
            <h2 className="font-display text-6xl font-medium leading-[0.92] tracking-ultratight md:text-[8vw]">
              {contact.heading.line1} <br />
              <RichText text={contact.heading.line2Rich} />
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="font-cabinet text-base leading-relaxed text-white/60 md:text-lg">
              {contact.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 font-cabinet text-sm">
              {contact.contactLines.map((line) => (
                <Contactline
                  key={line.label}
                  icon={line.icon}
                  label={line.label}
                  href={line.href}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-2xl md:p-12">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyanglow/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-violet/20 blur-3xl" />

          {!submitted ? (
            <form onSubmit={onSubmit} className="relative grid grid-cols-1 gap-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field
                    label={contact.formLabels.name}
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder={contact.formLabels.namePlaceholder}
                  />
                  <Field
                    label={contact.formLabels.email}
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder={contact.formLabels.emailPlaceholder}
                  />
                  <Field
                    label={contact.formLabels.company}
                    value={form.company}
                    onChange={(v) => setForm({ ...form, company: v })}
                    placeholder={contact.formLabels.companyPlaceholder}
                    full
                  />
                  <FieldArea
                    label={contact.formLabels.message}
                    value={form.message}
                    onChange={(v) => setForm({ ...form, message: v })}
                    placeholder={contact.formLabels.messagePlaceholder}
                  />
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="mb-3 text-xs uppercase tracking-[0.3em] text-white/50">
                  {contact.formLabels.needsHeading}
                </div>
                <div className="flex flex-wrap gap-2">
                  {contact.serviceOptions.map((s) => {
                    const active = picked.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => togglePick(s)}
                        data-cursor="hover"
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                          active
                            ? "border-cyanglow/70 bg-cyanglow/15 text-white shadow-[0_0_24px_rgba(125,249,255,0.3)]"
                            : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 mb-3 text-xs uppercase tracking-[0.3em] text-white/50">
                  {contact.formLabels.budgetHeading}
                </div>
                <div className="flex flex-wrap gap-2">
                  {contact.budgetOptions.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      data-cursor="hover"
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                        budget === b
                          ? "border-cyanglow/70 bg-cyanglow/15 text-white"
                          : "border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                <div className="mt-12 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                    {contact.formLabels.optionalNote}
                  </span>
                </div>
              </div>

              <div className="md:col-span-12">
                <div className="mt-4 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
                  <span className="font-cabinet text-xs uppercase tracking-[0.3em] text-white/45">
                    {contact.privacyNote}
                  </span>
                  <MagneticButton
                    as="button"
                    type="submit"
                    data-cursor="hover"
                    className="text-base"
                  >
                    <span className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-display font-medium text-black transition-all hover:shadow-[0_0_50px_rgba(255,255,255,0.45)]">
                      {contact.submitLabel}
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:rotate-45">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </span>
                  </MagneticButton>
                </div>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center justify-center gap-6 py-20 text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cyanglow/40 bg-cyanglow/10 shadow-[0_0_50px_rgba(125,249,255,0.5)]">
                <ArrowUpRight className="h-7 w-7 text-cyanglow" />
              </span>
              <h3 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
                {contact.successHeading}
              </h3>
              <p className="max-w-md font-cabinet text-base text-white/60">
                {contact.successBody}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", full }) {
  const [focus, setFocus] = useState(false);
  return (
    <label className={`group block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-white/45">
        {label}
      </span>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={placeholder}
          className="peer w-full border-b border-white/15 bg-transparent py-3 font-cabinet text-base text-white placeholder:text-white/25 focus:outline-none"
        />
        <motion.span
          aria-hidden
          initial={false}
          animate={{
            scaleX: focus || value ? 1 : 0,
            opacity: focus || value ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-cyanglow via-bluepulse to-violet"
        />
      </div>
    </label>
  );
}

function FieldArea({ label, value, onChange, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-white/45">
        {label}
      </span>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={placeholder}
          rows={4}
          className="w-full resize-none border-b border-white/15 bg-transparent py-3 font-cabinet text-base text-white placeholder:text-white/25 focus:outline-none"
        />
        <motion.span
          aria-hidden
          initial={false}
          animate={{
            scaleX: focus || value ? 1 : 0,
            opacity: focus || value ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-cyanglow via-bluepulse to-violet"
        />
      </div>
    </label>
  );
}

function Contactline({ icon, label, href }) {
  const Icon = getIcon(icon);
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      href={href}
      data-cursor={href ? "hover" : undefined}
      className="group flex items-center gap-3 text-white/75 transition-colors hover:text-white"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
        <Icon className="h-4 w-4 text-cyanglow" strokeWidth={1.5} />
      </span>
      <span className="font-cabinet">{label}</span>
    </Wrapper>
  );
}
