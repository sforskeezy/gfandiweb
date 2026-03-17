"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Shield, ChevronRight } from "lucide-react";

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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#222] border-t-[#7B8C6F]" />
      </div>
    );
  }

  return (
    <AdminSessionContext.Provider value={{ user, token, loading }}>
      <div className="relative min-h-screen" style={{ backgroundColor: "#0A0A0A", fontFamily: "var(--font-dm), sans-serif" }}>
        {/* Ambient glows */}
        <div className="pointer-events-none fixed inset-0">
          <div
            className="absolute -top-[200px] left-[10%] h-[600px] w-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(123,140,111,0.12) 0%, transparent 60%)" }}
          />
          <div
            className="absolute bottom-[0%] right-[-8%] h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(92,122,138,0.08) 0%, transparent 60%)" }}
          />
          <div
            className="absolute top-[40%] left-[50%] h-[400px] w-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(232,167,130,0.05) 0%, transparent 60%)" }}
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
            <a href="/admin" className="text-[1.1rem] font-bold tracking-[-0.04em] text-[#F0F0F0]">
              6POINT
            </a>
            <ChevronRight className="h-3.5 w-3.5 text-[#333]" />
            <div className="hidden items-center gap-0.5 sm:flex">
              <a
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8rem] font-medium text-[#555] transition-colors hover:bg-white/[0.03] hover:text-[#999]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </a>
              <a
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8rem] font-medium"
                style={{ backgroundColor: "rgba(123,140,111,0.12)", color: "#9AAF8C" }}
              >
                <Shield className="h-3.5 w-3.5" />
                Admin
              </a>
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
    </AdminSessionContext.Provider>
  );
}
