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

export function ClearanceForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const convex = useConvex();
  const [student, setStudent] = useState<any | null>(null);
  const [clearance, setClearance] = useState<any | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [studentId]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [fetchedStudent, fetchedClearances, fetchedDepartments] =
        await Promise.all([
          convex.query(api.students.getById, {
            id: studentId as Id<"students">,
          }),
          convex.query(api.studentClearance.getByStudentId, { studentId }),
          convex.query(api.clearance.getAllDepartments),
        ]);

      setStudent(fetchedStudent);
      setClearance(fetchedClearances);
      setDepartments(fetchedDepartments);
    } catch (error) {
      toast.error("Failed to fetch clearance data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function isStudentFullyCleared() {
    if (!clearance) return false;

    // Check if all departments have cleared the student
    return (
      departments.length > 0 &&
      departments.every((dept) => {
        const deptClearance = clearance.departmentClearances.find(
          (dc: any) => dc.departmentId === dept._id
        );
        return deptClearance && deptClearance.status === "cleared";
      })
    );
  }

  function getDepartmentClearance(departmentId: string) {
    if (!clearance) return null;

    return clearance.departmentClearances.find(
      (dc: any) => dc.departmentId === departmentId
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student || !clearance || !isStudentFullyCleared()) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-center text-muted-foreground">
          {!student
            ? "Student not found."
            : !clearance
              ? "Clearance data not found for this student."
              : "Student has not been fully cleared by all departments."}
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-10">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Clearance Form
        </Button>
      </div>

      <Card className="border-2 print:border-0">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">SCHOOL MANAGEMENT SYSTEM</h1>
              <h2 className="text-xl font-semibold">STUDENT CLEARANCE FORM</h2>
              <p className="text-muted-foreground">
                Academic Year {clearance.academicYear}
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

            {/* Clearance Status */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Departmental Clearance
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2">
                    <th className="py-2 text-left">Department</th>
                    <th className="py-2 text-left">Officer</th>
                    <th className="py-2 text-left">Title</th>
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department) => {
                    const deptClearance = getDepartmentClearance(
                      department._id
                    );
                    return (
                      <tr key={department._id} className="border-b">
                        <td className="py-2 font-medium">{department.name}</td>
                        <td className="py-2">
                          {deptClearance
                            ? deptClearance.officerName
                            : department.officerName}
                        </td>
                        <td className="py-2">
                          {deptClearance
                            ? deptClearance.officerTitle
                            : department.officerTitle}
                        </td>
                        <td className="py-2">
                          {deptClearance
                            ? new Date(deptClearance.date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="py-2">
                          {deptClearance ? deptClearance.remarks : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Certification */}
            <div className="rounded-md border p-4">
              <p className="text-center">
                This is to certify that the above-named student has been cleared
                by all departments and is free from any outstanding obligations
                to the school.
              </p>
            </div>

            {/* Signatures */}
            <div className="mt-8 grid grid-cols-3 gap-8 pt-8">
              <div className="border-t pt-2 text-center">
                <p className="text-sm text-muted-foreground">Principal</p>
              </div>
              <div className="border-t pt-2 text-center">
                <p className="text-sm text-muted-foreground">Registrar</p>
              </div>
              <div className="border-t pt-2 text-center">
                <p className="text-sm text-muted-foreground">Finance Officer</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
