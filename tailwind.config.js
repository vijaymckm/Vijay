/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-clash)", "Clash Display", "sans-serif"],
        cabinet: ["var(--font-cabinet)", "Cabinet Grotesk", "sans-serif"],
        satoshi: ["var(--font-satoshi)", "Satoshi", "sans-serif"],
        general: ["var(--font-general)", "General Sans", "sans-serif"],
        sans: ["var(--font-satoshi)", "Satoshi", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#03060d",
          900: "#050912",
          800: "#0a1020",
          700: "#0e1730",
        },
        cyanglow: "#7df9ff",
        bluepulse: "#3b82f6",
        violet: "#8b5cf6",
      },
      letterSpacing: {
        ultratight: "-0.06em",
      },
      backgroundImage: {
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.85 0 0 0 0 1 0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        "grid-faint":
          "linear-gradient(to right, rgba(125,249,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,249,255,0.05) 1px, transparent 1px)",
      },
      animation: {
        "marquee": "marquee 30s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "shimmer": "shimmer 2.4s linear infinite",
        "spin-slow": "spin 14s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionTimingFunction: {
        cinema: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
