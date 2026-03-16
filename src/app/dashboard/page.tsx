"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSession } from "./layout";
import { Globe, ArrowUpRight, BarChart3, Activity } from "lucide-react";
import Link from "next/link";

const CARD_ACCENTS = [
  { color: "#7B8C6F", light: "rgba(154,175,140,0.12)", gradient: "linear-gradient(135deg, rgba(154,175,140,0.08), rgba(154,175,140,0.02))" },
  { color: "#5C7A8A", light: "rgba(92,122,138,0.10)", gradient: "linear-gradient(135deg, rgba(92,122,138,0.08), rgba(92,122,138,0.02))" },
  { color: "#8B7355", light: "rgba(180,150,110,0.10)", gradient: "linear-gradient(135deg, rgba(180,150,110,0.08), rgba(180,150,110,0.02))" },
  { color: "#7A6B8A", light: "rgba(160,140,180,0.10)", gradient: "linear-gradient(135deg, rgba(160,140,180,0.08), rgba(160,140,180,0.02))" },
];

export default function DashboardPage() {
  const { user, token } = useSession();

  const websites = useQuery(
    api.websites.listWebsites,
    token ? { sessionToken: token } : "skip"
  );

  return (
    <div>
      <div className="mb-10">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#BBB]">
          Dashboard
        </p>
        <h1 className="mt-2 text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-[#1A1A1A]">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-1 text-[0.9rem] text-[#999]">
          Here are your websites and their performance.
        </p>
      </div>

      {websites === undefined ? (
        <div className="flex items-center gap-3 py-12 text-[0.85rem] text-[#CCC]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8E6E3] border-t-[#7B8C6F]" />
          Loading websites...
        </div>
      ) : websites.length === 0 ? (
        <div
          className="rounded-[24px] border px-8 py-16 text-center"
          style={{ borderColor: "rgba(0,0,0,0.05)", backgroundColor: "#FFFFFF" }}
        >
          <Globe className="mx-auto h-10 w-10 text-[#DDD]" />
          <h3 className="mt-4 text-lg font-medium text-[#1A1A1A]">No websites yet</h3>
          <p className="mt-2 text-[0.85rem] text-[#999]">
            Your admin will add your websites here. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {websites.map((site, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <Link
                key={site._id}
                href={`/dashboard/site/${site._id}`}
                className="group relative overflow-hidden rounded-[22px] border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ borderColor: "rgba(0,0,0,0.05)" }}
              >
                {/* Subtle gradient wash on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: accent.gradient }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: accent.light }}
                    >
                      <Globe className="h-5 w-5" style={{ color: accent.color }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent.color }} />
                      <span className="text-[0.65rem] font-medium" style={{ color: accent.color }}>Live</span>
                    </div>
                  </div>

                  <h3 className="mt-5 text-[1.05rem] font-semibold text-[#1A1A1A]">{site.name}</h3>
                  <p className="mt-1 truncate text-[0.78rem] text-[#AAA]">{site.url}</p>

                  <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
                    <div className="flex items-center gap-2 text-[0.78rem] font-medium" style={{ color: accent.color }}>
                      <BarChart3 className="h-4 w-4" />
                      View Analytics
                    </div>
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100"
                      style={{ backgroundColor: accent.light }}
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" style={{ color: accent.color }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
