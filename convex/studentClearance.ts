import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("studentClearances").collect();
  },
});

export const getByStudentId = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("studentClearances")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .first();
  },
});

export const create = mutation({
  args: {
    studentId: v.string(),
    academicYear: v.string(),
    departmentClearances: v.array(
      v.object({
        departmentId: v.string(),
        status: v.string(),
        remarks: v.optional(v.string()),
        officerName: v.string(),
        officerTitle: v.string(),
        date: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("studentClearances", args);
  },
});

export const update = mutation({
  args: {
    id: v.string(),
    departmentClearances: v.array(
      v.object({
        departmentId: v.string(),
        status: v.string(),
        remarks: v.optional(v.string()),
        officerName: v.string(),
        officerTitle: v.string(),
        date: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const normalizedId = ctx.db.normalizeId("studentClearances", id);
    if (normalizedId) {
      await ctx.db.patch(normalizedId, rest);
    }
    return id;
  },
});
