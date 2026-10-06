"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function Scroll3DSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  const rotateX = useTransform(smoothProgress, [0, 1], [14, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.4, 1], [0.3, 0.8, 1]);
  const y = useTransform(smoothProgress, [0, 1], [60, 0]);

  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.div
        ref={ref}
        style={{
          rotateX,
          scale,
          opacity,
          y,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
