import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addRoleChangeRequest = mutation({
  args: {
    requestedBy: v.string(),
    requestorName: v.string(),
    currentRole: v.string(),
    requestedRole: v.string(),
    requestReason: v.string(),
    requestProof: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("roleChange", {
      requestedBy: args.requestedBy,
      requestorName: args.requestorName,
      currentRole: args.currentRole,
      requestedRole: args.requestedRole,
      requestReason: args.requestReason,
      requestProof: args.requestProof,
      status: "pending",
    });
  },
});

export const getAllRequests = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const requests = await ctx.db.query("roleChange").collect();

    return requests;
  },
});

export const getUserRequests = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const userRequests = await ctx.db
      .query("roleChange")
      .withIndex("by_requested_by", (q) => q.eq("requestedBy", args.clerkId))
      .collect();

    return userRequests;
  },
});

export const getRequestById = query({
  args: { requestId: v.string() },
  handler: async (ctx, args) => {
    const request = await ctx.db
      .query("roleChange")
      .filter((q) => q.eq(q.field("_id"), args.requestId))
      .first();

    return request;
  },
});

export const updateRequestStatus = mutation({
  args: {
    id: v.id("roleChange"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});
