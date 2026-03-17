"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Shield, ChevronRight, Megaphone, Settings } from "lucide-react";

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
  const pathname = usePathname();
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

  const isOnDashboard = pathname === "/dashboard";
  const isOnAds = pathname === "/dashboard/ads";
  const isOnSettings = pathname === "/dashboard/settings";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0A0A0A", fontFamily: "var(--font-dm), sans-serif" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#222] border-t-[#7B8C6F]" />
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ user, token, loading }}>
      <div className="relative min-h-screen" style={{ backgroundColor: "#0A0A0A", fontFamily: "var(--font-dm), sans-serif" }}>
        {/* Ambient glows */}
        <div className="pointer-events-none fixed inset-0">
          <div
            className="absolute -top-[200px] right-[10%] h-[600px] w-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(123,140,111,0.12) 0%, transparent 60%)" }}
          />
          <div
            className="absolute bottom-[0%] left-[-8%] h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(92,122,138,0.08) 0%, transparent 60%)" }}
          />
          <div
            className="absolute top-[45%] right-[35%] h-[400px] w-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,115,85,0.06) 0%, transparent 60%)" }}
          />
        </div>

        {/* Top nav */}
        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 sm:px-8"
          style={{
            backgroundColor: "rgba(10,10,10,0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-2">
            <a href="/dashboard" className="text-[1.1rem] font-bold tracking-[-0.04em] text-[#F0F0F0]">
              6POINT
            </a>
            <ChevronRight className="h-3.5 w-3.5 text-[#333]" />
            <div className="hidden items-center gap-0.5 sm:flex">
              <a
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8rem] font-medium transition-colors"
                style={{
                  backgroundColor: isOnDashboard ? "rgba(123,140,111,0.12)" : "transparent",
                  color: isOnDashboard ? "#9AAF8C" : "#555",
                }}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </a>
              <a
                href="/dashboard/ads"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8rem] font-medium transition-colors"
                style={{
                  backgroundColor: isOnAds ? "rgba(92,122,138,0.12)" : "transparent",
                  color: isOnAds ? "#7BA0B4" : "#555",
                }}
              >
                <Megaphone className="h-3.5 w-3.5" />
                Ads
              </a>
              <a
                href="/dashboard/settings"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8rem] font-medium transition-colors"
                style={{
                  backgroundColor: isOnSettings ? "rgba(139,115,85,0.12)" : "transparent",
                  color: isOnSettings ? "#B8996E" : "#555",
                }}
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
              </a>
              {user?.isAdmin && (
                <a
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8rem] font-medium text-[#555] transition-colors hover:bg-white/[0.03] hover:text-[#888]"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[0.68rem] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #9AAF8C, #7B8C6F)" }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-[0.8rem] font-medium text-[#666] sm:block">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.75rem] font-medium text-[#555] transition-all hover:text-[#999]"
              style={{ border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.03)" }}
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
