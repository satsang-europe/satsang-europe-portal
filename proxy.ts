import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Use the edge-safe auth (no bcrypt / Prisma) for the proxy.
// The full auth.ts (with bcrypt) is only used in API routes / server components.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isAuthenticated = !!session?.user;
  const role = session?.user?.role;
  const pathname = nextUrl.pathname;

  // ── Root → always redirect to /login ────────────────────────────────────
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // ── /login → redirect authenticated users to their dashboard ────────────
  if (pathname === "/login") {
    if (isAuthenticated) {
      const dest =
        role === "admin" ? "/admin/dashboard" : "/member/dashboard";
      return NextResponse.redirect(new URL(dest, nextUrl));
    }
    return NextResponse.next();
  }

  // ── /admin/* → admin only ────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated || role !== "admin") {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  // ── /member/* → primary_member only ─────────────────────────────────────
  if (pathname.startsWith("/member")) {
    if (!isAuthenticated || role !== "primary_member") {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)"],
};
