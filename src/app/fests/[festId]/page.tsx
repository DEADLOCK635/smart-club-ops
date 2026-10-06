"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Search,
  SlidersHorizontal,
  XCircle,
  Users,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { EventCard } from "@/components/event/EventCard";
import { RegistrationModal } from "@/components/event/RegistrationModal";
import type { Category, ClubEvent } from "@/lib/types";
import { formatDateRange, cn } from "@/lib/utils";

const ALL_CATEGORIES: Category[] = [
  "Hackathon",
  "Robotics",
  "Quiz",
  "Design",
  "Workshop",
  "Security",
  "Startup",
  "Gaming",
];

export default function FestDetailPage({
  params,
}: {
  params: Promise<{ festId: string }>;
}) {
  const { festId } = use(params);
  const { db, seatsTaken } = useStore();

  const fest = db.fests.find((f) => f.id === festId);
  if (!fest) {
    notFound();
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);

  const festEvents = useMemo(
    () => db.events.filter((e) => e.festId === fest.id),
    [db.events, fest.id]
  );

  const totalCap = festEvents.reduce((acc, e) => acc + e.capacity, 0);
  const totalTaken = festEvents.reduce((acc, e) => acc + seatsTaken(e.id), 0);

  const filteredEvents = useMemo(() => {
    return festEvents.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [festEvents, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: festEvents.length };
    festEvents.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [festEvents]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Fest Directory</span>
        </Link>
      </div>

      {/* Fest Header Banner */}
      <section className="glass-card relative mb-10 overflow-hidden rounded-2xl p-6 sm:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-0.5 text-[11px] font-semibold tracking-wider text-zinc-300 uppercase">
              SCPSC Official Fest
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-0.5 text-[11px] text-zinc-400">
              {festEvents.length} Competitive Arenas
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {fest.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-400 font-medium">
            {fest.tagline}
          </p>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-400">
            {fest.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-white/[0.06] pt-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-zinc-300" />
              {formatDateRange(fest.startDate, fest.endDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-zinc-300" />
              {fest.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              {totalTaken} of {totalCap} spots booked
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Search & Filter Toolbar */}
      <section className="glass-strong sticky top-24 z-30 mb-8 rounded-xl border border-white/10 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search arenas, keywords..."
              className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-8 text-xs text-white placeholder:text-zinc-500 outline-none transition-all focus:border-white/30 focus:bg-white/[0.06]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                aria-label="Clear search"
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
            <span>
              <strong className="text-white">{filteredEvents.length}</strong> of{" "}
              {festEvents.length} events
            </span>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="no-scrollbar mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory("All")}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium transition-all",
              selectedCategory === "All"
                ? "bg-white text-black font-semibold"
                : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
            )}
          >
            All ({categoryCounts["All"] || 0})
          </button>
          {ALL_CATEGORIES.filter((cat) => (categoryCounts[cat] || 0) > 0).map(
            (cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium transition-all",
                    active
                      ? "bg-white text-black font-semibold"
                      : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                  )}
                >
                  {cat} ({categoryCounts[cat] || 0})
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* Event Grid with Clean 3D Tilt Cards */}
      <AnimatePresence mode="popLayout">
        {filteredEvents.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={(ev) => setSelectedEvent(ev)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-zinc-400">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              No matching events found
            </h3>
            <p className="mt-1 text-xs text-zinc-400">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white hover:bg-white/10"
            >
              Reset Filters
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <RegistrationModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
