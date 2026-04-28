import { NextResponse } from "next/server";

export async function proxy(request) {
  // Access cookies directly from the request
  const rawToken = request.cookies.get("security_token")?.value;
  
  if (!rawToken) {
    const loginUrl = new URL("https://yvity.vercel.app");
    loginUrl.searchParams.set("redirect", request.url);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}