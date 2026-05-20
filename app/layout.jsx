import "./globals.css";

export const metadata = {
  title: "JAS Studios — Immersive Digital Experiences",
  description:
    "JAS Studios is a cinematic creative agency crafting branding, interactive websites, motion graphics, digital campaigns, and futuristic visual systems.",
  keywords: [
    "creative agency",
    "interactive design",
    "branding",
    "motion graphics",
    "JAS Studios",
    "Awwwards",
    "cinematic web",
  ],
  openGraph: {
    title: "JAS Studios — Immersive Digital Experiences",
    description:
      "Cinematic branding, interactive websites, motion graphics, and futuristic visual systems.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#03060d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-ink-950">
      <body className="bg-ink-950 text-white antialiased selection:bg-cyanglow/30">
        {children}
      </body>
    </html>
  );
}
