import { NextResponse } from "next/server";

function getFallbackRedirectUrl() {
  if (process.env.NODE_ENV === "development") {
    return process.env.DASHBOARD_LOCAL_FALLBACK || "http://localhost:3000";
  }

  return process.env.DASHBOARD_PRODUCTION_FALLBACK || "https://yvity.vercel.app";
}

function clearCookie(response, name) {
  response.cookies.set(name, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: name === "session",
    secure: true,
    sameSite: "lax",
  });
}

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
    redirect_url: getFallbackRedirectUrl(),
  });

  ["session", "yvity_user_id"].forEach((name) => clearCookie(response, name));

  return response;
}
