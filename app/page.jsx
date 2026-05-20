import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Showreel from "@/components/Showreel";
import Process from "@/components/Process";
import Team from "@/components/Team";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MarqueeBand from "@/components/MarqueeBand";
import Loader from "@/components/Loader";

const Background3D = dynamic(() => import("@/components/Background3D"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Loader />
      <SmoothScroll>
        <Cursor />

        {/* Persistent atmospheric background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <Background3D />
          <div className="grid-overlay" />
          <div className="noise-layer" />
        </div>

        <div className="relative z-10">
          <Navbar />
          <main>
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
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </>
  );
}
