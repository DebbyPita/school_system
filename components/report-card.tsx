"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function ReportCard({
  studentId,
  term,
  academicYear,
}: {
  studentId: string;
  term: string;
  academicYear: string;
}) {
  const router = useRouter();
  const convex = useConvex();
  const [student, setStudent] = useState<any | null>(null);
  const [grades, setGrades] = useState<any | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (studentId && term && academicYear) {
      fetchData();
    }
  }, [studentId, term, academicYear]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [fetchedStudent, fetchedGrades, fetchedSubjects] =
        await Promise.all([
          convex.query(api.students.getById, {
            id: studentId as Id<"students">,
          }),
          convex.query(api.grades.getByStudentTermYear, {
            studentId,
            term,
            academicYear,
          }),
          convex.query(api.subjects.getAll),
        ]);

      setStudent(fetchedStudent);
      setGrades(fetchedGrades);
      setSubjects(fetchedSubjects);
    } catch (error) {
      toast.error("Failed to fetch report card data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function calculateAverage() {
    if (!grades || !grades.grades || grades.grades.length === 0) return "0.00";

    const totalScore = grades.grades.reduce(
      (sum: number, grade: any) => sum + grade.score,
      0
    );
    return (totalScore / grades.grades.length).toFixed(2);
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student || !grades) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-center text-muted-foreground">
          Report card data not found for this student for the selected term and
          academic year.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Report Card
        </Button>
      </div>

      <Card className="border-2 print:border-0">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">SCHOOL MANAGEMENT SYSTEM</h1>
              <h2 className="text-xl font-semibold">STUDENT REPORT CARD</h2>
              <p className="text-muted-foreground">
                {term} - Academic Year {academicYear}
              </p>
            </div>

            {/* Student Information */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <p>
                  <span className="font-semibold">Student Name:</span>{" "}
                  {student.firstName} {student.lastName}
                </p>
                <p>
                  <span className="font-semibold">Grade/Class:</span>{" "}
                  {student.grade}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Student ID:</span>{" "}
                  {student._id.slice(-8).toUpperCase()}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Grades */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Academic Performance
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2">
                    <th className="py-2 text-left">Subject</th>
                    <th className="py-2 text-center">Score (%)</th>
                    <th className="py-2 text-center">Grade</th>
                    <th className="py-2 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.grades.map((grade: any) => {
                    const subject = subjects.find(
                      (s) => s._id === grade.subjectId
                    );
                    return (
                      <tr key={grade.subjectId} className="border-b">
                        <td className="py-2">
                          {subject ? subject.name : "Unknown Subject"}
                        </td>
                        <td className="py-2 text-center">{grade.score}</td>
                        <td className="py-2 text-center">{grade.grade}</td>
                        <td className="py-2">{grade.remarks || "-"}</td>
                      </tr>
                    );
                  })}
                  <tr className="border-b font-semibold">
                    <td className="py-2">Average</td>
                    <td className="py-2 text-center">{calculateAverage()}</td>
                    <td className="py-2 text-center">
                      {parseFloat(calculateAverage()) >= 90
                        ? "A+"
                        : parseFloat(calculateAverage()) >= 80
                          ? "A"
                          : parseFloat(calculateAverage()) >= 70
                            ? "B"
                            : parseFloat(calculateAverage()) >= 60
                              ? "C"
                              : parseFloat(calculateAverage()) >= 50
                                ? "D"
                                : "F"}
                    </td>
                    <td className="py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Attendance */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Attendance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-md border p-4 text-center">
                  <p className="text-lg font-semibold">
                    {grades.attendance.present}
                  </p>
                  <p className="text-sm text-muted-foreground">Days Present</p>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-lg font-semibold">
                    {grades.attendance.absent}
                  </p>
                  <p className="text-sm text-muted-foreground">Days Absent</p>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <p className="text-lg font-semibold">
                    {grades.attendance.late}
                  </p>
                  <p className="text-sm text-muted-foreground">Days Late</p>
                </div>
              </div>
            </div>

            {/* Teacher Remarks */}
            <div>
              <h3 className="mb-2 text-lg font-semibold">Teacher's Remarks</h3>
              <div className="rounded-md border p-4">
                <p>{grades.teacherRemarks || "No remarks provided."}</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-8 grid grid-cols-2 gap-8 pt-8">
              <div className="border-t pt-2 text-center">
                <p className="text-sm text-muted-foreground">Class Teacher</p>
              </div>
              <div className="border-t pt-2 text-center">
                <p className="text-sm text-muted-foreground">Principal</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
