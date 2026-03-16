import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const login = mutation({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, { username, password }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }

    const hash = await hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      return { success: false, error: "Invalid username or password" };
    }

    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
    });

    return {
      success: true,
      token,
      user: { id: user._id, name: user.name, username: user.username, isAdmin: user.isAdmin },
    };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();

    if (session) {
      await ctx.db.delete(session._id);
    }
    return { success: true };
  },
});

export const getSession = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .unique();

    if (!session || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    return {
      id: user._id,
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin,
    };
  },
});

export const createInitialUser = mutation({
  args: {
    name: v.string(),
    username: v.string(),
    password: v.string(),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, { name, username, password, isAdmin }) => {
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
      isAdmin,
    });

    return { success: true, userId };
  },
});
