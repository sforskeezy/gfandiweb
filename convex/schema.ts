import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    passwordHash: v.string(),
    salt: v.string(),
    isAdmin: v.boolean(),
  }).index("by_username", ["username"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"]),

  websites: defineTable({
    userId: v.id("users"),
    name: v.string(),
    url: v.string(),
    trackingId: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_trackingId", ["trackingId"]),

  pageViews: defineTable({
    websiteId: v.id("websites"),
    trackingId: v.string(),
    path: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    screenWidth: v.optional(v.number()),
    screenHeight: v.optional(v.number()),
    timestamp: v.number(),
    sessionId: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmTerm: v.optional(v.string()),
    utmContent: v.optional(v.string()),
  })
    .index("by_websiteId", ["websiteId"])
    .index("by_trackingId", ["trackingId"])
    .index("by_timestamp", ["websiteId", "timestamp"]),

  adAccounts: defineTable({
    websiteId: v.id("websites"),
    platform: v.string(),
    accountName: v.string(),
    accountId: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_websiteId", ["websiteId"]),
});
