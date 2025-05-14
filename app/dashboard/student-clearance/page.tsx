import { StudentClearanceManagement } from "@/components/student-clearance-management";

export default function StudentClearancePage() {
  return (
    <div className="container py-10 px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-500">Student Clearance</h1>
        <p className="text-muted-foreground">
          Process and manage student clearance status
        </p>
      </div>
      <StudentClearanceManagement />
    </div>
  );
}
