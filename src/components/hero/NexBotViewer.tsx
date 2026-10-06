"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface NexBotViewerProps {
  className?: string;
}

export function NexBotViewer({ className = "" }: NexBotViewerProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center select-none overflow-visible ${className}`}
    >
      {/* 
        Balanced, Dedicated 3D Bust Stage:
        - Perfectly sized so it does NOT spread wholly through the website.
        - Framed specifically for Head-to-Torso (no legs).
        - 100% transparent into website's #000000 canvas with no separate box.
      */}
      <div
        className="relative w-full max-w-[680px] h-[460px] sm:h-[520px] lg:h-[560px] flex items-center justify-center overflow-hidden"
        style={{
          // Graceful bottom dissolve so the torso ends seamlessly with zero hard line
          WebkitMaskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 82%, transparent 100%)",
        }}
      >
        {/* Sleek Loading State */}
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 animate-ping rounded-full bg-cyan-500/20" />
              <div className="absolute h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            </div>
            <p className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
              Loading 3D NexBot...
            </p>
          </div>
        )}

        {/* 
          100% Transparent Spline iFrame:
          - No border, no background color offset, no separate box.
          - Headroom at top ensures helmet is never clipped.
          - Only head to torso in frame; legs are cropped off.
        */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative h-full w-full bg-transparent overflow-hidden"
        >
          <iframe
            src="/nexbot.html"
            title="NexBot 3D Humanoid Bust"
            onLoad={() => setLoaded(true)}
            className="h-full w-full border-0 bg-transparent pointer-events-auto"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            style={{
              backgroundColor: "transparent",
              colorScheme: "dark",
            }}
          />
        </motion.div>
      </div>

      {/* Subtle Interactive Hint Pill */}
      <div className="relative z-20 mt-1 flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-950/70 px-3.5 py-1 text-[11px] font-medium text-zinc-400 backdrop-blur-md">
        <Sparkles className="h-3 w-3 text-cyan-400" />
        <span>Interactive 3D Bust · Drag to rotate</span>
      </div>
    </div>
  );
}
