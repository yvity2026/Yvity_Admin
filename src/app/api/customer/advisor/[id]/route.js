import { NextResponse } from "next/server";
import { resolveAdvisorProfileSlug } from "@/lib/advisor/profileSlug";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req,  context) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();

    const { data: advisors, error } = await supabase
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
          score_last_recalculated_at,
          profile_slug
        )
      `)
      .filter("roles", "cs", JSON.stringify(["advisor"]))
      .limit(1000);

    if (error || !Array.isArray(advisors)) {
      return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
    }

    const requestedKey = String(id || "").trim().toLowerCase();
    const data = advisors.find((advisor) => {
      const profile = Array.isArray(advisor.advisor_profiles)
        ? advisor.advisor_profiles[0]
        : advisor.advisor_profiles;
      const resolvedSlug = resolveAdvisorProfileSlug(
        profile?.profile_slug,
        advisor.name,
      );

      return advisor.id === id || resolvedSlug === requestedKey;
    });

    if (!data) {
      return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
    }

    const profile = Array.isArray(data.advisor_profiles)
      ? data.advisor_profiles[0]
      : data.advisor_profiles;

    if (!profile?.ispublic_profile) {
      return NextResponse.json({ error: "Advisor profile is private" }, { status: 403 });
    }

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
