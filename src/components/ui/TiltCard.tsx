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
  maxTilt = 8,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
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

        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;

        if (glareRef.current) {
          glareRef.current.style.opacity = "0.15";
          glareRef.current.style.background = `radial-gradient(350px circle at ${Math.round(x * 100)}% ${Math.round(y * 100)}%, rgba(255, 255, 255, 0.4), transparent 60%)`;
        }
      });
    },
    [maxTilt]
  );

  const handlePointerLeave = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }
    const card = cardRef.current;
    if (card) {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)",
        transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
      }}
      className={cn("group relative h-full rounded-3xl", className)}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        />
      )}
    </div>
  );
}
