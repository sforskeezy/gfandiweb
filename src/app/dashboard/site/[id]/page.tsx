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
      <div className="flex items-center gap-3 py-12 text-[0.85rem] text-[#BBB]">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E5E8E0] border-t-[#7B8C6F]" />
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
          className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.78rem] font-medium text-[#BBB] transition-all hover:bg-[rgba(123,140,111,0.06)] hover:text-[#7B8C6F]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[clamp(1.4rem,3vw,1.8rem)] font-semibold tracking-[-0.03em] text-[#2A2A2A]">
              {website.name}
            </h1>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-[0.82rem] text-[#BBB] transition-colors hover:text-[#7B8C6F]"
            >
              {website.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex gap-1 rounded-xl bg-white p-1" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
            {[
              { value: 7, label: "7 days" },
              { value: 14, label: "14 days" },
              { value: 30, label: "30 days" },
            ].map((d) => (
              <button
                key={d.value}
                onClick={() => setDays(d.value)}
                className="rounded-lg px-3.5 py-1.5 text-[0.75rem] font-semibold transition-all"
                style={{
                  backgroundColor: days === d.value ? "#7B8C6F" : "transparent",
                  color: days === d.value ? "#fff" : "#BBB",
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Eye className="h-4.5 w-4.5" />} label="Total Views" value={totals?.totalViews ?? 0} accent="#7B8C6F" change="+12%" />
        <StatCard icon={<Users className="h-4.5 w-4.5" />} label="Unique Visitors" value={totals?.uniqueVisitors ?? 0} accent="#5C7A8A" change="+8%" />
        <StatCard icon={<FileText className="h-4.5 w-4.5" />} label="Pages Tracked" value={topPages?.length ?? 0} accent="#B8996E" />
      </div>

      {/* Chart */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
        <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
            <TrendingUp className="h-3.5 w-3.5 text-[#7B8C6F]" />
          </div>
          <div>
            <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">Page Views</h3>
            <p className="text-[0.7rem] text-[#BBB]">Last {days} days</p>
          </div>
        </div>
        <div className="px-4 py-5">
          {viewsOverTime && viewsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={viewsOverTime}>
                <defs>
                  <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B8C6F" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#7B8C6F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: "#BBB", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v: string) => v.slice(5)} />
                <YAxis tick={{ fill: "#BBB", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid rgba(123,140,111,0.12)", borderRadius: "12px", color: "#2A2A2A", fontSize: "0.78rem", fontWeight: 500, padding: "8px 12px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }} />
                <Area type="monotone" dataKey="views" stroke="#7B8C6F" strokeWidth={2.5} fill="url(#vGrad)" dot={false} activeDot={{ r: 5, fill: "#7B8C6F", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[260px] flex-col items-center justify-center gap-3 text-center">
              <TrendingUp className="h-8 w-8 text-[#DDD]" />
              <p className="text-[0.85rem] text-[#999]">No data yet</p>
              <p className="text-[0.75rem] text-[#BBB]">Add the tracking snippet to start collecting analytics</p>
            </div>
          )}
        </div>
      </div>

      {/* Top pages & referrers */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
          <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
              <FileText className="h-3.5 w-3.5 text-[#7B8C6F]" />
            </div>
            <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">Top Pages</h3>
          </div>
          <div className="p-4">
            {topPages && topPages.length > 0 ? (
              <div className="space-y-0.5">
                {topPages.map((page, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F8F9F6]">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded text-[0.6rem] font-semibold text-[#BBB]" style={{ backgroundColor: "rgba(123,140,111,0.06)" }}>{i + 1}</span>
                      <span className="truncate text-[0.8rem] font-medium text-[#666]">{page.path}</span>
                    </div>
                    <span className="ml-2 shrink-0 text-[0.75rem] font-semibold text-[#2A2A2A]">{page.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-[0.82rem] text-[#BBB]">No data yet</p>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
          <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
              <Globe className="h-3.5 w-3.5 text-[#7B8C6F]" />
            </div>
            <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">Referrers</h3>
          </div>
          <div className="p-5">
            {referrers && referrers.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={referrers} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="referrer" tick={{ fill: "#999", fontSize: 11, fontWeight: 500 }} width={120} axisLine={false} tickLine={false} tickFormatter={(v: string) => { try { return new URL(v).hostname; } catch { return v.slice(0, 20); } }} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid rgba(123,140,111,0.12)", borderRadius: "12px", color: "#2A2A2A", fontSize: "0.78rem", fontWeight: 500, padding: "8px 12px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }} />
                  <Bar dataKey="count" fill="#7B8C6F" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-[0.82rem] text-[#BBB]">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Tracking snippet */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
        <div className="border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
          <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">Tracking Snippet</h3>
          <p className="mt-0.5 text-[0.72rem] text-[#BBB]">Add this to the {`<head>`} of the website</p>
        </div>
        <div className="p-5">
          <div className="relative overflow-x-auto rounded-xl p-4 font-mono text-[0.72rem] leading-relaxed text-[#666]" style={{ backgroundColor: "#F8F9F6", border: "1px solid rgba(123,140,111,0.08)" }}>
            {trackingSnippet}
            <button
              onClick={() => handleCopy(trackingSnippet)}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.68rem] font-semibold transition-all"
              style={{
                backgroundColor: copied ? "rgba(123,140,111,0.1)" : "white",
                color: copied ? "#5A6D50" : "#BBB",
                border: `1px solid ${copied ? "rgba(123,140,111,0.2)" : "rgba(123,140,111,0.1)"}`,
              }}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent, change }: { icon: React.ReactNode; label: string; value: number; accent: string; change?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}14`, color: accent }}>
          {icon}
        </div>
        {change && (
          <span className="rounded-md px-2 py-0.5 text-[0.62rem] font-bold" style={{ backgroundColor: "rgba(123,140,111,0.08)", color: "#5A6D50" }}>{change}</span>
        )}
      </div>
      <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[#BBB]">{label}</p>
      <p className="mt-0.5 text-[1.5rem] font-bold tracking-[-0.02em] text-[#2A2A2A]">{value.toLocaleString()}</p>
    </div>
  );
}
