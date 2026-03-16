import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const recordPageView = mutation({
  args: {
    trackingId: v.string(),
    path: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    screenWidth: v.optional(v.number()),
    screenHeight: v.optional(v.number()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const website = await ctx.db
      .query("websites")
      .withIndex("by_trackingId", (q) => q.eq("trackingId", args.trackingId))
      .unique();

    if (!website) return { success: false };

    await ctx.db.insert("pageViews", {
      websiteId: website._id,
      trackingId: args.trackingId,
      path: args.path,
      referrer: args.referrer,
      userAgent: args.userAgent,
      screenWidth: args.screenWidth,
      screenHeight: args.screenHeight,
      timestamp: Date.now(),
      sessionId: args.sessionId,
    });

    return { success: true };
  },
});

export const getPageViews = query({
  args: {
    websiteId: v.id("websites"),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, { websiteId, startTime, endTime }) => {
    const start = startTime ?? Date.now() - 30 * 24 * 60 * 60 * 1000;
    const end = endTime ?? Date.now();

    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp", (q) =>
        q.eq("websiteId", websiteId).gte("timestamp", start).lte("timestamp", end)
      )
      .collect();

    return views;
  },
});

export const getTopPages = query({
  args: { websiteId: v.id("websites"), days: v.optional(v.number()) },
  handler: async (ctx, { websiteId, days }) => {
    const since = Date.now() - (days ?? 30) * 24 * 60 * 60 * 1000;

    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp", (q) =>
        q.eq("websiteId", websiteId).gte("timestamp", since)
      )
      .collect();

    const pageCounts: Record<string, number> = {};
    for (const v of views) {
      pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
    }

    return Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));
  },
});

export const getViewsOverTime = query({
  args: { websiteId: v.id("websites"), days: v.optional(v.number()) },
  handler: async (ctx, { websiteId, days }) => {
    const numDays = days ?? 7;
    const since = Date.now() - numDays * 24 * 60 * 60 * 1000;

    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp", (q) =>
        q.eq("websiteId", websiteId).gte("timestamp", since)
      )
      .collect();

    const dayCounts: Record<string, number> = {};
    for (let i = 0; i < numDays; i++) {
      const d = new Date(Date.now() - (numDays - 1 - i) * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dayCounts[key] = 0;
    }

    for (const view of views) {
      const key = new Date(view.timestamp).toISOString().slice(0, 10);
      if (key in dayCounts) {
        dayCounts[key]++;
      }
    }

    return Object.entries(dayCounts).map(([date, views]) => ({ date, views }));
  },
});

export const getReferrers = query({
  args: { websiteId: v.id("websites"), days: v.optional(v.number()) },
  handler: async (ctx, { websiteId, days }) => {
    const since = Date.now() - (days ?? 30) * 24 * 60 * 60 * 1000;

    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp", (q) =>
        q.eq("websiteId", websiteId).gte("timestamp", since)
      )
      .collect();

    const refCounts: Record<string, number> = {};
    for (const v of views) {
      const ref = v.referrer || "Direct";
      refCounts[ref] = (refCounts[ref] || 0) + 1;
    }

    return Object.entries(refCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));
  },
});

export const getTotalViews = query({
  args: { websiteId: v.id("websites"), days: v.optional(v.number()) },
  handler: async (ctx, { websiteId, days }) => {
    const since = Date.now() - (days ?? 30) * 24 * 60 * 60 * 1000;

    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp", (q) =>
        q.eq("websiteId", websiteId).gte("timestamp", since)
      )
      .collect();

    const uniqueSessions = new Set(views.map((v) => v.sessionId).filter(Boolean));

    return {
      totalViews: views.length,
      uniqueVisitors: uniqueSessions.size,
    };
  },
});
