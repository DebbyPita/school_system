import { RegistrationForm } from "@/components/registration-form";

export default function RegisterPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-500">Student Registration</h1>
          <p className="mt-2 text-muted-foreground">
            Complete the form below to register a new student
          </p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  );
}
