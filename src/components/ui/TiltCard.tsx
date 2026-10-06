"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * Ultra-smooth, hardware-accelerated 3D tilt card with zero layout jank.
 * Uses requestAnimationFrame throttling and direct style updates for 120fps fluid responsiveness.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 10,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
  );
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const rafId = useRef<number | null>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") return;
      const card = cardRef.current;
      if (!card) return;

      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotX = ((0.5 - y) * (maxTilt * 2)).toFixed(2);
        const rotY = ((x - 0.5) * (maxTilt * 2)).toFixed(2);

        setTransformStyle(
          `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`
        );

        if (glare) {
          setGlarePos({
            x: Math.round(x * 100),
            y: Math.round(y * 100),
            opacity: 0.18,
          });
        }
      });
    },
    [maxTilt, glare]
  );

  const handlePointerLeave = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }
    setTransformStyle(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
    if (glare) {
      setGlarePos((p) => ({ ...p, opacity: 0 }));
    }
  }, [glare]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: transformStyle,
        transition: "transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={cn("group relative h-full rounded-3xl", className)}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 60%)`,
          }}
        />
      )}
    </div>
  );
}
