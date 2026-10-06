"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Terminal } from "lucide-react";
import { loginAdmin, DEMO_ADMIN } from "@/lib/auth";
import { GlowButton } from "@/components/ui/GlowButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function fillDemo() {
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
    setError(null);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    const success = loginAdmin(email, password);
    if (success) {
      router.push("/ops");
      router.refresh();
    } else {
      setError("Invalid organizer credentials. Click 'Auto-Fill Demo Credentials' below.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-14rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card relative w-full max-w-sm rounded-2xl p-7 shadow-xl"
      >
        <div className="text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white text-black">
            <Terminal className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            SCPSC CYBER HUB
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Sign in to access organizer controls &amp; rosters.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
          <p className="text-[11px] text-zinc-400">
            Demo Credentials:
            <br />
            <code className="text-white font-mono">admin@smartclub.dev</code> /{" "}
            <code className="text-white font-mono">admin123</code>
          </p>
          <button
            type="button"
            onClick={fillDemo}
            className="mt-2 inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-[11px] font-medium text-white hover:bg-white/20 transition-colors"
          >
            Auto-Fill Credentials
          </button>
        </div>

        <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smartclub.dev"
                required
                className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 text-xs text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 text-xs text-white placeholder:text-zinc-600 outline-none transition-all focus:border-white/30"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <GlowButton
            type="submit"
            size="md"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
            <ArrowRight className="h-3.5 w-3.5" />
          </GlowButton>
        </form>
      </motion.div>
    </div>
  );
}
