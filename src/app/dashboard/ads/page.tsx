"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useSession } from "../layout";
import { Megaphone, TrendingUp, Eye, Users, Target, BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdsPage() {
  const { user, token } = useSession();
  const [days, setDays] = useState(14);

  const websites = useQuery(
    api.websites.listWebsites,
    token ? { sessionToken: token } : "skip"
  );

  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  const siteId = selectedSite || (websites && websites.length > 0 ? websites[0]._id : null);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#5C7A8A]" />
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#555]">
            Advertising
          </p>
        </div>
        <h1 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold tracking-[-0.04em] text-[#F0F0F0]">
          Ad Performance
        </h1>
        <p className="mt-2 text-[0.88rem] text-[#555]">
          Track how your Meta and Google ad conversions are performing.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        {/* Site selector */}
        {websites && websites.length > 1 && (
          <select
            className="rounded-2xl border-2 border-[#222] bg-[#141414] px-4 py-2.5 text-[0.82rem] font-medium text-[#E0E0E0] outline-none transition-all focus:border-[#7B8C6F]"
            value={siteId ?? ""}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            {websites.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        )}

        {/* Time range */}
        <div
          className="flex gap-1 rounded-2xl p-1.5"
          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {[
            { value: 7, label: "7d" },
            { value: 14, label: "14d" },
            { value: 30, label: "30d" },
          ].map((d) => (
            <button
              key={d.value}
              onClick={() => setDays(d.value)}
              className="rounded-xl px-4 py-2 text-[0.75rem] font-semibold transition-all"
              style={{
                backgroundColor: days === d.value ? "#7B8C6F" : "transparent",
                color: days === d.value ? "#fff" : "#555",
                boxShadow: days === d.value ? "0 2px 12px rgba(123,140,111,0.3)" : "none",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {siteId ? (
        <AdsAnalytics websiteId={siteId as Id<"websites">} days={days} />
      ) : (
        <div
          className="rounded-[24px] px-8 py-20 text-center"
          style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Megaphone className="mx-auto h-10 w-10 text-[#333]" />
          <h3 className="mt-5 text-[1.1rem] font-bold text-[#E0E0E0]">No websites yet</h3>
          <p className="mt-2 text-[0.85rem] text-[#555]">
            Add a website to start tracking ad performance.
          </p>
        </div>
      )}
    </div>
  );
}

function AdsAnalytics({ websiteId, days }: { websiteId: Id<"websites">; days: number }) {
  const conversions = useQuery(api.adAccounts.getAdConversions, { websiteId, days });
  const overTime = useQuery(api.adAccounts.getAdConversionsOverTime, { websiteId, days });
  const adAccounts = useQuery(api.adAccounts.listAdAccounts, { websiteId });

  if (!conversions) {
    return (
      <div className="flex items-center gap-3 py-16 text-[0.85rem] text-[#444]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#222] border-t-[#7B8C6F]" />
        Loading ad data...
      </div>
    );
  }

  const paidPct = conversions.totalViews > 0 ? Math.round((conversions.totalPaid / conversions.totalViews) * 100) : 0;

  return (
    <div>
      {/* Overview cards */}
      <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Eye className="h-5 w-5" />}
          label="Meta Ads"
          sublabel="Views / Visitors"
          value={`${conversions.meta.views}`}
          subvalue={`${conversions.meta.visitors} visitors`}
          accent="#4A9AF5"
        />
        <StatCard
          icon={<Eye className="h-5 w-5" />}
          label="Google Ads"
          sublabel="Views / Visitors"
          value={`${conversions.google.views}`}
          subvalue={`${conversions.google.visitors} visitors`}
          accent="#EF6B5E"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Organic"
          sublabel="Non-paid traffic"
          value={`${conversions.organic.views}`}
          subvalue={`${conversions.organic.visitors} visitors`}
          accent="#9AAF8C"
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="Paid Traffic"
          sublabel="% of total"
          value={`${paidPct}%`}
          subvalue={`${conversions.totalPaid} of ${conversions.totalViews}`}
          accent="#B8996E"
        />
      </div>

      {/* Chart */}
      <div
        className="mb-7 overflow-hidden rounded-[24px]"
        style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(92,122,138,0.12)" }}>
            <TrendingUp className="h-4 w-4 text-[#7BA0B4]" />
          </div>
          <div>
            <h3 className="text-[0.9rem] font-bold text-[#E0E0E0]">Traffic by Source</h3>
            <p className="text-[0.7rem] text-[#444]">Meta vs Google vs Organic over the last {days} days</p>
          </div>
        </div>
        <div className="px-5 py-5">
          {overTime && overTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={overTime}>
                <defs>
                  <linearGradient id="metaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A9AF5" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#4A9AF5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="googleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF6B5E" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#EF6B5E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="organicGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9AAF8C" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#9AAF8C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#444", fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis
                  tick={{ fill: "#444", fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F1F1F",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "14px",
                    color: "#E0E0E0",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    padding: "10px 14px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "0.72rem", fontWeight: 600, color: "#888" }}
                  iconType="circle"
                  iconSize={8}
                />
                <Area type="monotone" dataKey="meta" name="Meta" stroke="#4A9AF5" strokeWidth={2} fill="url(#metaGrad)" dot={false} />
                <Area type="monotone" dataKey="google" name="Google" stroke="#EF6B5E" strokeWidth={2} fill="url(#googleGrad)" dot={false} />
                <Area type="monotone" dataKey="organic" name="Organic" stroke="#9AAF8C" strokeWidth={2} fill="url(#organicGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] flex-col items-center justify-center gap-3">
              <TrendingUp className="h-8 w-8 text-[#333]" />
              <p className="text-[0.85rem] text-[#555]">No ad traffic data yet</p>
              <p className="max-w-xs text-center text-[0.75rem] text-[#444]">
                Traffic from Meta and Google Ads will appear here when visitors land with UTM parameters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Campaign breakdown */}
      <div
        className="mb-7 overflow-hidden rounded-[24px]"
        style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(139,115,85,0.12)" }}>
            <BarChart3 className="h-4 w-4 text-[#B8996E]" />
          </div>
          <h3 className="text-[0.9rem] font-bold text-[#E0E0E0]">Campaign Breakdown</h3>
        </div>
        <div className="p-4">
          {conversions.campaigns.length > 0 ? (
            <div className="space-y-0.5">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#444]">
                <span className="flex-1">Campaign</span>
                <span className="w-20 text-right">Views</span>
                <span className="w-20 text-right">Visitors</span>
              </div>
              {conversions.campaigns.map((c, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.02]">
                  <div className="flex flex-1 items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg text-[0.62rem] font-bold text-[#555]" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                      {i + 1}
                    </span>
                    <span className="text-[0.82rem] font-medium text-[#999]">{c.name}</span>
                  </div>
                  <span className="w-20 text-right text-[0.82rem] font-semibold text-[#E0E0E0]">{c.views}</span>
                  <span className="w-20 text-right rounded-lg px-2 py-0.5 text-[0.75rem] font-bold text-[#888]" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                    {c.visitors}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[0.82rem] text-[#444]">
              No campaign data yet. Use UTM parameters in your ad links.
            </p>
          )}
        </div>
      </div>

      {/* How it works info */}
      <div
        className="overflow-hidden rounded-[24px]"
        style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="px-7 py-6">
          <h3 className="text-[0.9rem] font-bold text-[#E0E0E0]">How Ad Tracking Works</h3>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-[#555]">
            Our tracker automatically captures UTM parameters from your ad links. When someone clicks a Meta or Google ad
            with UTM tags (like <code className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[0.72rem] font-mono text-[#888]">utm_source=facebook</code>),
            we attribute that visit to the correct platform.
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-[0.75rem] font-semibold text-[#666]">Example ad URLs:</p>
            <div className="space-y-1.5 rounded-2xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="font-mono text-[0.68rem] text-[#666]">
                <span className="text-[#4A9AF5]">Meta:</span> yoursite.com?utm_source=facebook&amp;utm_medium=paid&amp;utm_campaign=spring_sale
              </p>
              <p className="font-mono text-[0.68rem] text-[#666]">
                <span className="text-[#EF6B5E]">Google:</span> yoursite.com?utm_source=google&amp;utm_medium=cpc&amp;utm_campaign=brand_search
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  sublabel,
  value,
  subvalue,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  value: string;
  subvalue: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-[22px] p-6"
      style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-[14px]"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        {icon}
      </div>
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[#555]">{label}</p>
      <p className="mt-1 text-[1.5rem] font-bold tracking-[-0.03em] text-[#F0F0F0]">{value}</p>
      <p className="mt-1 text-[0.7rem] text-[#444]">{subvalue}</p>
    </div>
  );
}
