"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4" style={{ backgroundColor: "#F4F1EC" }}>
      {/* Colorful ambient blobs */}
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

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <a href="/" className="mb-10 block text-center">
          <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#1A1A1A]">
            6POINT
          </span>
          <span className="ml-1 text-[0.8rem] font-medium tracking-[0.05em] text-[#999]">
            STRATEGIES
          </span>
        </a>

        {/* Card */}
        <div
          className="overflow-hidden rounded-[28px]"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 50px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
          }}
        >
          {/* Accent bar */}
          <div className="h-1" style={{ background: "linear-gradient(90deg, #9AAF8C, #C5B88A, #E8B796)" }} />

          <div className="px-8 pb-9 pt-8 sm:px-10 sm:pb-10 sm:pt-9">
            <h1 className="text-[1.4rem] font-semibold tracking-[-0.02em] text-[#1A1A1A]">
              Welcome back
            </h1>
            <p className="mt-1 text-[0.85rem] text-[#999]">
              Sign in to your client dashboard
            </p>

            {error && (
              <div
                className="mt-5 rounded-xl px-4 py-3 text-[0.82rem] font-medium"
                style={{ backgroundColor: "rgba(220,50,50,0.06)", color: "#c53030", border: "1px solid rgba(220,50,50,0.06)" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7">
              <div className="space-y-5">
                {/* Username */}
                <div>
                  <label
                    className="mb-2 block text-[0.75rem] font-semibold tracking-[0.04em] transition-colors"
                    style={{ color: focused === "username" ? "#7B8C6F" : "#BBB" }}
                  >
                    USERNAME
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocused("username")}
                    onBlur={() => setFocused(null)}
                    required
                    autoFocus
                    className="w-full rounded-2xl border-2 bg-[#FAFAF8] px-4 py-3.5 text-[0.88rem] text-[#1A1A1A] outline-none transition-all placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white"
                    style={{ borderColor: focused === "username" ? "#7B8C6F" : "#EEECE8" }}
                    placeholder="Enter your username"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    className="mb-2 block text-[0.75rem] font-semibold tracking-[0.04em] transition-colors"
                    style={{ color: focused === "password" ? "#7B8C6F" : "#BBB" }}
                  >
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      required
                      className="w-full rounded-2xl border-2 bg-[#FAFAF8] px-4 py-3.5 pr-12 text-[0.88rem] text-[#1A1A1A] outline-none transition-all placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white"
                      style={{ borderColor: focused === "password" ? "#7B8C6F" : "#EEECE8" }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#CCC] transition-colors hover:text-[#999]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-8 flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-[0.9rem] font-semibold text-white transition-all duration-200 hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #7B8C6F 0%, #6A7A5F 100%)",
                  boxShadow: "0 4px 16px rgba(123,140,111,0.3)",
                }}
              >
                {loading ? (
                  <div className="flex items-center gap-2.5">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-7 text-center text-[0.78rem] text-[#BBB]">
          <a href="/" className="transition-colors hover:text-[#888]">
            &larr; Back to 6POINT Strategies
          </a>
        </p>
      </div>
    </div>
  );
}
