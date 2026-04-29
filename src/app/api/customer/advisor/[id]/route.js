import { NextResponse } from "next/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req, context) {
  try {
    const currentUser = await ValidateUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        name,
        mobile,
        email,
        dob,
        gender,
        city,
        selfie_url,
        mobile_verified,
        email_verified,
        roles,
        created_at,
        updated_at,
        advisor_profiles (
          id,
          advisor_role_id,
          advisor_roles (
        title
        ),
          advisor_id,
          services,
          short_bio,
          current_plan,
          iridai_certificate_url,
          profile_status,
          created_at,
          updated_at,
          intro_url,
          ispublic_professional,
          ispublic_services,
          ispublic_achievements,
          ispublic_gallery,
          ispublic_testimonials,
          ispublic_profile,
          score_last_recalculated_at
        )
      `,
      )
      .eq("id", id)
      .filter("roles", "cs", JSON.stringify(["advisor"]))
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
    }
    console.log(data);

    const profile = Array.isArray(data.advisor_profiles)
      ? data.advisor_profiles[0]
      : data.advisor_profiles;

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        advisor_profiles: profile
          ? {
              ...profile,
              is_verified: profile.profile_status || false,
            }
          : null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
