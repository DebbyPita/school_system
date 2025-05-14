"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

const gradeFormSchema = z.object({
  studentId: z.string().min(1, {
    message: "Student is required.",
  }),
  term: z.string().min(1, {
    message: "Term is required.",
  }),
  academicYear: z.string().min(1, {
    message: "Academic year is required.",
  }),
  grades: z.array(
    z.object({
      subjectId: z.string(),
      score: z.string().refine(
        (val) => {
          const num = Number.parseFloat(val);
          return !isNaN(num) && num >= 0 && num <= 100;
        },
        {
          message: "Score must be a number between 0 and 100",
        }
      ),
      grade: z.string(),
      remarks: z.string().optional(),
    })
  ),
  teacherRemarks: z.string().optional(),
  attendance: z.object({
    present: z.string().refine(
      (val) => {
        const num = Number.parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Present days must be a positive number",
      }
    ),
    absent: z.string().refine(
      (val) => {
        const num = Number.parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Absent days must be a positive number",
      }
    ),
    late: z.string().refine(
      (val) => {
        const num = Number.parseInt(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Late days must be a positive number",
      }
    ),
  }),
});

type GradeFormValues = z.infer<typeof gradeFormSchema>;

// Helper function to convert score to letter grade
function getLetterGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B-";
  if (score >= 60) return "C+";
  if (score >= 55) return "C";
  if (score >= 50) return "C-";
  if (score >= 45) return "D+";
  if (score >= 40) return "D";
  return "F";
}

export function GradeManagement() {
  const convex = useConvex();
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // @typescript-eslint/no-explicit-any
  const [existingGrades, setExistingGrades] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // @typescript-eslint/no-explicit-any
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  // @typescript-eslint/no-explicit-any
  const [gradeValues, setGradeValues] = useState<any[]>([]);

  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      studentId: "",
      term: "",
      academicYear: new Date().getFullYear().toString(),
      grades: [],
      teacherRemarks: "",
      attendance: {
        present: "0",
        absent: "0",
        late: "0",
      },
    },
  });

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
      const [fetchedStudents, fetchedSubjects] = await Promise.all([
        convex.query(api.students.list),
        convex.query(api.subjects.getAll),
      ]);
      setStudents(fetchedStudents);
      setFilteredStudents(fetchedStudents);
      setSubjects(fetchedSubjects);
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchStudentGrades(
    studentId: string,
    term: string,
    academicYear: string
  ) {
    try {
      const grades = await convex.query(api.grades.getByStudentTermYear, {
        studentId,
        term,
        academicYear,
      });

      if (grades) {
        setExistingGrades(grades);

        // Initialize grades for all subjects
        const initialGrades = subjects.map((subject) => {
          const existingGrade = grades.grades.find(
            (
              // @typescript-eslint/no-explicit-any
              g: any) => g.subjectId === subject._id
          );

          return {
            subjectId: subject._id,
            score: existingGrade ? existingGrade.score.toString() : "0",
            grade: existingGrade ? existingGrade.grade : "F",
            remarks: existingGrade ? existingGrade.remarks : "",
          };
        });

        setGradeValues(initialGrades);
        form.setValue("grades", initialGrades);
        form.setValue("teacherRemarks", grades.teacherRemarks || "");
        form.setValue("attendance", {
          present: grades.attendance.present.toString(),
          absent: grades.attendance.absent.toString(),
          late: grades.attendance.late.toString(),
        });
      } else {
        // No existing grades, initialize with empty values
        const initialGrades = subjects.map((subject) => ({
          subjectId: subject._id,
          score: "0",
          grade: "F",
          remarks: "",
        }));

        setGradeValues(initialGrades);
        form.setValue("grades", initialGrades);
        form.setValue("teacherRemarks", "");
        form.setValue("attendance", {
          present: "0",
          absent: "0",
          late: "0",
        });
        setExistingGrades(null);
      }
    } catch (error) {
      toast.error("Failed to fetch student grades");
      console.error(error);

      // Initialize with empty values on error
      const initialGrades = subjects.map((subject) => ({
        subjectId: subject._id,
        score: "0",
        grade: "F",
        remarks: "",
      }));

      setGradeValues(initialGrades);
      form.setValue("grades", initialGrades);
      form.setValue("teacherRemarks", "");
      form.setValue("attendance", {
        present: "0",
        absent: "0",
        late: "0",
      });
      setExistingGrades(null);
    }
  }

  function handleScoreChange(index: number, value: string) {
    // Create a new array with the updated score
    const newGradeValues = [...gradeValues];

    // Parse the score and update the grade
    const score = Number.parseFloat(value);
    if (!isNaN(score) && score >= 0 && score <= 100) {
      const letterGrade = getLetterGrade(score);
      newGradeValues[index] = {
        ...newGradeValues[index],
        score: value,
        grade: letterGrade,
      };
    } else {
      newGradeValues[index] = {
        ...newGradeValues[index],
        score: value,
      };
    }

    // Update the local state
    setGradeValues(newGradeValues);

    // Update the form state
    form.setValue("grades", newGradeValues);
  }

  function handleRemarksChange(index: number, value: string) {
    // Create a new array with the updated remarks
    const newGradeValues = [...gradeValues];
    newGradeValues[index] = {
      ...newGradeValues[index],
      remarks: value,
    };

    // Update the local state
    setGradeValues(newGradeValues);

    // Update the form state
    form.setValue("grades", newGradeValues);
  }

  async function onSubmit(data: GradeFormValues) {
    setIsSubmitting(true);
    try {
      // Format the data for submission
      const formattedData = {
        ...data,
        grades: data.grades.map((grade) => ({
          ...grade,
          score: Number.parseFloat(grade.score) || 0,
        })),
        attendance: {
          present: Number.parseInt(data.attendance.present) || 0,
          absent: Number.parseInt(data.attendance.absent) || 0,
          late: Number.parseInt(data.attendance.late) || 0,
        },
      };

      if (existingGrades) {
        // Update existing grades
        await convex.mutation(api.grades.update, {
          id: existingGrades._id,
          ...formattedData,
        });
        toast.success("Grades updated successfully");
      } else {
        // Create new grades
        await convex.mutation(api.grades.create, formattedData);
        toast.success("Grades saved successfully");
      }

      // Reset form
      form.reset({
        studentId: "",
        term: "",
        academicYear: new Date().getFullYear().toString(),
        grades: [],
        teacherRemarks: "",
        attendance: {
          present: "0",
          absent: "0",
          late: "0",
        },
      });
      setGradeValues([]);
      setExistingGrades(null);
    } catch (error) {
      toast.error("Failed to save grades");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStudentChange(studentId: string) {
    form.setValue("studentId", studentId);

    const term = form.getValues("term");
    const academicYear = form.getValues("academicYear");

    if (studentId && term && academicYear) {
      fetchStudentGrades(studentId, term, academicYear);
    }
  }

  function handleTermChange(term: string) {
    form.setValue("term", term);

    const studentId = form.getValues("studentId");
    const academicYear = form.getValues("academicYear");

    if (studentId && term && academicYear) {
      fetchStudentGrades(studentId, term, academicYear);
    }
  }

  function handleYearChange(year: string) {
    form.setValue("academicYear", year);

    const studentId = form.getValues("studentId");
    const term = form.getValues("term");

    if (studentId && term && year) {
      fetchStudentGrades(studentId, term, year);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter Student Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>

                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student</FormLabel>
                        <Select
                          onValueChange={(value) => handleStudentChange(value)}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select student" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {filteredStudents.map((student) => (
                              <SelectItem key={student._id} value={student._id}>
                                {student.firstName} {student.lastName} (
                                {student.grade})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Term</FormLabel>
                      <Select
                        onValueChange={(value) => handleTermChange(value)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Term 1">Term 1</SelectItem>
                          <SelectItem value="Term 2">Term 2</SelectItem>
                          <SelectItem value="Term 3">Term 3</SelectItem>
                          <SelectItem value="Final">Final</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="academicYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Year</FormLabel>
                      <Select
                        onValueChange={(value) => handleYearChange(value)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}-{year + 1}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("studentId") &&
                form.watch("term") &&
                form.watch("academicYear") && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Subject Grades</h3>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]">Subject</TableHead>
                            <TableHead className="w-[100px]">
                              Score (%)
                            </TableHead>
                            <TableHead className="w-[100px]">Grade</TableHead>
                            <TableHead>Remarks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subjects.map((subject, index) => (
                            <TableRow key={subject._id}>
                              <TableCell className="font-medium">
                                {subject.name} ({subject.code})
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={gradeValues[index]?.score || "0"}
                                  onChange={(e) =>
                                    handleScoreChange(index, e.target.value)
                                  }
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                {gradeValues[index]?.grade || "F"}
                              </TableCell>
                              <TableCell>
                                <Input
                                  placeholder="Subject remarks"
                                  value={gradeValues[index]?.remarks || ""}
                                  onChange={(e) =>
                                    handleRemarksChange(index, e.target.value)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="attendance.present"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days Present</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="attendance.absent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days Absent</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="attendance.late"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days Late</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="teacherRemarks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teacher Remarks</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Overall performance remarks"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Grades
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
