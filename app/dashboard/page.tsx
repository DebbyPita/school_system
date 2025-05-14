import { StudentDashboard } from "@/components/student-dashboard";

export default function DashboardPage() {
  return (
    <div className="container py-10 px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-500">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage students, generate reports, and view school statistics
        </p>
      </div>
      <StudentDashboard />
    </div>
  );
}
