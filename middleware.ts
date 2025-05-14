import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/register", "/students"];

// Public routes that don't require authentication
const publicRoutes = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = await isAuthenticated(request);

  console.log(`Middleware: Path ${pathname}, Auth: ${isAuth}`);

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuth) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // If the route is public and the user is authenticated, redirect to dashboard
  if (isPublicRoute && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the route is home and the user is not authenticated, redirect to login
  if (pathname === "/" && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
