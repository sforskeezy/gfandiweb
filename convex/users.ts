import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const createUser = mutation({
  args: {
    sessionToken: v.string(),
    name: v.string(),
    username: v.string(),
    password: v.string(),
    isAdmin: v.optional(v.boolean()),
  },
  handler: async (ctx, { sessionToken, name, username, password, isAdmin }) => {
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

    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existing) {
      return { success: false, error: "Username already exists" };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    const userId = await ctx.db.insert("users", {
      name,
      username,
      passwordHash,
      salt,
      isAdmin: isAdmin ?? false,
    });

    return { success: true, userId };
  },
});

export const listUsers = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();

    if (!session || session.expiresAt < Date.now()) return [];

    const admin = await ctx.db.get(session.userId);
    if (!admin?.isAdmin) return [];

    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({
      _id: u._id,
      name: u.name,
      username: u.username,
      isAdmin: u.isAdmin,
    }));
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin,
    };
  },
});

export const deleteUser = mutation({
  args: { sessionToken: v.string(), userId: v.id("users") },
  handler: async (ctx, { sessionToken, userId }) => {
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

    // Delete user's sessions
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    for (const s of sessions) await ctx.db.delete(s._id);

    // Delete user's websites and their page views
    const websites = await ctx.db
      .query("websites")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    for (const w of websites) {
      const views = await ctx.db
        .query("pageViews")
        .withIndex("by_websiteId", (q) => q.eq("websiteId", w._id))
        .collect();
      for (const pv of views) await ctx.db.delete(pv._id);
      await ctx.db.delete(w._id);
    }

    await ctx.db.delete(userId);
    return { success: true };
  },
});
