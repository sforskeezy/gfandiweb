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
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E5E5E5] border-t-[#111]" />
      </div>
    );
  }

  return (
    <AdminSessionContext.Provider value={{ user, token, loading }}>
      <div className="min-h-screen bg-[#FAFAFA]">
        <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#E5E5E5] bg-white px-5 py-3 sm:px-8">
          <div className="flex items-center gap-6">
            <a href="/admin" className="text-[1.05rem] font-semibold tracking-[-0.04em] text-[#111]">
              6POINT
            </a>
            <div className="hidden items-center gap-1 sm:flex">
              <a
                href="/dashboard"
                className="flex items-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-[0.8rem] font-medium text-[#999] transition-colors hover:text-[#666]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </a>
              <a
                href="/admin"
                className="flex items-center gap-1.5 border-b-2 border-[#111] px-3 py-2 text-[0.8rem] font-medium text-[#111]"
              >
                <Shield className="h-3.5 w-3.5" />
                Admin
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-[0.8rem] text-[#999] sm:block">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] px-3 py-1.5 text-[0.75rem] font-medium text-[#666] transition-colors hover:border-[#CCC] hover:text-[#111]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
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
