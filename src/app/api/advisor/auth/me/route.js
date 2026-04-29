import { getUser } from "@/lib/auth/Getuser";
import { recordAdvisorLoginActivity } from "@/lib/advisor-score/recordAdvisorLoginActivity";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sessionUser = await getUser();

    if (!sessionUser?.id) {
      return NextResponse.json(
        {
          success: false,
          code: 1,
          message: "Something went wrong, please try again",
          error: "Unable to get the token from the session",
        },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, roles")
      .eq("id", sessionUser.id)
      .maybeSingle();

    if (userError || !userData) {
      return NextResponse.json(
        {
          success: false,
          code: 2,
          message: "User Not Found",
          error: userError?.message || "User not found based on the session",
        },
        { status: 404 },
      );
    }

    await recordAdvisorLoginActivity(supabase, userData);

    return NextResponse.json(
      {
        success: true,
        code: 0,
        message: "User retrieved successfully",
        data: userData,
      },
      { status: 200 },
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
      { status: 500 },
    );
  }
}
