"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/**
 * Pure CSS-3D "reactor core" — gyroscopic rings that respond to the cursor.
 * Shown instantly while the Spline scene streams in, and stays as a graceful
 * fallback if WebGL / the network is unavailable.
 */
export function HoloCore() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [18, -18]), { stiffness: 80, damping: 15 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-24, 24]), { stiffness: 80, damping: 15 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const rings = [
    { size: "92%", border: "border-cyan-400/50", anim: { rotateX: [70, 70], rotateZ: [0, 360] }, dur: 14 },
    { size: "78%", border: "border-purple-500/60", anim: { rotateY: [60, 60], rotateZ: [360, 0] }, dur: 11 },
    { size: "64%", border: "border-fuchsia-400/40", anim: { rotateX: [20, 20], rotateY: [0, 360] }, dur: 9 },
    { size: "50%", border: "border-cyan-300/60", anim: { rotateX: [0, 360], rotateY: [45, 45] }, dur: 7 },
  ];

  return (
    <div className="relative grid aspect-square w-full place-items-center" style={{ perspective: 1000 }}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative grid h-full w-full place-items-center">
        {rings.map((r, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full border-2 ${r.border} shadow-[0_0_30px_-5px_currentColor]`}
            style={{ width: r.size, height: r.size, transformStyle: "preserve-3d", color: i % 2 ? "#a855f7" : "#22d3ee" }}
            animate={r.anim}
            transition={{ duration: r.dur, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-current shadow-[0_0_16px_4px_currentColor]" />
          </motion.div>
        ))}
        {/* Core sphere */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-[30%] w-[30%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#a5f3fc,#22d3ee_25%,#7c3aed_65%,#1e1b4b)] shadow-[0_0_80px_10px_rgba(34,211,238,0.45),0_0_160px_30px_rgba(168,85,247,0.35)]"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="absolute inset-[18%] rounded-full bg-white/20 blur-md" />
        </motion.div>
        {/* Orbiting particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.span
            key={`p-${i}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_10px_2px_rgba(103,232,249,0.9)]"
            style={{ top: "50%", left: "50%" }}
            animate={{
              x: [Math.cos(i) * 40, Math.cos(i + Math.PI) * 180, Math.cos(i) * 40],
              y: [Math.sin(i) * 40, Math.sin(i + Math.PI) * 160, Math.sin(i) * 40],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{ duration: 6 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
    </div>
  );
}
