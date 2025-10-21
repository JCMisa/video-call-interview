import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(
      v.literal("guest"),
      v.literal("student"),
      v.literal("teacher"),
      v.literal("admin")
    ),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    studentAnswer: v.optional(v.string()),
    aiFeedback: v.optional(
      v.object({
        feedback: v.string(),
        rating: v.number(),
        suggestions: v.optional(v.string()),
      })
    ),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  })
    .index("by_candidate_id", ["candidateId"])
    .index("by_stream_call_id", ["streamCallId"]),

  comments: defineTable({
    content: v.string(),
    rating: v.number(),
    interviewerId: v.string(),
    interviewId: v.id("interviews"),
  }).index("by_interview_id", ["interviewId"]),

  roleChange: defineTable({
    requestedBy: v.string(),
    requestorName: v.optional(v.string()),
    currentRole: v.string(),
    requestedRole: v.string(),
    requestReason: v.optional(v.string()),
    requestProof: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
  }).index("by_requested_by", ["requestedBy"]),

  track: defineTable({
    userId: v.id("users"),
    userEmail: v.string(),
    value: v.union(v.literal("TVL"), v.literal("Academic")),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_email", ["userEmail"]),
});
