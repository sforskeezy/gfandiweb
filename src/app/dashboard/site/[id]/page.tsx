"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useSession } from "../../layout";
import { ArrowLeft, Eye, Users, FileText, ExternalLink, Copy, Check } from "lucide-react";
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
      <div className="flex items-center gap-3 py-12 text-[0.85rem] text-[#999]">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E5E5E5] border-t-[#111]" />
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
          className="mb-4 inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-[#999] transition-colors hover:text-[#111]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[1.5rem] font-semibold tracking-[-0.03em] text-[#111]">
              {website.name}
            </h1>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-[0.82rem] text-[#999] transition-colors hover:text-[#666]"
            >
              {website.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex gap-1 rounded-lg border border-[#E5E5E5] bg-white p-1">
            {[
              { value: 7, label: "7d" },
              { value: 14, label: "14d" },
              { value: 30, label: "30d" },
            ].map((d) => (
              <button
                key={d.value}
                onClick={() => setDays(d.value)}
                className="rounded-md px-3 py-1.5 text-[0.75rem] font-medium transition-colors"
                style={{
                  backgroundColor: days === d.value ? "#111" : "transparent",
                  color: days === d.value ? "#fff" : "#999",
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
        <StatCard icon={<Eye className="h-4 w-4 text-[#666]" />} label="Total Views" value={totals?.totalViews ?? 0} />
        <StatCard icon={<Users className="h-4 w-4 text-[#666]" />} label="Unique Visitors" value={totals?.uniqueVisitors ?? 0} />
        <StatCard icon={<FileText className="h-4 w-4 text-[#666]" />} label="Pages Tracked" value={topPages?.length ?? 0} />
      </div>

      {/* Chart */}
      <div className="mb-6 rounded-2xl border border-[#E5E5E5] bg-white">
        <div className="border-b border-[#F0F0F0] px-6 py-4">
          <h3 className="text-[0.88rem] font-semibold text-[#111]">Page Views</h3>
          <p className="text-[0.72rem] text-[#999]">Last {days} days</p>
        </div>
        <div className="p-4">
          {viewsOverTime && viewsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={viewsOverTime}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B8C6F" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#7B8C6F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#999", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis
                  tick={{ fill: "#999", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.78rem",
                    padding: "8px 12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#7B8C6F"
                  strokeWidth={2}
                  fill="url(#viewsGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#7B8C6F", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[260px] items-center justify-center text-[0.85rem] text-[#999]">
              No data yet. Add the tracking snippet below.
            </div>
          )}
        </div>
      </div>

      {/* Top pages + Referrers */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white">
          <div className="border-b border-[#F0F0F0] px-6 py-4">
            <h3 className="text-[0.88rem] font-semibold text-[#111]">Top Pages</h3>
          </div>
          <div className="p-3">
            {topPages && topPages.length > 0 ? (
              <div className="space-y-0.5">
                {topPages.map((page, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-[#FAFAFA]">
                    <span className="truncate text-[0.82rem] text-[#666]">{page.path}</span>
                    <span className="ml-3 shrink-0 text-[0.78rem] font-medium tabular-nums text-[#111]">
                      {page.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-[0.82rem] text-[#CCC]">No data yet</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-white">
          <div className="border-b border-[#F0F0F0] px-6 py-4">
            <h3 className="text-[0.88rem] font-semibold text-[#111]">Referrers</h3>
          </div>
          <div className="p-4">
            {referrers && referrers.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={referrers} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="referrer"
                    tick={{ fill: "#999", fontSize: 11 }}
                    width={120}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: string) => {
                      try { return new URL(v).hostname; } catch { return v.slice(0, 20); }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "0.78rem",
                      padding: "8px 12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#7B8C6F" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-[0.82rem] text-[#CCC]">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Tracking snippet */}
      <div className="mt-6 rounded-2xl border border-[#E5E5E5] bg-white">
        <div className="border-b border-[#F0F0F0] px-6 py-4">
          <h3 className="text-[0.88rem] font-semibold text-[#111]">Tracking Snippet</h3>
          <p className="text-[0.72rem] text-[#999]">
            Add this to the {`<head>`} of the website
          </p>
        </div>
        <div className="p-4">
          <div className="relative overflow-x-auto rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] p-4 font-mono text-[0.75rem] text-[#666]">
            {trackingSnippet}
            <button
              onClick={() => handleCopy(trackingSnippet)}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-2.5 py-1.5 text-[0.7rem] font-medium text-[#666] transition-colors hover:border-[#CCC]"
              style={{ color: copied ? "#7B8C6F" : undefined }}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F5F5]">
        {icon}
      </div>
      <p className="mt-3 text-[0.72rem] font-medium text-[#999]">{label}</p>
      <p className="mt-0.5 text-[1.5rem] font-semibold tracking-[-0.02em] text-[#111]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
