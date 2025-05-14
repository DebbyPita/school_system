import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  students: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    dateOfBirth: v.string(),
    gender: v.string(),
    grade: v.string(),
    parentName: v.string(),
    parentPhone: v.string(),
    parentEmail: v.string(),
    emergencyContact: v.string(),
    medicalInformation: v.optional(v.string()),
    registrationDate: v.string(),
    status: v.string(),
  }),

  subjects: defineTable({
    name: v.string(),
    code: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    gradeLevel: v.string(),
  }),

  grades: defineTable({
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
  }),

  departments: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    officerName: v.string(),
    officerTitle: v.string(),
  }),

  clearanceItems: defineTable({
    departmentId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
  }),

  studentClearances: defineTable({
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
  }),
});
