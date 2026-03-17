"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSession } from "./layout";
import { Globe, ArrowUpRight, BarChart3, TrendingUp, Zap, Activity } from "lucide-react";
import Link from "next/link";

const CARD_THEMES = [
  { accent: "#9AAF8C", bg: "rgba(154,175,140,0.10)", bgHover: "rgba(154,175,140,0.08)", border: "rgba(154,175,140,0.15)", glow: "rgba(154,175,140,0.06)" },
  { accent: "#7BA0B4", bg: "rgba(92,122,138,0.10)", bgHover: "rgba(92,122,138,0.08)", border: "rgba(92,122,138,0.15)", glow: "rgba(92,122,138,0.06)" },
  { accent: "#B8996E", bg: "rgba(180,150,110,0.10)", bgHover: "rgba(180,150,110,0.08)", border: "rgba(180,150,110,0.15)", glow: "rgba(180,150,110,0.06)" },
  { accent: "#A08CB4", bg: "rgba(160,140,180,0.10)", bgHover: "rgba(160,140,180,0.08)", border: "rgba(160,140,180,0.15)", glow: "rgba(160,140,180,0.06)" },
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
        <div className="mb-4 flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-[#7B8C6F]" />
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#444]">
            Dashboard
          </p>
        </div>
        <h1 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold tracking-[-0.04em] text-[#F0F0F0]">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-2.5 max-w-md text-[0.88rem] leading-relaxed text-[#555]">
          Here are your websites and their performance at a glance.
        </p>
      </div>

      {/* Stats row */}
      {websites && websites.length > 0 && (
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full" style={{ background: "radial-gradient(circle, rgba(123,140,111,0.15), transparent 70%)" }} />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(123,140,111,0.12)" }}>
              <Globe className="h-[18px] w-[18px] text-[#9AAF8C]" />
            </div>
            <p className="mt-3 text-[2rem] font-bold tracking-[-0.02em] text-[#F0F0F0]">{websites.length}</p>
            <p className="mt-0.5 text-[0.72rem] font-medium text-[#555]">Active Sites</p>
          </div>
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full" style={{ background: "radial-gradient(circle, rgba(92,122,138,0.15), transparent 70%)" }} />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(92,122,138,0.12)" }}>
              <TrendingUp className="h-[18px] w-[18px] text-[#7BA0B4]" />
            </div>
            <p className="mt-3 text-[2rem] font-bold tracking-[-0.02em] text-[#F0F0F0]">100%</p>
            <p className="mt-0.5 text-[0.72rem] font-medium text-[#555]">Uptime</p>
          </div>
          <div
            className="relative overflow-hidden rounded-2xl p-5 max-sm:col-span-2"
            style={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full" style={{ background: "radial-gradient(circle, rgba(139,115,85,0.15), transparent 70%)" }} />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(139,115,85,0.12)" }}>
              <Activity className="h-[18px] w-[18px] text-[#B8996E]" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#9AAF8C] animate-pulse" />
              <p className="text-[0.88rem] font-semibold text-[#9AAF8C]">All Systems Live</p>
            </div>
            <p className="mt-0.5 text-[0.72rem] font-medium text-[#555]">System Status</p>
          </div>
        </div>
      )}

      {websites === undefined ? (
        <div className="flex items-center gap-3 py-20 text-[0.85rem] text-[#444]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-[#7B8C6F]" />
          Loading websites...
        </div>
      ) : websites.length === 0 ? (
        <div
          className="relative overflow-hidden rounded-[28px] px-8 py-24 text-center"
          style={{
            backgroundColor: "#111",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center top, rgba(123,140,111,0.06) 0%, transparent 60%)" }} />
          <div className="relative">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(123,140,111,0.1)", border: "1px solid rgba(123,140,111,0.1)" }}
            >
              <Globe className="h-7 w-7 text-[#555]" />
            </div>
            <h3 className="mt-6 text-[1.15rem] font-bold text-[#E0E0E0]">No websites yet</h3>
            <p className="mx-auto mt-2.5 max-w-[300px] text-[0.85rem] leading-relaxed text-[#555]">
              Your admin will add your websites here. Check back soon!
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#444]">
              Your Websites
            </p>
            <p className="text-[0.72rem] font-medium text-[#333]">
              {websites.length} site{websites.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {websites.map((site, i) => {
              const theme = CARD_THEMES[i % CARD_THEMES.length];
              return (
                <Link
                  key={site._id}
                  href={`/dashboard/site/${site._id}`}
                  className="group relative overflow-hidden rounded-[22px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
                  style={{ backgroundColor: "#111", border: `1px solid rgba(255,255,255,0.06)` }}
                >
                  {/* Card glow on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `radial-gradient(ellipse at top left, ${theme.glow}, transparent 70%)` }}
                  />
                  {/* Top accent line */}
                  <div
                    className="pointer-events-none absolute left-6 right-6 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `linear-gradient(to right, transparent, ${theme.accent}40, transparent)` }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105"
                        style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}
                      >
                        <Globe className="h-5 w-5" style={{ color: theme.accent }} />
                      </div>
                      <div
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                        style={{ backgroundColor: theme.bg }}
                      >
                        <Zap className="h-3 w-3" style={{ color: theme.accent }} />
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.06em]" style={{ color: theme.accent }}>Live</span>
                      </div>
                    </div>

                    <h3 className="mt-5 text-[1.05rem] font-bold tracking-[-0.02em] text-[#E8E8E8] transition-colors duration-200 group-hover:text-white">
                      {site.name}
                    </h3>
                    <p className="mt-1 truncate text-[0.76rem] text-[#444]">{site.url}</p>

                    <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-2 text-[0.76rem] font-semibold transition-colors" style={{ color: theme.accent }}>
                        <BarChart3 className="h-3.5 w-3.5" />
                        View Analytics
                      </div>
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg opacity-0 transition-all duration-300 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0"
                        style={{ backgroundColor: theme.bg }}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" style={{ color: theme.accent }} />
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
