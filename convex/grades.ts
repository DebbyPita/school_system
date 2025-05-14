import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("grades").collect();
  },
});

export const getByStudentId = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("grades")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .collect();
  },
});

export const getByStudentTermYear = query({
  args: {
    studentId: v.string(),
    term: v.string(),
    academicYear: v.string(),
  },
  handler: async (ctx, args) => {
    const grades = await ctx.db
      .query("grades")
      .filter((q) =>
        q.and(
          q.eq(q.field("studentId"), args.studentId),
          q.eq(q.field("term"), args.term),
          q.eq(q.field("academicYear"), args.academicYear)
        )
      )
      .first();

    return grades;
  },
});

export const create = mutation({
  args: {
    studentId: v.string(),
    term: v.string(),
    academicYear: v.string(),
    grades: v.array(
      v.object({
        subjectId: v.string(),
        score: v.number(),
        grade: v.string(),
        remarks: v.optional(v.string()),
      })
    ),
    teacherRemarks: v.optional(v.string()),
    attendance: v.object({
      present: v.number(),
      absent: v.number(),
      late: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("grades", args);
  },
});

export const update = mutation({
  args: {
    id: v.string(),
    studentId: v.string(),
    term: v.string(),
    academicYear: v.string(),
    grades: v.array(
      v.object({
        subjectId: v.string(),
        score: v.number(),
        grade: v.string(),
        remarks: v.optional(v.string()),
      })
    ),
    teacherRemarks: v.optional(v.string()),
    attendance: v.object({
      present: v.number(),
      absent: v.number(),
      late: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const normalizedId = ctx.db.normalizeId("grades", id);
    if (normalizedId) {
      await ctx.db.patch(normalizedId, rest);
    }
    return id;
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("grades", args.id);
    if (normalizedId) {
      await ctx.db.delete(normalizedId);
    }
    return args.id;
  },
});
