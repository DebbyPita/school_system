import { SubjectManagement } from "@/components/subject-management";

export default function SubjectsPage() {
  return (
    <div className="container py-10 px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-500">Subject Management</h1>
        <p className="text-muted-foreground">
          Add, edit, and manage subjects for report cards
        </p>
      </div>
      <SubjectManagement />
    </div>
  );
}
