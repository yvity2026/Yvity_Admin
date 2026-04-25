import { NextResponse } from "next/server";

export function proxy(request) {
  const cookie = request.cookies.get("security_token")?.value;

  let session = null;

  try {
    session = cookie ? JSON.parse(cookie) : null;
  } catch (err) {
    session = null;
  }

  if (
    !session ||
    !session.token
    // !session.expires_at ||
    // new Date(session.expires_at) < new Date()
  ) {
    return NextResponse.redirect(new URL("/auth/init", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
