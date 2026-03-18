"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [welcomeState, setWelcomeState] = useState<{ show: boolean; name: string; isAdmin: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        setWelcomeState({ show: true, name: data.user.name, isAdmin: data.user.isAdmin });
        setTimeout(() => {
          router.push(data.user.isAdmin ? "/admin" : "/dashboard");
        }, 2200);
      } else {
        setError(data.error || "Login failed");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.1fr_1fr]" style={{ fontFamily: "var(--font-dm), sans-serif" }}>
      {/* Welcome overlay */}
      <AnimatePresence>
        {welcomeState?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A]"
          >
            {/* Green glow pulse */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="pointer-events-none absolute h-[600px] w-[600px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(93,139,104,0.15) 0%, transparent 60%)" }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <CheckCircle2 className="h-12 w-12 text-[#5D8B68]" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-white/25"
              >
                Welcome back
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 text-[clamp(2.4rem,6vw,4rem)] font-bold tracking-[-0.04em] text-white"
              >
                {welcomeState.name}
              </motion.h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 h-[2px] rounded-full bg-[#5D8B68]/40"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="mt-4 text-[0.82rem] text-white/25"
              >
                Redirecting to your {welcomeState.isAdmin ? "admin panel" : "dashboard"}...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left — hero image */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(30px) saturate(1.4) brightness(1.05)", transform: "scale(1.15)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/25 to-black/50" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <a href="/" className="flex items-center gap-2.5">
            <img
              src="/d2b8263f-f484-4783-8fd0-daf49e85220b.png"
              alt="6POINT"
              className="h-8 w-8 brightness-0 invert"
              style={{ animation: "logo-spin 5s cubic-bezier(0.3, 0, 0.1, 1) infinite" }}
            />
            <span className="text-[1rem] font-bold tracking-[-0.04em] text-white">6POINT</span>
          </a>

          <div />

          <div className="flex gap-6 text-[0.72rem] text-white/25">
            <a href="/" className="transition-colors hover:text-white/50">&larr; Back to site</a>
            <a href="/privacy" className="transition-colors hover:text-white/50">Privacy</a>
            <a href="#" className="transition-colors hover:text-white/50">Terms</a>
          </div>
        </div>
      </div>

      {/* Right — login */}
      <div className="relative flex items-center justify-center bg-[#0E0E0E] px-6 py-16 sm:px-12">
        {/* Green glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(93,139,104,0.07) 0%, transparent 65%)" }}
        />

        {/* Decorative corner lines */}
        <div className="pointer-events-none absolute right-8 top-8 h-16 w-16 border-t border-r border-white/[0.04] rounded-tr-2xl" />
        <div className="pointer-events-none absolute left-8 bottom-8 h-16 w-16 border-b border-l border-white/[0.04] rounded-bl-2xl" />

        {/* Floating badge */}
        <div className="pointer-events-none absolute right-8 bottom-8 hidden items-center gap-2 rounded-full border border-white/[0.04] bg-white/[0.02] px-4 py-2 backdrop-blur-sm lg:flex">
          <div className="h-2 w-2 rounded-full bg-[#5D8B68] shadow-[0_0_8px_rgba(93,139,104,0.4)]" />
          <span className="text-[0.68rem] font-medium text-white/20">Secure Portal</span>
        </div>

        <div className="relative z-10 w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="mb-14 flex items-center justify-center gap-2.5 lg:hidden">
            <img src="/d2b8263f-f484-4783-8fd0-daf49e85220b.png" alt="6POINT" className="h-8 w-8" />
            <span className="text-[1.1rem] font-bold tracking-[-0.04em] text-white">6POINT</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="hidden h-px flex-1 bg-white/[0.06] lg:block" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/15">Client Portal</span>
              <div className="hidden h-px flex-1 bg-white/[0.06] lg:block" />
            </div>
            <h1 className="text-[1.65rem] font-bold tracking-[-0.03em] text-white">Welcome back</h1>
            <p className="mt-1.5 text-[0.85rem] text-white/25">Sign in to your portal</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl px-4 py-3 text-[0.82rem] font-medium"
              style={{ backgroundColor: "rgba(220,80,80,0.1)", color: "#E07070", border: "1px solid rgba(220,80,80,0.15)" }}
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-200"
                style={{ color: focused === "username" ? "#8AB695" : "rgba(255,255,255,0.2)" }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused(null)}
                required
                autoFocus
                placeholder="Enter your username"
                className="w-full rounded-xl px-4 py-3.5 text-[0.88rem] text-white outline-none transition-all duration-200 placeholder:text-white/15"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${focused === "username" ? "rgba(93,139,104,0.5)" : "rgba(255,255,255,0.06)"}`,
                  boxShadow: focused === "username" ? "0 0 0 3px rgba(93,139,104,0.1)" : "none",
                }}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-200"
                style={{ color: focused === "password" ? "#8AB695" : "rgba(255,255,255,0.2)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl px-4 py-3.5 pr-12 text-[0.88rem] text-white outline-none transition-all duration-200 placeholder:text-white/15"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${focused === "password" ? "rgba(93,139,104,0.5)" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: focused === "password" ? "0 0 0 3px rgba(93,139,104,0.1)" : "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 transition-colors hover:text-white/50"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!welcomeState}
              className="group mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-[0.88rem] font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #5D8B68, #4a7254)",
                boxShadow: "0 4px 20px rgba(93,139,104,0.3)",
              }}
            >
              {loading ? (
                <div className="flex items-center gap-2.5">
                  <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Back link — mobile only */}
          <p className="mt-10 text-center text-[0.75rem] text-white/15 lg:hidden">
            <a href="/" className="transition-colors hover:text-white/35">
              &larr; Back to 6POINT Solutions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
