"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CapacityBar({ taken, capacity, className }: { taken: number; capacity: number; className?: string }) {
  const pct = Math.min(100, Math.round((taken / capacity) * 100));
  const remaining = Math.max(0, capacity - taken);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="text-zinc-400">
          <span className={cn("font-semibold", remaining === 0 ? "text-rose-400" : "text-white")}>
            {remaining}
          </span>{" "}
          seats left
        </span>
        <span className="text-zinc-500 font-mono text-[11px]">
          {taken}/{capacity}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={cn(
            "h-full rounded-full transition-all",
            remaining === 0 ? "bg-rose-500" : pct >= 80 ? "bg-amber-400" : "bg-emerald-400"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
