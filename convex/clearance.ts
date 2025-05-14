import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Department functions
export const getAllDepartments = query({
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

export const getDepartmentById = query({
  args: { id: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createDepartment = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    officerName: v.string(),
    officerTitle: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("departments", args);
  },
});

export const updateDepartment = mutation({
  args: {
    id: v.id("departments"),
    name: v.string(),
    description: v.optional(v.string()),
    officerName: v.string(),
    officerTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
    return id;
  },
});

export const removeDepartment = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // First, delete all clearance items associated with this department
    const items = await ctx.db
      .query("clearanceItems")
      .filter((q) => q.eq(q.field("departmentId"), args.id))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    // Then delete the department
    const normalizedId = ctx.db.normalizeId("departments", args.id);
    if (normalizedId) {
      await ctx.db.delete(normalizedId);
    }
    return args.id;
  },
});

// Clearance Item functions
export const getAllItems = query({
  handler: async (ctx) => {
    return await ctx.db.query("clearanceItems").collect();
  },
});

export const getItemsByDepartment = query({
  args: { departmentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("clearanceItems")
      .filter((q) => q.eq(q.field("departmentId"), args.departmentId))
      .collect();
  },
});

export const createItem = mutation({
  args: {
    departmentId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("clearanceItems", args);
  },
});

export const updateItem = mutation({
  args: {
    id: v.id("clearanceItems"),
    departmentId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
    return id;
  },
});

export const removeItem = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("clearanceItems", args.id);
    if (normalizedId) {
      await ctx.db.delete(normalizedId);
    }
    return args.id;
  },
});
