"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Sparkles, Ticket, Compass, MessageSquare } from "lucide-react";
import { CuteRobotCanvas } from "@/components/hero/CuteRobotCanvas";

const COMPANION_TIPS = [
  "Hey! I'm Byte, your SCPSC companion! 👋",
  "Scroll down to explore Tech Carnival & Winter Summit! 🚀",
  "Don't forget to grab your scannable QR ticket! 🎟️",
  "You can drag me anywhere around the screen! ✨",
];

export function FloatingBotCompanion() {
  const [isOpen, setIsOpen] = useState(true);
  const [bubbleText, setBubbleText] = useState(COMPANION_TIPS[0]);
  const [tipIndex, setTipIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setTilt({ x: -y * 10, y: x * 12 });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  function nextTip() {
    const next = (tipIndex + 1) % COMPANION_TIPS.length;
    setTipIndex(next);
    setBubbleText(COMPANION_TIPS[next]);
  }

  if (!mounted) return null;

  const dragConstraints = typeof window !== "undefined"
    ? { left: -window.innerWidth + 120, right: 0, top: -window.innerHeight + 140, bottom: 0 }
    : undefined;

  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end cursor-grab active:cursor-grabbing select-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="apple-glass-strong relative mb-3 max-w-[220px] rounded-2xl p-3 text-xs text-white shadow-2xl border border-white/14"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 rounded-full bg-zinc-800 p-1 text-zinc-400 hover:text-white"
              aria-label="Close speech bubble"
            >
              <X className="h-3 w-3" />
            </button>

            <p className="font-medium text-[11px] leading-relaxed text-zinc-200" onClick={nextTip}>
              {bubbleText}
            </p>

            <div className="mt-2.5 flex items-center gap-1.5 border-t border-white/10 pt-2 text-[10px]">
              <Link
                href="/#fests"
                className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-zinc-300 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Compass className="h-3 w-3" /> Fests
              </Link>
              <Link
                href="/tickets"
                className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-zinc-300 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Ticket className="h-3 w-3" /> Passes
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Interactive Robot Mascot */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          else nextTip();
        }}
        className="group relative flex items-center justify-center will-change-transform"
        title="I'm Byte! Drag me anywhere or click to chat!"
      >
        {/* Glow halo */}
        <div className="absolute -inset-2 rounded-full bg-cyan-400/20 blur-md opacity-75 group-hover:opacity-100 transition-opacity" />

        <div className="apple-glass relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl p-0.5 shadow-2xl border border-white/15 overflow-hidden flex items-center justify-center">
          <CuteRobotCanvas className="h-full w-full pointer-events-none" />
        </div>

        {/* Pulse indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-black" />
        </span>
      </motion.div>
    </motion.div>
  );
}
