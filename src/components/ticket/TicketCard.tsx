"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Printer, RotateCw, ShieldCheck, User } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { ClubEvent, Fest, Registration, User as UserType } from "@/lib/types";
import { cn, formatDate, formatTime } from "@/lib/utils";

export function ticketPayload(reg: Registration, event: ClubEvent, user: UserType) {
  return JSON.stringify({ t: reg.ticketId, e: event.id, u: user.email, s: reg.status });
}

export function TicketCard({
  registration,
  event,
  user,
  fest,
  compact = false,
}: {
  registration: Registration;
  event: ClubEvent;
  user: UserType;
  fest?: Fest;
  compact?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const confirmed = registration.status === "confirmed";

  function handlePrint(e: React.MouseEvent) {
    e.stopPropagation();
    window.print();
  }

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <div
        onClick={() => !compact && setFlipped((f) => !f)}
        style={{
          transform: `rotateY(${flipped ? 180 : 0}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        className={cn(
          "relative min-h-[220px] rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-xl backdrop-blur-xl",
          compact ? "" : "cursor-pointer group"
        )}
      >
        {/* FRONT SIDE */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className="relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-7"
        >
          <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                    confirmed
                      ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
                      : "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                  )}
                >
                  {registration.status}
                </span>
                {fest && (
                  <span className="truncate text-[11px] font-medium text-slate-400">
                    {fest.name}
                  </span>
                )}
              </div>

              {!compact && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-cyan-300 transition-colors">
                  <RotateCw className="h-3 w-3" /> Flip pass
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-2xl font-bold tracking-tight text-white truncate">
                  {event.title}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                  <User className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{user.name}</span>
                  <span className="text-slate-500">·</span>
                  <span className="font-mono text-slate-400">{user.studentId}</span>
                </p>

                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{formatDate(event.date)} · {formatTime(event.date)}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-purple-400" />
                    <span className="truncate">{event.venue}</span>
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="shrink-0 flex items-center justify-center">
                {confirmed ? (
                  <div className="rounded-2xl bg-white p-2.5 shadow-xl shadow-cyan-500/20">
                    <QRCodeSVG
                      value={ticketPayload(registration, event, user)}
                      size={compact ? 80 : 100}
                      bgColor="#ffffff"
                      fgColor="#05060a"
                      level="M"
                    />
                  </div>
                ) : (
                  <div className="grid h-[100px] w-[100px] place-items-center rounded-2xl border border-dashed border-amber-400/40 bg-amber-400/5 p-2 text-center text-[10px] text-amber-200">
                    Approval Pending
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
            <span className="font-mono text-[11px] tracking-wider text-cyan-300 font-semibold">
              {registration.ticketId}
            </span>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5" /> Print Pass
            </button>
          </div>
        </div>

        {/* BACK SIDE (Flip details) */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1b4b]/95 via-[#0b0f19]/95 to-[#05060a] p-6 text-xs text-slate-300"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Venue &amp; Check-In Protocol
              </span>
              <span className="font-mono text-[11px] text-slate-400">Desk 3</span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-slate-300">
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
                <p className="font-semibold text-white">Event Category:</p>
                <p className="text-[11px] text-cyan-300">{event.category} · {event.teamSize}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
                <p className="font-semibold text-white">Check-in Instructions:</p>
                <p className="text-[11px] text-slate-400">
                  Present this digital QR or a printed pass at the security desk. Wristbands will be issued for all-day arena access.
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
                <p className="font-semibold text-white">Need Support?</p>
                <p className="text-[11px] text-slate-400">
                  WhatsApp: +880 1711-203914 · Email: ops@smartclub.mit.edu
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-slate-400">
            <span>Ticket: {registration.ticketId}</span>
            <span className="text-cyan-300">Click to flip front</span>
          </div>
        </div>
      </div>
    </div>
  );
}
