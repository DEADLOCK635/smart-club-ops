"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  Download,
  Check,
  X,
  User,
  Filter,
} from "lucide-react";
import type { Database, RegistrationStatus } from "@/lib/types";
import { formatDate, initials, cn } from "@/lib/utils";

interface ParticipantsTableProps {
  db: Database;
  onStatusChange: (regId: string, status: RegistrationStatus) => void;
}

export function ParticipantsTable({ db, onStatusChange }: ParticipantsTableProps) {
  const [search, setSearch] = useState("");
  const [festFilter, setFestFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtered events based on fest selection
  const availableEvents = useMemo(() => {
    if (festFilter === "all") return db.events;
    return db.events.filter((e) => e.festId === festFilter);
  }, [db.events, festFilter]);

  // Main filtered registrations
  const filteredRegistrations = useMemo(() => {
    return db.registrations.filter((reg) => {
      const user = db.users.find((u) => u.id === reg.userId);
      const event = db.events.find((e) => e.id === reg.eventId);
      if (!user || !event) return false;

      // Status filter
      if (statusFilter !== "all" && reg.status !== statusFilter) return false;

      // Fest filter
      if (festFilter !== "all" && event.festId !== festFilter) return false;

      // Event filter
      if (eventFilter !== "all" && event.id !== eventFilter) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = user.name.toLowerCase().includes(q);
        const matchEmail = user.email.toLowerCase().includes(q);
        const matchStudentId = user.studentId.toLowerCase().includes(q);
        const matchTicket = reg.ticketId.toLowerCase().includes(q);
        const matchEvent = event.title.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchStudentId && !matchTicket && !matchEvent) {
          return false;
        }
      }

      return true;
    });
  }, [db.registrations, db.users, db.events, search, festFilter, eventFilter, statusFilter]);

  function exportCSV() {
    const headers = ["Ticket ID", "Participant", "Email", "Student ID", "Department", "Event", "Fest", "Status", "Registered At"];
    const rows = filteredRegistrations.map((reg) => {
      const user = db.users.find((u) => u.id === reg.userId);
      const event = db.events.find((e) => e.id === reg.eventId);
      const fest = db.fests.find((f) => f.id === event?.festId);
      return [
        reg.ticketId,
        user?.name || "",
        user?.email || "",
        user?.studentId || "",
        user?.department || "",
        event?.title || "",
        fest?.name || "",
        reg.status,
        reg.createdAt,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smart-club-registrations-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="glass border-gradient mt-8 rounded-3xl p-6 sm:p-8">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Participant Roster
          </h2>
          <p className="text-xs text-slate-400">
            Real-time participant list with search, status toggles, and filters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, ID, ticket..."
            className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 text-xs text-white placeholder:text-slate-500 outline-none transition-all focus:border-cyan-400"
          />
        </div>

        {/* Fest Filter */}
        <div>
          <select
            value={festFilter}
            onChange={(e) => {
              setFestFilter(e.target.value);
              setEventFilter("all");
            }}
            className="h-10 w-full rounded-xl border border-white/10 bg-panel px-3 text-xs text-slate-200 outline-none transition-all focus:border-cyan-400"
          >
            <option value="all">All Fests</option>
            {db.fests.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Event Filter */}
        <div>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="h-10 w-full rounded-xl border border-white/10 bg-panel px-3 text-xs text-slate-200 outline-none transition-all focus:border-cyan-400"
          >
            <option value="all">All Events</option>
            {availableEvents.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-full rounded-xl border border-white/10 bg-panel px-3 text-xs text-slate-200 outline-none transition-all focus:border-cyan-400"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing <strong className="text-white">{filteredRegistrations.length}</strong> of{" "}
          {db.registrations.length} registrations
        </span>
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-white/[0.02] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Participant</th>
              <th className="px-4 py-3 font-semibold">Student ID</th>
              <th className="px-4 py-3 font-semibold">Event &amp; Fest</th>
              <th className="px-4 py-3 font-semibold">Ticket ID</th>
              <th className="px-4 py-3 font-semibold">Registered</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {filteredRegistrations.map((reg) => {
                const user = db.users.find((u) => u.id === reg.userId);
                const event = db.events.find((e) => e.id === reg.eventId);
                const fest = db.fests.find((f) => f.id === event?.festId);
                const isConfirmed = reg.status === "confirmed";

                return (
                  <motion.tr
                    key={reg.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 font-bold text-white text-xs">
                          {user ? initials(user.name) : "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user?.name}</p>
                          <p className="text-[11px] text-zinc-400">{user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-zinc-300">{user?.studentId}</span>
                      <span className="block text-[11px] text-zinc-500">{user?.department}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{event?.title}</p>
                      <p className="text-[11px] text-zinc-400">{fest?.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
                        {reg.ticketId}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {formatDate(reg.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                          isConfirmed
                            ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
                            : "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                        )}
                      >
                        {isConfirmed ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          onStatusChange(reg.id, isConfirmed ? "pending" : "confirmed")
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-95",
                          isConfirmed
                            ? "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                            : "border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
                        )}
                      >
                        {isConfirmed ? "Revoke (Set Pending)" : "Approve (Confirm)"}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack View (Hidden on desktop) */}
      <div className="mt-4 space-y-3 md:hidden">
        {filteredRegistrations.map((reg) => {
          const user = db.users.find((u) => u.id === reg.userId);
          const event = db.events.find((e) => e.id === reg.eventId);
          const isConfirmed = reg.status === "confirmed";

          return (
            <div key={reg.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white text-sm">{user?.name}</p>
                  <p className="text-slate-400">{user?.email}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{user?.studentId} · {user?.department}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                    isConfirmed ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"
                  )}
                >
                  {reg.status}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <div>
                  <p className="font-medium text-white">{event?.title}</p>
                  <code className="text-cyan-300 text-[11px] font-mono">{reg.ticketId}</code>
                </div>
                <button
                  onClick={() =>
                    onStatusChange(reg.id, isConfirmed ? "pending" : "confirmed")
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white"
                >
                  Toggle Status
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
