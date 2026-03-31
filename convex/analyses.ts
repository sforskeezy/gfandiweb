import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    businessName: v.string(),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    report: v.string(),
    sources: v.object({
      google: v.boolean(),
      facebook: v.boolean(),
      twitter: v.boolean(),
      exa: v.boolean(),
    }),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyses", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("analyses")
      .withIndex("by_createdAt")
      .order("desc")
      .take(50);
  },
});

export const remove = mutation({
  args: { id: v.id("analyses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
