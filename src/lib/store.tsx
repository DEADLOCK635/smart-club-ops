"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { createSeedDatabase } from "./mock-data";
import type { ClubEvent, Database, Registration, RegistrationStatus, User } from "./types";
import { generateTicketId } from "./utils";

const STORAGE_KEY = "smart-club-ops:db:v1";
const MY_TICKETS_KEY = "smart-club-ops:my-tickets:v1";

type Action =
  | { type: "hydrate"; db: Database }
  | { type: "add-registration"; registration: Registration; user?: User }
  | { type: "set-status"; id: string; status: RegistrationStatus }
  | { type: "reset" };

function reducer(state: Database, action: Action): Database {
  switch (action.type) {
    case "hydrate":
      return action.db;
    case "add-registration":
      return {
        ...state,
        users: action.user ? [...state.users, action.user] : state.users,
        registrations: [...state.registrations, action.registration],
      };
    case "set-status":
      return {
        ...state,
        registrations: state.registrations.map((r) => (r.id === action.id ? { ...r, status: action.status } : r)),
      };
    case "reset":
      return createSeedDatabase();
  }
}

export interface RegisterInput {
  eventId: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  phone: string;
}

export type RegisterResult =
  | { ok: true; registration: Registration; user: User; event: ClubEvent }
  | { ok: false; error: string };

interface StoreValue {
  db: Database;
  hydrated: boolean;
  myTicketIds: string[];
  seatsTaken: (eventId: string) => number;
  remaining: (eventId: string) => number;
  register: (input: RegisterInput) => RegisterResult;
  setStatus: (id: string, status: RegistrationStatus) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, dispatch] = useReducer(reducer, undefined, createSeedDatabase);
  const [hydrated, setHydrated] = useState(false);
  const [myTicketIds, setMyTicketIds] = useState<string[]>([]);

  // Load persisted state once on the client.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", db: JSON.parse(raw) as Database });
      const mine = localStorage.getItem(MY_TICKETS_KEY);
      if (mine) setMyTicketIds(JSON.parse(mine) as string[]);
    } catch {
      /* corrupted storage – fall back to seed */
    }
    setHydrated(true);
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }, [db, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(MY_TICKETS_KEY, JSON.stringify(myTicketIds));
  }, [myTicketIds, hydrated]);

  const seatsTaken = useCallback(
    (eventId: string) => db.registrations.filter((r) => r.eventId === eventId).length,
    [db.registrations],
  );

  const remaining = useCallback(
    (eventId: string) => {
      const ev = db.events.find((e) => e.id === eventId);
      if (!ev) return 0;
      return Math.max(0, ev.capacity - seatsTaken(eventId));
    },
    [db.events, seatsTaken],
  );

  const register = useCallback(
    (input: RegisterInput): RegisterResult => {
      const event = db.events.find((e) => e.id === input.eventId);
      if (!event) return { ok: false, error: "Event not found." };
      if (new Date(event.deadline).getTime() < Date.now()) return { ok: false, error: "Registration deadline has passed." };
      if (remaining(event.id) <= 0) return { ok: false, error: "This event is fully booked." };

      const email = input.email.trim().toLowerCase();
      let user = db.users.find((u) => u.email.toLowerCase() === email);
      const isNewUser = !user;
      if (user && db.registrations.some((r) => r.eventId === event.id && r.userId === user!.id)) {
        return { ok: false, error: "This email is already registered for this event." };
      }
      if (!user) {
        user = {
          id: `u-${Date.now().toString(36)}`,
          name: input.name.trim(),
          email,
          studentId: input.studentId.trim(),
          department: input.department,
          phone: input.phone.trim(),
        };
      }

      const registration: Registration = {
        id: `reg-${Date.now().toString(36)}`,
        ticketId: generateTicketId(event.id),
        eventId: event.id,
        userId: user.id,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: "add-registration", registration, user: isNewUser ? user : undefined });
      setMyTicketIds((prev) => [registration.id, ...prev]);
      return { ok: true, registration, user, event };
    },
    [db.events, db.users, db.registrations, remaining],
  );

  const setStatus = useCallback((id: string, status: RegistrationStatus) => dispatch({ type: "set-status", id, status }), []);

  const resetDemo = useCallback(() => {
    dispatch({ type: "reset" });
    setMyTicketIds([]);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({ db, hydrated, myTicketIds, seatsTaken, remaining, register, setStatus, resetDemo }),
    [db, hydrated, myTicketIds, seatsTaken, remaining, register, setStatus, resetDemo],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
