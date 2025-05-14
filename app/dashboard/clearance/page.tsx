import { ClearanceManagement } from "@/components/clearance-management";

export default function ClearancePage() {
  return (
    <div className="container py-10 px-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-500">Clearance Management</h1>
        <p className="text-muted-foreground">
          Manage departments and clearance items for student clearance forms
        </p>
      </div>
      <ClearanceManagement />
    </div>
  );
}
