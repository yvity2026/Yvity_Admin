import { NextResponse } from "next/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req,  context) {
  try {
    const currentUser = await ValidateUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("users")
      .select(`
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
      `)
      .eq("id", id)
      .filter("roles", "cs", JSON.stringify(["advisor"]))
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
    }

    const profile = Array.isArray(data.advisor_profiles)
      ? data.advisor_profiles[0]
      : data.advisor_profiles;

    // if (!profile?.ispublic_profile) {
    //   return NextResponse.json({ error: "Advisor profile is private" }, { status: 403 });
    // }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        dob: data.dob,
        gender: data.gender,
        city: data.city,
        profession: data.profession,
        selfie_url: data.selfie_url,
        mobile_verified: data.mobile_verified,
        email_verified: data.email_verified,
        advisor_profile: {
          ...profile,
          is_verified: profile?.profile_status || false,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
