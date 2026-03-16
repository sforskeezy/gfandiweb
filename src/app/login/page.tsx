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
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "#FAFAFA" }}>
      <div className="w-full max-w-[380px]">
        <a href="/" className="mb-10 block text-center">
          <span className="text-[1.4rem] font-semibold tracking-[-0.04em] text-[#111]">
            6POINT
          </span>
        </a>

        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-8 sm:p-10">
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#111]">
            Sign in
          </h1>
          <p className="mt-1.5 text-[0.85rem] text-[#999]">
            Access your client dashboard
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[0.82rem] font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[0.8rem] font-medium text-[#111]">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[0.88rem] text-[#111] outline-none transition-colors placeholder:text-[#CCC] focus:border-[#111]"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[0.8rem] font-medium text-[#111]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 pr-11 text-[0.88rem] text-[#111] outline-none transition-colors placeholder:text-[#CCC] focus:border-[#111]"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#CCC] transition-colors hover:text-[#666]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111] px-6 py-3 text-[0.88rem] font-medium text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-40"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Signing in...
                </div>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[0.78rem] text-[#999]">
          <a href="/" className="transition-colors hover:text-[#666]">
            &larr; Back to 6POINT Strategies
          </a>
        </p>
      </div>
    </div>
  );
}
