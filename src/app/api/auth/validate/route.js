import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateToken } from "@/lib/auth/jwt/GenerateToken";
import { verifyCode } from "@/lib/auth/validate";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", request.url)
    );
  }

  const result = await verifyCode(code);
  console.log("Decoded userId:", result);

  if (!result) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_code", request.url)
    );
  }


  const supabase = createAdminClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", result.userId)
    .maybeSingle();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?error=user_not_found", request.url)
    );
  }

  const payload = {
    id : user.id,
    roles : user.roles
  }
  const sessionToken = await generateToken(payload, "30d");

  const response = NextResponse.redirect(
    new URL("/dashboard", request.url)
  );

  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: true,           // MUST be true in production
    sameSite: "lax",        // use "none" if cross-domain
    path: "/",
    maxAge: 60 * 60 * 24 * 30,  
  });

  return response;
}