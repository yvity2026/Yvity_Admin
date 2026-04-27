import { NextResponse } from "next/server";

export function proxy(request) {
  const cookie = request.cookies.get("security_token")?.value;

  let session = null;

  try {
    session = cookie ? JSON.parse(cookie) : null;
  } catch (error) {
    session = null;
  }

  // If no session or invalid token, redirect to login
  if (!session || !session.token) {
    const loginUrl = new URL("https://yvity.vercel.app"); 
    loginUrl.searchParams.set('redirect', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the session is valid, proceed to the next step
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],  // Protect the /dashboard path and its subpaths
};