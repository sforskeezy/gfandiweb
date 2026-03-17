"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSession } from "./layout";
import { Globe, ArrowUpRight, BarChart3, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

const CARD_THEMES = [
  { accent: "#9AAF8C", bg: "rgba(154,175,140,0.10)", bgHover: "rgba(154,175,140,0.06)", border: "rgba(154,175,140,0.12)" },
  { accent: "#7BA0B4", bg: "rgba(92,122,138,0.10)", bgHover: "rgba(92,122,138,0.06)", border: "rgba(92,122,138,0.12)" },
  { accent: "#B8996E", bg: "rgba(180,150,110,0.10)", bgHover: "rgba(180,150,110,0.06)", border: "rgba(180,150,110,0.12)" },
  { accent: "#A08CB4", bg: "rgba(160,140,180,0.10)", bgHover: "rgba(160,140,180,0.06)", border: "rgba(160,140,180,0.12)" },
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
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#555]">
            Dashboard
          </p>
        </div>
        <h1 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold tracking-[-0.04em] text-[#F0F0F0]">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-[#555]">
          Here are your websites and their performance at a glance.
        </p>
      </div>

      {/* Quick stats bar */}
      {websites && websites.length > 0 && (
        <div
          className="mb-8 flex items-center gap-6 rounded-2xl px-6 py-4"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.12)" }}>
              <Globe className="h-4 w-4 text-[#9AAF8C]" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#444]">Sites</p>
              <p className="text-[1.1rem] font-bold text-[#F0F0F0]">{websites.length}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-[#1A1A1A]" />
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(92,122,138,0.12)" }}>
              <TrendingUp className="h-4 w-4 text-[#7BA0B4]" />
            </div>
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#444]">Status</p>
              <p className="text-[0.82rem] font-semibold text-[#9AAF8C]">All Live</p>
            </div>
          </div>
        </div>
      )}

      {websites === undefined ? (
        <div className="flex items-center gap-3 py-16 text-[0.85rem] text-[#444]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#222] border-t-[#7B8C6F]" />
          Loading websites...
        </div>
      ) : websites.length === 0 ? (
        <div
          className="rounded-[28px] px-8 py-20 text-center"
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(123,140,111,0.08)" }}
          >
            <Globe className="h-7 w-7 text-[#444]" />
          </div>
          <h3 className="mt-5 text-[1.1rem] font-bold text-[#E0E0E0]">No websites yet</h3>
          <p className="mx-auto mt-2 max-w-[280px] text-[0.85rem] leading-relaxed text-[#555]">
            Your admin will add your websites here. Check back soon!
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#444]">
            Your Websites
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {websites.map((site, i) => {
              const theme = CARD_THEMES[i % CARD_THEMES.length];
              return (
                <Link
                  key={site._id}
                  href={`/dashboard/site/${site._id}`}
                  className="group relative overflow-hidden rounded-[24px] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/30"
                  style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
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

                    <h3 className="mt-5 text-[1.1rem] font-bold tracking-[-0.02em] text-[#E8E8E8] transition-colors group-hover:text-white">
                      {site.name}
                    </h3>
                    <p className="mt-1.5 truncate text-[0.78rem] text-[#555]">{site.url}</p>

                    <div className="mt-6 flex items-center justify-between border-t pt-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
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
