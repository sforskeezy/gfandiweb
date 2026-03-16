"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useSession } from "../../layout";
import { ArrowLeft, Eye, Users, Globe, ExternalLink, Copy, Check, TrendingUp, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function SiteAnalyticsPage() {
  const params = useParams();
  const websiteId = params.id as Id<"websites">;
  const { token } = useSession();
  const [days, setDays] = useState(7);
  const [copied, setCopied] = useState(false);

  const website = useQuery(api.websites.getWebsite, { websiteId });
  const viewsOverTime = useQuery(api.analytics.getViewsOverTime, { websiteId, days });
  const topPages = useQuery(api.analytics.getTopPages, { websiteId, days });
  const referrers = useQuery(api.analytics.getReferrers, { websiteId, days });
  const totals = useQuery(api.analytics.getTotalViews, { websiteId, days });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!website) {
    return (
      <div className="flex items-center gap-3 py-12 text-[0.85rem] text-[#C5C2BC]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8E6E3] border-t-[#7B8C6F]" />
        Loading...
      </div>
    );
  }

  const trackingSnippet = `<script src="${typeof window !== "undefined" ? window.location.origin : ""}/api/tracker.js?id=${website.trackingId}"></script>`;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.78rem] font-medium text-[#A5A29D] transition-all hover:bg-white hover:text-[#666]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[clamp(1.4rem,3vw,1.8rem)] font-bold tracking-[-0.03em] text-[#1A1A1A]">
              {website.name}
            </h1>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 text-[0.82rem] text-[#A5A29D] transition-colors hover:text-[#7B8C6F]"
            >
              {website.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Time range pills */}
          <div
            className="flex gap-1 rounded-2xl p-1.5"
            style={{ backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            {[
              { value: 7, label: "7 days" },
              { value: 14, label: "14 days" },
              { value: 30, label: "30 days" },
            ].map((d) => (
              <button
                key={d.value}
                onClick={() => setDays(d.value)}
                className="rounded-xl px-4 py-2 text-[0.75rem] font-semibold transition-all"
                style={{
                  backgroundColor: days === d.value ? "#1A1A1A" : "transparent",
                  color: days === d.value ? "#fff" : "#999",
                  boxShadow: days === d.value ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Eye className="h-5 w-5" />}
          label="Total Views"
          value={totals?.totalViews ?? 0}
          accent="#7B8C6F"
          change="+12%"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Unique Visitors"
          value={totals?.uniqueVisitors ?? 0}
          accent="#5C7A8A"
          change="+8%"
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Pages Tracked"
          value={topPages?.length ?? 0}
          accent="#8B7355"
        />
      </div>

      {/* Views over time chart */}
      <div
        className="mb-7 overflow-hidden rounded-[24px] bg-white"
        style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center justify-between border-b px-7 py-5" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
              <TrendingUp className="h-4 w-4 text-[#7B8C6F]" />
            </div>
            <div>
              <h3 className="text-[0.9rem] font-bold text-[#1A1A1A]">Page Views</h3>
              <p className="text-[0.7rem] text-[#B0ADA8]">Traffic over the last {days} days</p>
            </div>
          </div>
        </div>
        <div className="px-5 py-5">
          {viewsOverTime && viewsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={viewsOverTime}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B8C6F" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#7B8C6F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#C5C2BC", fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis
                  tick={{ fill: "#C5C2BC", fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "none",
                    borderRadius: "14px",
                    color: "#fff",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    padding: "10px 14px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#7B8C6F"
                  strokeWidth={2.5}
                  fill="url(#viewsGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#7B8C6F", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: "rgba(123,140,111,0.06)" }}>
                <TrendingUp className="h-5 w-5 text-[#C5C2BC]" />
              </div>
              <div>
                <p className="text-[0.85rem] font-medium text-[#999]">No data yet</p>
                <p className="mt-0.5 text-[0.75rem] text-[#C5C2BC]">Add the tracking snippet to start collecting analytics</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top pages and referrers */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Top pages */}
        <div
          className="overflow-hidden rounded-[24px] bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(139,115,85,0.08)" }}>
              <FileText className="h-4 w-4 text-[#8B7355]" />
            </div>
            <h3 className="text-[0.9rem] font-bold text-[#1A1A1A]">Top Pages</h3>
          </div>
          <div className="p-4">
            {topPages && topPages.length > 0 ? (
              <div className="space-y-0.5">
                {topPages.map((page, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-[#FAF9F7]">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg text-[0.65rem] font-bold text-[#C5C2BC]" style={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                        {i + 1}
                      </span>
                      <span className="truncate text-[0.82rem] font-medium text-[#555]">{page.path}</span>
                    </div>
                    <span className="ml-2 shrink-0 rounded-lg px-2.5 py-1 text-[0.72rem] font-bold text-[#888]" style={{ backgroundColor: "#F4F1EC" }}>
                      {page.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-[0.82rem] text-[#C5C2BC]">No data yet</p>
            )}
          </div>
        </div>

        {/* Referrers */}
        <div
          className="overflow-hidden rounded-[24px] bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(92,122,138,0.08)" }}>
              <Globe className="h-4 w-4 text-[#5C7A8A]" />
            </div>
            <h3 className="text-[0.9rem] font-bold text-[#1A1A1A]">Referrers</h3>
          </div>
          <div className="p-5">
            {referrers && referrers.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={referrers} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="referrer"
                    tick={{ fill: "#999", fontSize: 11, fontWeight: 500 }}
                    width={120}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: string) => {
                      try { return new URL(v).hostname; } catch { return v.slice(0, 20); }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      border: "none",
                      borderRadius: "14px",
                      color: "#fff",
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      padding: "10px 14px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  />
                  <Bar dataKey="count" fill="#5C7A8A" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-[0.82rem] text-[#C5C2BC]">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Tracking snippet */}
      <div
        className="mt-7 overflow-hidden rounded-[24px] bg-white"
        style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
      >
        <div className="border-b px-7 py-5" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
          <h3 className="text-[0.9rem] font-bold text-[#1A1A1A]">Tracking Snippet</h3>
          <p className="mt-0.5 text-[0.75rem] text-[#B0ADA8]">
            Add this to the {`<head>`} of the website to start tracking
          </p>
        </div>
        <div className="p-5">
          <div
            className="relative overflow-x-auto rounded-2xl p-5 font-mono text-[0.75rem] leading-relaxed text-[#666]"
            style={{ backgroundColor: "#FAF9F7", border: "1px solid rgba(0,0,0,0.04)" }}
          >
            {trackingSnippet}
            <button
              onClick={() => handleCopy(trackingSnippet)}
              className="absolute right-4 top-4 flex items-center gap-1.5 rounded-xl px-3 py-2 text-[0.7rem] font-semibold transition-all"
              style={{
                backgroundColor: copied ? "rgba(123,140,111,0.08)" : "#fff",
                color: copied ? "#7B8C6F" : "#999",
                border: `1px solid ${copied ? "rgba(123,140,111,0.2)" : "rgba(0,0,0,0.06)"}`,
                boxShadow: copied ? "none" : "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
  change?: string;
}) {
  return (
    <div
      className="rounded-[22px] bg-white p-6"
      style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-[14px]"
          style={{ backgroundColor: `${accent}12`, color: accent }}
        >
          {icon}
        </div>
        {change && (
          <span className="rounded-lg px-2 py-1 text-[0.65rem] font-bold" style={{ backgroundColor: "rgba(123,140,111,0.08)", color: "#7B8C6F" }}>
            {change}
          </span>
        )}
      </div>
      <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#B0ADA8]">{label}</p>
      <p className="mt-1 text-[1.6rem] font-bold tracking-[-0.03em] text-[#1A1A1A]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
