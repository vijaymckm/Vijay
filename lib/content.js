/* ------------------------------------------------------------------ *
 *  SITE CONTENT — single source of truth                              *
 *  ------------------------------------------------------------------ *
 *  Edit anything in this file and the entire website updates.         *
 *  No need to touch component files for normal customization.         *
 *                                                                     *
 *  Sections (search the file by these comments):                      *
 *    SITE        — meta, title, description, theme color              *
 *    BRAND       — logo text, tagline, accent colors                  *
 *    NAV         — navbar links and CTA                               *
 *    LOADER      — preloader text                                     *
 *    HERO        — hero headline, subtext, CTAs, badges               *
 *    MARQUEE     — running ticker words                               *
 *    ABOUT       — studio story, stats, timeline                      *
 *    SERVICES    — list of service cards                              *
 *    PORTFOLIO   — list of projects (horizontal scroll)               *
 *    SHOWREEL    — film/showreel section                              *
 *    PROCESS     — phases of the process timeline                     *
 *    TEAM        — team members                                       *
 *    PRICING     — pricing plans                                      *
 *    FAQ         — frequently asked questions                         *
 *    CONTACT     — contact form options + contact lines               *
 *    FOOTER      — footer columns, social links, bottom bar           *
 * ------------------------------------------------------------------ */

/* ============================== SITE ============================== */
export const site = {
  title: "Firma Studio — Editable Agency Template",
  description:
    "Firma is a horizontally-scrolling, fully-editable agency template. Crafted with cinematic motion, WebGL, and smooth scroll. Every word, color, and image is driven from a single content file.",
  keywords: [
    "agency template",
    "portfolio template",
    "creative studio",
    "Next.js template",
    "framer motion",
    "editable template",
  ],
  themeColor: "#03060d",
  ogTitle: "Firma Studio — Editable Agency Template",
  ogDescription:
    "Cinematic, editable agency website template. Built with Next.js, Framer Motion, GSAP and Lenis.",
};

/* ============================= BRAND =============================== */
export const brand = {
  // Initial shown inside the rotating logo badge
  logoMark: "F",
  // Wordmark next to the logo
  name: "Firma Studio",
  // Small label under the wordmark
  kicker: "Creative Lab",
  // Big closing wordmark in the footer ("FIRMA Studio")
  footerWordmarkPrimary: "FIRMA",
  footerWordmarkSecondary: "Studio",
};

/* ============================== NAV ================================ */
export const nav = {
  links: [
    { label: "Work", href: "#portfolio" },
    { label: "Studio", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ],
  cta: { label: "Start Project", href: "#contact" },
};

/* ============================= LOADER =============================== */
export const loader = {
  brand: "Firma Studio",
  subtitle: "Now Loading",
  caption: "Immersive Experience",
};

/* ============================== HERO ================================ */
export const hero = {
  // 4 lines of the giant headline. Lines marked italic and stroke get
  // special treatment — keep the array length at 4 for best layout.
  headline: ["WE BUILD", "IMMERSIVE", "DIGITAL", "EXPERIENCES"],
  // Status badge top-left
  statusBadge: "Studio open / 2026 — booking now",
  // Top-right city list
  cities: ["Mumbai", "Berlin", "NYC"],
  // Lead paragraph below the headline
  lead:
    "Firma Studio creates cinematic branding, interactive websites, motion graphics, digital campaigns, and futuristic visual systems for ambitious brands and category-defining companies.",
  // Two CTA buttons
  primaryCta: { label: "Start Project", href: "#contact" },
  secondaryCta: { label: "View Showreel", href: "#showreel" },
  // Bottom row
  scrollLabel: "Scroll to explore",
  awards: ["Reel '26", "Awwwards SOTD x4"],
};

/* ============================= MARQUEE ============================== */
export const marquee = {
  items: [
    "Cinematic Branding",
    "Interactive Web",
    "Motion Graphics",
    "Digital Campaigns",
    "Visual Systems",
    "3D & Shaders",
    "Creative Direction",
  ],
};

/* ============================== ABOUT =============================== */
export const about = {
  sectionNumber: "01",
  sectionLabel: "The Studio",
  meta: "Est. 2017 / Mumbai - Berlin - NYC",
  heading: {
    // Use {gradient}...{/gradient} to wrap a colored italic phrase
    rich:
      "A studio that designs {gradient}light{/gradient}, motion, and meaning — into digital matter.",
  },
  paragraph:
    "We are filmmakers, technologists, and designers building cinematic systems for brands that want to be felt — not clicked. Every frame is choreographed. Every scroll is composed. Every interaction is an arc.",
  stats: [
    { value: 184, suffix: "+", label: "Projects Shipped" },
    { value: 42, suffix: "+", label: "Awwwards Earned" },
    { value: 23, suffix: "", label: "Industries Served" },
    { value: 9, suffix: "yrs", label: "Of Visual R&D" },
  ],
  floatingCards: [
    { title: "Live Render", value: "GPU 60fps", accent: "cyanglow", position: "tl" },
    { title: "Shader Engine", value: "GLSL - WebGL2", accent: "bluepulse", position: "br" },
    { title: "Studio Status", value: "In session", accent: "violet", position: "bl" },
  ],
  liveBadge: "Rec - Studio Live",
  timeline: [
    {
      year: "2017",
      title: "Founded as a 3-person motion lab",
      body:
        "We started as an experimental film + design unit obsessed with cinematic storytelling on the web.",
    },
    {
      year: "2020",
      title: "Pivot to interactive systems",
      body:
        "We rebuilt our craft around WebGL, shaders, and choreography-first development.",
    },
    {
      year: "2023",
      title: "Global studio network",
      body:
        "Three studios across continents, one creative philosophy: every pixel must move with intention.",
    },
    {
      year: "2026",
      title: "Firma Immersive Lab",
      body:
        "Now operating as a full-stack creative lab building branded universes, not pages.",
    },
  ],
};

/* ============================ SERVICES ============================== */
// Available icons (Lucide): Sparkles, MonitorSmartphone, Film, Megaphone,
// Code2, Building2, Palette, Camera, Wand2, Layers, Boxes, Zap
export const services = {
  sectionNumber: "02",
  sectionLabel: "Services",
  heading: {
    line1: "Six disciplines.",
    line2Rich: "{gradient}One choreography.{/gradient}",
  },
  description:
    "From the first conceptual spark to the final pixel, every discipline at Firma moves in sync — composed by directors, choreographed by designers, shipped by engineers.",
  items: [
    {
      icon: "Sparkles",
      title: "Branding",
      body:
        "Identity systems, naming, visual languages and brand films designed to resonate at any scale.",
      tags: ["Logo", "Identity", "Strategy"],
      accent: "from-cyanglow/30 to-bluepulse/0",
      glow: "rgba(125,249,255,0.55)",
    },
    {
      icon: "MonitorSmartphone",
      title: "Web Design",
      body:
        "Cinematic websites engineered with shaders, choreography, and a relentless attention to craft.",
      tags: ["UX", "UI", "WebGL"],
      accent: "from-bluepulse/30 to-violet/0",
      glow: "rgba(59,130,246,0.55)",
    },
    {
      icon: "Film",
      title: "Motion Graphics",
      body:
        "Frame-by-frame storytelling — title sequences, brand films, and interactive motion systems.",
      tags: ["Film", "3D", "AE"],
      accent: "from-violet/30 to-cyanglow/0",
      glow: "rgba(139,92,246,0.55)",
    },
    {
      icon: "Megaphone",
      title: "Digital Marketing",
      body:
        "Content engines, paid creative, and performance systems that turn campaigns into culture.",
      tags: ["Performance", "Content", "Strategy"],
      accent: "from-cyanglow/25 to-violet/0",
      glow: "rgba(125,249,255,0.5)",
    },
    {
      icon: "Code2",
      title: "Creative Development",
      body:
        "Custom WebGL, generative graphics, real-time interaction and bespoke creative tooling.",
      tags: ["R3F", "GLSL", "GSAP"],
      accent: "from-bluepulse/35 to-cyanglow/0",
      glow: "rgba(59,130,246,0.6)",
    },
    {
      icon: "Building2",
      title: "Studio Rental",
      body:
        "Cinematic stages with cyc walls, motion control, LED volumes and a full creative crew on call.",
      tags: ["Stage", "Crew", "Gear"],
      accent: "from-violet/30 to-bluepulse/0",
      glow: "rgba(139,92,246,0.55)",
    },
  ],
};

/* ============================ PORTFOLIO ============================= */
// Each project shows in the horizontal-scroll track. Add or remove items.
export const portfolio = {
  sectionNumber: "03",
  sectionLabel: "Selected Work",
  heading: {
    line1: "Cinematic chapters,",
    line2Rich: "{stroke}scrolled into reality.{/stroke}",
  },
  hint: "Drag right to scroll horizontally and step through six recent films & experiences.",
  // Projects (horizontal cards)
  projects: [
    {
      n: "01",
      title: "Lumen / Brand Universe",
      client: "Lumen Aerospace",
      year: "2026",
      discipline: "Identity - Web - Film",
      gradient: "from-bluepulse via-cyanglow to-violet",
      accent: "rgba(125,249,255,0.55)",
      href: "#",
    },
    {
      n: "02",
      title: "Nightglass — Album Site",
      client: "Akari Studio",
      year: "2026",
      discipline: "WebGL - Direction",
      gradient: "from-violet via-bluepulse to-cyanglow",
      accent: "rgba(139,92,246,0.55)",
      href: "#",
    },
    {
      n: "03",
      title: "ORB / Mobility Identity",
      client: "ORB Mobility",
      year: "2025",
      discipline: "Brand - Motion",
      gradient: "from-cyanglow via-bluepulse to-violet",
      accent: "rgba(59,130,246,0.55)",
      href: "#",
    },
    {
      n: "04",
      title: "Atlas — Spatial Campaign",
      client: "Atlas & Co.",
      year: "2025",
      discipline: "Campaign - 3D",
      gradient: "from-bluepulse via-violet to-cyanglow",
      accent: "rgba(125,249,255,0.5)",
      href: "#",
    },
    {
      n: "05",
      title: "Form / Generative System",
      client: "Form Type Foundry",
      year: "2024",
      discipline: "Creative Dev - Tools",
      gradient: "from-violet via-cyanglow to-bluepulse",
      accent: "rgba(139,92,246,0.5)",
      href: "#",
    },
    {
      n: "06",
      title: "Arc — Studio Reel",
      client: "Firma Studio",
      year: "2024",
      discipline: "Direction - Edit - Score",
      gradient: "from-cyanglow via-violet to-bluepulse",
      accent: "rgba(125,249,255,0.55)",
      href: "#",
    },
  ],
  // End slab (CTA at the end of the horizontal scroll)
  endSlab: {
    eyebrow: "Archive",
    title: "+ 60. case studies in the vault.",
    body:
      "Request the full archive — branded films, type systems, generative tools and live experiences.",
    cta: { label: "Request Archive", href: "#contact" },
  },
};

/* ============================= SHOWREEL ============================= */
export const showreel = {
  sectionNumber: "04",
  sectionLabel: "Showreel '26",
  heading: { prefix: "Press ", suffixRich: "{gradient}play{/gradient}" },
  director: "Director - J. A. Saxena",
  spec: "02:48 / 4K / Dolby Atmos",
  recBadge: "Rec - 4K - 24fps",
  cornerLabel: "Firma / Reel '26",
  timecode: "Frame 00:01:24:08",
  geo: "Lat 19.0760 N - Lon 72.8777 E",
  // Each line of the cinematic overlay typography. Lines at indexes 1
  // and 4 receive the italic outlined treatment by default.
  overlayLines: ["A FILM", "ABOUT", "MOTION,", "MEANING,", "AND", "MEMORY."],
  playLabel: "Play Showreel",
};

/* ============================= PROCESS ============================== */
export const process = {
  sectionNumber: "05",
  sectionLabel: "Process",
  heading: {
    rich:
      "A choreography in {gradient}five{/gradient} movements.",
  },
  description:
    "Every Firma engagement runs through this five-phase system — structured for clarity, designed for surprise.",
  steps: [
    {
      icon: "Compass",
      title: "Strategy",
      sub: "Phase 01",
      body:
        "Discovery, audits, narrative architecture and a north-star creative brief.",
    },
    {
      icon: "Lightbulb",
      title: "Creative Direction",
      sub: "Phase 02",
      body:
        "Mood, tone, type, light. We pre-visualize the entire experience as a film.",
    },
    {
      icon: "Pen",
      title: "Design",
      sub: "Phase 03",
      body:
        "High-fidelity systems, motion choreography, prototypes and live shaders.",
    },
    {
      icon: "Rocket",
      title: "Launch",
      sub: "Phase 04",
      body:
        "Production-grade engineering, performance hardening, and a cinematic release.",
    },
    {
      icon: "TrendingUp",
      title: "Scale",
      sub: "Phase 05",
      body:
        "Live optimization, content engines, season drops and continuous evolution.",
    },
  ],
};

/* ============================== TEAM ================================ */
export const team = {
  sectionNumber: "06",
  sectionLabel: "Team",
  heading: {
    rich:
      "The {gradient}humans{/gradient} behind the pixels.",
  },
  description:
    "A small, senior crew of directors, designers and engineers who ship together — across every discipline, in every timezone.",
  members: [
    {
      name: "J. A. Saxena",
      role: "Founder - Creative Director",
      gradient: "from-cyanglow via-bluepulse to-violet",
    },
    {
      name: "Mira Okafor",
      role: "Design Lead",
      gradient: "from-violet via-cyanglow to-bluepulse",
    },
    {
      name: "Kenji Tanaka",
      role: "Motion Director",
      gradient: "from-bluepulse via-violet to-cyanglow",
    },
    {
      name: "Sofia Reyes",
      role: "Head of Engineering",
      gradient: "from-cyanglow via-violet to-bluepulse",
    },
    {
      name: "Linus Vogel",
      role: "Brand Strategist",
      gradient: "from-violet via-bluepulse to-cyanglow",
    },
    {
      name: "Anika Roy",
      role: "Studio Producer",
      gradient: "from-bluepulse via-cyanglow to-violet",
    },
  ],
};

/* ============================= PRICING ============================== */
export const pricing = {
  sectionNumber: "07",
  sectionLabel: "Pricing",
  heading: {
    rich: "Engagements that {gradient}scale{/gradient} with ambition.",
  },
  description:
    "Three core engagement modes. Every plan starts with a discovery call — we'll recommend the right shape together.",
  plans: [
    {
      name: "Sprint",
      price: "From $25k",
      tagline: "Two-week creative sprint.",
      features: [
        "Strategy + concept territories",
        "1 hero deliverable",
        "Async daily updates",
        "1 senior designer + 1 director",
      ],
      cta: { label: "Book Sprint", href: "#contact" },
      featured: false,
    },
    {
      name: "Studio",
      price: "From $75k",
      tagline: "Full creative engagement.",
      features: [
        "End-to-end identity or site",
        "Unlimited iterations within phase",
        "Weekly live reviews",
        "Dedicated team of 4-6",
        "Launch film included",
      ],
      cta: { label: "Start Studio", href: "#contact" },
      featured: true,
    },
    {
      name: "Lab",
      price: "From $150k",
      tagline: "Multi-quarter partnership.",
      features: [
        "Branded universe build-out",
        "Always-on creative team",
        "Custom tooling and CMS",
        "Quarterly season drops",
        "Performance + content engine",
      ],
      cta: { label: "Apply for Lab", href: "#contact" },
      featured: false,
    },
  ],
};

/* =============================== FAQ ================================ */
export const faq = {
  sectionNumber: "08",
  sectionLabel: "FAQ",
  heading: {
    rich: "Things people {gradient}ask{/gradient} before signing.",
  },
  items: [
    {
      q: "How long does a typical project take?",
      a: "Sprints run two weeks. Studio engagements average 8–12 weeks. Lab partnerships run quarter-by-quarter. We send you a tailored timeline after the discovery call.",
    },
    {
      q: "Do you work with early-stage startups?",
      a: "Yes — when the vision is sharp. We take on a small handful of pre-launch partners each season, often in exchange for a mix of cash and equity.",
    },
    {
      q: "Where is the team based?",
      a: "Mumbai, Berlin, and NYC — but we ship globally. All collaboration runs async-first with weekly live reviews.",
    },
    {
      q: "Can you work with our existing brand or codebase?",
      a: "Absolutely. We slot into existing systems regularly — extending design languages, refactoring fronts, or directing motion for an established brand.",
    },
    {
      q: "What happens after launch?",
      a: "We offer a Care plan: monthly creative retainers for content, motion, performance and season drops. Or we hand off cleanly with full documentation.",
    },
    {
      q: "Do you sign NDAs?",
      a: "Always. NDAs are signed before any brief is shared. We keep all work fully private until you choose to publish.",
    },
  ],
};

/* ============================= CONTACT ============================== */
export const contact = {
  sectionNumber: "09",
  sectionLabel: "Let's Build",
  heading: {
    line1: "Have a vision",
    line2Rich: "worth {gradient}choreographing?{/gradient}",
  },
  description:
    "We take on a small handful of partners each season. Tell us what you're building, and we'll write back within 48 hours.",
  contactLines: [
    { icon: "Mail", label: "hello@firmastudio.co", href: "mailto:hello@firmastudio.co" },
    { icon: "Phone", label: "+91 22 0000 0000", href: "tel:+912200000000" },
    { icon: "MapPin", label: "Mumbai - Berlin - NYC" },
  ],
  serviceOptions: [
    "Branding",
    "Web Design",
    "Motion Graphics",
    "Digital Marketing",
    "Creative Dev",
    "Studio Rental",
  ],
  budgetOptions: ["< $25k", "$25–75k", "$75–150k", "$150k+"],
  defaultPickedService: "Web Design",
  defaultBudget: "$75–150k",
  privacyNote: "By submitting you agree to our gentle, non-spammy reply.",
  submitLabel: "Send Brief",
  successHeading: "Brief received.",
  successBody:
    "We'll be in touch within 48 hours. In the meantime, hit play on the showreel — it's the best way to know us.",
  formLabels: {
    name: "Your name",
    namePlaceholder: "Jane Doe",
    email: "Email",
    emailPlaceholder: "jane@brand.co",
    company: "Company",
    companyPlaceholder: "Acme, Inc.",
    message: "Tell us about your project",
    messagePlaceholder:
      "We're launching a new mobility brand and need a full identity + cinematic site for the season-one drop…",
    needsHeading: "What do you need?",
    budgetHeading: "Budget",
    optionalNote: "All fields optional - we read every brief",
  },
};

/* ============================== FOOTER ============================== */
export const footer = {
  // Big closing wordmark — also see brand.footerWordmark*
  ctaHeading: "Let's build the next icon together.",
  ctaButton: { label: "Start a project", href: "#contact" },
  columns: [
    {
      title: "Studio",
      links: [
        { label: "About", href: "#about" },
        { label: "Process", href: "#process" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Sustainability", href: "#" },
      ],
    },
    {
      title: "Work",
      links: [
        { label: "Selected", href: "#portfolio" },
        { label: "Archive", href: "#" },
        { label: "Awards", href: "#" },
        { label: "Reel '26", href: "#showreel" },
        { label: "Case Studies", href: "#" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "hello@firmastudio.co", href: "mailto:hello@firmastudio.co" },
        { label: "Mumbai HQ", href: "#" },
        { label: "Berlin Lab", href: "#" },
        { label: "NYC Outpost", href: "#" },
        { label: "Press kit", href: "#" },
      ],
    },
  ],
  socials: [
    { icon: "Instagram", label: "Instagram", href: "#" },
    { icon: "Twitter", label: "Twitter", href: "#" },
    { icon: "Youtube", label: "Vimeo", href: "#" },
    { icon: "Linkedin", label: "LinkedIn", href: "#" },
    { icon: "Github", label: "GitHub", href: "#" },
  ],
  bottom: {
    copyright: "Firma Studio — All rights reserved.",
    note: "Crafted with light, motion & shaders.",
    version: "v 26.05 - Mumbai HQ",
  },
};
