"use client";

import { Filter, ChevronRight } from "lucide-react";
import type { FunnelStage } from "@/utils/insights";

export default function FunnelAnalysis({ stages }: { stages: FunnelStage[] }) {
  const maxVal = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
      <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
          <Filter className="h-3.5 w-3.5 text-[#7B8C6F]" />
        </div>
        <div>
          <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">Conversion Funnel</h3>
          <p className="text-[0.7rem] text-[#BBB]">Drop-off analysis between stages</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-end gap-3">
          {stages.map((stage, i) => {
            const pct = maxVal > 0 ? (stage.value / maxVal) * 100 : 0;
            const isLast = i === stages.length - 1;

            return (
              <div key={stage.name} className="flex flex-1 items-end gap-3">
                {/* Stage column */}
                <div className="flex flex-1 flex-col items-center">
                  <p className="mb-2 text-[1.1rem] font-bold tracking-[-0.02em] text-[#2A2A2A]">
                    {stage.value.toLocaleString()}
                  </p>
                  <div
                    className="w-full rounded-xl transition-all"
                    style={{
                      height: `${Math.max(pct * 1.6, 24)}px`,
                      backgroundColor: stage.isWorstDropOff ? "rgba(220,80,80,0.12)" : "rgba(123,140,111,0.12)",
                      border: stage.isWorstDropOff ? "1px solid rgba(220,80,80,0.15)" : "1px solid rgba(123,140,111,0.08)",
                    }}
                  />
                  <p className="mt-2.5 text-[0.7rem] font-semibold text-[#888]">{stage.name}</p>
                </div>

                {/* Drop-off arrow */}
                {!isLast && (
                  <div className="flex shrink-0 flex-col items-center gap-0.5 pb-8">
                    <ChevronRight className="h-3.5 w-3.5 text-[#CCC]" />
                    {stages[i + 1]?.dropOff !== undefined && (
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[0.6rem] font-bold"
                        style={{
                          backgroundColor: stages[i + 1].isWorstDropOff ? "rgba(220,80,80,0.08)" : "rgba(123,140,111,0.06)",
                          color: stages[i + 1].isWorstDropOff ? "#C04040" : "#888",
                        }}
                      >
                        -{stages[i + 1].dropOff}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
