import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({
        message: "Missing userId",
        success: false,
        statusCode: 1,
        data: null,
        error: "userId is required",
      });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("users")
      .select("id, device_tokens")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return NextResponse.json({
        message: "User not found",
        success: false,
        statusCode: 2,
        data: null,
        error: error?.message || "No user found",
      });
    }

    // set cookie
    const response = NextResponse.json({
      message: "User verified successfully",
      success: true,
      statusCode: 3,
      data: {
        userId: data.id,
        deviceTokens: data.device_tokens,
      },
      error: null,
    });

    response.cookies.set(
      "security_token",
      JSON.stringify({
        token: data.device_tokens?.[data.device_tokens.length - 1]?.token
      }),
      {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "lax",
      },
    );

    return response;
  } catch (error) {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      statusCode: 4,
      data: null,
      error: error.message,
    });
  }
}
