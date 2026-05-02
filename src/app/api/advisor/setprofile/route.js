import { apiResponse } from "@/lib/apiResponse";
import { getUser } from "@/lib/auth/Getuser";
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
    const user = await getUser();
    if (!user?.token) {
      return apiResponse(
        "Unauthorized",
        false,
        1,
        "",
        "Unable to get token from session",
      );
    }

    const supabase = createAdminClient();

    // 4. Fetch user from DB
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .filter("device_tokens", "cs", JSON.stringify([{ token: user.token }]))
      .maybeSingle();

    if (userError || !existingUser) {
      return apiResponse("User not found", false, 2, "", userError?.message);
    }

    // 5. Insert profile
    const { data: profile, error: profileError } = await supabase
      .from("advisor_profiles")
      .insert([
        {
          user_id: existingUser.id,
          advisor_role_id: "00000000-0000-0000-0000-000000000000",
          short_bio: bio,
          iridai_certificate_url: certificate_url,

          // ✅ store full JSONB array here
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
