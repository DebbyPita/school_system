"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, FileText, Printer, PenSquare } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export function StudentProfile({ studentId }: { studentId: string }) {
  const student = useQuery(api.students.getById, {
    id: studentId as Id<"students">,
  });

  if (!student) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-10">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-green-500">Student Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt={`${student.firstName} ${student.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <CardTitle className="text-center text-xl">
              {student.firstName} {student.lastName}
            </CardTitle>
            <CardDescription className="text-center">
              Student ID: STU-{studentId.slice(-6)}
              <div className="mt-2">
                <Badge
                  variant={
                    student.status === "Active" ? "default" : "secondary"
                  }
                >
                  {student.status}
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Grade:</span>
                <span className="font-medium">Grade {student.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Date of Birth:
                </span>
                <span className="font-medium">{student.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Gender:</span>
                <span className="font-medium">{student.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Registration Date:
                </span>
                <span className="font-medium">
                  {new Date(student.registrationDate).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                {/* <Link href={`dashboard/students/${studentId}/edit`}>
                  <Button variant="outline" className="w-full justify-start text-green-500">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Edit Student
                  </Button>
                </Link> */}
                <Link href={`/students/${studentId}/report-card`}>
                  <Button variant="outline" className="w-full justify-start text-green-500">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report Card
                  </Button>
                </Link>
                <Link href={`/students/${studentId}/id-card`}>
                  <Button variant="outline" className="w-full justify-start text-green-500">
                    <Printer className="mr-2 h-4 w-4" />
                    Print ID Card
                  </Button>
                </Link>
                <Link href={`/students/${studentId}/clearance`}>
                  <Button variant="outline" className="w-full justify-start text-green-500">
                    <FileText className="mr-2 h-4 w-4" />
                    Clearance Form
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Contact Information
                        </h3>
                        <div className="mt-2 space-y-2">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Email:
                            </span>
                            <p>{student.email}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Phone:
                            </span>
                            <p>{student.phone}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Address:
                            </span>
                            <p>{student.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Parent/Guardian Information
                        </h3>
                        <div className="mt-2 space-y-2">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Parent/Guardian Name:
                            </span>
                            <p>{student.parentName}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Parent/Guardian Phone:
                            </span>
                            <p>{student.parentPhone}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Emergency Contact:
                            </span>
                            <p>{student.emergencyContact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Medical Information
                    </h3>
                    <p className="mt-2">
                      {student.medicalInformation ||
                        "No medical information provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="academic" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>
                    Student's academic records, grades, and performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-muted-foreground">
                      Academic records will be displayed here once grades are
                      entered.
                    </p>
                    <div className="mt-4">
                      <Link href={`/students/${studentId}/report-card`}>
                        <Button>
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Report Card
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="attendance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                  <CardDescription>
                    Student's attendance history and statistics.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-muted-foreground">
                      Attendance records will be displayed here once data is
                      available.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
