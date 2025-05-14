import { GradeManagement } from "@/components/grade-management";

export default function GradesPage() {
  return (
    <div className="container py-10 px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-500">Grade Management</h1>
        <p className="text-muted-foreground">
          Enter and manage student grades for report cards
        </p>
      </div>
      <GradeManagement />
    </div>
  );
}
