import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("subjects").collect();
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("subjects", args.id);
    if (!normalizedId) {
      throw new Error("Invalid ID");
    }
    return await ctx.db.get(normalizedId);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    gradeLevel: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subjects", {
      name: args.name,
      code: args.code,
      category: args.category,
      description: args.description,
      gradeLevel: args.gradeLevel,
    });
  },
});

export const update = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    code: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    gradeLevel: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const normalizedId = ctx.db.normalizeId("subjects", id);
    if (!normalizedId) {
      throw new Error("Invalid ID");
    }
    await ctx.db.patch(normalizedId, rest);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("subjects", args.id);
    if (!normalizedId) {
      throw new Error("Invalid ID");
    }
    await ctx.db.delete(normalizedId);
    return args.id;
  },
});
