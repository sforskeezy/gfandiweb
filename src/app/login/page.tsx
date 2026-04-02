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
  const [welcomeState, setWelcomeState] = useState<{ show: boolean; name: string; isAdmin: boolean; role: string } | null>(null);

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
        const role = data.user.role || (data.user.isAdmin ? "admin" : "client");
        setWelcomeState({ show: true, name: data.user.name, isAdmin: data.user.isAdmin, role });
        setTimeout(() => {
          router.push(role === "admin" ? "/admin" : "/dashboard");
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
    <div className="relative min-h-screen lg:grid lg:grid-cols-2" style={{ fontFamily: "var(--font-dm), sans-serif" }}>
      {/* Welcome overlay */}
      <AnimatePresence>
        {welcomeState?.show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A]">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="pointer-events-none absolute h-[600px] w-[600px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(93,139,104,0.15) 0%, transparent 60%)" }} />
            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
                <CheckCircle2 className="h-12 w-12 text-[#5D8B68]" />
              </motion.div>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-white/25">
                Welcome back
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 text-[clamp(2.4rem,6vw,4rem)] font-bold tracking-[-0.04em] text-white">
                {welcomeState.name}
              </motion.h1>
              <motion.div initial={{ width: 0 }} animate={{ width: 60 }}
                transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 h-[2px] rounded-full bg-[#5D8B68]/40" />
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="mt-4 text-[0.82rem] text-white/25">
                Redirecting to your {welcomeState.role === "admin" ? "admin panel" : "dashboard"}...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Column — Large logo (Desktop only) */}
      <div className="relative hidden bg-[#0A0A0A] lg:flex flex-col items-center justify-center p-12">
        {/* Subtle green glow behind logo */}
        <div
          className="pointer-events-none absolute h-[600px] w-[600px] rounded-full opacity-[0.25] blur-[100px]"
          style={{ background: "radial-gradient(circle, #5D8B68, transparent 70%)" }}
        />
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <img
            src="/d2b8263f-f484-4783-8fd0-daf49e85220b.png"
            alt="6POINT"
            className="h-32 w-32 brightness-0 invert"
          />
          <span className="text-[2.5rem] font-bold tracking-[-0.05em] text-white">6POINT</span>
        </div>
        
        <div className="absolute bottom-10 flex gap-6 text-[0.72rem] text-white/25">
          <a href="/" className="transition-colors hover:text-white/50">&larr; Back to site</a>
          <a href="/privacy" className="transition-colors hover:text-white/50">Privacy</a>
          <a href="#" className="transition-colors hover:text-white/50">Terms</a>
        </div>
      </div>

      {/* Right Column — Login form with image background (Mobile & Desktop) */}
      <div className="relative flex min-h-screen lg:min-h-0 items-center justify-center overflow-hidden p-4 sm:p-8">
        {/* Background Image that was previously on the left */}
        <img
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.9) saturate(1.2)" }}
        />
        {/* Heavy dark overlay so the form is readable */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

        {/* Glassmorphism Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[420px] rounded-[32px] border border-white/10 bg-black/40 p-8 sm:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          {/* Mobile logo (hidden on lg since they see the big left logo) */}
          <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <img src="/d2b8263f-f484-4783-8fd0-daf49e85220b.png" alt="6POINT" className="h-8 w-8 brightness-0 invert" />
            <span className="text-[1.2rem] font-bold tracking-[-0.04em] text-white">6POINT</span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[#5D8B68] shadow-[0_0_8px_rgba(93,139,104,0.6)]" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/50">Client Portal</span>
            </div>
            <h1 className="text-[1.8rem] font-bold tracking-[-0.03em] text-white mt-2">Welcome back</h1>
            <p className="mt-1.5 text-[0.85rem] text-white/50">Sign in to your portal</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl px-4 py-3 border border-red-500/20 bg-red-500/10 text-[0.82rem] font-medium text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-200"
                style={{ color: focused === "username" ? "#8AB695" : "rgba(255,255,255,0.4)" }}
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
                placeholder="Enter your username"
                className="w-full rounded-2xl px-4 py-3.5 text-[0.88rem] text-white outline-none transition-all duration-200 placeholder:text-white/20"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: `1px solid ${focused === "username" ? "rgba(93,139,104,0.4)" : "rgba(255,255,255,0.08)"}`,
                  boxShadow: focused === "username" ? "0 0 0 2px rgba(93,139,104,0.15)" : "inset 0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-200"
                style={{ color: focused === "password" ? "#8AB695" : "rgba(255,255,255,0.4)" }}
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
                  className="w-full rounded-2xl px-4 py-3.5 pr-12 text-[0.88rem] text-white outline-none transition-all duration-200 placeholder:text-white/20"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: `1px solid ${focused === "password" ? "rgba(93,139,104,0.4)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: focused === "password" ? "0 0 0 2px rgba(93,139,104,0.15)" : "inset 0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!welcomeState}
              className="group mt-4 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-[0.9rem] font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #5D8B68, #4a7254)",
                boxShadow: "0 8px 24px rgba(93,139,104,0.25)",
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
          <p className="mt-8 text-center text-[0.75rem] text-white/30 lg:hidden">
            <a href="/" className="transition-colors hover:text-white/60">
              &larr; Back to 6POINT Solutions
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
