import { supabaseAdmin } from "@/lib/supabase/admin";
import { createAdminClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { UserId } = await req.json();
    if (!UserId) {
      return NextResponse.json({
        message: "Some thing went wrong please try again",
        success: false,
        statusCode: 1,
        data: "",
        error: "Missing Userid from the session Storage",
      });
    }
    
    const { data, error } = await createAdminClient.;
    if (error || !data.user) {
      return NextResponse.json({
        message: "User not Found",
        success: false,
        statusCode: 2,
        data: "",
        error: error || "User not found in the database",
      });
    }

    //store the token in Cookies :
    (await cookies()).set(
      "security_token",
      JSON.stringify({
        token: data.user.system_token,
      }),
      {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
      },
    );

    return NextResponse.json({
      message: "User Verified Successfully",
      success: true,
      statusCode: 3,
      data: token,
      error: "",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
      statusCode: 4,
      data: "",
      error: error.message,
    });
  }
}
