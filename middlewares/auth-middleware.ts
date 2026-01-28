import { authPrefix, publicPrefixes } from "@/routes";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

// Middleware
export function authMiddleware(request: NextRequest) {
  const nextUrl = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isPublicRoute = publicPrefixes.includes(nextUrl.pathname);
  const isApiAuth = request.nextUrl.pathname.startsWith(authPrefix);
  const isLoggedIn = !!sessionCookie;

  if (isApiAuth) {
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  return NextResponse.next();
}
