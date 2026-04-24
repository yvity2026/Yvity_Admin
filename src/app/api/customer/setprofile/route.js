import { apiResponse } from "@/lib/apiResponse";
import { ValidateUser } from "@/lib/auth/ValidateUser";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    // 1. Parse body
    const body = await req.json();
    const { roleId, services, certificate_url, bio } = body;

    // 2. Validate input
    if (
      !services ||
      services.length === 0 ||
      !certificate_url ||
      !bio ||
      !roleId
    ) {
      return apiResponse(
        "Missing required fields",
        false,
        0,
        "",
        "services, certificate_url and bio are required",
      );
    }

    // 3. Get user
    const user = await ValidateUser();
    if (!user) {
      return apiResponse(
        "Unauthorized",
        false,
        1,
        "",
        "Unable to get token from session",
      );
    }

    const supabase = createAdminClient();


    // 5. Insert profile
    const { data: profile, error: profileError } = await supabase
      .from("advisor_profiles")
      .insert([
        {
          advisor_id: user.id,
          advisor_role_id: "00000000-0000-0000-0000-000000000000",
          short_bio: bio,
          iridai_certificate_url: certificate_url,
          services: services.map((s) => ({
            service: s.service,
            company: s.company,
            license: s.license,
            experience: Number(s.experience),
          })),
        },
      ])
      .select()
      .single();

      console.log(profileError)
    if (profileError) {
      return apiResponse(
        "Failed to save services",
        false,
        4,
        "",
        profileError.message,
      );
    }

    // 7. Success
    return apiResponse("Profile created successfully", true, 200, profile);
  } catch (error) {
    console.error(error);
    return apiResponse("Internal server error", false, 500, "", error.message);
  }
}
