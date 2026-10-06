"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

const NOTICES = [
  "SCPSC Tech Carnival 2026: Registration is now open across all competitive tracks.",
  "Robotics & Hackathon arenas: Team slots are filling up quickly.",
  "Check-in protocol: Show your generated QR pass at Desk 1 upon arrival.",
];

export function NoticeTicker() {
  return (
    <aside
      aria-label="Campus Notice"
      className="border-b border-white/[0.06] bg-[#0c0c0e] py-1.5 text-xs text-zinc-400"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-300">
            Notice:
          </span>
        </div>

        <div className="flex-1 overflow-hidden px-4">
          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
            {NOTICES.map((note, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 text-zinc-400">
                <span>{note}</span>
                <span className="text-zinc-700">/</span>
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/#fests"
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-zinc-300 hover:text-white"
        >
          <span>Explore Fests</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}
