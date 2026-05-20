"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [variant, setVariant] = useState("default");
  const [label, setLabel] = useState("");

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  const sx = useSpring(mx, { damping: 30, stiffness: 350, mass: 0.4 });
  const sy = useSpring(my, { damping: 30, stiffness: 350, mass: 0.4 });

  // Outer ring lags behind for a cinematic feel
  const ox = useSpring(mx, { damping: 24, stiffness: 120, mass: 0.6 });
  const oy = useSpring(my, { damping: 24, stiffness: 120, mass: 0.6 });

  const lastTarget = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mq.matches);
    const mqHandler = (e) => setIsFinePointer(e.matches);
    mq.addEventListener("change", mqHandler);

    const handleMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };

    const handleOver = (e) => {
      const target = e.target.closest(
        "a, button, [role='button'], [data-cursor]"
      );
      if (target && target !== lastTarget.current) {
        lastTarget.current = target;
        const ds = target.getAttribute("data-cursor");
        if (ds === "view") {
          setVariant("view");
          setLabel("View");
        } else if (ds === "play") {
          setVariant("play");
          setLabel("Play");
        } else if (ds === "drag") {
          setVariant("drag");
          setLabel("Drag");
        } else {
          setVariant("hover");
          setLabel("");
        }
      } else if (!target && lastTarget.current) {
        lastTarget.current = null;
        setVariant("default");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver);

    return () => {
      mq.removeEventListener("change", mqHandler);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [mx, my]);

  if (!isFinePointer) return null;

  const isLabeled = variant === "view" || variant === "play" || variant === "drag";

  return (
    <>
      {/* Outer ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{ x: ox, y: oy, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full border border-cyanglow/60 backdrop-blur-[1px]"
          animate={{
            width: isLabeled ? 96 : variant === "hover" ? 56 : 36,
            height: isLabeled ? 96 : variant === "hover" ? 56 : 36,
            opacity: 1,
            backgroundColor:
              variant === "hover" ? "rgba(125,249,255,0.08)" : "rgba(125,249,255,0)",
            borderColor:
              variant === "hover"
                ? "rgba(125,249,255,0.9)"
                : "rgba(125,249,255,0.55)",
          }}
          transition={{ type: "spring", damping: 22, stiffness: 220 }}
        >
          {isLabeled && (
            <span className="flex h-full w-full items-center justify-center text-[11px] font-medium uppercase tracking-[0.3em] text-cyanglow">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(125,249,255,0.9)]"
          animate={{ scale: isLabeled ? 0 : 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        />
      </motion.div>
    </>
  );
}
