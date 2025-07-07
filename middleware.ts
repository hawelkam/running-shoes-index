import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Add any routes that require authentication here
const protectedRoutes = [
  "/dashboard",
  "/profile",
  // Add more protected routes as needed
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const authToken = request.cookies.get("strava_auth")?.value;

    if (!authToken) {
      // Redirect to home page with error message
      return NextResponse.redirect(
        new URL("/?error=auth_required", request.url)
      );
    }

    try {
      // Verify the JWT token
      const jwtSecret = process.env["JWT_SECRET"] || "your-jwt-secret-key";
      jwt.verify(authToken, jwtSecret);
      // Token is valid, continue
    } catch {
      // Invalid token, redirect to home
      return NextResponse.redirect(
        new URL("/?error=invalid_session", request.url)
      );
    }
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
