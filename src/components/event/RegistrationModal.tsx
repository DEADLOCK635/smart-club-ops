"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { TicketCard } from "@/components/ticket/TicketCard";
import { GlowButton, GlowLink } from "@/components/ui/GlowButton";
import { Modal } from "@/components/ui/Modal";
import { useStore, type RegisterResult } from "@/lib/store";
import type { ClubEvent } from "@/lib/types";
import { CATEGORY_COLORS, cn, formatDate } from "@/lib/utils";

const DEPARTMENTS = ["CSE", "EEE", "ME", "BBA", "Architecture", "Other"];

type Form = { name: string; email: string; studentId: string; department: string; phone: string };
const EMPTY: Form = { name: "", email: "", studentId: "", department: "CSE", phone: "" };

function validate(f: Form) {
  const errors: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errors.email = "Enter a valid email address.";
  if (f.studentId.trim().length < 4) errors.studentId = "Student ID is required.";
  if (f.phone && !/^[+\d][\d\s-]{6,}$/.test(f.phone.trim())) errors.phone = "Enter a valid phone number.";
  return errors;
}

export function RegistrationModal({ event, onClose }: { event: ClubEvent | null; onClose: () => void }) {
  return (
    <Modal open={!!event} onClose={onClose} labelledBy="register-title">
      {event && <RegistrationFlow key={event.id} event={event} onClose={onClose} />}
    </Modal>
  );
}

function RegistrationFlow({ event, onClose }: { event: ClubEvent; onClose: () => void }) {
  const { register, remaining, db } = useStore();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [phase, setPhase] = useState<"form" | "submitting" | "success">("form");
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<RegisterResult, { ok: true }> | null>(null);
  const color = CATEGORY_COLORS[event.category];
  const fest = db.fests.find((f) => f.id === event.festId);

  const update = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setServerError(null);
    setPhase("submitting");
    await new Promise((r) => setTimeout(r, 1100)); // simulate network
    const res = register({ eventId: event.id, ...form });
    if (!res.ok) {
      setServerError(res.error);
      setPhase("form");
      return;
    }
    setResult(res);
    setPhase("success");
  }

  return (
    <AnimatePresence mode="wait">
      {phase !== "success" ? (
        <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16, scale: 0.97 }}>
          <span
            className="inline-block rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest"
            style={{ color, borderColor: `${color}55`, background: `${color}14` }}
          >
            {event.category}
          </span>
          <h2 id="register-title" className="mt-3 pr-8 font-display text-2xl font-bold text-white sm:text-3xl">
            {event.title}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {fest?.name} · {formatDate(event.date)} · <span className="text-cyan-300">{remaining(event.id)} seats left</span>
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <Field label="Full name" error={errors.name}>
              <input value={form.name} onChange={update("name")} placeholder="Ayesha Rahman" autoComplete="name" className={inputCls(errors.name)} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                value={form.email}
                onChange={update("email")}
                type="email"
                placeholder="you@university.edu"
                autoComplete="email"
                className={inputCls(errors.email)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Student ID" error={errors.studentId}>
                <input value={form.studentId} onChange={update("studentId")} placeholder="2023-1-60-001" className={inputCls(errors.studentId)} />
              </Field>
              <Field label="Department">
                <select value={form.department} onChange={update("department")} className={inputCls()}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} className="bg-panel">
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Phone (optional)" error={errors.phone}>
              <input value={form.phone} onChange={update("phone")} placeholder="+880 17xx-xxxxxx" autoComplete="tel" className={inputCls(errors.phone)} />
            </Field>

            <AnimatePresence>
              {serverError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" /> {serverError}
                </motion.p>
              )}
            </AnimatePresence>

            <GlowButton type="submit" size="lg" className="w-full overflow-hidden" disabled={phase === "submitting"}>
              {phase === "submitting" ? (
                <>
                  <span className="shimmer absolute inset-0" />
                  <Loader2 className="h-4 w-4 animate-spin" /> Securing your seat…
                </>
              ) : (
                <>
                  Confirm registration <ArrowRight className="h-4 w-4" />
                </>
              )}
            </GlowButton>
          </form>
        </motion.div>
      ) : (
        result && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <SuccessBurst />
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="mt-2 font-display text-3xl font-bold text-white"
            >
              You&apos;re <span className="text-gradient">in!</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-1 text-sm text-slate-400">
              Seat locked for {result.event.title}. Show this QR at the venue.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 16, delay: 1.05 }}
              className="mt-6 text-left"
              style={{ perspective: 800 }}
            >
              <TicketCard registration={result.registration} event={result.event} user={result.user} fest={fest} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <GlowLink href="/tickets" variant="secondary" className="flex-1" onClick={onClose}>
                <Sparkles className="h-4 w-4" /> View my tickets
              </GlowLink>
              <GlowButton className="flex-1" onClick={onClose}>
                Done
              </GlowButton>
            </motion.div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 block text-xs text-rose-300"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

function inputCls(error?: string) {
  return cn(
    "h-11 w-full rounded-xl border bg-white/[0.04] px-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all",
    "focus:border-cyan-400/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]",
    error ? "border-rose-500/60" : "border-white/10",
  );
}

/** Animated check draw + radial particle burst + expanding ring. */
function SuccessBurst() {
  const particles = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const dist = 70 + (i % 3) * 22;
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, color: i % 2 ? "#a855f7" : "#22d3ee", size: 4 + (i % 3) * 2 };
  });

  return (
    <div className="relative mx-auto grid h-36 w-36 place-items-center">
      {[0, 0.2].map((d) => (
        <motion.span
          key={d}
          className="absolute inset-0 rounded-full border-2 border-cyan-400/60"
          initial={{ scale: 0.4, opacity: 0.9 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 1.1, delay: 0.35 + d, ease: "easeOut" }}
        />
      ))}
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: p.color, boxShadow: `0 0 10px ${p.color}` }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0, 1.2, 0.6] }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 15 }}
        className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 shadow-[0_0_60px_rgba(34,211,238,0.55)]"
      >
        <svg viewBox="0 0 52 52" className="h-12 w-12" fill="none">
          <motion.path
            d="M14 27 L22 35 L38 18"
            stroke="#05060a"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
