"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cpu, ShieldCheck, Sparkles, Terminal } from "lucide-react";

interface CinematicAndroidBustProps {
  className?: string;
}

export function CinematicAndroidBust({ className = "" }: CinematicAndroidBustProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  // Raw mouse coordinates relative to container center (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Drag offset motion values
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Dynamic light cursor position (0% to 100%)
  const [lightPos, setLightPos] = useState({ x: 50, y: 35 });

  // Spring physics for ultra-smooth liquid inertia
  const springConfig = { damping: 24, stiffness: 180, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const smoothDragX = useSpring(dragX, { damping: 20, stiffness: 140 });
  const smoothDragY = useSpring(dragY, { damping: 20, stiffness: 140 });

  // Combined 3D Rotations
  const rotY = useTransform(
    [smoothX, smoothDragX],
    ([x, dx]) => (x as number) * 16 + (dx as number) * 0.15
  );
  const rotX = useTransform(
    [smoothY, smoothDragY],
    ([y, dy]) => -(y as number) * 14 - (dy as number) * 0.12
  );

  // Deep Parallax Shifts for Floating Holographic HUD elements
  const hudLeftX = useTransform(smoothX, (x) => x * -24);
  const hudLeftY = useTransform(smoothY, (y) => y * -18);
  const hudRightX = useTransform(smoothX, (x) => x * 28);
  const hudRightY = useTransform(smoothY, (y) => y * 20);

  // Handle pointer tracking
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    // Center-normalized (-1 to 1)
    const normX = relX * 2 - 1;
    const normY = relY * 2 - 1;

    mouseX.set(normX);
    mouseY.set(normY);

    setLightPos({
      x: Math.round(relX * 100),
      y: Math.round(relY * 100),
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (!isDragging) {
      mouseX.set(0);
      mouseY.set(0);
      setLightPos({ x: 50, y: 35 });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialDragX = dragX.get();
    const initialDragY = dragY.get();

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      dragX.set(initialDragX + deltaX);
      dragY.set(Math.max(-80, Math.min(80, initialDragY + deltaY)));
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  // Trigger cybernetic impulse flash on click
  const triggerPulse = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 600);
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onClick={triggerPulse}
      className={`relative flex w-full max-w-[660px] flex-col items-center justify-center select-none overflow-visible cursor-grab active:cursor-grabbing ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* Expansive Ambient Atmospheric Cyber Aura */}
      <div className="pointer-events-none absolute -top-10 h-[450px] w-[450px] sm:h-[620px] sm:w-[620px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-28 h-[360px] w-[360px] sm:h-[480px] sm:w-[480px] rounded-full bg-blue-600/10 blur-[150px]" />

      {/* ── 3D Interactive Stage Container ── */}
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: isHovered || isDragging ? 0 : [0, -10, 0],
        }}
        transition={{
          y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative flex h-[520px] w-full items-center justify-center sm:h-[600px] lg:h-[660px]"
      >
        {/* ── The Master Hyper-Realistic Android Bust ── */}
        <div
          className="relative h-full w-full max-w-[620px] flex items-center justify-center overflow-visible"
          style={{
            transform: "translateZ(30px)",
            // Soft bottom dissolve so the waist terminates seamlessly into pure black with zero legs
            WebkitMaskImage: "linear-gradient(to bottom, black 86%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 86%, transparent 100%)",
          }}
        >
          {/* Main High-Fidelity Photorealistic Image */}
          <div className="relative h-full w-full">
            <Image
              src="/robot-hero-black.png"
              alt="SCPSC Cyber Android Bust"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-contain filter contrast-[1.03]"
            />
          </div>

          {/* ── Layer 4: Interactive Dynamic Specular Lighting Glint ── */}
          {/* Glides across the polished mirror visor and chrome shoulder following the cursor in real time */}
          <div
            className="pointer-events-none absolute inset-0 z-20 mix-blend-color-dodge transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.75 : 0.35,
              background: `radial-gradient(circle 320px at ${lightPos.x}% ${lightPos.y}%, rgba(255, 255, 255, 0.65), rgba(56, 189, 248, 0.25) 30%, transparent 65%)`,
            }}
          />

          {/* Secondary subtle rim glare */}
          <div
            className="pointer-events-none absolute inset-0 z-20 mix-blend-screen opacity-30"
            style={{
              background: `radial-gradient(circle 200px at ${100 - lightPos.x * 0.5}% ${lightPos.y}%, rgba(147, 197, 253, 0.4), transparent 60%)`,
            }}
          />

          {/* ── Layer 5: Impulse Diagnostic Pulse Flash on Click ── */}
          {pulseActive && (
            <motion.div
              initial={{ opacity: 0.9, scale: 0.95 }}
              animate={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 z-30 rounded-full bg-cyan-400/25 blur-xl"
            />
          )}
        </div>
      </motion.div>

      {/* ── Interactive Hint Badge ── */}
      <div className="relative z-20 mt-2 flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-950/70 px-3.5 py-1 text-[11px] font-medium text-zinc-400 backdrop-blur-md">
        <Sparkles className="h-3 w-3 text-cyan-400" />
        <span>Interactive 3D · Move mouse to tilt · Drag to pivot</span>
      </div>
    </div>
  );
}
