"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf;
    let value = 0;
    const tick = () => {
      // Accelerating ease toward 100
      value += (100 - value) * 0.025 + 0.4;
      if (value >= 100) {
        value = 100;
        setProgress(100);
        setTimeout(() => setDone(true), 700);
        return;
      }
      setProgress(value);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[10000] flex items-end justify-between overflow-hidden bg-ink-950 px-8 pb-10 md:px-14 md:pb-14"
        >
          {/* Curtain reveal */}
          <motion.div
            className="absolute inset-0 origin-bottom bg-gradient-to-b from-ink-900 via-ink-950 to-black"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: progress >= 100 ? 0 : 1 }}
            transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          />

          {/* Aura blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-1/3 h-[40vh] w-[40vh] rounded-full bg-bluepulse/30 blur-[120px]" />
            <div className="absolute right-1/4 bottom-1/3 h-[30vh] w-[30vh] rounded-full bg-cyanglow/30 blur-[120px]" />
          </div>

          <div className="relative z-10 flex w-full items-end justify-between font-display">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.5em] text-white/50">
                JAS Studios
              </span>
              <motion.span
                className="text-7xl font-medium leading-none tracking-ultratight text-white md:text-9xl"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {Math.floor(progress).toString().padStart(2, "0")}
                <span className="text-cyanglow">%</span>
              </motion.span>
            </div>

            <div className="hidden flex-col items-end gap-3 md:flex">
              <span className="text-xs uppercase tracking-[0.5em] text-white/50">
                Now Loading
              </span>
              <span className="font-cabinet text-2xl font-medium tracking-tight text-white/80">
                Immersive Experience
              </span>
              <div className="h-px w-64 overflow-hidden bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyanglow via-bluepulse to-violet"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
