"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Shield, Megaphone, Settings, Menu, X } from "lucide-react";

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
  const [mobileNav, setMobileNav] = useState(false);

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

  useEffect(() => {
    setMobileNav(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const isOnDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/site/");
  const isOnAds = pathname === "/dashboard/ads";
  const isOnSettings = pathname === "/dashboard/settings";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#080B07", fontFamily: "var(--font-dm), sans-serif" }}>
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#1a1f18] border-t-[#7B8C6F]" />
      </div>
    );
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, active: isOnDashboard },
    { href: "/dashboard/ads", label: "Ads", icon: Megaphone, active: isOnAds },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, active: isOnSettings },
  ];

  return (
    <SessionContext.Provider value={{ user, token, loading }}>
      <div
        className="relative min-h-screen"
        style={{
          backgroundColor: "#080B07",
          fontFamily: "var(--font-dm), sans-serif",
          backgroundImage: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(123,140,111,0.08) 0%, transparent 60%)",
        }}
      >
        {/* Top nav */}
        <nav
          className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: "rgba(8,11,7,0.8)", backdropFilter: "blur(20px)" }}
        >
          <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-[0.95rem] font-bold tracking-[-0.03em] text-[#D0D0D0]">
                6POINT
              </a>

              <div className="hidden items-center gap-0.5 sm:flex">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.78rem] font-medium transition-colors"
                      style={{
                        color: link.active ? "#C8D4BE" : "#4A4A4A",
                        backgroundColor: link.active ? "rgba(123,140,111,0.1)" : "transparent",
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  );
                })}
                {user?.isAdmin && (
                  <a
                    href="/admin"
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.78rem] font-medium text-[#4A4A4A] transition-colors hover:text-[#777]"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Admin
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="hidden items-center gap-2.5 sm:flex">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[0.58rem] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #8FA382, #6B7A60)" }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[0.78rem] font-medium text-[#666]">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-[#3A3A3A] transition-colors hover:text-[#777]"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                onClick={() => setMobileNav(!mobileNav)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#555] sm:hidden"
              >
                {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(123,140,111,0.12) 30%, rgba(123,140,111,0.12) 70%, transparent)" }} />
        </nav>

        {/* Mobile nav */}
        {mobileNav && (
          <div
            className="fixed inset-x-0 top-14 z-40 border-b p-4 sm:hidden"
            style={{ backgroundColor: "rgba(8,11,7,0.95)", backdropFilter: "blur(20px)", borderColor: "rgba(123,140,111,0.08)" }}
          >
            <div className="space-y-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[0.85rem] font-medium"
                    style={{
                      color: link.active ? "#C8D4BE" : "#555",
                      backgroundColor: link.active ? "rgba(123,140,111,0.1)" : "transparent",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </a>
                );
              })}
              {user?.isAdmin && (
                <a href="/admin" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[0.85rem] font-medium text-[#555]">
                  <Shield className="h-4 w-4" />
                  Admin
                </a>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full text-[0.58rem] font-bold text-white" style={{ background: "linear-gradient(135deg, #8FA382, #6B7A60)" }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[0.8rem] font-medium text-[#666]">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="text-[0.75rem] font-medium text-[#555]">Logout</button>
            </div>
          </div>
        )}

        <main className="relative z-10 mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </main>
      </div>
    </SessionContext.Provider>
  );
}
