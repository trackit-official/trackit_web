import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define which paths are considered protected (require authentication)
  const isProtectedPath = path.startsWith("/dashboard");

  // Define which paths are considered auth paths (login, signup)
  const isAuthPath = path.startsWith("/auth");

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect logic
  if (isProtectedPath && !token) {
    // Redirect to login if trying to access protected route without being logged in
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (isAuthPath && token) {
    // Redirect to dashboard if already logged in and trying to access auth pages
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Configure which paths middleware runs on
export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
