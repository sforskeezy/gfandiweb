import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    passwordHash: v.string(),
    salt: v.string(),
    isAdmin: v.boolean(),
    role: v.optional(v.string()),         // "admin" | "staff" | "client"
    permissions: v.optional(v.array(v.string())), // ["dashboard","crm","websites","inbox","users"]
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

  applications: defineTable({
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
    status: v.string(),
    type: v.string(),
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  adAccounts: defineTable({
    websiteId: v.id("websites"),
    platform: v.string(),
    accountName: v.string(),
    accountId: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_websiteId", ["websiteId"]),

  analyses: defineTable({
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
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
  }).index("by_createdAt", ["createdAt"]),

  coldCalls: defineTable({
    contactName: v.string(),
    phone: v.string(),
    company: v.string(),
    notes: v.string(),
    status: v.string(), // "new" | "contacted" | "follow-up" | "converted" | "lost"
    createdAt: v.number(),
    createdByUser: v.string(), // username of the user who created it
  }).index("by_createdAt", ["createdAt"]),

  appointments: defineTable({
    contactName: v.string(),
    company: v.string(),
    email: v.string(),
    date: v.string(),
    time: v.string(),
    type: v.string(), // "discovery" | "proposal" | "follow-up" | "onboarding" | "other"
    notes: v.string(),
    status: v.string(), // "scheduled" | "completed" | "cancelled" | "no-show"
    createdAt: v.number(),
    createdByUser: v.string(),
  }).index("by_createdAt", ["createdAt"]),

  crmLeads: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.string(),
    source: v.string(),
    score: v.number(),
    notes: v.string(),
    status: v.string(), // "new" | "qualified" | "nurturing" | "converted" | "lost"
    createdAt: v.number(),
    createdByUser: v.string(),
    assignedTo: v.optional(v.string()), // username of the staff member assigned to this lead
  }).index("by_createdAt", ["createdAt"]),

  commissions: defineTable({
    username: v.string(),         // staff user who gets paid
    amount: v.number(),           // dollar amount
    description: v.string(),      // what it's for
    status: v.string(),           // "pending" | "paid"
    createdAt: v.number(),
    paidAt: v.optional(v.number()),
    createdBy: v.string(),        // admin who submitted it
  }).index("by_username", ["username"])
    .index("by_createdAt", ["createdAt"]),
});
