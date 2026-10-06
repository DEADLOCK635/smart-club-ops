"use client";

import { motion } from "framer-motion";
import { ArrowRight, QrCode, Sparkles, Terminal } from "lucide-react";
import { FestCard } from "@/components/fest/FestCard";
import { CuteRobot } from "@/components/hero/CuteRobot";
import { GlowLink } from "@/components/ui/GlowButton";
import { Scroll3DSection } from "@/components/ui/Scroll3DContainer";
import { useStore } from "@/lib/store";

export default function Home() {
  const { db } = useStore();
  const confirmed = db.registrations.filter((r) => r.status === "confirmed").length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* ── Apple Frosted Hero with NexBot 3D Bust Centerpiece ────────────────── */}
      <section className="relative flex flex-col items-center justify-center pt-8 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="apple-pill mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-medium text-zinc-300"
        >
          <Terminal className="h-3.5 w-3.5 text-cyan-400" />
          <span>South Point School &amp; College · Cyber Hub</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          SCPSC <span className="text-gradient">CYBER HUB</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-400"
        >
          The campus digital command center for tech fests, hackathons, and robotics. Register instantly and receive your verified QR gate pass.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3.5"
        >
          <GlowLink href="#fests" size="lg">
            Explore Fests <ArrowRight className="h-4 w-4" />
          </GlowLink>
          <GlowLink href="/tickets" variant="secondary" size="lg">
            My Passes
          </GlowLink>
        </motion.div>

        {/* ── Interactive 3D NexBot Bust (Head to Torso · Seamless Fit) ── */}
        <div className="relative mt-4 flex w-full items-center justify-center">
          <CuteRobot />
        </div>
      </section>

      {/* ── 3D Scroll Perspective Section: Fest Directory ─────── */}
      <Scroll3DSection className="scroll-mt-28 py-16">
        <div id="fests" className="mb-8 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Campus Lineup
            </span>
            <h2 className="mt-1 font-display text-3xl font-bold text-white">
              Available Festivals
            </h2>
          </div>
          <p className="hidden text-xs text-zinc-500 sm:block">
            Select a festival to browse arenas and register
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {db.fests.map((fest, idx) => (
            <FestCard key={fest.id} fest={fest} index={idx} />
          ))}
        </div>
      </Scroll3DSection>

      {/* ── Apple Glass 3-Step Simple Flow ── */}
      <Scroll3DSection className="border-t border-white/[0.06] py-16">
        <div className="mb-8 text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Simple Process
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            How It Works
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="apple-card rounded-2xl p-6">
            <span className="font-mono text-xs font-bold text-zinc-500">01</span>
            <div className="mt-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white" />
              <h3 className="font-semibold text-white text-sm">Pick an Event</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Browse hackathons, robotics, quizzes, or design sprints in the directory.
            </p>
          </div>

          <div className="apple-card rounded-2xl p-6">
            <span className="font-mono text-xs font-bold text-zinc-500">02</span>
            <div className="mt-3 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-white" />
              <h3 className="font-semibold text-white text-sm">Register in Seconds</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Fill in your student ID and details. Seats update automatically.
            </p>
          </div>

          <div className="apple-card rounded-2xl p-6">
            <span className="font-mono text-xs font-bold text-zinc-500">03</span>
            <div className="mt-3 flex items-center gap-2">
              <QrCode className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-white text-sm">Scan QR at Gate</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              Your digital pass is stored in your passbook. Present it for check-in.
            </p>
          </div>
        </div>
      </Scroll3DSection>
    </div>
  );
}
