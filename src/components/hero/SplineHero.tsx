"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Component, useState, type ReactNode } from "react";
import { Cyber3DOrb } from "./Cyber3DOrb";
import { Box, CircleDot } from "lucide-react";

export const SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

class SplineBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SplineHero() {
  const [activeView, setActiveView] = useState<"cyber" | "spline">("cyber");
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {/* Clean 3D view toggle */}
      <div className="mb-4 z-20 flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 text-xs">
        <button
          onClick={() => setActiveView("cyber")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-all ${
            activeView === "cyber"
              ? "bg-white text-black shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <CircleDot className="h-3 w-3" /> 3D Cyber Core
        </button>
        <button
          onClick={() => setActiveView("spline")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-all ${
            activeView === "spline"
              ? "bg-white text-black shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Box className="h-3 w-3" /> Spline Interactive
        </button>
      </div>

      {/* 3D Canvas */}
      <div className="relative h-[360px] w-full max-w-[420px] grid place-items-center">
        <AnimatePresence mode="wait">
          {activeView === "cyber" && (
            <motion.div
              key="cyber"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center"
            >
              <Cyber3DOrb />
            </motion.div>
          )}

          {activeView === "spline" && (
            <motion.div
              key="spline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-full w-full"
            >
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center">
                  <Cyber3DOrb />
                </div>
              )}
              {!failed ? (
                <SplineBoundary onError={() => setFailed(true)}>
                  <Spline
                    scene={SPLINE_SCENE}
                    onLoad={() => setLoaded(true)}
                    className="!h-full !w-full"
                  />
                </SplineBoundary>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-zinc-400">
                  <p>Spline WebGL scene unavailable.</p>
                  <button
                    onClick={() => setActiveView("cyber")}
                    className="mt-2 text-white underline"
                  >
                    Switch back to 3D Cyber Core
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
