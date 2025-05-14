import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(),
    gender: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    grade: v.string(),
    parentName: v.string(),
    parentPhone: v.string(),
    parentEmail: v.string(),
    emergencyContact: v.string(),
    medicalInformation: v.string(),
    registrationDate: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const studentId = await ctx.db.insert("students", {
      firstName: args.firstName,
      lastName: args.lastName,
      dateOfBirth: args.dateOfBirth,
      gender: args.gender,
      email: args.email,
      phone: args.phone,
      address: args.address,
      grade: args.grade,
      parentName: args.parentName,
      emergencyContact: args.emergencyContact,
      parentEmail: args.parentEmail,
      parentPhone: args.parentPhone,
      medicalInformation: args.medicalInformation,
      registrationDate: args.registrationDate,
      status: args.status,
    });
    return studentId;
  },
});

export const update = mutation({
  args: {
    id: v.id("students"),
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.string(),
    gender: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    grade: v.string(),
    parentName: v.string(),
    parentPhone: v.string(),
    emergencyContact: v.string(),
    medicalInformation: v.string(),
    registrationDate: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
    return id;
  },
});

export const getById = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("students").collect();
  },
});

export const remove = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
