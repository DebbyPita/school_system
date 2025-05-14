"use client";

import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Printer, Download } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export function IdCard({ studentId }: { studentId: string }) {
  const student = useQuery(api.students.getById, {
    id: studentId as Id<"students">,
  });
  const idCardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!student) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/students/${studentId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Student ID Card</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md" ref={idCardRef}>
          <Card className="overflow-hidden print:shadow-none">
            <div className="bg-primary p-4 text-center text-primary-foreground">
              <div className="flex items-center justify-center gap-2">
                <Image
                  src="/logo.png"
                  alt="School Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <h2 className="text-xl font-bold">School Management System</h2>
              </div>
              <p className="mt-1 text-sm">Student Identification Card</p>
            </div>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt={`${student.firstName} ${student.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Student Name
                    </p>
                    <p className="font-semibold">
                      {student.firstName} {student.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Student ID</p>
                    <p className="font-semibold">STU-{studentId.slice(-6)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Grade</p>
                    <p className="font-semibold">Grade {student.grade}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p>{student.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p>{student.gender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p>{student.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Emergency Contact</p>
                  <p>{student.emergencyContact}</p>
                </div>
              </div>

              <div className="mt-4 rounded-md bg-muted p-3 text-center text-sm">
                <p>If found, please return to:</p>
                <p className="font-medium">School Management System</p>
                <p>123 School Street, City, State 12345</p>
                <p>Phone: (123) 456-7890</p>
              </div>

              <div className="mt-4 text-center text-xs text-muted-foreground">
                <p>Valid for Academic Year 2023-2024</p>
                <p>This card is the property of the School Management System</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
