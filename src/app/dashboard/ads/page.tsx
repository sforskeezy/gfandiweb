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
      <div className="mb-8">
        <h1 className="text-[clamp(1.4rem,3vw,1.8rem)] font-semibold tracking-[-0.03em] text-[#2A2A2A]">
          Ad Performance
        </h1>
        <p className="mt-1.5 text-[0.85rem] text-[#999]">
          Track how your Meta and Google ad conversions are performing.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-7 flex flex-wrap items-center gap-3">
        {websites && websites.length > 1 && (
          <select
            className="rounded-xl border border-[#E2E5DD] bg-white px-4 py-2.5 text-[0.82rem] font-medium text-[#2A2A2A] outline-none focus:border-[#7B8C6F]"
            value={siteId ?? ""}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            {websites.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        )}

        <div className="flex gap-1 rounded-xl bg-white p-1" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
          {[
            { value: 7, label: "7d" },
            { value: 14, label: "14d" },
            { value: 30, label: "30d" },
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

      {siteId ? (
        <AdsAnalytics websiteId={siteId as Id<"websites">} days={days} />
      ) : (
        <div className="rounded-2xl bg-white px-8 py-20 text-center" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
          <Megaphone className="mx-auto h-10 w-10 text-[#DDD]" />
          <h3 className="mt-5 text-[1rem] font-semibold text-[#2A2A2A]">No websites yet</h3>
          <p className="mt-1.5 text-[0.85rem] text-[#999]">Add a website to start tracking ad performance.</p>
        </div>
      )}
    </div>
  );
}

function AdsAnalytics({ websiteId, days }: { websiteId: Id<"websites">; days: number }) {
  const conversions = useQuery(api.adAccounts.getAdConversions, { websiteId, days });
  const overTime = useQuery(api.adAccounts.getAdConversionsOverTime, { websiteId, days });

  if (!conversions) {
    return (
      <div className="flex items-center gap-3 py-16 text-[0.85rem] text-[#BBB]">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E5E8E0] border-t-[#7B8C6F]" />
        Loading ad data...
      </div>
    );
  }

  const paidPct = conversions.totalViews > 0 ? Math.round((conversions.totalPaid / conversions.totalViews) * 100) : 0;

  return (
    <div>
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Eye className="h-4.5 w-4.5" />} label="Meta Ads" value={`${conversions.meta.views}`} sub={`${conversions.meta.visitors} visitors`} accent="#1877F2" />
        <StatCard icon={<Eye className="h-4.5 w-4.5" />} label="Google Ads" value={`${conversions.google.views}`} sub={`${conversions.google.visitors} visitors`} accent="#EA4335" />
        <StatCard icon={<Users className="h-4.5 w-4.5" />} label="Organic" value={`${conversions.organic.views}`} sub={`${conversions.organic.visitors} visitors`} accent="#7B8C6F" />
        <StatCard icon={<Target className="h-4.5 w-4.5" />} label="Paid Traffic" value={`${paidPct}%`} sub={`${conversions.totalPaid} of ${conversions.totalViews}`} accent="#B8996E" />
      </div>

      {/* Chart */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
        <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
            <TrendingUp className="h-3.5 w-3.5 text-[#7B8C6F]" />
          </div>
          <div>
            <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">Traffic by Source</h3>
            <p className="text-[0.7rem] text-[#BBB]">Last {days} days</p>
          </div>
        </div>
        <div className="px-4 py-5">
          {overTime && overTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={overTime}>
                <defs>
                  <linearGradient id="metaG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1877F2" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#1877F2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="googleG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA4335" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#EA4335" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="organicG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B8C6F" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#7B8C6F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: "#BBB", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v: string) => v.slice(5)} />
                <YAxis tick={{ fill: "#BBB", fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid rgba(123,140,111,0.12)", borderRadius: "12px", color: "#2A2A2A", fontSize: "0.78rem", fontWeight: 500, padding: "8px 12px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }} />
                <Legend wrapperStyle={{ fontSize: "0.72rem", fontWeight: 600, color: "#999" }} iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="meta" name="Meta" stroke="#1877F2" strokeWidth={2} fill="url(#metaG)" dot={false} />
                <Area type="monotone" dataKey="google" name="Google" stroke="#EA4335" strokeWidth={2} fill="url(#googleG)" dot={false} />
                <Area type="monotone" dataKey="organic" name="Organic" stroke="#7B8C6F" strokeWidth={2} fill="url(#organicG)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] flex-col items-center justify-center gap-3">
              <TrendingUp className="h-8 w-8 text-[#DDD]" />
              <p className="text-[0.85rem] text-[#999]">No ad traffic data yet</p>
              <p className="max-w-xs text-center text-[0.75rem] text-[#BBB]">Traffic from Meta and Google Ads will appear here when visitors land with UTM parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Campaign breakdown */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
        <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
            <BarChart3 className="h-3.5 w-3.5 text-[#7B8C6F]" />
          </div>
          <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">Campaign Breakdown</h3>
        </div>
        <div className="p-4">
          {conversions.campaigns.length > 0 ? (
            <div className="space-y-0.5">
              <div className="flex items-center gap-3 px-3.5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-[#BBB]">
                <span className="flex-1">Campaign</span>
                <span className="w-20 text-right">Views</span>
                <span className="w-20 text-right">Visitors</span>
              </div>
              {conversions.campaigns.map((c, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-[#F8F9F6]">
                  <div className="flex flex-1 items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded text-[0.6rem] font-semibold text-[#BBB]" style={{ backgroundColor: "rgba(123,140,111,0.06)" }}>{i + 1}</span>
                    <span className="text-[0.82rem] font-medium text-[#666]">{c.name}</span>
                  </div>
                  <span className="w-20 text-right text-[0.82rem] font-semibold text-[#2A2A2A]">{c.views}</span>
                  <span className="w-20 text-right text-[0.75rem] font-semibold text-[#999]">{c.visitors}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[0.82rem] text-[#BBB]">No campaign data yet. Use UTM parameters in your ad links.</p>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
        <div className="px-6 py-5">
          <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">How Ad Tracking Works</h3>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-[#999]">
            Our tracker automatically captures UTM parameters from your ad links. When someone clicks a Meta or Google ad
            with UTM tags (like <code className="rounded bg-[#F0F2ED] px-1.5 py-0.5 text-[0.72rem] font-mono text-[#666]">utm_source=facebook</code>),
            we attribute that visit to the correct platform.
          </p>
          <div className="mt-3 space-y-1.5 rounded-xl p-4" style={{ backgroundColor: "#F8F9F6", border: "1px solid rgba(123,140,111,0.08)" }}>
            <p className="font-mono text-[0.68rem] text-[#888]">
              <span className="text-[#1877F2]">Meta:</span> yoursite.com?utm_source=facebook&amp;utm_medium=paid&amp;utm_campaign=spring_sale
            </p>
            <p className="font-mono text-[0.68rem] text-[#888]">
              <span className="text-[#EA4335]">Google:</span> yoursite.com?utm_source=google&amp;utm_medium=cpc&amp;utm_campaign=brand_search
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}12`, color: accent }}>
        {icon}
      </div>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-[#BBB]">{label}</p>
      <p className="mt-0.5 text-[1.4rem] font-bold tracking-[-0.02em] text-[#2A2A2A]">{value}</p>
      <p className="mt-0.5 text-[0.7rem] text-[#BBB]">{sub}</p>
    </div>
  );
}
