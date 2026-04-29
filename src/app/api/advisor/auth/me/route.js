import { getUser } from "@/lib/auth/Getuser";
import { recordAdvisorLoginActivity } from "@/lib/advisor-score/recordAdvisorLoginActivity";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";

export async function GET() {
  try {
    const user = await ValidateUser();
          // console.log("harsha123",user);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: 1,
          message: "Something went wrong, please try again",
          error: "Unable to get the token from the session",
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, roles")
      .filter("device_tokens", "cs", JSON.stringify([{ token: user.device_tokens[0].token }]))
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json(
        {
          success: false,
          code: 2,
          message: "User Not Found",
          error: userError?.message || "User not found based on the token",
        },
        { status: 404 }
      );
    }

    if (!Array.isArray(userData.roles) || !userData.roles.includes("advisor")) {
      return NextResponse.json(
        {
          success: false,
          code: 3,
          message: "UNAUTHORIZED",
          error: "Unauthorized access",
        },
        { status: 403 }
      );
    }

    await recordAdvisorLoginActivity(supabase, userData);

    const { data: advisor, error: advisorError } = await supabase
      .from("advisor_profiles")
      .select("*")
      .eq("advisor_id", userData.id)
      .maybeSingle();

    if (advisorError || !advisor) {
      return NextResponse.json(
        {
          success: false,
          code: 4,
          message: "Advisor profile not found",
          error:
            advisorError?.message ||
            "No advisor profile exists for this user",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: 0,
        message: "User retrieved successfully",
        data: advisor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/advisor/auth/me error:", error);

    return NextResponse.json(
      {
        success: false,
        code: 5,
        message: "Internal Server Error",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}