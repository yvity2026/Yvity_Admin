import { apiResponse } from "@/lib/apiResponse";
import { getUser } from "@/lib/auth/Getuser";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getUser();

    if (!user?.token) {
      return apiResponse(
        "something went wrong please try again",
        false,
        1,
        "",
        "Unable to get the token from the sessions",
      );
    }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("advisor_profiles")
      .select("*")
      .filter("device_tokens", "cs", JSON.stringify([{ token: user.token }]))
      .maybeSingle()
      
    if (!data && error) {
      return apiResponse(
        "User Not Found",
        false,
        2,
        "",
        "user not found based on the userId",
      );
    }
    if(!Array.isArray(data.roles) || !data.roles.include("advisor")){
        return apiResponse("UN AUTHORIZED", false, 3, "", "unauthorized access");
    }
    return apiResponse("user Retrieved successfully", true, 3, data, "");
  } catch (error) {
    console.log(error);
    return apiResponse(
      "Internal Server Error",
      false,
      4,
      "",
      error.message || error,
    );
  }
}
