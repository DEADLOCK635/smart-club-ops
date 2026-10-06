"use client";

import { Calendar, Clock, MapPin, Trophy, Users } from "lucide-react";
import { CapacityBar } from "@/components/event/CapacityBar";
import { GlowButton } from "@/components/ui/GlowButton";
import { TiltCard } from "@/components/ui/TiltCard";
import { useStore } from "@/lib/store";
import type { ClubEvent } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { cn, formatDate, formatTime, timeLeft } from "@/lib/utils";

export function EventCard({
  event,
  onRegister,
}: {
  event: ClubEvent;
  onRegister: (e: ClubEvent) => void;
}) {
  const { seatsTaken, remaining } = useStore();
  const now = useNow();
  const taken = seatsTaken(event.id);
  const left = remaining(event.id);
  const deadline = now ? timeLeft(event.deadline, now) : null;
  const closed = deadline?.closed ?? false;
  const full = left === 0;

  return (
    <TiltCard maxTilt={5} className="rounded-2xl">
      <article className="apple-card relative flex h-full flex-col justify-between rounded-2xl p-6">
        <div>
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-300 uppercase">
              {event.category}
            </span>
            {deadline && (
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  closed
                    ? "bg-rose-500/10 text-rose-300"
                    : deadline.urgent
                    ? "bg-amber-500/10 text-amber-300"
                    : "bg-white/5 text-zinc-400"
                )}
              >
                <Clock className="h-3 w-3" />
                {deadline.label}
              </span>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-display text-xl font-bold tracking-tight text-white">
              {event.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
              {event.description}
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                <span>{formatDate(event.date, { weekday: "short" })} · {formatTime(event.date)}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                <span className="truncate">{event.venue}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-zinc-500" />
                  {event.teamSize}
                </span>
                {event.prizePool && (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Trophy className="h-3.5 w-3.5" />
                    {event.prizePool}
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 space-y-3.5 border-t border-white/[0.06] pt-4">
          <CapacityBar taken={taken} capacity={event.capacity} />
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-zinc-500">
              Deadline: {formatDate(event.deadline, { year: undefined })}
            </span>
            <GlowButton
              size="sm"
              variant={full || closed ? "secondary" : "primary"}
              disabled={full || closed}
              onClick={() => onRegister(event)}
            >
              {full ? "Sold Out" : closed ? "Closed" : "Register"}
            </GlowButton>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
