"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Shield, Megaphone, Settings } from "lucide-react";

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

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, match: pathname === "/dashboard" || pathname.startsWith("/dashboard/site") },
    { href: "/dashboard/ads", label: "Ads", icon: Megaphone, match: pathname === "/dashboard/ads" },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, match: pathname === "/dashboard/settings" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E5E5E5] border-t-[#111]" />
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ user, token, loading }}>
      <div className="min-h-screen bg-[#FAFAFA]">
        <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#E5E5E5] bg-white px-5 py-3 sm:px-8">
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="text-[1.05rem] font-semibold tracking-[-0.04em] text-[#111]">
              6POINT
            </a>
            <div className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 border-b-2 px-3 py-2 text-[0.8rem] font-medium transition-colors"
                  style={{
                    borderColor: item.match ? "#111" : "transparent",
                    color: item.match ? "#111" : "#999",
                  }}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </a>
              ))}
              {user?.isAdmin && (
                <a
                  href="/admin"
                  className="flex items-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-[0.8rem] font-medium text-[#999] transition-colors hover:text-[#666]"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </a>
              )}
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
    </SessionContext.Provider>
  );
}
