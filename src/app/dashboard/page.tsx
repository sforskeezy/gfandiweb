"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSession } from "./layout";
import { Globe, ArrowUpRight, BarChart3, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

const CARD_THEMES = [
  { accent: "#7B8C6F", bg: "rgba(154,175,140,0.10)", bgHover: "rgba(154,175,140,0.06)", border: "rgba(154,175,140,0.15)" },
  { accent: "#5C7A8A", bg: "rgba(92,122,138,0.10)", bgHover: "rgba(92,122,138,0.06)", border: "rgba(92,122,138,0.15)" },
  { accent: "#8B7355", bg: "rgba(180,150,110,0.10)", bgHover: "rgba(180,150,110,0.06)", border: "rgba(180,150,110,0.15)" },
  { accent: "#7A6B8A", bg: "rgba(160,140,180,0.10)", bgHover: "rgba(160,140,180,0.06)", border: "rgba(160,140,180,0.15)" },
];

export default function DashboardPage() {
  const { user, token } = useSession();

  const websites = useQuery(
    api.websites.listWebsites,
    token ? { sessionToken: token } : "skip"
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#7B8C6F]" />
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#B0ADA8]">
            Dashboard
          </p>
        </div>
        <h1 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold tracking-[-0.04em] text-[#1A1A1A]">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-[#A5A29D]">
          Here are your websites and their performance at a glance.
        </p>
      </div>

      {/* Quick stats bar */}
      {websites && websites.length > 0 && (
        <div
          className="mb-8 flex items-center gap-6 rounded-2xl px-6 py-4"
          style={{ backgroundColor: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.1)" }}>
              <Globe className="h-4 w-4 text-[#7B8C6F]" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#C5C2BC]">Sites</p>
              <p className="text-[1.1rem] font-bold text-[#1A1A1A]">{websites.length}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-[#EEECE8]" />
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(92,122,138,0.1)" }}>
              <TrendingUp className="h-4 w-4 text-[#5C7A8A]" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#C5C2BC]">Status</p>
              <p className="text-[0.82rem] font-semibold text-[#7B8C6F]">All Live</p>
            </div>
          </div>
        </div>
      )}

      {websites === undefined ? (
        <div className="flex items-center gap-3 py-16 text-[0.85rem] text-[#C5C2BC]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8E6E3] border-t-[#7B8C6F]" />
          Loading websites...
        </div>
      ) : websites.length === 0 ? (
        <div
          className="rounded-[28px] px-8 py-20 text-center"
          style={{
            backgroundColor: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(123,140,111,0.08)" }}
          >
            <Globe className="h-7 w-7 text-[#C5C2BC]" />
          </div>
          <h3 className="mt-5 text-[1.1rem] font-bold text-[#1A1A1A]">No websites yet</h3>
          <p className="mx-auto mt-2 max-w-[280px] text-[0.85rem] leading-relaxed text-[#A5A29D]">
            Your admin will add your websites here. Check back soon!
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#C5C2BC]">
            Your Websites
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {websites.map((site, i) => {
              const theme = CARD_THEMES[i % CARD_THEMES.length];
              return (
                <Link
                  key={site._id}
                  href={`/dashboard/site/${site._id}`}
                  className="group relative overflow-hidden rounded-[24px] bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                >
                  {/* Hover gradient wash */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `linear-gradient(135deg, ${theme.bgHover}, transparent)` }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div
                        className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}
                      >
                        <Globe className="h-[22px] w-[22px]" style={{ color: theme.accent }} />
                      </div>
                      <div
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                        style={{ backgroundColor: theme.bg }}
                      >
                        <Zap className="h-3 w-3" style={{ color: theme.accent }} />
                        <span className="text-[0.62rem] font-bold uppercase tracking-[0.06em]" style={{ color: theme.accent }}>Live</span>
                      </div>
                    </div>

                    <h3 className="mt-5 text-[1.1rem] font-bold tracking-[-0.02em] text-[#1A1A1A] transition-colors group-hover:text-[#333]">
                      {site.name}
                    </h3>
                    <p className="mt-1.5 truncate text-[0.78rem] text-[#B0ADA8]">{site.url}</p>

                    <div className="mt-6 flex items-center justify-between border-t pt-5" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center gap-2 text-[0.78rem] font-semibold" style={{ color: theme.accent }}>
                        <BarChart3 className="h-4 w-4" />
                        View Analytics
                      </div>
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1"
                        style={{ backgroundColor: theme.bg }}
                      >
                        <ArrowUpRight className="h-4 w-4" style={{ color: theme.accent }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
