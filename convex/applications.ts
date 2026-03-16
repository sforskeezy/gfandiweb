import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    businessName: v.optional(v.string()),
    packageTier: v.string(),
    services: v.array(v.string()),
    details: v.optional(v.string()),
    budget: v.optional(v.string()),
    website: v.optional(v.string()),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("applications", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
    return { success: true, id };
  },
});

export const list = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();
    if (!session || session.expiresAt < Date.now()) return [];

    const user = await ctx.db.get(session.userId);
    if (!user?.isAdmin) return [];

    return await ctx.db
      .query("applications")
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    sessionToken: v.string(),
    applicationId: v.id("applications"),
    status: v.string(),
  },
  handler: async (ctx, { sessionToken, applicationId, status }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();
    if (!session || session.expiresAt < Date.now()) return { success: false, error: "Unauthorized" };

    const user = await ctx.db.get(session.userId);
    if (!user?.isAdmin) return { success: false, error: "Admin only" };

    await ctx.db.patch(applicationId, { status });
    return { success: true };
  },
});

export const remove = mutation({
  args: {
    sessionToken: v.string(),
    applicationId: v.id("applications"),
  },
  handler: async (ctx, { sessionToken, applicationId }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();
    if (!session || session.expiresAt < Date.now()) return { success: false, error: "Unauthorized" };

    const user = await ctx.db.get(session.userId);
    if (!user?.isAdmin) return { success: false, error: "Admin only" };

    await ctx.db.delete(applicationId);
    return { success: true };
  },
});
