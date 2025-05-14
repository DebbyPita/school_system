import { IdCard } from "@/components/id-card";

export default function IdCardPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <IdCard studentId={params.id} />
    </div>
  );
}
