"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/ui/TiltCard";
import { useStore } from "@/lib/store";
import type { Fest } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

export function FestCard({ fest, index }: { fest: Fest; index: number }) {
  const { db, seatsTaken } = useStore();
  const festEvents = db.events.filter((e) => e.festId === fest.id);
  const totalCap = festEvents.reduce((s, e) => s + e.capacity, 0);
  const taken = festEvents.reduce((s, e) => s + seatsTaken(e.id), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/fests/${fest.id}`}
        className="block h-full focus-visible:outline-none"
        aria-label={`Open ${fest.name}`}
      >
        <TiltCard maxTilt={6} className="rounded-2xl">
          <div className="apple-card relative flex h-full flex-col justify-between rounded-2xl p-6 sm:p-8">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold tracking-wider text-zinc-300">
                  {festEvents.length} Events
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {fest.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-zinc-400">
                {fest.tagline}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                {fest.description}
              </p>
            </div>

            <div className="mt-8 border-t border-white/[0.06] pt-5">
              <div className="grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-zinc-300" />
                  {formatDateRange(fest.startDate, fest.endDate)}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-zinc-300" />
                  {taken} / {totalCap} spots booked
                </span>
                <span className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="h-3.5 w-3.5 text-zinc-300" />
                  {fest.location}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {fest.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[10px] text-zinc-400 font-mono"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TiltCard>
      </Link>
    </motion.div>
  );
}
