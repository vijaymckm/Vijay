"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Play,
  Wand2,
  Crown,
  ShieldCheck,
  MessageSquare,
  Presentation,
  Workflow,
  PenTool,
  Globe,
  Bot,
  Users,
  Palette,
  Compass,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Smartphone,
  LayoutDashboard,
  MousePointer2,
  Search,
  Target,
  Eye,
  MessageCircle,
  ListChecks,
  FileUp,
  BellRing,
  FolderKanban,
  Megaphone,
  ScrollText,
  Layers,
  Zap,
  TrendingUp,
  Award,
  Building2,
  Check,
  Rocket,
  Mail,
  Globe2,
  Star,
  Circle,
  ChevronRight,
} from "lucide-react";

/* ============================================================
   DATA
============================================================ */

const presenceCards = [
  {
    icon: Crown,
    title: "Professional Branding",
    desc: "A polished, consistent visual identity that elevates RegalFinserrv across every customer touchpoint.",
  },
  {
    icon: ShieldCheck,
    title: "Better Customer Trust",
    desc: "Premium presentation, secure communication and credible storytelling that earns instant client confidence.",
  },
  {
    icon: MessageSquare,
    title: "Faster Customer Communication",
    desc: "Instant WhatsApp responses and smart routing so no enquiry waits and no opportunity is missed.",
  },
  {
    icon: Presentation,
    title: "Modern Business Presentation",
    desc: "A clean, cinematic digital identity that reflects the seriousness of a modern financial services brand.",
  },
  {
    icon: Workflow,
    title: "Streamlined Lead Handling",
    desc: "Every lead captured, classified and tracked through a single, organized automated pipeline.",
  },
];

const deliverCards = [
  {
    icon: PenTool,
    title: "Social Media Branding",
    desc: "End-to-end branded presence on Instagram, Facebook, LinkedIn & YouTube.",
  },
  {
    icon: Globe,
    title: "Website Redesign",
    desc: "A premium, conversion-focused website built for modern financial customers.",
  },
  {
    icon: Bot,
    title: "Smart Automation System",
    desc: "WhatsApp + form + CRM automations that work silently in the background.",
  },
  {
    icon: Users,
    title: "Lead Handling Workflow",
    desc: "A structured pipeline from first click to qualified, document-ready lead.",
  },
  {
    icon: Palette,
    title: "Creative Design Support",
    desc: "Ongoing creatives, posts, ads and brand assets curated every month.",
  },
  {
    icon: Compass,
    title: "Digital Brand Positioning",
    desc: "Strategic positioning that places RegalFinserrv as a premium financial brand.",
  },
];

const socialCards = [
  {
    icon: Instagram,
    title: "Instagram Setup",
    tag: "Visual storytelling",
    gradient: "from-yellow-200 via-amber-100 to-white",
    desc: "Premium grid, branded reels covers, story highlights and consistent post identity.",
  },
  {
    icon: Facebook,
    title: "Facebook Setup",
    tag: "Trust & reach",
    gradient: "from-amber-100 via-yellow-50 to-white",
    desc: "Optimized business page, branded creatives, lead form integration & ad-ready presence.",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Setup",
    tag: "Authority building",
    gradient: "from-yellow-100 via-white to-amber-50",
    desc: "Polished company page, founder branding, B2B credibility and thought-leadership posts.",
  },
  {
    icon: Youtube,
    title: "YouTube Setup",
    tag: "Long-form trust",
    gradient: "from-amber-50 via-yellow-100 to-white",
    desc: "Branded channel art, premium thumbnails and structured playlists for credibility.",
  },
];

const websiteFeatures = [
  {
    icon: Smartphone,
    title: "Modern Responsive Design",
    desc: "Pixel-perfect on mobile, tablet, laptop and 4K — engineered for every customer device.",
  },
  {
    icon: LayoutDashboard,
    title: "Professional UI/UX",
    desc: "A premium, financial-grade interface that earns trust within the first three seconds.",
  },
  {
    icon: MousePointer2,
    title: "Smooth User Experience",
    desc: "Cinematic scrolling, micro-interactions and zero-friction navigation across every page.",
  },
  {
    icon: Search,
    title: "SEO Optimized Structure",
    desc: "Clean architecture, fast performance and search-ready metadata baked into every page.",
  },
  {
    icon: Target,
    title: "Lead-Oriented Design",
    desc: "Every section is engineered to push qualified leads into the WhatsApp + CRM pipeline.",
  },
];

const customerCards = [
  {
    icon: MessageCircle,
    title: "WhatsApp Auto Response",
    desc: "Instant branded replies the moment a lead messages — 24×7, never a missed enquiry.",
  },
  {
    icon: ListChecks,
    title: "Smart Service Selection",
    desc: "Guided menu helps the customer pick the exact loan or service in seconds.",
  },
  {
    icon: FileUp,
    title: "Document Collection System",
    desc: "Automated document checklist, secure upload links and clean storage per lead.",
  },
  {
    icon: BellRing,
    title: "Admin Notifications",
    desc: "Real-time alerts to the team the second a qualified lead is captured.",
  },
  {
    icon: FolderKanban,
    title: "Organized Lead Handling",
    desc: "Every lead structured, tagged and tracked inside one premium pipeline.",
  },
];

const automationCards = [
  {
    icon: Megaphone,
    title: "Meta Ads Lead Capture",
    step: "01",
    desc: "Leads from Facebook & Instagram ads instantly pulled into the system.",
  },
  {
    icon: ScrollText,
    title: "Landing Page Enquiry",
    step: "02",
    desc: "Custom forms on the website pipe directly into the automation workflow.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Auto Response",
    step: "03",
    desc: "Lead receives a branded WhatsApp greeting within seconds of submission.",
  },
  {
    icon: Layers,
    title: "Service Selection Flow",
    step: "04",
    desc: "Customer picks the service via a clean conversational flow.",
  },
  {
    icon: FileUp,
    title: "Client Document Upload",
    step: "05",
    desc: "Automated checklist + secure links to collect KYC and supporting documents.",
  },
  {
    icon: BellRing,
    title: "Admin Notifications",
    step: "06",
    desc: "Internal team is alerted with the full lead context, ready to close.",
  },
];

const outcomeCards = [
  {
    icon: TrendingUp,
    title: "Stronger Brand Presence",
    desc: "A unified premium identity across every digital surface.",
  },
  {
    icon: ShieldCheck,
    title: "Better Online Trust",
    desc: "Customers experience credibility from the first click.",
  },
  {
    icon: Award,
    title: "Professional Business Identity",
    desc: "RegalFinserrv positioned as a serious, modern financial brand.",
  },
  {
    icon: Eye,
    title: "Improved Digital Visibility",
    desc: "Discoverable across search, socials and ad-driven channels.",
  },
];

const websitePlanFeatures = [
  "Premium Website Design",
  "Modern Responsive UI/UX",
  "Mobile & Tablet Optimization",
  "SEO Friendly Structure",
  "Lead Generation Setup",
  "WhatsApp Integration",
  "Business Profile Presentation",
  "Contact & Enquiry Forms",
  "Performance Optimization",
  "Professional Brand Experience",
];

const retainerPlanFeatures = [
  "Social Media Management",
  "Creative Branding Designs",
  "Meta Ads Management",
  "Website Maintenance",
  "Monthly Content Updates",
  "Lead Automation Support",
  "WhatsApp Automation",
  "Google Business Optimization",
  "Monthly Branding Support",
  "Priority Technical Support",
];

/* ============================================================
   ANIMATION VARIANTS
============================================================ */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const float = {
  initial: { y: 0 },
  animate: {
    y: [0, -12, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

/* ============================================================
   PREMIUM 3D LOADER
============================================================ */

function PremiumLoader() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-yellow-400/10 blur-[140px]" />
        <div className="absolute left-[10%] top-[20%] w-[280px] h-[280px] rounded-full bg-yellow-300/10 blur-[120px]" />
        <div className="absolute right-[8%] bottom-[12%] w-[260px] h-[260px] rounded-full bg-amber-300/10 blur-[120px]" />
      </div>

      {/* central stack */}
      <div className="relative flex flex-col items-center justify-center">
        {/* rotating rings */}
        <div className="relative w-[320px] h-[320px] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-yellow-400/40"
            style={{ boxShadow: "0 0 60px rgba(250,204,21,0.18) inset" }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 rounded-full border border-yellow-300/25"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-12 rounded-full border border-dashed border-yellow-200/20"
          />

          {/* glowing yellow orb */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-28 h-28 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-amber-500"
            style={{
              boxShadow:
                "0 0 80px rgba(250,204,21,0.55), 0 0 160px rgba(250,204,21,0.35), inset 0 0 40px rgba(255,255,255,0.45)",
            }}
          >
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/60 to-transparent blur-md" />
            <div className="absolute inset-0 rounded-full ring-1 ring-white/20" />
          </motion.div>
        </div>

        {/* floating 3D card */}
        <motion.div
          initial={{ y: 30, opacity: 0, rotateX: -8 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 px-7 py-4 rounded-2xl border border-yellow-400/30 bg-white/5 backdrop-blur-xl"
          style={{
            boxShadow:
              "0 30px 80px -20px rgba(250,204,21,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-[11px] tracking-[0.4em] uppercase text-yellow-200/80">
              Loading Experience
            </span>
          </div>
        </motion.div>

        {/* title */}
        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-center text-4xl md:text-6xl font-semibold tracking-tight text-white"
        >
          Regal<span className="text-yellow-400">Finserrv</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-2 text-xs tracking-[0.45em] uppercase text-white/50"
        >
          Premium Digital Proposal
        </motion.p>

        {/* loading bar */}
        <div className="mt-10 h-[2px] w-72 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   SHARED UI BITS
============================================================ */

function SectionEyebrow({ children }) {
  return (
    <motion.div
      variants={fadeUp}
      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-1.5 backdrop-blur-md shadow-sm"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
      <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-black/70">
        {children}
      </span>
    </motion.div>
  );
}

function GradientBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-yellow-300/30 blur-[160px]" />
      <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-amber-200/40 blur-[160px]" />
      <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-yellow-200/30 blur-[160px]" />
    </div>
  );
}

function GridOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)",
      }}
    />
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */

export default function RegalFinserrvPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-black font-sans antialiased">
      {/* loader overlay */}
      <AnimatePresence mode="wait">
        {loading && <PremiumLoader />}
      </AnimatePresence>

      {/* persistent floating gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <GradientBlobs />
        <GridOverlay />
      </div>

      <div className="relative z-10">
        {/* ============================================================
            NAVBAR (lightweight, premium)
        ============================================================ */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/60 border-b border-black/5">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-xl bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_8px_30px_-8px_rgba(250,204,21,0.7)]">
                <div className="absolute inset-1 rounded-lg bg-white/30 backdrop-blur-sm" />
              </div>
              <span className="text-sm font-semibold tracking-tight">
                Regal<span className="text-yellow-500">Finserrv</span>
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-black/60">
              <a href="#presence" className="hover:text-black transition">Presence</a>
              <a href="#deliver" className="hover:text-black transition">Deliverables</a>
              <a href="#automation" className="hover:text-black transition">Automation</a>
              <a href="#pricing" className="hover:text-black transition">Pricing</a>
            </nav>
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-medium text-white hover:bg-yellow-400 hover:text-black transition"
            >
              Start Project
              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </header>

        {/* ============================================================
            1. HERO
        ============================================================ */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-44">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={loading ? "hidden" : "show"}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* left */}
              <div className="lg:col-span-7">
                <motion.div variants={fadeUp}>
                  <SectionEyebrow>RegalFinserrv Proposal</SectionEyebrow>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  className="mt-7 text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] font-semibold tracking-[-0.04em] leading-[0.95]"
                >
                  A premium digital
                  <br />
                  experience built for
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10 text-black">RegalFinserrv</span>
                    <span className="absolute inset-x-0 bottom-2 h-3 bg-yellow-300/70 -z-0 rounded-sm" />
                  </span>
                  .
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="mt-7 max-w-xl text-lg text-black/60 leading-relaxed"
                >
                  A complete proposal to modernize the brand, redesign the
                  website and automate every lead — engineered with the polish
                  of a premium financial company.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="#presence"
                    className="group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_60px_-15px_rgba(250,204,21,0.6)] hover:bg-yellow-400 hover:text-black transition-all"
                  >
                    View Proposal
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#automation"
                    className="group inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-6 py-3.5 text-sm font-medium text-black backdrop-blur-md hover:border-yellow-400 hover:bg-yellow-50 transition"
                  >
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Automated Lead Management
                  </a>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-12 flex items-center gap-8">
                  <div className="flex -space-x-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-9 w-9 rounded-full ring-2 ring-white bg-gradient-to-br from-yellow-200 to-amber-500"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-black/60">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400" />
                      ))}
                    </div>
                    Crafted by JAS Studios — premium presentation
                  </div>
                </motion.div>
              </div>

              {/* right floating premium card */}
              <div className="lg:col-span-5">
                <motion.div
                  variants={fadeUp}
                  className="relative"
                >
                  <motion.div
                    variants={float}
                    initial="initial"
                    animate="animate"
                    className="relative rounded-[32px] border border-black/5 bg-white/70 p-6 backdrop-blur-2xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.25)]"
                  >
                    {/* glow */}
                    <div className="absolute -inset-1 -z-10 rounded-[36px] bg-gradient-to-br from-yellow-300/30 via-amber-200/20 to-transparent blur-2xl" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.7)]" />
                        <span className="text-[11px] tracking-[0.3em] uppercase text-black/50">
                          Live Proposal
                        </span>
                      </div>
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                    </div>

                    <div className="mt-6 rounded-3xl bg-black p-6 text-white relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl" />
                      <div className="text-[10px] tracking-[0.4em] uppercase text-yellow-300/80">
                        Brand · Web · Automation
                      </div>
                      <div className="mt-4 text-3xl font-semibold tracking-tight leading-tight">
                        RegalFinserrv
                        <br />
                        Digital Suite
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-xs text-white/50">Engagement</div>
                        <div className="text-xs text-yellow-300">Premium</div>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "86%" }}
                          transition={{ duration: 1.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full bg-gradient-to-r from-yellow-300 to-amber-500"
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      {[
                        { label: "Brand", val: "+1" },
                        { label: "Pages", val: "12" },
                        { label: "Flows", val: "06" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="rounded-2xl border border-black/5 bg-white/80 p-3 text-center"
                        >
                          <div className="text-2xl font-semibold tracking-tight">
                            {s.val}
                          </div>
                          <div className="text-[10px] tracking-[0.3em] uppercase text-black/40 mt-1">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-yellow-50 border border-yellow-200/70 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-yellow-600" />
                        <span className="text-xs font-medium text-yellow-800">
                          Automation Ready
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-yellow-700" />
                    </div>
                  </motion.div>

                  {/* floating accent */}
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-6 -bottom-6 hidden md:flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white shadow-2xl"
                  >
                    <Play className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">Cinematic preview</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            3. BUILDING A STRONGER DIGITAL PRESENCE
        ============================================================ */}
        <section id="presence" className="relative py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-3xl"
            >
              <SectionEyebrow>01 — The Vision</SectionEyebrow>
              <motion.h2
                variants={fadeUp}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]"
              >
                Building a stronger
                <br />
                <span className="text-black/40">digital presence.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-black/60 max-w-xl"
              >
                Five foundational pillars that elevate RegalFinserrv from a
                financial service into a recognizable, premium digital brand.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {presenceCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="group relative rounded-3xl border border-black/5 bg-white/70 p-7 backdrop-blur-md shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_80px_-25px_rgba(250,204,21,0.35)] transition-all"
                  >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-50/0 via-yellow-50/0 to-yellow-100/0 group-hover:from-yellow-50/60 group-hover:to-amber-50/40 transition" />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-200 to-amber-400 text-black shadow-[0_10px_30px_-10px_rgba(250,204,21,0.7)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] tracking-[0.3em] uppercase text-black/30">
                          0{i + 1}
                        </span>
                      </div>
                      <h3 className="mt-7 text-xl font-semibold tracking-tight">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-black/60">
                        {card.desc}
                      </p>
                      <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-black/50 group-hover:text-yellow-700 transition">
                        Learn more
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            4. WHAT WE WILL DELIVER
        ============================================================ */}
        <section id="deliver" className="relative py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
            >
              <div className="max-w-2xl">
                <SectionEyebrow>02 — Deliverables</SectionEyebrow>
                <motion.h2
                  variants={fadeUp}
                  className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]"
                >
                  What we will
                  <br />
                  <span className="text-yellow-500">deliver.</span>
                </motion.h2>
              </div>
              <motion.p
                variants={fadeUp}
                className="lg:max-w-md text-lg text-black/60"
              >
                A complete, production-ready system — from creatives and
                website to lead automation, designed end-to-end.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {deliverCards.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="group relative overflow-hidden rounded-3xl bg-black p-7 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
                  >
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yellow-400/20 blur-3xl group-hover:bg-yellow-400/40 transition" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_60%)]" />
                    <div className="relative">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-black shadow-[0_10px_30px_-8px_rgba(250,204,21,0.8)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-7 text-xl font-semibold tracking-tight">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/60">
                        {card.desc}
                      </p>
                      <div className="mt-6 h-px w-full bg-white/10" />
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-yellow-300 font-medium">
                        Included
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            5. PROFESSIONAL SOCIAL MEDIA PRESENCE
        ============================================================ */}
        <section className="relative py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-3xl"
            >
              <SectionEyebrow>03 — Social Presence</SectionEyebrow>
              <motion.h2
                variants={fadeUp}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]"
              >
                Professional social
                <br />
                <span className="text-black/40">media presence.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-black/60 max-w-xl"
              >
                A unified premium identity across the four channels that matter
                most for a modern financial brand.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {socialCards.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    variants={fadeUp}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="group relative rounded-3xl border border-black/5 bg-white/70 backdrop-blur-md overflow-hidden shadow-[0_25px_70px_-30px_rgba(0,0,0,0.25)] hover:shadow-[0_35px_90px_-25px_rgba(250,204,21,0.45)] transition-all"
                  >
                    {/* placeholder image area */}
                    <div className={`relative h-44 w-full bg-gradient-to-br ${card.gradient} overflow-hidden`}>
                      <div
                        className="absolute inset-0 opacity-60"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
                          backgroundSize: "24px 24px",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                          className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
                        >
                          <Icon className="h-9 w-9 text-black" />
                          <div className="absolute -bottom-1 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-black/20 blur-md" />
                        </motion.div>
                      </div>
                      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase text-black/60">
                        <Circle className="h-1.5 w-1.5 fill-yellow-400 text-yellow-400" />
                        {card.tag}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold tracking-tight">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/55">
                        {card.desc}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-black/50 group-hover:text-yellow-700 transition">
                        View setup
                        <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            6. PREMIUM WEBSITE EXPERIENCE
        ============================================================ */}
        <section className="relative py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start"
            >
              <div className="lg:col-span-5">
                <SectionEyebrow>04 — Website</SectionEyebrow>
                <motion.h2
                  variants={fadeUp}
                  className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]"
                >
                  A premium
                  <br />
                  website
                  <br />
                  <span className="text-yellow-500">experience.</span>
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="mt-6 text-lg text-black/60 max-w-md"
                >
                  Engineered with the polish, performance and trust expected
                  from a premium financial company.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-8 space-y-4">
                  {websiteFeatures.map((feat, i) => {
                    const Icon = feat.icon;
                    return (
                      <div
                        key={feat.title}
                        className="group flex items-start gap-4 rounded-2xl border border-black/5 bg-white/70 p-4 backdrop-blur-md hover:border-yellow-300 hover:bg-yellow-50/60 transition"
                      >
                        <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-black text-yellow-300 group-hover:bg-yellow-400 group-hover:text-black transition">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold tracking-tight">
                            {feat.title}
                          </div>
                          <div className="mt-1 text-xs text-black/55 leading-relaxed">
                            {feat.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>

                <motion.div variants={fadeUp} className="mt-8">
                  <a
                    href="#"
                    className="group inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3.5 text-sm font-medium text-black shadow-[0_20px_50px_-15px_rgba(250,204,21,0.7)] hover:bg-black hover:text-yellow-300 transition"
                  >
                    Website Preview
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </motion.div>
              </div>

              {/* preview panel */}
              <div className="lg:col-span-7">
                <motion.div
                  variants={fadeUp}
                  className="relative rounded-[36px] border border-black/5 bg-white/60 p-4 backdrop-blur-2xl shadow-[0_50px_120px_-30px_rgba(0,0,0,0.3)]"
                >
                  <div className="absolute -inset-2 -z-10 rounded-[40px] bg-gradient-to-br from-yellow-300/30 via-amber-100/10 to-transparent blur-2xl" />

                  {/* browser chrome */}
                  <div className="flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur px-4 py-3 border border-black/5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="rounded-full bg-black/5 px-3 py-1 text-[11px] text-black/50">
                      regalfinserrv.com
                    </div>
                    <Globe className="h-3.5 w-3.5 text-black/30" />
                  </div>

                  {/* preview content */}
                  <div className="relative mt-4 aspect-[4/3] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-amber-50 border border-black/5">
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                      }}
                    />
                    <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-yellow-300/40 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-amber-200/40 blur-3xl" />

                    <div className="relative p-8 lg:p-12 h-full flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="text-xs tracking-[0.3em] uppercase text-black/40">
                          Premium Finance
                        </div>
                        <div className="rounded-full bg-black px-3 py-1 text-[10px] text-yellow-300">
                          Apply Now
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] leading-[1] text-black">
                          Loans built
                          <br />
                          on trust.
                        </div>
                        <div className="mt-4 max-w-sm text-sm text-black/55">
                          Premium financial solutions with transparency,
                          speed and a human touch.
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <div className="rounded-full bg-yellow-400 px-4 py-2 text-xs font-medium text-black">
                            Get Started
                          </div>
                          <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs text-black/70 backdrop-blur">
                            Talk to advisor
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-2">
                          {["Personal", "Business", "Mortgage"].map((p) => (
                            <div
                              key={p}
                              className="rounded-xl bg-white/70 backdrop-blur border border-black/5 p-2.5 text-center text-[11px] text-black/60"
                            >
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* floating accent */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 rounded-2xl bg-black px-4 py-3 text-white shadow-2xl"
                  >
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400 text-black">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold">Live preview</div>
                      <div className="text-white/50">Cinematic experience</div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            7. SMART CUSTOMER HANDLING SYSTEM
        ============================================================ */}
        <section className="relative py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-3xl"
            >
              <SectionEyebrow>05 — Customer Handling</SectionEyebrow>
              <motion.h2
                variants={fadeUp}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]"
              >
                A smart customer
                <br />
                <span className="text-black/40">handling system.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-black/60 max-w-xl"
              >
                Every enquiry — captured, classified, replied to and tracked.
                Zero leaks, zero delays, zero manual chaos.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {customerCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="group relative rounded-3xl border border-black/5 bg-white/70 p-7 backdrop-blur-md shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_80px_-25px_rgba(250,204,21,0.35)] transition-all"
                  >
                    <div className="absolute right-7 top-7 text-[11px] tracking-[0.3em] uppercase text-black/30">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-yellow-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] group-hover:bg-yellow-400 group-hover:text-black transition">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-7 text-xl font-semibold tracking-tight">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-black/60">
                      {card.desc}
                    </p>
                    <div className="mt-6 h-px w-full bg-black/5" />
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-black/50 group-hover:text-yellow-700 transition">
                      Inside the system
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            8. AUTOMATION WORKFLOW SECTION
        ============================================================ */}
        <section id="automation" className="relative py-32 bg-black text-white overflow-hidden">
          {/* dark section blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/3 h-[480px] w-[480px] rounded-full bg-yellow-400/15 blur-[160px]" />
            <div className="absolute bottom-0 right-1/4 h-[420px] w-[420px] rounded-full bg-amber-300/10 blur-[160px]" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage:
                  "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-3xl"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-white/5 px-4 py-1.5 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-yellow-200/80">
                  06 — Automation
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]"
              >
                How the automation
                <br />
                <span className="text-yellow-400">system works.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-white/60 max-w-xl"
              >
                A six-stage pipeline that runs silently in the background —
                turning every click into a qualified, document-ready lead.
              </motion.p>
            </motion.div>

            {/* large workflow visual placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-16 rounded-[36px] border border-dashed border-yellow-400/30 bg-white/[0.03] p-8 backdrop-blur-md"
            >
              <div className="absolute -inset-1 -z-10 rounded-[40px] bg-gradient-to-br from-yellow-400/10 via-transparent to-amber-300/10 blur-2xl" />

              <div className="flex flex-col lg:flex-row items-stretch gap-8">
                {/* visual placeholder */}
                <div className="relative flex-1 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 min-h-[360px] overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(250,204,21,0.25) 1px, transparent 0)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <div className="relative h-full flex flex-col items-center justify-center text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                      className="absolute h-72 w-72 rounded-full border border-dashed border-yellow-400/30"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                      className="absolute h-96 w-96 rounded-full border border-yellow-400/10"
                    />

                    <motion.div
                      variants={float}
                      initial="initial"
                      animate="animate"
                      className="relative inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-300 to-amber-500 text-black shadow-[0_30px_60px_-15px_rgba(250,204,21,0.6)]"
                    >
                      <Workflow className="h-10 w-10" />
                    </motion.div>
                    <div className="relative mt-6 text-sm tracking-[0.4em] uppercase text-yellow-200/70">
                      Workflow Engine
                    </div>
                    <div className="relative mt-2 text-xs text-white/40">
                      Premium automation pipeline · Real-time
                    </div>
                  </div>
                </div>

                {/* workflow cards stack */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {automationCards.map((c) => {
                    const Icon = c.icon;
                    return (
                      <motion.div
                        key={c.title}
                        variants={fadeUp}
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                        className="group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 hover:border-yellow-400/40 hover:bg-yellow-400/5 transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-black">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-[11px] tracking-[0.3em] uppercase text-yellow-200/60">
                            {c.step}
                          </span>
                        </div>
                        <div className="mt-5 text-sm font-semibold tracking-tight">
                          {c.title}
                        </div>
                        <div className="mt-1.5 text-xs leading-relaxed text-white/55">
                          {c.desc}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            9. WORKFLOW SETUP PREVIEW
        ============================================================ */}
        <section className="relative py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-3xl"
            >
              <SectionEyebrow>07 — Workflow Setup</SectionEyebrow>
              <motion.h2
                variants={fadeUp}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]"
              >
                A live look inside
                <br />
                <span className="text-yellow-500">the workflow.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-black/60 max-w-xl"
              >
                An enterprise-grade dashboard view of the actual automation
                that powers RegalFinserrv's lead engine.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-14 rounded-[40px] border border-black/5 bg-white/70 p-4 backdrop-blur-2xl shadow-[0_60px_140px_-40px_rgba(0,0,0,0.35)]"
            >
              <div className="absolute -inset-2 -z-10 rounded-[44px] bg-gradient-to-br from-yellow-200/40 via-amber-100/20 to-transparent blur-3xl" />

              {/* dashboard chrome */}
              <div className="flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur px-5 py-3 border border-black/5">
                <div className="flex items-center gap-2">
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black text-yellow-300">
                    <Workflow className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-medium">RegalFinserrv · Workflow Dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-green-700 tracking-wide">
                      LIVE
                    </span>
                  </div>
                  <div className="text-[10px] text-black/40">v 1.0.0</div>
                </div>
              </div>

              {/* huge dashed placeholder */}
              <div className="relative mt-4 rounded-3xl border-2 border-dashed border-yellow-300/60 bg-gradient-to-br from-yellow-50/50 via-white to-amber-50/40 p-6 lg:p-10 min-h-[480px] overflow-hidden">
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="absolute -top-20 -right-10 h-72 w-72 rounded-full bg-yellow-300/40 blur-3xl" />
                <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* left col */}
                  <div className="lg:col-span-3 space-y-3">
                    {["Capture", "Qualify", "Reply", "Collect", "Notify", "Close"].map(
                      (s, i) => (
                        <div
                          key={s}
                          className="flex items-center justify-between rounded-2xl bg-white/80 border border-black/5 px-4 py-3 backdrop-blur"
                        >
                          <div className="flex items-center gap-3">
                            <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400 text-black text-[11px] font-semibold">
                              {String(i + 1).padStart(2, "0")}
                            </div>
                            <span className="text-xs font-medium">{s}</span>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-black/30" />
                        </div>
                      )
                    )}
                  </div>

                  {/* center large card */}
                  <div className="lg:col-span-6 rounded-3xl bg-black text-white p-8 relative overflow-hidden flex flex-col">
                    <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-400/25 blur-3xl" />
                    <div className="text-[10px] tracking-[0.4em] uppercase text-yellow-300">
                      Active Pipeline
                    </div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight">
                      Lead Automation
                    </div>
                    <div className="mt-2 text-sm text-white/55 max-w-sm">
                      Real-time view of every lead flowing through the
                      RegalFinserrv automation engine.
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {[
                        { l: "Captured", v: "1,284" },
                        { l: "Replied", v: "1,260" },
                        { l: "Closed", v: "342" },
                      ].map((s) => (
                        <div
                          key={s.l}
                          className="rounded-2xl bg-white/[0.05] border border-white/10 p-4"
                        >
                          <div className="text-2xl font-semibold tracking-tight">{s.v}</div>
                          <div className="mt-1 text-[10px] tracking-[0.3em] uppercase text-white/40">
                            {s.l}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">
                        Engagement
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "92%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full bg-gradient-to-r from-yellow-300 to-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* right col */}
                  <div className="lg:col-span-3 space-y-3">
                    {[
                      { icon: MessageCircle, t: "WhatsApp", v: "Active" },
                      { icon: FileUp, t: "Documents", v: "Secured" },
                      { icon: BellRing, t: "Alerts", v: "On" },
                      { icon: Users, t: "Team Sync", v: "Live" },
                    ].map((m) => {
                      const I = m.icon;
                      return (
                        <div
                          key={m.t}
                          className="rounded-2xl bg-white/80 border border-black/5 p-4 backdrop-blur"
                        >
                          <div className="flex items-center gap-3">
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-yellow-300">
                              <I className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold">{m.t}</div>
                              <div className="text-[10px] text-black/50">{m.v}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            10. EXPECTED BUSINESS OUTCOME
        ============================================================ */}
        <section className="relative py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-3xl"
            >
              <SectionEyebrow>08 — Outcomes</SectionEyebrow>
              <motion.h2
                variants={fadeUp}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]"
              >
                Expected business
                <br />
                <span className="text-black/40">outcome.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-black/60 max-w-xl"
              >
                A measurable shift in how customers perceive, trust and
                interact with RegalFinserrv across every digital channel.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {outcomeCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    variants={fadeUp}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white/70 p-7 backdrop-blur-md shadow-[0_25px_70px_-30px_rgba(0,0,0,0.25)] hover:shadow-[0_35px_90px_-25px_rgba(250,204,21,0.45)] transition-all"
                  >
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-yellow-200/40 blur-2xl group-hover:bg-yellow-300/60 transition" />
                    <div className="relative">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-200 to-amber-400 text-black shadow-[0_10px_30px_-10px_rgba(250,204,21,0.7)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="mt-7 flex items-baseline gap-2">
                        <h3 className="text-xl font-semibold tracking-tight">
                          {card.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-black/60">
                        {card.desc}
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-[11px] tracking-[0.3em] uppercase text-black/30">
                          0{i + 1}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-black/40 group-hover:text-yellow-700 transition" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            11. PRICING & INVESTMENT
        ============================================================ */}
        <section id="pricing" className="relative py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="max-w-3xl"
            >
              <SectionEyebrow>09 — Investment</SectionEyebrow>
              <motion.h2
                variants={fadeUp}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]"
              >
                Pricing &amp;
                <br />
                <span className="text-yellow-500">investment.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-black/60 max-w-xl"
              >
                Two clean, premium engagements — a one-time website build,
                and an ongoing growth partnership.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* LEFT CARD */}
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative rounded-[36px] border border-black/5 bg-white/80 p-10 backdrop-blur-md shadow-[0_40px_100px_-30px_rgba(0,0,0,0.25)] hover:shadow-[0_50px_120px_-30px_rgba(0,0,0,0.4)] transition-all"
              >
                <div className="absolute -inset-1 -z-10 rounded-[40px] bg-gradient-to-br from-yellow-100/60 via-amber-50/40 to-transparent blur-2xl" />

                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 border border-yellow-200 px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-700" />
                  <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-yellow-800">
                    One Time Website Setup
                  </span>
                </div>

                <h3 className="mt-7 text-3xl sm:text-4xl font-semibold tracking-tight">
                  Website Development
                </h3>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-6xl font-semibold tracking-[-0.04em]">
                    ₹25K
                  </span>
                  <span className="text-sm text-black/50">one-time</span>
                </div>

                <div className="mt-2 text-sm text-black/55 max-w-md">
                  A premium, conversion-focused website built end-to-end and
                  ready to launch.
                </div>

                <div className="mt-8 h-px w-full bg-black/5" />

                <ul className="mt-8 space-y-4">
                  {websitePlanFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-black">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </div>
                      <span className="text-black/75">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#cta"
                  className="group mt-10 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 text-sm font-medium text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:bg-yellow-400 hover:text-black transition"
                >
                  Start Website Project
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </motion.div>

              {/* RIGHT CARD */}
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative rounded-[36px] bg-black p-10 text-white overflow-hidden shadow-[0_40px_120px_-25px_rgba(0,0,0,0.6)] hover:shadow-[0_50px_140px_-25px_rgba(250,204,21,0.45)] transition-all"
              >
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-yellow-400/25 blur-3xl" />
                <div className="absolute -left-10 -bottom-10 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, rgba(250,204,21,0.25) 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                  }}
                />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/15 border border-yellow-400/30 px-3 py-1.5 backdrop-blur">
                    <Rocket className="h-3.5 w-3.5 text-yellow-300" />
                    <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-yellow-200">
                      Monthly Retainer
                    </span>
                  </div>

                  <h3 className="mt-7 text-3xl sm:text-4xl font-semibold tracking-tight">
                    Digital Growth Management
                  </h3>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-6xl font-semibold tracking-[-0.04em] text-yellow-400">
                      ₹35K
                    </span>
                    <span className="text-sm text-white/50">/ month</span>
                  </div>

                  <div className="mt-2 text-sm text-white/55 max-w-md">
                    A premium monthly partnership covering branding, ads,
                    automation and growth.
                  </div>

                  <div className="mt-8 h-px w-full bg-white/10" />

                  <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {retainerPlanFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-black">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </div>
                        <span className="text-white/85">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#cta"
                    className="group mt-10 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-medium text-black shadow-[0_25px_60px_-15px_rgba(250,204,21,0.7)] hover:bg-white transition"
                  >
                    Scale Business Digitally
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            12. FINAL CTA + FOOTER
        ============================================================ */}
        <section id="cta" className="relative py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-[44px] bg-black text-white p-12 sm:p-16 lg:p-24"
            >
              {/* glow + grid */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-yellow-400/25 blur-[140px]" />
                <div className="absolute -bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-amber-300/20 blur-[120px]" />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                    maskImage:
                      "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)",
                  }}
                />
              </div>

              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                  <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-yellow-200/80">
                    Let's Begin
                  </span>
                </div>

                <h2 className="mt-8 text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-[-0.04em] leading-[1] max-w-4xl mx-auto">
                  Let's build a strong
                  <br />
                  digital presence
                  <br />
                  <span className="text-yellow-400">together.</span>
                </h2>

                <p className="mt-8 max-w-xl mx-auto text-lg text-white/60">
                  A complete digital experience designed to modernize
                  RegalFinserrv's online presence.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="mailto:hello@jasstudios.in"
                    className="group inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-4 text-sm font-medium text-black shadow-[0_30px_70px_-15px_rgba(250,204,21,0.7)] hover:bg-white transition"
                  >
                    Start The Project
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href="#presence"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-medium text-white backdrop-blur-md hover:border-yellow-400 hover:bg-yellow-400/10 transition"
                  >
                    Re-explore proposal
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </a>
                </div>
              </div>

              {/* footer line */}
              <div className="relative mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_8px_30px_-8px_rgba(250,204,21,0.7)]">
                    <div className="absolute inset-1 rounded-lg bg-white/30 backdrop-blur-sm" />
                  </div>
                  <div>
                    <div className="font-semibold tracking-tight">JAS Studios</div>
                    <div className="text-xs text-white/50">Crafting premium digital experiences</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 text-white/60">
                  <a
                    href="https://jasstudios.in"
                    className="group inline-flex items-center gap-2 hover:text-yellow-300 transition"
                  >
                    <Globe2 className="h-4 w-4" />
                    jasstudios.in
                  </a>
                  <a
                    href="mailto:hello@jasstudios.in"
                    className="group inline-flex items-center gap-2 hover:text-yellow-300 transition"
                  >
                    <Mail className="h-4 w-4" />
                    hello@jasstudios.in
                  </a>
                </div>

                <div className="text-xs text-white/40">
                  © {new Date().getFullYear()} RegalFinserrv · Proposal
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
