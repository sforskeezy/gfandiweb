"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useSession } from "../layout";
import { Megaphone, TrendingUp, Eye, Users, Target } from "lucide-react";
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
  const { token } = useSession();
  const [days, setDays] = useState(14);

  const websites = useQuery(
    api.websites.listWebsites,
    token ? { sessionToken: token } : "skip"
  );

  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const siteId = selectedSite || (websites && websites.length > 0 ? websites[0]._id : null);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#111]">
            Ad Performance
          </h1>
          <p className="mt-1 text-[0.88rem] text-[#999]">
            Track how your ad conversions are performing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {websites && websites.length > 1 && (
            <select
              className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-[0.82rem] text-[#111] outline-none focus:border-[#111]"
              value={siteId ?? ""}
              onChange={(e) => setSelectedSite(e.target.value)}
            >
              {websites.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          )}

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

      {siteId ? (
        <AdsAnalytics websiteId={siteId as Id<"websites">} days={days} />
      ) : (
        <div className="rounded-2xl border border-[#E5E5E5] bg-white px-8 py-16 text-center">
          <Megaphone className="mx-auto h-8 w-8 text-[#CCC]" />
          <h3 className="mt-4 text-[1rem] font-semibold text-[#111]">No websites yet</h3>
          <p className="mt-1.5 text-[0.85rem] text-[#999]">
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

  if (!conversions) {
    return (
      <div className="flex items-center gap-3 py-12 text-[0.85rem] text-[#999]">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E5E5E5] border-t-[#111]" />
        Loading ad data...
      </div>
    );
  }

  const paidPct = conversions.totalViews > 0 ? Math.round((conversions.totalPaid / conversions.totalViews) * 100) : 0;

  return (
    <div>
      {/* Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Eye className="h-4 w-4" />} label="Meta Ads" value={`${conversions.meta.views}`} sub={`${conversions.meta.visitors} visitors`} accent="#1877F2" />
        <StatCard icon={<Eye className="h-4 w-4" />} label="Google Ads" value={`${conversions.google.views}`} sub={`${conversions.google.visitors} visitors`} accent="#EA4335" />
        <StatCard icon={<Users className="h-4 w-4" />} label="Organic" value={`${conversions.organic.views}`} sub={`${conversions.organic.visitors} visitors`} accent="#7B8C6F" />
        <StatCard icon={<Target className="h-4 w-4" />} label="Paid Traffic" value={`${paidPct}%`} sub={`${conversions.totalPaid} of ${conversions.totalViews}`} accent="#111" />
      </div>

      {/* Chart */}
      <div className="mb-6 rounded-2xl border border-[#E5E5E5] bg-white">
        <div className="border-b border-[#F0F0F0] px-6 py-4">
          <h3 className="text-[0.88rem] font-semibold text-[#111]">Traffic by Source</h3>
          <p className="text-[0.72rem] text-[#999]">Last {days} days</p>
        </div>
        <div className="p-4">
          {overTime && overTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={overTime}>
                <defs>
                  <linearGradient id="metaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1877F2" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#1877F2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="googleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA4335" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#EA4335" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="organicGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B8C6F" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#7B8C6F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: "#999", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: string) => v.slice(5)} />
                <YAxis tick={{ fill: "#999", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "none", borderRadius: "8px", color: "#fff", fontSize: "0.78rem", padding: "8px 12px" }} />
                <Legend wrapperStyle={{ fontSize: "0.72rem", fontWeight: 500 }} iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="meta" name="Meta" stroke="#1877F2" strokeWidth={2} fill="url(#metaGrad)" dot={false} />
                <Area type="monotone" dataKey="google" name="Google" stroke="#EA4335" strokeWidth={2} fill="url(#googleGrad)" dot={false} />
                <Area type="monotone" dataKey="organic" name="Organic" stroke="#7B8C6F" strokeWidth={2} fill="url(#organicGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] flex-col items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-[#CCC]" />
              <p className="text-[0.85rem] text-[#999]">No ad traffic data yet</p>
              <p className="max-w-xs text-center text-[0.75rem] text-[#CCC]">
                Traffic from ads will appear here when visitors land with UTM parameters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Campaign breakdown */}
      <div className="mb-6 rounded-2xl border border-[#E5E5E5] bg-white">
        <div className="border-b border-[#F0F0F0] px-6 py-4">
          <h3 className="text-[0.88rem] font-semibold text-[#111]">Campaigns</h3>
        </div>
        <div className="p-3">
          {conversions.campaigns.length > 0 ? (
            <div>
              <div className="flex items-center gap-3 px-3 py-2 text-[0.68rem] font-medium uppercase tracking-wider text-[#999]">
                <span className="flex-1">Campaign</span>
                <span className="w-16 text-right">Views</span>
                <span className="w-16 text-right">Visitors</span>
              </div>
              {conversions.campaigns.map((c, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#FAFAFA]">
                  <span className="flex-1 truncate text-[0.82rem] text-[#666]">{c.name}</span>
                  <span className="w-16 text-right text-[0.82rem] font-medium tabular-nums text-[#111]">{c.views}</span>
                  <span className="w-16 text-right text-[0.78rem] tabular-nums text-[#999]">{c.visitors}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[0.82rem] text-[#CCC]">
              No campaign data yet. Use UTM parameters in your ad links.
            </p>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-[#E5E5E5] bg-white">
        <div className="px-6 py-5">
          <h3 className="text-[0.88rem] font-semibold text-[#111]">How Ad Tracking Works</h3>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-[#999]">
            Our tracker automatically captures UTM parameters from your ad links. When someone clicks a Meta or Google ad
            with UTM tags (like <code className="rounded bg-[#F5F5F5] px-1.5 py-0.5 font-mono text-[0.72rem] text-[#666]">utm_source=facebook</code>),
            we attribute that visit to the correct platform.
          </p>
          <div className="mt-4 rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] p-4">
            <p className="mb-2 text-[0.72rem] font-medium text-[#999]">Example ad URLs:</p>
            <p className="font-mono text-[0.68rem] text-[#999]">
              <span className="text-[#1877F2]">Meta:</span> yoursite.com?utm_source=facebook&amp;utm_medium=paid&amp;utm_campaign=spring_sale
            </p>
            <p className="mt-1 font-mono text-[0.68rem] text-[#999]">
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
    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}10`, color: accent }}>
        {icon}
      </div>
      <p className="mt-3 text-[0.72rem] font-medium text-[#999]">{label}</p>
      <p className="mt-0.5 text-[1.5rem] font-semibold tracking-[-0.02em] text-[#111]">{value}</p>
      <p className="mt-0.5 text-[0.7rem] text-[#CCC]">{sub}</p>
    </div>
  );
}
