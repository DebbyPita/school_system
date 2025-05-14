import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in with your admin credentials to access the school management
            system
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
