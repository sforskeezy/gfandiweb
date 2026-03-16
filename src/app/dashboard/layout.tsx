"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Shield } from "lucide-react";

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

const SessionContext = createContext<SessionCtx>({ user: null, token: null, loading: true });
export const useSession = () => useContext(SessionContext);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setToken(data.token);
      } else {
        router.push("/login");
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
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F4F1EC" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8E6E3] border-t-[#7B8C6F]" />
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ user, token, loading }}>
      <div className="relative min-h-screen" style={{ backgroundColor: "#F4F1EC" }}>
        {/* Ambient color washes */}
        <div className="pointer-events-none fixed inset-0">
          <div
            className="absolute -top-[150px] right-[5%] h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(154,175,140,0.18) 0%, transparent 65%)" }}
          />
          <div
            className="absolute bottom-[5%] left-[-5%] h-[450px] w-[450px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(180,200,220,0.12) 0%, transparent 65%)" }}
          />
          <div
            className="absolute top-[50%] right-[40%] h-[350px] w-[350px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(220,200,160,0.1) 0%, transparent 65%)" }}
          />
        </div>

        {/* Top nav */}
        <nav
          className="sticky top-0 z-50 flex items-center justify-between border-b px-5 py-4 sm:px-8"
          style={{
            backgroundColor: "rgba(244,241,236,0.85)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="text-lg font-semibold tracking-[-0.03em] text-[#1A1A1A]">
              6POINT
            </a>
            <div className="hidden items-center gap-1 sm:flex">
              <a
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[0.82rem] text-[#777] transition-colors hover:bg-black/[0.04] hover:text-[#1A1A1A]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </a>
              {user?.isAdmin && (
                <a
                  href="/admin"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[0.82rem] text-[#777] transition-colors hover:bg-black/[0.04] hover:text-[#1A1A1A]"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[0.7rem] font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #9AAF8C, #7B8C6F)" }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-[0.82rem] text-[#777] sm:block">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-[0.78rem] font-medium text-[#777] transition-all hover:border-[#CCC] hover:text-[#1A1A1A]"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </nav>

        <main className="relative z-10 mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </SessionContext.Provider>
  );
}
