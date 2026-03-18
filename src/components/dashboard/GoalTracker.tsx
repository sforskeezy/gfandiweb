"use client";

import { Target } from "lucide-react";

interface Goal {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

export default function GoalTracker({ goals }: { goals: Goal[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
      <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
          <Target className="h-3.5 w-3.5 text-[#7B8C6F]" />
        </div>
        <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">Goal Tracking</h3>
      </div>
      <div className="space-y-4 p-5">
        {goals.map((goal) => {
          const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
          const isComplete = pct >= 100;

          return (
            <div key={goal.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[0.78rem] font-semibold text-[#2A2A2A]">{goal.label}</span>
                <span className="text-[0.72rem] font-bold" style={{ color: isComplete ? "#5A6D50" : "#888" }}>
                  {goal.current}{goal.unit ?? ""} / {goal.target}{goal.unit ?? ""}
                </span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#F0F2ED]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: isComplete
                      ? "linear-gradient(90deg, #7B8C6F, #5A6D50)"
                      : pct >= 70
                        ? "linear-gradient(90deg, #7B8C6F, #8FA382)"
                        : pct >= 40
                          ? "linear-gradient(90deg, #C89B30, #D4AD50)"
                          : "linear-gradient(90deg, #DC5050, #E07070)",
                  }}
                />
              </div>
              <p className="mt-1 text-right text-[0.65rem] font-bold" style={{ color: isComplete ? "#5A6D50" : "#BBB" }}>
                {pct}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
