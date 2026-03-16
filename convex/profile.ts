import { mutation } from "./_generated/server";
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

export const updateName = mutation({
  args: { sessionToken: v.string(), name: v.string() },
  handler: async (ctx, { sessionToken, name }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();
    if (!session || session.expiresAt < Date.now()) {
      return { success: false, error: "Not authenticated" };
    }

    const trimmed = name.trim();
    if (!trimmed) return { success: false, error: "Name cannot be empty" };

    await ctx.db.patch(session.userId, { name: trimmed });
    return { success: true };
  },
});

export const changePassword = mutation({
  args: {
    sessionToken: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { sessionToken, currentPassword, newPassword }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", sessionToken))
      .unique();
    if (!session || session.expiresAt < Date.now()) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await ctx.db.get(session.userId);
    if (!user) return { success: false, error: "User not found" };

    const currentHash = await hashPassword(currentPassword, user.salt);
    if (currentHash !== user.passwordHash) {
      return { success: false, error: "Current password is incorrect" };
    }

    if (newPassword.length < 4) {
      return { success: false, error: "New password must be at least 4 characters" };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPassword, newSalt);

    await ctx.db.patch(session.userId, {
      passwordHash: newHash,
      salt: newSalt,
    });

    return { success: true };
  },
});
