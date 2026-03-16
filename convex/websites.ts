import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function generateTrackingId(): string {
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return "6p_" + Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const addWebsite = mutation({
  args: {
    sessionToken: v.string(),
    userId: v.id("users"),
    name: v.string(),
    url: v.string(),
  },
  handler: async (ctx, { sessionToken, userId, name, url }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();

    if (!session || session.expiresAt < Date.now()) {
      return { success: false, error: "Not authenticated" };
    }

    const admin = await ctx.db.get(session.userId);
    if (!admin?.isAdmin) {
      return { success: false, error: "Not authorized" };
    }

    const trackingId = generateTrackingId();

    const websiteId = await ctx.db.insert("websites", {
      userId,
      name,
      url,
      trackingId,
    });

    return { success: true, websiteId, trackingId };
  },
});

export const listWebsites = query({
  args: { sessionToken: v.string(), userId: v.optional(v.id("users")) },
  handler: async (ctx, { sessionToken, userId }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();

    if (!session || session.expiresAt < Date.now()) return [];

    const currentUser = await ctx.db.get(session.userId);
    if (!currentUser) return [];

    if (userId && currentUser.isAdmin) {
      return await ctx.db
        .query("websites")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();
    }

    return await ctx.db
      .query("websites")
      .withIndex("by_userId", (q) => q.eq("userId", session.userId))
      .collect();
  },
});

export const listAllWebsites = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();

    if (!session || session.expiresAt < Date.now()) return [];

    const currentUser = await ctx.db.get(session.userId);
    if (!currentUser?.isAdmin) return [];

    const websites = await ctx.db.query("websites").collect();
    const withOwners = await Promise.all(
      websites.map(async (w) => {
        const owner = await ctx.db.get(w.userId);
        return { ...w, ownerName: owner?.name ?? "Unknown" };
      })
    );
    return withOwners;
  },
});

export const getWebsite = query({
  args: { websiteId: v.id("websites") },
  handler: async (ctx, { websiteId }) => {
    return await ctx.db.get(websiteId);
  },
});

export const deleteWebsite = mutation({
  args: { sessionToken: v.string(), websiteId: v.id("websites") },
  handler: async (ctx, { sessionToken, websiteId }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();

    if (!session || session.expiresAt < Date.now()) {
      return { success: false, error: "Not authenticated" };
    }

    const admin = await ctx.db.get(session.userId);
    if (!admin?.isAdmin) {
      return { success: false, error: "Not authorized" };
    }

    const views = await ctx.db
      .query("pageViews")
      .withIndex("by_websiteId", (q) => q.eq("websiteId", websiteId))
      .collect();
    for (const pv of views) await ctx.db.delete(pv._id);

    await ctx.db.delete(websiteId);
    return { success: true };
  },
});
