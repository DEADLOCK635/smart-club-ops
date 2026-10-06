"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  LogOut,
  RotateCcw,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Percent,
  Check,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { logoutAdmin, DEMO_ADMIN, ADMIN_COOKIE, ADMIN_TOKEN } from "@/lib/auth";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { ParticipantsTable } from "@/components/admin/ParticipantsTable";
import type { RegistrationStatus } from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { db, setStatus, resetDemo, hydrated } = useStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Client-side authentication safeguard
  useEffect(() => {
    const isAuthed = document.cookie.includes(`${ADMIN_COOKIE}=${ADMIN_TOKEN}`);
    if (!isAuthed) {
      router.push("/ops/login");
    }
  }, [router]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleLogout() {
    logoutAdmin();
    router.push("/ops/login");
    router.refresh();
  }

  function handleReset() {
    if (confirm("Reset local database to initial seed data? Any new registrations will be reset.")) {
      resetDemo();
      showToast("Demo data reset to original seed state.");
    }
  }

  function handleStatusChange(regId: string, newStatus: RegistrationStatus) {
    setStatus(regId, newStatus);
    showToast(`Registration status updated to "${newStatus}".`);
  }

  // KPI Calculations
  const stats = useMemo(() => {
    const total = db.registrations.length;
    const confirmed = db.registrations.filter((r) => r.status === "confirmed").length;
    const pending = total - confirmed;
    const totalCapacity = db.events.reduce((acc, ev) => acc + ev.capacity, 0);
    const capacityRate = totalCapacity > 0 ? Math.round((total / totalCapacity) * 100) : 0;
    return { total, confirmed, pending, capacityRate, totalCapacity };
  }, [db.registrations, db.events]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-2 rounded-2xl border border-cyan-400/40 bg-void/90 px-4 py-3 text-xs font-semibold text-cyan-200 shadow-2xl backdrop-blur-xl"
          >
            <Check className="h-4 w-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Operations Console
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            SCPSC CYBER HUB <span className="text-zinc-400 font-normal">Dashboard</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Logged in as <strong className="text-zinc-200">{DEMO_ADMIN.name}</strong> · {db.organization.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Demo
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/20"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Total Registrations
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-zinc-300">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">
            {stats.total}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            Across {db.events.length} arenas in 2 fests
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Confirmed Passes
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-emerald-400">
            {stats.confirmed}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {Math.round((stats.confirmed / (stats.total || 1)) * 100)}% approved
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Pending Approvals
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-amber-400">
            {stats.pending}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            Awaiting desk check-in
          </p>
        </div>

        {/* Card 4 */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              Capacity Booked
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-zinc-300">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-white">
            {stats.capacityRate}%
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {stats.total} of {stats.totalCapacity} slots filled
          </p>
        </div>
      </section>

      {/* Real-time Analytics Section */}
      <section className="mb-8">
        <AnalyticsCharts db={db} />
      </section>

      {/* Participant Roster Table with Status Toggles */}
      <section>
        <ParticipantsTable db={db} onStatusChange={handleStatusChange} />
      </section>
    </div>
  );
}
