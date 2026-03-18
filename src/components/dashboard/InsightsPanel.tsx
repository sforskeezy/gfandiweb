"use client";

import { Lightbulb, AlertTriangle, AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { Insight, InsightType } from "@/utils/insights";

const config: Record<InsightType, { icon: typeof Lightbulb; bg: string; border: string; iconColor: string; titleColor: string }> = {
  alert: { icon: AlertCircle, bg: "rgba(220,80,80,0.04)", border: "rgba(220,80,80,0.1)", iconColor: "#DC5050", titleColor: "#C04040" },
  warning: { icon: AlertTriangle, bg: "rgba(210,160,60,0.04)", border: "rgba(210,160,60,0.12)", iconColor: "#C89B30", titleColor: "#A07E20" },
  success: { icon: CheckCircle2, bg: "rgba(123,140,111,0.05)", border: "rgba(123,140,111,0.12)", iconColor: "#7B8C6F", titleColor: "#5A6D50" },
  info: { icon: Info, bg: "rgba(92,122,138,0.05)", border: "rgba(92,122,138,0.12)", iconColor: "#5C7A8A", titleColor: "#4A6575" },
};

export default function InsightsPanel({ insights }: { insights: Insight[] }) {
  if (!insights.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
      <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
          <Lightbulb className="h-3.5 w-3.5 text-[#7B8C6F]" />
        </div>
        <div>
          <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">AI Insights</h3>
          <p className="text-[0.7rem] text-[#BBB]">{insights.length} insight{insights.length > 1 ? "s" : ""} detected</p>
        </div>
      </div>
      <div className="space-y-2.5 p-4">
        {insights.map((insight) => {
          const c = config[insight.type];
          const Icon = c.icon;
          return (
            <div
              key={insight.id}
              className="flex items-start gap-3.5 rounded-xl px-4 py-3.5"
              style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.iconColor }} />
              <div>
                <p className="text-[0.82rem] font-semibold" style={{ color: c.titleColor }}>{insight.title}</p>
                <p className="mt-0.5 text-[0.75rem] leading-relaxed text-[#888]">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
