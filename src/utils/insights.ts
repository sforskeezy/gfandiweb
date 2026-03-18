export type InsightType = "warning" | "alert" | "success" | "info";

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
}

export interface MetricsSnapshot {
  leads: { current: number; previous: number };
  cpl: { current: number; previous: number };
  impressions: number;
  clicks: number;
  conversions: number;
  channels: { name: string; leads: number; cpl: number }[];
}

export function generateInsights(metrics: MetricsSnapshot): Insight[] {
  const insights: Insight[] = [];

  const leadsDelta = metrics.leads.previous > 0
    ? ((metrics.leads.current - metrics.leads.previous) / metrics.leads.previous) * 100
    : 0;

  const cplDelta = metrics.cpl.previous > 0
    ? ((metrics.cpl.current - metrics.cpl.previous) / metrics.cpl.previous) * 100
    : 0;

  if (leadsDelta <= -20) {
    insights.push({
      id: "leads-drop",
      type: "alert",
      title: `Leads dropped ${Math.abs(Math.round(leadsDelta))}%`,
      description: `You generated ${metrics.leads.current} leads this period vs ${metrics.leads.previous} last period. Investigate channel performance.`,
    });
  } else if (leadsDelta >= 15) {
    insights.push({
      id: "leads-up",
      type: "success",
      title: `Leads up ${Math.round(leadsDelta)}%`,
      description: `Strong growth — ${metrics.leads.current} leads this period compared to ${metrics.leads.previous} previously.`,
    });
  }

  if (cplDelta >= 15) {
    insights.push({
      id: "cpl-increase",
      type: "warning",
      title: `Cost per lead increased ${Math.round(cplDelta)}%`,
      description: `CPL is now $${metrics.cpl.current.toFixed(2)} vs $${metrics.cpl.previous.toFixed(2)} last period. Review ad spend efficiency.`,
    });
  } else if (cplDelta <= -10) {
    insights.push({
      id: "cpl-decrease",
      type: "success",
      title: `CPL decreased ${Math.abs(Math.round(cplDelta))}%`,
      description: `Efficiency improving — CPL dropped to $${metrics.cpl.current.toFixed(2)}.`,
    });
  }

  if (metrics.channels.length > 0) {
    const sorted = [...metrics.channels].sort((a, b) => b.leads - a.leads);
    const top = sorted[0];
    if (top.leads > 0) {
      insights.push({
        id: "top-channel",
        type: "info",
        title: `${top.name} is your top channel`,
        description: `Generating ${top.leads} leads at $${top.cpl.toFixed(2)} per lead this period.`,
      });
    }

    if (sorted.length >= 2) {
      const worst = sorted[sorted.length - 1];
      if (worst.cpl > top.cpl * 1.5 && worst.leads > 0) {
        insights.push({
          id: "underperformer",
          type: "warning",
          title: `${worst.name} underperforming`,
          description: `CPL of $${worst.cpl.toFixed(2)} is significantly higher than your best channel. Consider reallocating budget.`,
        });
      }
    }
  }

  if (insights.length === 0) {
    insights.push({
      id: "all-good",
      type: "success",
      title: "Everything looks good",
      description: "No significant changes detected. Metrics are stable this period.",
    });
  }

  return insights;
}

export interface FunnelStage {
  name: string;
  value: number;
  dropOff?: number;
  isWorstDropOff?: boolean;
}

export function analyzeFunnel(impressions: number, clicks: number, leads: number, conversions: number): FunnelStage[] {
  const stages = [
    { name: "Impressions", value: impressions },
    { name: "Clicks", value: clicks },
    { name: "Leads", value: leads },
    { name: "Conversions", value: conversions },
  ];

  let worstIdx = -1;
  let worstDrop = 0;

  for (let i = 1; i < stages.length; i++) {
    const prev = stages[i - 1].value;
    const drop = prev > 0 ? Math.round(((prev - stages[i].value) / prev) * 100) : 0;
    (stages[i] as FunnelStage).dropOff = drop;
    if (drop > worstDrop) {
      worstDrop = drop;
      worstIdx = i;
    }
  }

  if (worstIdx >= 0) {
    (stages[worstIdx] as FunnelStage).isWorstDropOff = true;
  }

  return stages as FunnelStage[];
}
