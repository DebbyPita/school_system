import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegistrationSuccessPage() {
  return (
    <div className="container flex items-center justify-center py-20">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Registration Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The student has been successfully registered in the system. You can
            now view their details in the dashboard or generate their ID card.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button variant="default">Go to Dashboard</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Register Another Student</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
