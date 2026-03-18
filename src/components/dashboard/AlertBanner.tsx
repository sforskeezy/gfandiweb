"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import type { Insight } from "@/utils/insights";

export default function AlertBanner({ insights }: { insights: Insight[] }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const alerts = insights.filter(
    (i) => (i.type === "alert" || i.type === "warning") && !dismissed.has(i.id)
  );

  if (!alerts.length) return null;

  return (
    <div className="mb-6 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{
            backgroundColor: alert.type === "alert" ? "rgba(220,80,80,0.05)" : "rgba(210,160,60,0.05)",
            border: `1px solid ${alert.type === "alert" ? "rgba(220,80,80,0.12)" : "rgba(210,160,60,0.12)"}`,
          }}
        >
          <AlertTriangle
            className="h-4 w-4 shrink-0"
            style={{ color: alert.type === "alert" ? "#DC5050" : "#C89B30" }}
          />
          <p className="flex-1 text-[0.78rem] font-medium text-[#555]">
            <span className="font-semibold" style={{ color: alert.type === "alert" ? "#C04040" : "#A07E20" }}>
              {alert.title}
            </span>
            {" — "}
            {alert.description}
          </p>
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(alert.id))}
            className="shrink-0 rounded-lg p-1 text-[#CCC] transition-colors hover:text-[#888]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
