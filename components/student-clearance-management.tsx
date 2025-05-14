"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Check, Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

export function StudentClearanceManagement() {
  const convex = useConvex();
  // @typescript-eslint/no-explicit-any
  const [students, setStudents] = useState<any[]>([]);
  // @typescript-eslint/no-explicit-any
  const [departments, setDepartments] = useState<any[]>([]);
  // @typescript-eslint/no-explicit-any
  const [clearanceItems, setClearanceItems] = useState<any[]>([]);
  // @typescript-eslint/no-explicit-any
  const [studentClearances, setStudentClearances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // @typescript-eslint/no-explicit-any
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  // @typescript-eslint/no-explicit-any
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // @typescript-eslint/no-explicit-any
  const [processingDepartment, setProcessingDepartment] = useState<any | null>(
    null
  );
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter students based on search query
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStudents(
        students.filter(
          (student) =>
            student.firstName.toLowerCase().includes(query) ||
            student.lastName.toLowerCase().includes(query) ||
            student.grade.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, students]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [
        fetchedStudents,
        fetchedDepartments,
        fetchedItems,
        fetchedClearances,
      ] = await Promise.all([
        convex.query(api.students.list),
        convex.query(api.clearance.getAllDepartments),
        convex.query(api.clearance.getAllItems),
        convex.query(api.studentClearance.getAll),
      ]);
      setStudents(fetchedStudents);
      setFilteredStudents(fetchedStudents);
      setDepartments(fetchedDepartments);
      setClearanceItems(fetchedItems);
      setStudentClearances(fetchedClearances);
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleViewClearance(
    // @typescript-eslint/no-explicit-any
    student: any
  ) {
    setSelectedStudent(student);
  }

  function handleProcessClearance(
    // @typescript-eslint/no-explicit-any
    student: any,
    // @typescript-eslint/no-explicit-any
    department: any
  ) {
    console.log(
      "Processing clearance for:",
      student.firstName,
      "Department:",
      department.name
    );
    setSelectedStudent(student);
    setProcessingDepartment(department);
    setRemarks("");
    setIsDialogOpen(true);
  }

  async function handleSubmitClearance(status: "cleared" | "not_cleared") {
    if (!selectedStudent || !processingDepartment) {
      console.error("Missing student or department for clearance submission");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting clearance:", {
        student: selectedStudent.firstName,
        department: processingDepartment.name,
        status,
        remarks,
      });

      // Check if clearance record exists for this student
      const existingClearance = studentClearances.find(
        (c) => c.studentId === selectedStudent._id
      );

      if (existingClearance) {
        // Update existing clearance record
        const departmentClearances =
          existingClearance.departmentClearances || [];
        const departmentIndex = departmentClearances.findIndex(
          (
            // @typescript-eslint/no-explicit-any
            dc: any
          ) => dc.departmentId === processingDepartment._id
        );

        const updatedDepartmentClearances = [...departmentClearances];

        if (departmentIndex >= 0) {
          // Update existing department clearance
          updatedDepartmentClearances[departmentIndex] = {
            ...updatedDepartmentClearances[departmentIndex],
            status,
            remarks,
            officerName: processingDepartment.officerName,
            officerTitle: processingDepartment.officerTitle,
            date: new Date().toISOString(),
          };
        } else {
          // Add new department clearance
          updatedDepartmentClearances.push({
            departmentId: processingDepartment._id,
            status,
            remarks,
            officerName: processingDepartment.officerName,
            officerTitle: processingDepartment.officerTitle,
            date: new Date().toISOString(),
          });
        }

        await convex.mutation(api.studentClearance.update, {
          id: existingClearance._id,
          departmentClearances: updatedDepartmentClearances,
        });
      } else {
        // Create new clearance record
        await convex.mutation(api.studentClearance.create, {
          studentId: selectedStudent._id,
          academicYear: new Date().getFullYear().toString(),
          departmentClearances: [
            {
              departmentId: processingDepartment._id,
              status,
              remarks,
              officerName: processingDepartment.officerName,
              officerTitle: processingDepartment.officerTitle,
              date: new Date().toISOString(),
            },
          ],
        });
      }

      toast.success(
        `Student ${status === "cleared" ? "cleared" : "not cleared"} for ${processingDepartment.name}`
      );
      setIsDialogOpen(false);
      await fetchData(); // Refresh data after update
    } catch (error) {
      toast.error("Failed to process clearance");
      console.error("Clearance submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function getDepartmentClearanceStatus(
    studentId: string,
    departmentId: string
  ) {
    const clearance = studentClearances.find((c) => c.studentId === studentId);
    if (!clearance || !clearance.departmentClearances) return null;

    const departmentClearance = clearance.departmentClearances.find(
      (
        // @typescript-eslint/no-explicit-any
        dc: any
      ) => dc.departmentId === departmentId
    );
    return departmentClearance;
  }

  function isStudentFullyCleared(studentId: string) {
    const clearance = studentClearances.find((c) => c.studentId === studentId);
    if (!clearance || !clearance.departmentClearances) return false;

    // Check if all departments have cleared the student
    return (
      departments.length > 0 &&
      departments.every((dept) => {
        const deptClearance = clearance.departmentClearances.find(
          (
            // @typescript-eslint/no-explicit-any
            dc: any
          ) => dc.departmentId === dept._id
        );
        return deptClearance && deptClearance.status === "cleared";
      })
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Clearance Status: {selectedStudent.firstName}{" "}
            {selectedStudent.lastName}
          </h2>
          <Button variant="outline" onClick={() => setSelectedStudent(null)}>
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Department Clearance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => {
                  const clearanceStatus = getDepartmentClearanceStatus(
                    selectedStudent._id,
                    department._id
                  );

                  return (
                    <TableRow key={department._id}>
                      <TableCell className="font-medium">
                        {department.name}
                      </TableCell>
                      <TableCell>
                        {clearanceStatus
                          ? clearanceStatus.officerName
                          : department.officerName}
                      </TableCell>
                      <TableCell>
                        {clearanceStatus ? (
                          clearanceStatus.status === "cleared" ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                              <Check className="mr-1 h-3 w-3" />
                              Cleared
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                              <X className="mr-1 h-3 w-3" />
                              Not Cleared
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {clearanceStatus
                          ? new Date(clearanceStatus.date).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {clearanceStatus ? clearanceStatus.remarks : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => {
                            handleProcessClearance(selectedStudent, department);
                          }}
                        >
                          Process
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clearance Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {departments.map((department) => {
                const departmentItems = clearanceItems.filter(
                  (item) => item.departmentId === department._id
                );

                if (departmentItems.length === 0) return null;

                return (
                  <div key={department._id} className="space-y-4">
                    <h3 className="text-lg font-medium">{department.name}</h3>
                    <ul className="list-inside list-disc space-y-2 pl-4">
                      {departmentItems.map((item) => (
                        <li key={item._id}>
                          <span className="font-medium">{item.name}</span>
                          {item.description && (
                            <span className="text-muted-foreground">
                              {" "}
                              - {item.description}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Process Clearance Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Process Clearance</DialogTitle>
              <DialogDescription>
                {selectedStudent && processingDepartment
                  ? `Process clearance for ${selectedStudent.firstName} ${selectedStudent.lastName} in ${processingDepartment.name} department.`
                  : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Clearance Items:</h3>
                <ul className="list-inside list-disc space-y-1 pl-4 text-sm">
                  {processingDepartment &&
                    clearanceItems
                      .filter(
                        (item) => item.departmentId === processingDepartment._id
                      )
                      .map((item) => <li key={item._id}>{item.name}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Remarks:</label>
                <Textarea
                  placeholder="Enter any remarks or notes"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="resize-none mt-2"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleSubmitClearance("not_cleared")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <X className="mr-2 h-4 w-4" />
                )}
                Not Cleared
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={() => handleSubmitClearance("cleared")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Cleared
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Clearance Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Clearance Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const isCleared = isStudentFullyCleared(student._id);
                  const clearance = studentClearances.find(
                    (c) => c.studentId === student._id
                  );
                  const clearedDepartments = clearance
                    ? clearance.departmentClearances.filter(
                        (
                          // @typescript-eslint/no-explicit-any
                          dc: any
                        ) => dc.status === "cleared"
                      ).length
                    : 0;

                  return (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        {isCleared ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                            <Check className="mr-1 h-3 w-3" />
                            Fully Cleared
                          </span>
                        ) : clearance ? (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            {clearedDepartments}/{departments.length}{" "}
                            Departments
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                            Not Started
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewClearance(student)}
                        >
                          View Clearance
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
