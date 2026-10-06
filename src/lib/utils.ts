import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Category } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const startStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = sameMonth
    ? e.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })
    : e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startStr} – ${endStr}`;
}

/** Human friendly countdown, e.g. "6d 4h left" or "Closed". */
export function timeLeft(iso: string, now = Date.now()) {
  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return { label: "Closed", closed: true, urgent: false };
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const label = days > 0 ? `${days}d ${hours}h left` : hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`;
  return { label, closed: false, urgent: days < 3 };
}

export function generateTicketId(eventId: string) {
  const prefix = eventId.split("-")[0].toUpperCase();
  const rand = Math.random().toString(16).slice(2, 7).toUpperCase();
  return `SC-${prefix}-${rand}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Hackathon: "#22d3ee",
  Robotics: "#a855f7",
  Quiz: "#f472b6",
  Design: "#34d399",
  Workshop: "#fbbf24",
  Security: "#f87171",
  Startup: "#60a5fa",
  Gaming: "#c084fc",
};
