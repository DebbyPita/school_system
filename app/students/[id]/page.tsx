import { StudentProfile } from "@/components/student-profile";

export default function StudentPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <StudentProfile studentId={params.id} />
    </div>
  );
}
