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
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F4F1EC", fontFamily: "var(--font-dm), sans-serif" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8E6E3] border-t-[#7B8C6F]" />
      </div>
    );
  }

  return (
    <AdminSessionContext.Provider value={{ user, token, loading }}>
      <div className="relative min-h-screen" style={{ backgroundColor: "#F4F1EC", fontFamily: "var(--font-dm), sans-serif" }}>
        {/* Ambient washes */}
        <div className="pointer-events-none fixed inset-0">
          <div
            className="absolute -top-[150px] left-[10%] h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(154,175,140,0.15) 0%, transparent 65%)" }}
          />
          <div
            className="absolute bottom-[10%] right-[-5%] h-[400px] w-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(180,200,220,0.12) 0%, transparent 65%)" }}
          />
        </div>

        {/* Top nav */}
        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 sm:px-8"
          style={{
            backgroundColor: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-2">
            <a href="/admin" className="text-[1.1rem] font-bold tracking-[-0.04em] text-[#1A1A1A]">
              6POINT
            </a>
            <ChevronRight className="h-3.5 w-3.5 text-[#D0D0D0]" />
            <div className="hidden items-center gap-0.5 sm:flex">
              <a
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8rem] font-medium text-[#999] transition-colors hover:bg-black/[0.03] hover:text-[#666]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </a>
              <a
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.8rem] font-medium"
                style={{ backgroundColor: "rgba(123,140,111,0.08)", color: "#5a6d50" }}
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
              <span className="hidden text-[0.8rem] font-medium text-[#888] sm:block">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[0.75rem] font-medium text-[#999] transition-all hover:text-[#666]"
              style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
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
