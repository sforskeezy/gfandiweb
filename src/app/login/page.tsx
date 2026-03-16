"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

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
        if (data.user.isAdmin) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      style={{ backgroundColor: "#F4F1EC", fontFamily: "var(--font-dm), sans-serif" }}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-[100px] -right-[100px] h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(154,175,140,0.25) 0%, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-[80px] -left-[80px] h-[450px] w-[450px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(232,183,150,0.2) 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-[20%] left-[60%] h-[350px] w-[350px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(180,200,220,0.15) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-[30%] right-[55%] h-[300px] w-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(220,200,160,0.15) 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo */}
        <a href="/" className="mb-12 flex items-center justify-center gap-2">
          <span className="text-[1.6rem] font-bold tracking-[-0.04em] text-[#1A1A1A]">
            6POINT
          </span>
          <span className="text-[0.75rem] font-medium tracking-[0.08em] text-[#AAA]">
            STRATEGIES
          </span>
        </a>

        {/* Card */}
        <div
          className="overflow-hidden rounded-[32px]"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 12px 60px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.03)",
          }}
        >
          {/* Top accent */}
          <div className="h-[3px]" style={{ background: "linear-gradient(90deg, #9AAF8C, #C5B88A, #E8B796)" }} />

          <div className="px-9 pb-10 pt-9 sm:px-11 sm:pb-11 sm:pt-10">
            {/* Header with icon */}
            <div className="mb-8 flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: "linear-gradient(135deg, rgba(154,175,140,0.15), rgba(154,175,140,0.05))" }}
              >
                <Shield className="h-5 w-5 text-[#7B8C6F]" />
              </div>
              <div>
                <h1 className="text-[1.35rem] font-bold tracking-[-0.03em] text-[#1A1A1A]">
                  Client Portal
                </h1>
                <p className="text-[0.82rem] text-[#B0ADA8]">
                  Sign in to access your dashboard
                </p>
              </div>
            </div>

            {error && (
              <div
                className="mb-6 rounded-2xl px-4 py-3.5 text-[0.82rem] font-medium"
                style={{ backgroundColor: "rgba(220,50,50,0.05)", color: "#c53030", border: "1px solid rgba(220,50,50,0.08)" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label
                    className="mb-2.5 block text-[0.7rem] font-bold uppercase tracking-[0.1em] transition-colors duration-200"
                    style={{ color: focused === "username" ? "#7B8C6F" : "#C5C2BC" }}
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
                    className="w-full rounded-2xl border-2 px-5 py-4 text-[0.9rem] font-medium text-[#1A1A1A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#D5D2CC]"
                    style={{
                      backgroundColor: focused === "username" ? "#FFFFFF" : "#FAF9F7",
                      borderColor: focused === "username" ? "#7B8C6F" : "#EEECEA",
                      boxShadow: focused === "username" ? "0 0 0 4px rgba(123,140,111,0.08)" : "none",
                    }}
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label
                    className="mb-2.5 block text-[0.7rem] font-bold uppercase tracking-[0.1em] transition-colors duration-200"
                    style={{ color: focused === "password" ? "#7B8C6F" : "#C5C2BC" }}
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
                      className="w-full rounded-2xl border-2 px-5 py-4 pr-13 text-[0.9rem] font-medium text-[#1A1A1A] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[#D5D2CC]"
                      style={{
                        backgroundColor: focused === "password" ? "#FFFFFF" : "#FAF9F7",
                        borderColor: focused === "password" ? "#7B8C6F" : "#EEECEA",
                        boxShadow: focused === "password" ? "0 0 0 4px rgba(123,140,111,0.08)" : "none",
                      }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-[#CCC] transition-colors hover:text-[#888]"
                    >
                      {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-9 flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-[18px] text-[0.92rem] font-semibold text-white transition-all duration-200 hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #7B8C6F 0%, #6A7A5F 100%)",
                  boxShadow: "0 6px 20px rgba(123,140,111,0.3)",
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
          </div>
        </div>

        <p className="mt-8 text-center text-[0.78rem] text-[#C0BCB5]">
          <a href="/" className="transition-colors hover:text-[#888]">
            &larr; Back to 6POINT Strategies
          </a>
        </p>
      </div>
    </div>
  );
}
