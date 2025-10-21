// convex/tracks.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { useUser } from "@clerk/nextjs";

export const storeTrack = mutation({
  args: {
    userId: v.id("users"),
    userEmail: v.string(),
    value: v.union(v.literal("TVL"), v.literal("Academic")),
  },
  handler: async (ctx, args) => {
    // Upsert: if the user already has a row, overwrite it
    const existing = await ctx.db
      .query("track")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
      return existing._id;
    }

    return await ctx.db.insert("track", {
      userId: args.userId,
      userEmail: args.userEmail,
      value: args.value,
    });
  },
});

export const getAllTracks = query({
  handler: async (ctx) => {
    /* join users table so we can filter only students */
    const tracks = await ctx.db.query("track").collect();
    const users = await ctx.db.query("users").collect();

    const studentIds = new Set(
      users.filter((u) => u.role === "student").map((u) => u._id)
    );

    return tracks.filter((t) => studentIds.has(t.userId));
  },
});
