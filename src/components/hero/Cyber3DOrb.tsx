"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * 3D Interactive Cyber Polyhedron / Sphere.
 * Renders a crisp 3D rotating wireframe mesh on HTML5 Canvas with hardware acceleration,
 * dynamic cursor tracking, and 3D scroll-based rotation.
 */
export function Cyber3DOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const { scrollY } = useScroll();
  const scrollRotation = useTransform(scrollY, [0, 1000], [0, Math.PI * 2]);
  const smoothScrollRot = useSpring(scrollRotation, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 380);
    let height = (canvas.height = 380);

    const onResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = (rect.width || 380) * dpr;
      height = canvas.height = (rect.height || 380) * dpr;
      ctx.scale(dpr, dpr);
    };
    onResize();

    // Generate 3D sphere vertices
    const points: [number, number, number][] = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
      const phi = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const radius = 110;
      points.push([
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta),
      ]);
    }

    // Connect nearest neighbors for wireframe mesh
    const edges: [number, number][] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i][0] - points[j][0];
        const dy = points[i][1] - points[j][1];
        const dz = points[i][2] - points[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 64) {
          edges.push([i, j]);
        }
      }
    }

    let rotX = 0;
    let rotY = 0;

    const render = () => {
      // Smooth mouse interpolation
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

      const scrollR = smoothScrollRot.get();

      rotY += 0.005 + mouse.current.x * 0.02;
      rotX += 0.003 + mouse.current.y * 0.02 + scrollR * 0.002;

      ctx.clearRect(0, 0, width, height);

      const cx = width / (2 * (window.devicePixelRatio > 1 ? 2 : 1));
      const cy = height / (2 * (window.devicePixelRatio > 1 ? 2 : 1));
      const fov = 340;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const projected: { x: number; y: number; z: number; scale: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const [px, py, pz] = points[i];

        // Rotate Y
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;

        // Rotate X
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const distance = fov + z2;
        const scale = fov / distance;
        projected.push({
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale,
        });
      }

      // Draw wireframe edges
      ctx.lineWidth = 1;
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        const p1 = projected[a];
        const p2 = projected[b];

        // Depth fog / alpha based on average z
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.08, Math.min(0.7, (avgZ + 110) / 220));

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Draw node points
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const alpha = Math.max(0.15, Math.min(1, (p.z + 110) / 220));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, 2.4 * p.scale), 0, Math.PI * 2);
        ctx.fill();
      }

      // Inner glowing core
      const gradient = ctx.createRadialGradient(cx, cy, 5, cx, cy, 70);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.03)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const handleMouseLeave = () => {
      mouse.current.targetX = 0;
      mouse.current.targetY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [smoothScrollRot]);

  return (
    <div className="relative flex aspect-square w-full max-w-[380px] items-center justify-center">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        style={{ width: "100%", height: "100%" }}
      />
      {/* Subtle outer tech ring */}
      <div className="pointer-events-none absolute inset-4 rounded-full border border-white/5 opacity-60" />
      <div className="pointer-events-none absolute inset-10 rounded-full border border-dashed border-white/10 opacity-40 animate-spin-slow" />
    </div>
  );
}
