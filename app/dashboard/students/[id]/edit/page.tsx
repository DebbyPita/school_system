import { StudentEditForm } from "@/components/student-edit-form"

export default function EditStudentPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-500">Edit Student</h1>
        <p className="text-muted-foreground">Update student information</p>
      </div>
      <StudentEditForm studentId={params.id} />
    </div>
  )
}
