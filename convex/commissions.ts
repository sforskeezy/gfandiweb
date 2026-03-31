import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { username: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.username) {
      return await ctx.db
        .query("commissions")
        .withIndex("by_username", (q) => q.eq("username", args.username!))
        .order("desc")
        .take(200);
    }
    return await ctx.db
      .query("commissions")
      .withIndex("by_createdAt")
      .order("desc")
      .take(200);
  },
});

export const add = mutation({
  args: {
    username: v.string(),
    amount: v.number(),
    description: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("commissions", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const markPaid = mutation({
  args: { id: v.id("commissions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "paid", paidAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("commissions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
