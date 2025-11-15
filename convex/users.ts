import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", {
      ...args,
      role: "guest",
    });
  },
});

export const getUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const users = await ctx.db.query("users").collect();

    return users;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

export const updateUserRole = mutation({
  args: {
    clerkId: v.string(),
    updatedRole: v.union(
      v.literal("guest"),
      v.literal("student"),
      v.literal("teacher"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.patch(user._id, {
      role: args.updatedRole,
    });
  },
});

export const getUsersByRole = query({
  args: {
    role: v.union(
      v.literal("student"),
      v.literal("teacher"),
      v.literal("admin")
    ),
    searchTerm: v.optional(v.string()),
    page: v.number(),
    itemsPerPage: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.auth.getUserIdentity();

    // Get users by role
    let users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), args.role))
      .collect();

    // Apply search
    if (args.searchTerm) {
      const term = args.searchTerm.toLowerCase();
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    // Get all interviews once
    const allInterviews = await ctx.db.query("interviews").collect();

    // Enrich users with interviews
    const usersWithInterviews = users.map((user) => {
      const userInterviews = allInterviews.filter((interview) =>
        args.role === "student"
          ? interview.candidateId === user.clerkId
          : interview.interviewerIds.includes(user.clerkId)
      );

      return {
        ...user,
        interviews: userInterviews,
        interviewCount: userInterviews.length,
      };
    });

    // Sort by interview count
    usersWithInterviews.sort((a, b) => b.interviewCount - a.interviewCount);

    // Paginate
    const totalCount = usersWithInterviews.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / args.itemsPerPage));
    const start = (args.page - 1) * args.itemsPerPage;

    return {
      users: usersWithInterviews.slice(start, start + args.itemsPerPage),
      totalCount,
      totalPages,
    };
  },
});
