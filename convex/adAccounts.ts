import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addAdAccount = mutation({
  args: {
    sessionToken: v.string(),
    websiteId: v.id("websites"),
    platform: v.string(),
    accountName: v.string(),
    accountId: v.string(),
  },
  handler: async (ctx, { sessionToken, websiteId, platform, accountName, accountId }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();
    if (!session || session.expiresAt < Date.now()) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await ctx.db.get(session.userId);
    if (!user?.isAdmin) {
      return { success: false, error: "Admin only" };
    }

    await ctx.db.insert("adAccounts", {
      websiteId,
      platform,
      accountName: accountName.trim(),
      accountId: accountId.trim(),
      isActive: true,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

export const listAdAccounts = query({
  args: { websiteId: v.id("websites") },
  handler: async (ctx, { websiteId }) => {
    return await ctx.db
      .query("adAccounts")
      .withIndex("by_websiteId", (q) => q.eq("websiteId", websiteId))
      .collect();
  },
});

export const toggleAdAccount = mutation({
  args: { sessionToken: v.string(), adAccountId: v.id("adAccounts") },
  handler: async (ctx, { sessionToken, adAccountId }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();
    if (!session || session.expiresAt < Date.now()) {
      return { success: false, error: "Not authenticated" };
    }

    const account = await ctx.db.get(adAccountId);
    if (!account) return { success: false, error: "Not found" };

    await ctx.db.patch(adAccountId, { isActive: !account.isActive });
    return { success: true, isActive: !account.isActive };
  },
});

export const deleteAdAccount = mutation({
  args: { sessionToken: v.string(), adAccountId: v.id("adAccounts") },
  handler: async (ctx, { sessionToken, adAccountId }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();
    if (!session || session.expiresAt < Date.now()) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await ctx.db.get(session.userId);
    if (!user?.isAdmin) {
      return { success: false, error: "Admin only" };
    }

    await ctx.db.delete(adAccountId);
    return { success: true };
  },
});

export const getAdConversions = query({
  args: { websiteId: v.id("websites"), days: v.optional(v.number()) },
  handler: async (ctx, { websiteId, days }) => {
    const since = Date.now() - (days ?? 30) * 24 * 60 * 60 * 1000;

    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp", (q) =>
        q.eq("websiteId", websiteId).gte("timestamp", since)
      )
      .collect();

    const metaViews = views.filter(
      (v) => v.utmSource === "facebook" || v.utmSource === "fb" || v.utmSource === "instagram" || v.utmSource === "meta"
    );
    const googleViews = views.filter(
      (v) => v.utmSource === "google" || v.utmSource === "googleads" || v.utmMedium === "cpc"
    );
    const organicViews = views.filter(
      (v) => !v.utmSource && !v.utmMedium
    );
    const otherPaid = views.filter(
      (v) =>
        v.utmSource &&
        !metaViews.includes(v) &&
        !googleViews.includes(v)
    );

    const metaSessions = new Set(metaViews.map((v) => v.sessionId).filter(Boolean));
    const googleSessions = new Set(googleViews.map((v) => v.sessionId).filter(Boolean));
    const organicSessions = new Set(organicViews.map((v) => v.sessionId).filter(Boolean));

    const campaignBreakdown: Record<string, { views: number; sessions: Set<string> }> = {};
    for (const v of [...metaViews, ...googleViews, ...otherPaid]) {
      const key = v.utmCampaign || "No Campaign";
      if (!campaignBreakdown[key]) {
        campaignBreakdown[key] = { views: 0, sessions: new Set() };
      }
      campaignBreakdown[key].views++;
      if (v.sessionId) campaignBreakdown[key].sessions.add(v.sessionId);
    }

    const campaigns = Object.entries(campaignBreakdown)
      .map(([name, data]) => ({ name, views: data.views, visitors: data.sessions.size }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 15);

    return {
      meta: { views: metaViews.length, visitors: metaSessions.size },
      google: { views: googleViews.length, visitors: googleSessions.size },
      organic: { views: organicViews.length, visitors: organicSessions.size },
      otherPaid: { views: otherPaid.length },
      totalPaid: metaViews.length + googleViews.length + otherPaid.length,
      totalViews: views.length,
      campaigns,
    };
  },
});

export const getAdConversionsOverTime = query({
  args: { websiteId: v.id("websites"), days: v.optional(v.number()) },
  handler: async (ctx, { websiteId, days }) => {
    const numDays = days ?? 14;
    const since = Date.now() - numDays * 24 * 60 * 60 * 1000;

    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp", (q) =>
        q.eq("websiteId", websiteId).gte("timestamp", since)
      )
      .collect();

    const data: Record<string, { meta: number; google: number; organic: number }> = {};
    for (let i = 0; i < numDays; i++) {
      const d = new Date(Date.now() - (numDays - 1 - i) * 24 * 60 * 60 * 1000);
      data[d.toISOString().slice(0, 10)] = { meta: 0, google: 0, organic: 0 };
    }

    for (const v of views) {
      const key = new Date(v.timestamp).toISOString().slice(0, 10);
      if (!(key in data)) continue;

      const src = v.utmSource?.toLowerCase();
      if (src === "facebook" || src === "fb" || src === "instagram" || src === "meta") {
        data[key].meta++;
      } else if (src === "google" || src === "googleads" || v.utmMedium === "cpc") {
        data[key].google++;
      } else {
        data[key].organic++;
      }
    }

    return Object.entries(data).map(([date, counts]) => ({ date, ...counts }));
  },
});
