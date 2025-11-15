import { redirect } from "next/navigation";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

const belongsToCategory = (
  interview: Doc<"interviews">,
  category: string,
  now: number
) => {
  const interviewTime = interview.startTime;

  if (category === "succeeded") return interview.status === "succeeded";
  if (category === "failed") return interview.status === "failed";
  if (category === "completed") {
    return (
      interview.status === "completed" ||
      (interview.status !== "succeeded" &&
        interview.status !== "failed" &&
        interviewTime < now)
    );
  }
  if (category === "upcoming") {
    return (
      interview.status !== "succeeded" &&
      interview.status !== "failed" &&
      interviewTime > now
    );
  }
  return false;
};

export const getAllInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      redirect("/sign-in");
    }

    const interviews = await ctx.db.query("interviews").collect();

    return interviews;
  },
});

export const getMyInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", identity.subject)
      )
      .collect();

    return interviews!;
  },
});

export const getInterviewByStreamCallId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) =>
        q.eq("streamCallId", args.streamCallId)
      )
      .first();
  },
});

export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db.insert("interviews", {
      ...args,
    });
  },
});

export const updateInterviewStatus = mutation({
  args: {
    id: v.id("interviews"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      ...(args.status === "completed" ? { endTime: Date.now() } : {}), // set the end time to time now once interview status is completed
    });
  },
});

export const updateInterviewAiFeedback = mutation({
  args: {
    id: v.id("interviews"),
    studentAnswer: v.string(),
    aiFeedback: v.object({
      feedback: v.string(),
      rating: v.number(),
      suggestions: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      studentAnswer: args.studentAnswer,
      aiFeedback: args.aiFeedback,
    });
  },
});

export const deleteInterview = mutation({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const interview = await ctx.db.get(args.interviewId);
    if (!interview) throw new Error("Interview not found");

    await ctx.db.delete(args.interviewId);

    const commentsToDelete = await ctx.db
      .query("comments") // Replace "comments" with your actual comments table name
      .filter((q) => q.eq(q.field("interviewId"), args.interviewId))
      .collect();

    await Promise.all(
      commentsToDelete.map((comment) => ctx.db.delete(comment._id))
    );
  },
});

export const getInterviewsByCategory = query({
  args: {
    category: v.union(
      v.literal("upcoming"),
      v.literal("completed"),
      v.literal("succeeded"),
      v.literal("failed")
    ),
    searchTerm: v.optional(v.string()),
    page: v.number(),
    itemsPerPage: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.auth.getUserIdentity(); // Auth check
    const now = Date.now();

    // Get all interviews (your existing getAllInterviews logic)
    const allInterviews = await ctx.db.query("interviews").collect();

    // Filter by category
    let filtered = allInterviews.filter((interview) =>
      belongsToCategory(interview, args.category, now)
    );

    // Apply search
    if (args.searchTerm) {
      const term = args.searchTerm.toLowerCase();
      const users = await ctx.db.query("users").collect();

      filtered = filtered.filter((interview) => {
        const candidate = users.find(
          (u) => u.clerkId === interview.candidateId
        );
        const candidateName = candidate?.name || "";

        return (
          candidateName.toLowerCase().includes(term) ||
          interview.title.toLowerCase().includes(term) ||
          (interview.description || "").toLowerCase().includes(term)
        );
      });
    }

    // Paginate
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / args.itemsPerPage));
    const start = (args.page - 1) * args.itemsPerPage;

    return {
      interviews: filtered.slice(start, start + args.itemsPerPage),
      totalCount,
      totalPages,
    };
  },
});

export const getScheduleInterviews = query({
  args: {
    searchTerm: v.optional(v.string()),
    page: v.number(),
    itemsPerPage: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.auth.getUserIdentity(); // Auth check
    const now = Date.now();

    // Get all interviews and users
    const allInterviews = await ctx.db.query("interviews").collect();
    const users = await ctx.db.query("users").collect();

    // Apply search filter
    let filtered = allInterviews;
    if (args.searchTerm) {
      const term = args.searchTerm.toLowerCase();
      filtered = allInterviews.filter((interview) => {
        const candidate = users.find(
          (u) => u.clerkId === interview.candidateId
        );
        const candidateName = candidate?.name || "";

        return (
          candidateName.toLowerCase().includes(term) ||
          interview.title.toLowerCase().includes(term) ||
          (interview.description || "").toLowerCase().includes(term)
        );
      });
    }

    // Sort by start time (newest first)
    filtered.sort((a, b) => b.startTime - a.startTime);

    // Paginate
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / args.itemsPerPage));
    const start = (args.page - 1) * args.itemsPerPage;

    return {
      interviews: filtered.slice(start, start + args.itemsPerPage),
      totalCount,
      totalPages,
    };
  },
});
