import { Terminal } from "lucide-react";
import { organization } from "@/lib/mock-data";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-zinc-500 sm:flex-row">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/club-logo.png" alt="Club Logo" className="h-4 w-4 object-contain" />
          <span>
            © 2026 {organization.name} · {organization.tagline}
          </span>
        </div>
        <div>
          <span>Next.js App Router · TypeScript · 3D Operations</span>
        </div>
      </div>
    </footer>
  );
}
