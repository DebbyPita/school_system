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
import { GraduationCap, ClipboardList, FileText, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-20 dark:from-gray-900 dark:to-background px-[100px]">
        <div className="container flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-[500px] space-y-4">
            <h1 className="text-4xl text-green-500 font-bold tracking-tight sm:text-5xl">
              School Management System
            </h1>
            <p className="text-lg text-muted-foreground">
              A comprehensive platform for student registration, report cards,
              and academic management.
            </p>
            <div className="flex gap-4">
              <Link href="/register">
                <Button size="lg">Register Student</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[200px] w-[200px] md:h-[250px] md:w-[250px]">
            <Image
              src="/logo.png"
              alt="School Management"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-10">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl text-green-500 font-bold">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <GraduationCap className="h-6 w-6 text-green-500" />
                <CardTitle className="text-green-500">Student Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Streamlined registration process for new and returning
                  students with all necessary information.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <ClipboardList className="h-6 w-6 text-green-500" />
                <CardTitle className="text-green-500">Report Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate comprehensive report cards with grades, attendance,
                  and teacher comments.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <FileText className="h-6 w-6 text-green-500" />
                <CardTitle className="text-green-500">Clearance Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Digital clearance forms for students with approval workflows
                  and tracking.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Users className="h-6 w-6 text-green-500" />
                <CardTitle className="text-green-500">Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive dashboard for administrators to manage students,
                  classes, and reports.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white/90">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl text-green-500 font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-lg">
            Join our school management system and streamline your administrative
            processes.
          </p>
          <Link href="/login">
            <Button size="lg" variant="default">
              Login to Admin Panel
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
