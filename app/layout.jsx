import "./globals.css";
import { site } from "@/lib/content";

export const metadata = {
  title: site.title,
  description: site.description,
  keywords: site.keywords,
  openGraph: {
    title: site.ogTitle,
    description: site.ogDescription,
    type: "website",
  },
};

export const viewport = {
  themeColor: site.themeColor,
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
