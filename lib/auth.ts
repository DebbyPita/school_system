import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

// Auth constants
export const AUTH_COOKIE_NAME = "school_auth_token";
export const AUTH_COOKIE_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds

// Check if user is authenticated
export async function isAuthenticated(request?: NextRequest) {
  // For server components and middleware
  if (request) {
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
    return !!authCookie?.value;
  }

  // For server actions
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  return !!authCookie?.value;
}

// Set auth cookie
export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: "authenticated",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: AUTH_COOKIE_EXPIRY,
    sameSite: "lax",
  });
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: -1,
  });
}

// Validate admin credentials
export function validateAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("Admin credentials not set in environment variables");
    return false;
  }

  return email === adminEmail && password === adminPassword;
}
