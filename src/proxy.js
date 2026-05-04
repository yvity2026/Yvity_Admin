import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("admin_session");

    if (!adminSession) {
      // Redirect to login
      return NextResponse.redirect(new URL("/auth/admin/login", request.url));
    }

    try {
      const session = JSON.parse(adminSession.value);
      // Could add more validation here
    } catch {
      return NextResponse.redirect(new URL("/auth/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};