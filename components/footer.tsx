import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background px-10">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg text-green-500 font-semibold">
              School Management System
            </h3>
            <p className="text-sm text-muted-foreground">
              A comprehensive system for student registration, report cards, and
              clearance forms.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-green-500">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Register Student
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-green-500">Contact</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>123 School Street</p>
              <p>City, State 12345</p>
              <p>Email: info@school.edu</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-green-500">
          <p>
            &copy; {new Date().getFullYear()} School Management System. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
