import { NextResponse } from "next/server";

export function proxy(request) {
  const cookie = request.cookies.get("security_token")?.value;

  let session = null;

  try {
    session = cookie ? JSON.parse(cookie) : null;
  } catch {
    session = null;
  }

  if (!session || !session.token) {
    return NextResponse.redirect(new URL("https://yvity.vercel.app", request.url));
    
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};