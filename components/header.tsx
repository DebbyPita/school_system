"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/components/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function Header() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", auth: true },
    { name: "Register Student", href: "/register", auth: true },
    { name: "Home", href: "/", auth: false },
  ];

  const adminItems = [
    { name: "Students", href: "/dashboard" },
    { name: "Subjects", href: "/dashboard/subjects" },
    { name: "Grades", href: "/dashboard/grades" },
    { name: "Clearance Departments", href: "/dashboard/clearance" },
    { name: "Student Clearance", href: "/dashboard/student-clearance" },
  ];

  return (
    <header className="sticky px-10 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/logo.png"
              alt="School Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="hidden text-green-500 font-bold sm:inline-block">
              School Management System
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {!isLoading && isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex text-green-500 items-center gap-1">
                  Admin <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {adminItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <DropdownMenuItem
                      className={isActive(item.href) ? "bg-accent" : "cursor-pointer"}
                    >
                      {item.name}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isLoading &&
            navItems
              .filter((item) => (isAuthenticated ? item.auth : !item.auth))
              .map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={isActive(item.href) ? "bg-accent" : "cursor-pointer text-green-500"}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}

          {!isLoading && isAuthenticated && (
            <Button variant="outline" className="text-green-500" onClick={() => logout()}>
              Logout
            </Button>
          )}

          {!isLoading && !isAuthenticated && (
            <Link href="/login">
              <Button variant="default" className="text-green-500">Login</Button>
            </Link>
          )}

          <ModeToggle/>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-6">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="School Logo"
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <span className="font-bold">School Management System</span>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>

                <div className="flex flex-col gap-4">
                  {!isLoading && isAuthenticated && (
                    <>
                      <p className="px-4 text-sm font-medium text-muted-foreground">
                        Admin
                      </p>
                      {adminItems.map((item) => (
                        <SheetClose key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={`px-4 py-2 text-sm ${isActive(item.href) ? "bg-accent rounded-md" : ""}`}
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      ))}
                      <div className="h-px bg-border" />
                    </>
                  )}

                  {!isLoading &&
                    navItems
                      .filter((item) =>
                        isAuthenticated ? item.auth : !item.auth
                      )
                      .map((item) => (
                        <SheetClose key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={`px-4 py-2 text-sm ${isActive(item.href) ? "bg-accent rounded-md" : ""}`}
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      ))}

                  <div className="h-px bg-border" />

                  {!isLoading && isAuthenticated ? (
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => logout()}
                      >
                        Logout
                      </Button>
                    </SheetClose>
                  ) : !isLoading && !isAuthenticated ? (
                    <SheetClose asChild>
                      <Link href="/login">
                        <Button variant="default" className="w-full">
                          Login
                        </Button>
                      </Link>
                    </SheetClose>
                  ) : null}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
