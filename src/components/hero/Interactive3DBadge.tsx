"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, QrCode, RotateCw, MapPin, Calendar, CheckCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function Interactive3DBadge() {
  const [flipped, setFlipped] = useState(false);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") return;
      const card = cardRef.current;
      if (!card) return;

      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setRotX((0.5 - y) * 22);
        setRotY((x - 0.5) * 26);
      });
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    setRotX(0);
    setRotY(0);
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      {/* 3D Perspective Container */}
      <div
        style={{ perspective: 1200 }}
        className="w-full max-w-[340px] cursor-pointer sm:max-w-[380px]"
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY + (flipped ? 180 : 0)}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="relative aspect-[3/4.2] w-full rounded-3xl"
        >
          {/* Lanyard Clip Hologram */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
          >
            <div className="h-4 w-12 rounded-full border border-white/20 bg-slate-800 shadow-md" />
            <div className="h-6 w-1 bg-gradient-to-b from-cyan-400 to-transparent" />
          </div>

          {/* FRONT FACE */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            }}
            className="absolute inset-0 overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-[#0f172a]/95 via-[#0b0f19]/90 to-[#1e1b4b]/90 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl"
          >
            {/* Holographic foil overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/[0.07] to-purple-500/[0.09]" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />

            <div style={{ transform: "translateZ(40px)" }} className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                    <Sparkles className="h-3 w-3" /> All-Access Pass
                  </span>
                  <span className="font-mono text-[11px] font-bold tracking-widest text-slate-400">
                    PASS-2026
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Campus Tech Fest</p>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Tech Carnival &apos;26
                  </h3>
                  <p className="mt-1 text-xs text-cyan-300">Metropolitan Institute of Technology</p>
                </div>
              </div>

              {/* Holographic Chip */}
              <div className="my-auto flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Attendee</p>
                  <p className="font-display text-sm font-bold text-white">Zahidul Hossain</p>
                  <p className="font-mono text-[11px] text-slate-400">CSE · Batch of 2026</p>
                </div>
                <div className="rounded-xl bg-white p-2 shadow-lg shadow-cyan-500/20">
                  <QRCodeSVG value="SMARTCLUB-TC26-DEMO-PASS" size={64} level="M" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-cyan-400" /> Oct 23–25, 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-purple-400" /> Audi A &amp; Quad
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                    <CheckCircle className="h-3 w-3" /> Security Verified
                  </span>
                  <span className="text-[10px] text-slate-400">Click to flip pass</span>
                </div>
              </div>
            </div>
          </div>

          {/* BACK FACE */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              transformStyle: "preserve-3d",
            }}
            className="absolute inset-0 overflow-hidden rounded-3xl border border-purple-400/30 bg-gradient-to-br from-[#1e1b4b]/95 via-[#0f172a]/95 to-[#0b0f19]/90 p-6 shadow-2xl shadow-purple-500/10 backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-purple-400/[0.08] to-cyan-500/[0.08]" />

            <div style={{ transform: "translateZ(40px)" }} className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-purple-300">
                    Attendee Guidelines
                  </span>
                  <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] text-purple-200">
                    Gate 3 Check-in
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-left text-xs text-slate-300">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                    <p className="font-semibold text-white">1. Kit &amp; Badge Collection</p>
                    <p className="text-[11px] text-slate-400">Main desk opens 8:30 AM. Bring your official student ID.</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                    <p className="font-semibold text-white">2. Wi-Fi &amp; Power Access</p>
                    <p className="text-[11px] text-slate-400">SSID: &quot;SmartClub-Guest&quot; · Dedicated power strips at every team bay.</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                    <p className="font-semibold text-white">3. Food &amp; Refreshments</p>
                    <p className="text-[11px] text-slate-400">Coupons redeemable at Cafeteria Zone B during breaks.</p>
                  </div>
                </div>
              </div>

              {/* Barcode & Flip Hint */}
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span>EMERGENCY: +880 1711-000000</span>
                  <span>DISCORD: /smartclub</span>
                </div>
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[10px] text-slate-300 hover:text-white">
                    <RotateCw className="h-3 w-3" /> Click card to flip back
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <RotateCw className="h-3 w-3 text-cyan-400" />
        <span>Interactive 3D Badge: move cursor to tilt, click to flip</span>
      </p>
    </div>
  );
}
