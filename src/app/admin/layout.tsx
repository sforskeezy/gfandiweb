"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Shield, Menu, X } from "lucide-react";

type User = {
  id: string;
  name: string;
  username: string;
  isAdmin: boolean;
};

type SessionCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
};

const AdminSessionContext = createContext<SessionCtx>({ user: null, token: null, loading: true });
export const useAdminSession = () => useContext(AdminSessionContext);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user?.isAdmin) {
        setUser(data.user);
        setToken(data.token);
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0A0A0A", fontFamily: "var(--font-dm), sans-serif" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-[#7B8C6F]" />
      </div>
    );
  }

  return (
    <AdminSessionContext.Provider value={{ user, token, loading }}>
      <div className="relative min-h-screen" style={{ backgroundColor: "#0A0A0A", fontFamily: "var(--font-dm), sans-serif" }}>
        {/* Ambient glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute -top-[300px] left-[10%] h-[700px] w-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(123,140,111,0.10) 0%, transparent 55%)" }}
          />
          <div
            className="absolute -bottom-[100px] right-[-10%] h-[600px] w-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(92,122,138,0.07) 0%, transparent 55%)" }}
          />
          <div
            className="absolute top-[40%] left-[50%] h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(232,167,130,0.04) 0%, transparent 55%)" }}
          />
        </div>

        {/* Top nav */}
        <nav
          className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: "rgba(10,10,10,0.75)", backdropFilter: "blur(24px) saturate(1.2)" }}
        >
          <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between">
            {/* Left: brand + nav */}
            <div className="flex items-center gap-5">
              <a href="/admin" className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "linear-gradient(135deg, #7B8C6F, #5a6d50)" }}
                >
                  <span className="text-[0.6rem] font-black tracking-tight text-white">6P</span>
                </div>
                <span className="text-[1rem] font-bold tracking-[-0.03em] text-[#E8E8E8]">
                  6POINT
                </span>
              </a>

              <div className="hidden h-5 w-px bg-[#1A1A1A] sm:block" />

              {/* Desktop nav pills */}
              <div
                className="hidden items-center gap-1 rounded-xl p-1 sm:flex"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <a
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[0.78rem] font-medium text-[#555] transition-all duration-200 hover:text-[#888]"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </a>
                <a
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[0.78rem] font-medium transition-all duration-200"
                  style={{ backgroundColor: "rgba(123,140,111,0.12)", color: "#9AAF8C" }}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </a>
              </div>
            </div>

            {/* Right: user + logout */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[0.65rem] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #9AAF8C, #7B8C6F)" }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.78rem] font-semibold text-[#CCC]">{user?.name}</span>
                    <span className="text-[0.62rem] text-[#444]">@{user?.username}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#444] transition-all hover:bg-white/[0.04] hover:text-[#888]"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileNav(!mobileNav)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#666] transition-all hover:bg-white/[0.04] sm:hidden"
              >
                {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Bottom border */}
          <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)" }} />
        </nav>

        {/* Mobile nav dropdown */}
        {mobileNav && (
          <div
            className="fixed inset-x-0 top-16 z-40 p-4 sm:hidden"
            style={{ backgroundColor: "rgba(10,10,10,0.95)", backdropFilter: "blur(24px)" }}
          >
            <div className="space-y-1">
              <a href="/dashboard" className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[0.88rem] font-medium text-[#666]">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </a>
              <a
                href="/admin"
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[0.88rem] font-medium"
                style={{ backgroundColor: "rgba(123,140,111,0.12)", color: "#9AAF8C" }}
              >
                <Shield className="h-4 w-4" /> Admin
              </a>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[0.68rem] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #9AAF8C, #7B8C6F)" }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.82rem] font-semibold text-[#CCC]">{user?.name}</span>
                  <span className="text-[0.68rem] text-[#444]">@{user?.username}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-xl px-4 py-2 text-[0.78rem] font-medium text-[#666] transition-all hover:text-[#999]"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                Logout
              </button>
            </div>
          </div>
        )}

        <main className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </main>
      </div>
    </AdminSessionContext.Provider>
  );
}
