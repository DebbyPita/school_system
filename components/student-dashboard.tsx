"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  FileText,
  UserPlus,
  Download,
  Printer,
} from "lucide-react";

export function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const students = useQuery(api.students.list) || [];

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Link href="/register">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-500">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 10)} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-500">
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter((s) => s.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.floor(Math.random() * 100)}% of total students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-500">
              New Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(Math.random() * 20)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 5)} from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-500">
              Report Cards Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(Math.random() * 100)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 20)} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Records</CardTitle>
              <CardDescription>
                Manage student records, generate report cards, and print ID
                cards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mt-4 text-lg font-semibold">
                    No students registered
                  </h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Get started by registering a new student.
                  </p>
                  <Link href="/register">
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Student
                    </Button>
                  </Link>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <h3 className="mt-4 text-lg font-semibold">
                    No matching students
                  </h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Try adjusting your search query.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell className="font-medium">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell>STU-{student._id.slice(-6)}</TableCell>
                          <TableCell>Grade {student.grade}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.status === "Active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              student.registrationDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link href={`/students/${student._id}`}>
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                </Link>
                                {/* <Link href={`dashboard/students/${student._id}/edit`}>
                                  <DropdownMenuItem>
                                    Edit Student
                                  </DropdownMenuItem>
                                </Link> */}
                                <Link
                                  href={`/students/${student._id}/report-card`}
                                >
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Generate Report Card
                                  </DropdownMenuItem>
                                </Link>
                                <Link href={`/students/${student._id}/id-card`}>
                                  <DropdownMenuItem>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print ID Card
                                  </DropdownMenuItem>
                                </Link>
                                <Link
                                  href={`/students/${student._id}/clearance`}
                                >
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Clearance Form
                                  </DropdownMenuItem>
                                </Link>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          {/* Similar content as "all" but filtered for active students */}
          <Card>
            <CardHeader>
              <CardTitle>Active Students</CardTitle>
              <CardDescription>
                Currently active students in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents
                      .filter((student) => student.status === "Active")
                      .map((student) => (
                        <TableRow key={student._id}>
                          <TableCell className="font-medium">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell>STU-{student._id.slice(-6)}</TableCell>
                          <TableCell>Grade {student.grade}</TableCell>
                          <TableCell>
                            {new Date(
                              student.registrationDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link href={`/students/${student._id}`}>
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                </Link>
                                <Link
                                  href={`/students/${student._id}/report-card`}
                                >
                                  <DropdownMenuItem>
                                    Generate Report Card
                                  </DropdownMenuItem>
                                </Link>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive">
          {/* Similar content as "all" but filtered for inactive students */}
          <Card>
            <CardHeader>
              <CardTitle>Inactive Students</CardTitle>
              <CardDescription>
                Students who are currently inactive in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents
                      .filter((student) => student.status !== "Active")
                      .map((student) => (
                        <TableRow key={student._id}>
                          <TableCell className="font-medium">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell>STU-{student._id.slice(-6)}</TableCell>
                          <TableCell>Grade {student.grade}</TableCell>
                          <TableCell>
                            {new Date(
                              student.registrationDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link href={`/students/${student._id}`}>
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem>
                                  Activate Student
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
