import { NextResponse } from "next/server";
import { verifyJwt } from "./lib/auth/jwt/VerifyJwt";


const PUBLIC_PATHS = ["/api/auth/validate"];
const REDIRECTION_LINK =
  process.env.NODE_ENV === "production"
    ? process.env.DASHBOARD_PRODUCTION_FALLBACK
    : process.env.DASHBOARD_LOCAL_FALLBACK;

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  if (!token) {
    return redirectToLogin(req, "no_session");
  }

  try {
    const payload = verifyJwt(token);
    console.log(payload);

    if (!payload || !payload.id) {
      throw new Error("Invalid payload");
    }

    // ✅ Attach user info to request headers (for downstream usage)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", String(payload.id));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    console.error("JWT validation failed:", err);
    return redirectToLogin(req, "invalid_session");
  }
}

function redirectToLogin(req, error) {
  const loginUrl = new URL(REDIRECTION_LINK);
  // loginUrl.searchParams.set("error", error);

  const response = NextResponse.redirect(loginUrl);

  response.cookies.set("session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/protected/:path*", // optional
  ],
};
