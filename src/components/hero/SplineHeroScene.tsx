"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Dynamically import Spline to ensure client-side WebGL rendering without SSR mismatch
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[750px] sm:h-[860px] lg:h-[940px] w-full items-center justify-center text-zinc-500">
      <div className="flex items-center gap-2 font-mono text-xs">
        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
        <span>INITIALIZING 3D ENVIRONMENT...</span>
      </div>
    </div>
  ),
});

export function SplineHeroScene() {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Safely remove only the "Built with Spline" watermark link/badge continuously
  useEffect(() => {
    const hideBadge = () => {
      const links = document.querySelectorAll(
        'a[href*="spline.design"], a[href*="spline"], #spline-logo, .spline-watermark, [aria-label*="Spline"]'
      );
      links.forEach((a) => {
        (a as HTMLElement).style.setProperty("display", "none", "important");
        (a as HTMLElement).style.setProperty("opacity", "0", "important");
        (a as HTMLElement).style.setProperty("visibility", "hidden", "important");
        (a as HTMLElement).style.setProperty("pointer-events", "none", "important");
        (a as HTMLElement).style.setProperty("height", "0px", "important");
        (a as HTMLElement).style.setProperty("width", "0px", "important");
      });
    };

    hideBadge();
    const timer = setInterval(hideBadge, 150);
    return () => clearInterval(timer);
  }, [loaded]);

  // Prevent wheel events over the robot from zooming the 3D camera or freezing page scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent Spline Three.js OrbitControls from consuming the wheel event to zoom camera
      e.stopPropagation();
      // Scroll the window naturally with zero lag
      window.scrollBy({ top: e.deltaY, behavior: "auto" });
    };

    container.addEventListener("wheel", handleWheel, { capture: true, passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, []);

  const handleSplineLoad = (splineApp: any) => {
    setLoaded(true);

    try {
      if (splineApp && typeof splineApp.setZoom === "function") {
        splineApp.setZoom(1.15);
      }
    } catch (_) {}
  };

  return (
    <div
      ref={containerRef}
      className="spline-container relative flex w-full max-w-7xl flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* 
        Bigger hero presence:
        - Scale up to fill the screen
        - Height expanded to 750px - 940px
        - transform-gpu for lag-free 60fps rendering
      */}
      <div className="relative h-[750px] sm:h-[860px] lg:h-[940px] w-full flex items-center justify-center transform-gpu">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center text-zinc-500">
            <div className="flex items-center gap-2 font-mono text-xs">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              <span>SYNCHRONIZING 3D ROBOT...</span>
            </div>
          </div>
        )}

        <div className="h-full w-full flex items-center justify-center transform scale-110 sm:scale-115 lg:scale-120 transition-transform duration-300">
          <Spline
            scene="https://prod.spline.design/V1KrcrPjNNi8CcuO/scene.splinecode"
            onLoad={handleSplineLoad}
            className="h-full w-full pointer-events-auto"
          />
        </div>

        {/* Bottom soft gradient mask to ensure seamless transition into the black background */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>
    </div>
  );
}
