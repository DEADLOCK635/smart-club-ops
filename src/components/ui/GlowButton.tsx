"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-normal select-none outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "text-black bg-white hover:bg-zinc-200 shadow-sm",
  secondary:
    "text-zinc-200 bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:text-white hover:border-white/20",
  ghost: "text-zinc-400 hover:text-white hover:bg-white/[0.05]",
  danger: "text-white bg-rose-600 hover:bg-rose-500",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

const physics = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15, ease: "easeOut" },
} as const;

export interface GlowButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(function GlowButton(
  { className, variant = "primary", size = "md", children, disabled, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      {...(disabled ? {} : physics)}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
});

const MotionLink = motion.create(Link);

export function GlowLink({
  href,
  className,
  variant = "primary",
  size = "md",
  children,
  onClick,
}: {
  href: string;
  className?: string;
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <MotionLink
      href={href}
      onClick={onClick}
      {...physics}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </MotionLink>
  );
}
