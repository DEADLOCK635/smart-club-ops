"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, QrCode, Search, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { TicketCard } from "@/components/ticket/TicketCard";
import { GlowLink } from "@/components/ui/GlowButton";

export default function TicketsPage() {
  const { db, myTicketIds, hydrated } = useStore();
  const [filterMode, setFilterMode] = useState<"my" | "all">("my");
  const [search, setSearch] = useState("");

  const myRegistrations = useMemo(() => {
    return db.registrations.filter((r) => myTicketIds.includes(r.id));
  }, [db.registrations, myTicketIds]);

  const activeRegistrations = useMemo(() => {
    const base = filterMode === "my" && myRegistrations.length > 0 ? myRegistrations : db.registrations;
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter((r) => {
      const user = db.users.find((u) => u.id === r.userId);
      const ev = db.events.find((e) => e.id === r.eventId);
      return (
        r.ticketId.toLowerCase().includes(q) ||
        user?.name.toLowerCase().includes(q) ||
        user?.email.toLowerCase().includes(q) ||
        ev?.title.toLowerCase().includes(q)
      );
    });
  }, [filterMode, myRegistrations, db.registrations, db.users, db.events, search]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      {/* Header */}
      <section className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
          <Ticket className="h-3.5 w-3.5" /> Passbook
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Digital Passes &amp; QR Tickets
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Present your QR code at the check-in desk. Click any card to flip and inspect venue guidelines.
        </p>
      </section>

      {/* Filter and Switcher */}
      <div className="glass-card mb-8 flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterMode("my")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filterMode === "my"
                ? "bg-white text-black font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            My Registrations ({myRegistrations.length})
          </button>
          <button
            onClick={() => setFilterMode("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filterMode === "all"
                ? "bg-white text-black font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            All Passes ({db.registrations.length})
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket ID or name..."
            className="h-8 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 outline-none transition-all focus:border-white/30 sm:w-60"
          />
        </div>
      </div>

      {/* Ticket Grid */}
      <AnimatePresence mode="popLayout">
        {hydrated && activeRegistrations.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {activeRegistrations.map((reg) => {
              const event = db.events.find((e) => e.id === reg.eventId);
              const user = db.users.find((u) => u.id === reg.userId);
              const fest = db.fests.find((f) => f.id === event?.festId);
              if (!event || !user) return null;

              return (
                <div key={reg.id}>
                  <TicketCard
                    registration={reg}
                    event={event}
                    user={user}
                    fest={fest}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-zinc-400">
              <QrCode className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              No tickets found in this tab
            </h3>
            <p className="mt-1 text-xs text-zinc-400">
              You haven&apos;t registered for any events yet in this browser session.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setFilterMode("all")}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10"
              >
                Browse All Mock Tickets ({db.registrations.length})
              </button>
              <GlowLink href="/#fests" size="sm">
                Explore Arenas <ArrowRight className="h-4 w-4" />
              </GlowLink>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
