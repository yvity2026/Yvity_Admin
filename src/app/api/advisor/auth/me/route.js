import { apiResponse } from "@/lib/apiResponse";
import { getUser } from "@/lib/auth/Getuser";
import { recordAdvisorLoginActivity } from "@/lib/advisor-score/recordAdvisorLoginActivity";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getUser();

    if (!user?.token) {
      return apiResponse(
        "Something went wrong, please try again",
        false,
        1,
        "",
        "Unable to get the token from the session"
      );
    }

    const supabase = createAdminClient();

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, roles")
      .filter("device_tokens", "cs", JSON.stringify([{ token: user.token }]))
      .maybeSingle();

    if (userError || !userData) {
      return apiResponse(
        "User Not Found",
        false,
        2,
        "",
        userError?.message || "User not found based on the token"
      );
    }

    // Safe roles check
    if (!Array.isArray(userData.roles) || !userData.roles.includes("advisor")) {
      return apiResponse("UNAUTHORIZED", false, 3, "", "Unauthorized access");
    }

    await recordAdvisorLoginActivity(supabase, userData);

    const { data: advisor, error: advisorError } = await supabase
      .from("advisor_profiles")
      .select("*")
      .eq("advisor_id", userData.id)
      .maybeSingle();

    if (advisorError || !advisor) {
      return apiResponse(
        "Advisor profile not found",
        false,
        4,
        "",
        advisorError?.message || "No advisor profile exists for this user"
      );
    }

    return apiResponse("User retrieved successfully", true, 0, advisor, "");
  } catch (error) {
    console.error("GET /api/advisor/auth/me error:", error);
    return apiResponse(
      "Internal Server Error",
      false,
      5,
      "",
      error.message || error
    );
  }
}
