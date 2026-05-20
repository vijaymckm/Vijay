# How to customize this template

**TL;DR:** edit one file — [`lib/content.js`](./lib/content.js) — and the entire website updates.

This template is a fully content-driven Next.js agency site. Every word, link, project, service, plan, FAQ, social handle, and contact email is defined inside `lib/content.js`. Components only read from that file — they don't hold any hard-coded copy.

---

## 1. The single content file

Open `lib/content.js`. You'll see clearly labeled sections:

| Section in `content.js` | Controls                                               | Component(s)              |
| ----------------------- | ------------------------------------------------------ | ------------------------- |
| `site`                  | Page `<title>`, meta description, OG tags, theme color | `app/layout.jsx`          |
| `brand`                 | Logo letter, studio name, kicker, footer wordmark      | `Navbar`, `Footer`        |
| `nav`                   | Navbar links + CTA                                     | `Navbar`                  |
| `loader`                | Preloader text                                         | `Loader`                  |
| `hero`                  | Hero headline lines, lead, CTAs, status, cities        | `Hero`                    |
| `marquee`               | Running ticker words                                   | `MarqueeBand`             |
| `about`                 | Studio story, stats counters, timeline                 | `About`                   |
| `services`              | 6 service cards (icon, title, body, tags)              | `Services`                |
| `portfolio`             | Horizontal-scroll project cards + end CTA slab         | `Portfolio`               |
| `showreel`              | Showreel headline + cinematic typography lines         | `Showreel`                |
| `process`               | 5-phase vertical timeline                              | `Process`                 |
| `team`                  | Team member grid                                       | `Team`                    |
| `pricing`               | 3 pricing plans (one can be `featured: true`)          | `Pricing`                 |
| `faq`                   | Accordion items                                        | `FAQ`                     |
| `contact`               | Contact form labels, services, budgets, contact lines  | `Contact`                 |
| `footer`:               | Footer columns, socials, bottom bar                    | `Footer`                  |

Edit any field, save, and the dev server hot-reloads.

---

## 2. Common edits

### Change the studio name

```js
// lib/content.js
export const brand = {
  logoMark: "A",                 // single letter inside the rotating badge
  name: "Acme Studio",           // wordmark beside logo
  kicker: "Design Lab",          // small label under wordmark
  footerWordmarkPrimary: "ACME", // huge footer wordmark (gradient half)
  footerWordmarkSecondary: "Studio", // huge footer wordmark (stroke half)
};
```

Then update the page title in `site.title` and `site.description`.

### Add or remove a service card

Add an object to `services.items`:

```js
{
  icon: "Palette",          // any name from lib/icons.js
  title: "Illustration",
  body: "Custom illustration systems for editorial and product surfaces.",
  tags: ["Editorial", "Product"],
  accent: "from-cyanglow/30 to-violet/0",
  glow: "rgba(125,249,255,0.55)",
}
```

Available icons (extend `lib/icons.js` to add more from `lucide-react`):
`Sparkles`, `MonitorSmartphone`, `Film`, `Megaphone`, `Code2`, `Building2`,
`Palette`, `Camera`, `Wand2`, `Layers`, `Boxes`, `Zap`, `Compass`,
`Lightbulb`, `Pen`, `Rocket`, `TrendingUp`, `Mail`, `MapPin`, `Phone`,
`Instagram`, `Twitter`, `Youtube`, `Linkedin`, `Github`, `Star`, `Check`,
`Plus`, `Minus`, `ArrowUpRight`, `ArrowRight`, `Play`, `MoveDown`.

### Add or remove a project (horizontal scroll)

Edit `portfolio.projects`. Each card supports:

```js
{
  n: "07",
  title: "Project name",
  client: "Client Name",
  year: "2026",
  discipline: "Brand - Web - Film",
  // Tailwind gradient classes — try cyanglow, bluepulse, violet
  gradient: "from-cyanglow via-violet to-bluepulse",
  // RGBA used for the hover glow
  accent: "rgba(125,249,255,0.55)",
  href: "#",
}
```

The horizontal-scroll distance auto-recalculates from the number of cards.

### Edit the giant hero headline

```js
hero.headline = ["WE BUILD", "BEAUTIFUL", "DIGITAL", "PRODUCTS"];
```

The 2nd line is auto-styled with a gradient italic, the 4th line with a stroke outline. Keep 4 lines for best layout (or edit `Hero.jsx` if you want different rules).

### Change the rich-text accent inside headlines

Headlines that contain a colored phrase use a tiny markup convention:

```js
process.heading.rich = "A choreography in {gradient}five{/gradient} movements.";
```

Available markers (from `lib/richText.jsx`):

- `{gradient}...{/gradient}` — gradient + italic
- `{stroke}...{/stroke}` — outlined text
- `{italic}...{/italic}` — italic only

### Add/remove team members

```js
team.members.push({
  name: "Your Name",
  role: "Role title",
  gradient: "from-bluepulse via-cyanglow to-violet",
});
```

The name's initials are automatically generated for the portrait stand-in.

### Edit pricing plans

`pricing.plans` is an array. Set `featured: true` on the plan you want highlighted (white CTA + glow). Only one plan should be `featured` at a time for the cleanest look.

### Update FAQ entries

Each item in `faq.items` is `{ q, a }`. Add or remove freely; the accordion adapts.

### Update contact form

`contact.serviceOptions` and `contact.budgetOptions` drive the chip selectors.
Set defaults via `defaultPickedService` and `defaultBudget`.

The form is **wired but not connected to a backend**. To send real submissions, edit the `onSubmit` handler in `components/Contact.jsx`. Suggested options:

- [Resend](https://resend.com) + a Next.js Route Handler
- [Formspree](https://formspree.io) (drop-in form action)
- A custom `/api/contact` route hitting your CRM

---

## 3. Changing colors

The accent palette lives in `tailwind.config.js`:

```js
colors: {
  cyanglow:  "#7df9ff",  // primary cyan accent
  bluepulse: "#3b82f6",  // electric blue
  violet:    "#8b5cf6",  // violet
  ink: { 950: "#03060d", 900: "#050912", 800: "#0a1020", 700: "#0e1730" },
}
```

Change those hex values to rebrand the entire site. The shader background plane in `components/Background3D.jsx` also has a color palette inside its fragment shader — search for `c0`, `c1`, `c2`, `c3`, `c4` to retune the noise gradient.

---

## 4. Adding/removing whole sections

The page composition lives in `app/page.jsx`:

```jsx
<Hero />
<MarqueeBand />
<About />
<Services />
<Portfolio />
<Showreel />
<Process />
<Team />
<Pricing />
<FAQ />
<Contact />
```

Reorder, comment out, or remove any line. Anchor IDs (`#about`, `#services`, etc.) are defined on each section component — keep them in sync with `nav.links` if you reorder.

---

## 5. Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build && npm start
```

For a production build.

---

## 6. Animation behavior reference

| Component       | Animation tech              | What it does                                                 |
| --------------- | --------------------------- | ------------------------------------------------------------ |
| `Loader`        | Framer Motion               | Curtain reveal + animated percentage on first paint          |
| `Cursor`        | Framer Motion springs       | Custom cursor with hover/play/drag/view variants             |
| `SmoothScroll`  | Lenis + GSAP ticker         | Smooth scroll synced with GSAP ScrollTrigger                 |
| `Background3D`  | React-Three-Fiber + GLSL    | Fullscreen mesh-gradient shader with mouse parallax          |
| `Hero`          | Framer Motion + scroll      | Line-by-line reveal, scroll-tied scale/opacity, mouse orbs   |
| `MarqueeBand`   | CSS keyframes (Tailwind)    | Infinite horizontal ticker                                   |
| `About`         | Framer Motion + sticky CSS  | Pinned visual + counters + animated timeline                 |
| `Services`      | Framer Motion 3D            | 3D card tilt + mouse-tracking radial glow                    |
| `Portfolio`     | GSAP ScrollTrigger pin      | Pinned horizontal scroll with per-card scale scrub           |
| `Showreel`      | GSAP ScrollTrigger          | Frame expands from rounded to fullscreen on scroll           |
| `Process`       | Framer Motion + scroll      | Glowing trace line scrubs as you scroll the timeline         |
| `Team`          | Framer Motion stagger       | Card grid with hover glow + initials overlay                 |
| `Pricing`       | Framer Motion stagger       | Plan cards with featured-plan glow + magnetic CTA            |
| `FAQ`           | Framer Motion AnimatePresence | Smooth height animation with `+` rotating to `x`           |
| `Contact`       | Framer Motion               | Animated underline on focus + magnetic submit button         |
| `Footer`        | Framer Motion + GSAP        | Reveal-on-view giant wordmark                                |

---

## 7. Tech stack

- **Next.js 14** (App Router)
- **Tailwind CSS** for utility styling
- **Framer Motion 11** for component animations
- **GSAP 3 + ScrollTrigger** for scroll-pinned sequences
- **Lenis** for smooth scrolling
- **React-Three-Fiber + Three.js** for the WebGL gradient background
- **Lucide React** for icons
- **Fontshare** webfonts (Clash Display, Cabinet Grotesk, Satoshi, General Sans)
