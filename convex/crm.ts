import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ─── Cold Calls ───

export const listCalls = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("coldCalls")
      .withIndex("by_createdAt")
      .order("desc")
      .take(500);
  },
});

export const addCall = mutation({
  args: {
    contactName: v.string(),
    phone: v.string(),
    company: v.string(),
    notes: v.string(),
    createdByUser: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("coldCalls", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const updateCallStatus = mutation({
  args: {
    id: v.id("coldCalls"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const removeCall = mutation({
  args: { id: v.id("coldCalls") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ─── Appointments ───

export const listAppointments = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_createdAt")
      .order("desc")
      .take(500);
  },
});

export const addAppointment = mutation({
  args: {
    contactName: v.string(),
    company: v.string(),
    email: v.string(),
    date: v.string(),
    time: v.string(),
    type: v.string(),
    notes: v.string(),
    createdByUser: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("appointments", {
      ...args,
      status: "scheduled",
      createdAt: Date.now(),
    });
  },
});

export const updateApptStatus = mutation({
  args: {
    id: v.id("appointments"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const removeAppointment = mutation({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ─── Leads ───

export const listLeads = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("crmLeads")
      .withIndex("by_createdAt")
      .order("desc")
      .take(500);
  },
});

export const addLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.string(),
    source: v.string(),
    notes: v.string(),
    createdByUser: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("crmLeads", {
      ...args,
      score: 50,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const updateLeadStatus = mutation({
  args: {
    id: v.id("crmLeads"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const removeLead = mutation({
  args: { id: v.id("crmLeads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
