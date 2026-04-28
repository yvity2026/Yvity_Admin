import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/Getuser";
import { createAdminClient } from "@/lib/supabase/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";

export async function GET() {
  try {
    const user = await ValidateUser();

    if (!user.device_tokens[0]?.token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data: loggedUser, error: userError } = await supabase
      .from("users")
      .select("id, roles")
      .filter("device_tokens", "cs", JSON.stringify([{ token: user.device_tokens[0]?.token }]))
      .maybeSingle();

    if (userError || !loggedUser || !loggedUser.roles?.includes("advisor")) {
      return NextResponse.json(
        {
          success: false,
          message: "Advisor not found",
        },
        { status: 404 }
      );
    }

    const { data: scoreRow, error: scoreError } = await supabase
      .from("advisor_scores")
      .select(
        "identity_total, visibility_total, trust_total, total_score"
      )
      .eq("advisor_id", loggedUser.id)
      .maybeSingle();

    if (scoreError) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch score",
          error: scoreError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          identity: scoreRow?.identity_total ?? 0,
          visibility: scoreRow?.visibility_total ?? 0,
          trust: scoreRow?.trust_total ?? 0,
          total: scoreRow?.total_score ?? 0,
          max: 100,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}
