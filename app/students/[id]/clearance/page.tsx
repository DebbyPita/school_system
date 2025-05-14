import { ClearanceForm } from "@/components/clearance-form";

export default function ClearancePage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10 px-10">
      <ClearanceForm studentId={params.id} />
    </div>
  );
}
