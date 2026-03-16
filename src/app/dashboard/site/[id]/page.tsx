"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useSession } from "../../layout";
import { ArrowLeft, Eye, Users, Globe, ExternalLink, Copy, Check } from "lucide-react";
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
      <div className="flex items-center gap-3 py-12 text-[0.85rem] text-[#CCC]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8E6E3] border-t-[#7B8C6F]" />
        Loading...
      </div>
    );
  }

  const trackingSnippet = `<script src="${typeof window !== "undefined" ? window.location.origin : ""}/api/tracker.js?id=${website.trackingId}"></script>`;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-3 inline-flex items-center gap-1.5 text-[0.78rem] text-[#AAA] transition-colors hover:text-[#1A1A1A]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-[1.6rem] font-semibold tracking-[-0.02em] text-[#1A1A1A]">
            {website.name}
          </h1>
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-[0.82rem] text-[#AAA] transition-colors hover:text-[#7B8C6F]"
          >
            {website.url}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div
          className="flex gap-1 rounded-xl border bg-white p-1"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className="rounded-lg px-3.5 py-2 text-[0.78rem] font-medium transition-all"
              style={{
                backgroundColor: days === d ? "#1A1A1A" : "transparent",
                color: days === d ? "#fff" : "#999",
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Eye className="h-5 w-5 text-[#7B8C6F]" />}
          label="Total Views"
          value={totals?.totalViews ?? 0}
          accent="#7B8C6F"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-[#5C7A8A]" />}
          label="Unique Visitors"
          value={totals?.uniqueVisitors ?? 0}
          accent="#5C7A8A"
        />
        <StatCard
          icon={<Globe className="h-5 w-5 text-[#8B7355]" />}
          label="Top Pages"
          value={topPages?.length ?? 0}
          accent="#8B7355"
        />
      </div>

      {/* Views over time chart */}
      <div
        className="mb-6 rounded-[20px] border bg-white p-6"
        style={{ borderColor: "rgba(0,0,0,0.05)" }}
      >
        <h3 className="mb-4 text-[0.9rem] font-semibold text-[#1A1A1A]">Page Views</h3>
        {viewsOverTime && viewsOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={viewsOverTime}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7B8C6F" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#7B8C6F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: "#BBB", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis
                tick={{ fill: "#BBB", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#7B8C6F"
                strokeWidth={2}
                fill="url(#viewsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[260px] items-center justify-center text-[0.85rem] text-[#CCC]">
            No data yet. Add the tracking snippet to start collecting analytics.
          </div>
        )}
      </div>

      {/* Top pages and referrers */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div
          className="rounded-[20px] border bg-white p-6"
          style={{ borderColor: "rgba(0,0,0,0.05)" }}
        >
          <h3 className="mb-4 text-[0.9rem] font-semibold text-[#1A1A1A]">Top Pages</h3>
          {topPages && topPages.length > 0 ? (
            <div className="space-y-1">
              {topPages.map((page, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F8F7F4]">
                  <span className="truncate text-[0.82rem] text-[#666]">{page.path}</span>
                  <span className="ml-2 shrink-0 rounded-md bg-[#F4F1EC] px-2 py-0.5 text-[0.75rem] font-medium text-[#777]">
                    {page.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-[0.82rem] text-[#CCC]">No data yet</p>
          )}
        </div>

        <div
          className="rounded-[20px] border bg-white p-6"
          style={{ borderColor: "rgba(0,0,0,0.05)" }}
        >
          <h3 className="mb-4 text-[0.9rem] font-semibold text-[#1A1A1A]">Referrers</h3>
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
                    backgroundColor: "#1A1A1A",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "0.8rem",
                  }}
                />
                <Bar dataKey="count" fill="#7B8C6F" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-6 text-center text-[0.82rem] text-[#CCC]">No data yet</p>
          )}
        </div>
      </div>

      {/* Tracking snippet */}
      <div
        className="mt-6 rounded-[20px] border bg-white p-6"
        style={{ borderColor: "rgba(0,0,0,0.05)" }}
      >
        <h3 className="mb-2 text-[0.9rem] font-semibold text-[#1A1A1A]">Tracking Snippet</h3>
        <p className="mb-3 text-[0.8rem] text-[#999]">
          Add this to the {`<head>`} of the website to start tracking.
        </p>
        <div
          className="relative overflow-x-auto rounded-xl border p-4 font-mono text-[0.75rem] text-[#555]"
          style={{ backgroundColor: "#FAF9F7", borderColor: "rgba(0,0,0,0.05)" }}
        >
          {trackingSnippet}
          <button
            onClick={() => handleCopy(trackingSnippet)}
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1.5 text-[0.68rem] font-medium transition-all"
            style={{
              borderColor: copied ? "rgba(123,140,111,0.3)" : "rgba(0,0,0,0.08)",
              color: copied ? "#7B8C6F" : "#777",
              backgroundColor: copied ? "rgba(123,140,111,0.05)" : "#fff",
            }}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div
      className="rounded-[20px] border bg-white p-5"
      style={{ borderColor: "rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}12` }}
        >
          {icon}
        </div>
        <div>
          <p className="text-[0.72rem] text-[#AAA]">{label}</p>
          <p className="text-[1.3rem] font-semibold tracking-[-0.02em] text-[#1A1A1A]">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
