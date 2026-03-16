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
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#FAFAF8" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8E6E3] border-t-[#7B8C6F]" />
      </div>
    );
  }

  return (
    <AdminSessionContext.Provider value={{ user, token, loading }}>
      <div className="min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
        <nav
          className="sticky top-0 z-50 flex items-center justify-between border-b px-5 py-4 sm:px-8"
          style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-6">
            <a href="/admin" className="text-lg font-semibold tracking-[-0.03em] text-[#1A1A1A]">
              6POINT
            </a>
            <div className="hidden items-center gap-1 sm:flex">
              <a
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[0.82rem] text-[#777] transition-colors hover:bg-black/[0.03] hover:text-[#1A1A1A]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </a>
              <a
                href="/admin"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[0.82rem] font-medium text-[#1A1A1A]"
                style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
              >
                <Shield className="h-4 w-4" />
                Admin
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[0.82rem] text-[#999]">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-[0.78rem] font-medium text-[#777] transition-all hover:border-[#CCC] hover:text-[#1A1A1A]"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </nav>

        <main className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </AdminSessionContext.Provider>
  );
}
