"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Menu, Sparkles, Ticket, X, Terminal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Fests", icon: Sparkles },
  { href: "/tickets", label: "My Tickets", icon: Ticket },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { myTicketIds, hydrated } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/fests") : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full px-3 pt-3 sm:px-6"
    >
      <nav
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-xl px-4 transition-all duration-300 sm:px-5",
          scrolled ? "glass-strong shadow-lg" : "glass"
        )}
      >
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="relative flex h-8 w-8 items-center justify-center transition-transform group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/club-logo.png"
              alt="Club Logo"
              className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
            />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-white uppercase sm:text-base">
            SCPSC <span className="text-zinc-400 font-medium">CYBER HUB</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
                isActive(href) ? "text-white bg-white/10" : "text-zinc-400 hover:text-white"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
              {href === "/tickets" && hydrated && myTicketIds.length > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-white px-1 text-[9px] font-bold text-black">
                  {myTicketIds.length}
                </span>
              )}
            </Link>
          ))}
        </div>

        <button
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="glass-strong mx-auto mt-2 max-w-6xl rounded-xl p-2 md:hidden"
          >
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium",
                  isActive(href) ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
