import { NextResponse } from "next/server";
import { resolveAdvisorProfileSlug } from "@/lib/advisor/profileSlug";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const supabase = createAdminClient();
    const { data: users, error } = await supabase
      .from("users")
      .select(`
    *,
    advisor_profiles (
      *,
      advisor_roles (*)
    )
  `)
      .limit(1000);

    if (error || !Array.isArray(users)) {
      return NextResponse.json(
        { error: "Advisor data not found" },
        { status: 404 }
      );
    }

    const advisors = users.filter((user) => {
      try {
        const roles =
          typeof user.roles === "string"
            ? JSON.parse(user.roles)
            : user.roles;

        return Array.isArray(roles) && roles.includes("advisor");
      } catch {
        return false;
      }
    });

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
    console.log(data);

    const profile = Array.isArray(data.advisor_profiles)
      ? data.advisor_profiles[0]
      : data.advisor_profiles;

    if (!profile?.ispublic_profile) {
      return NextResponse.json({ error: "Advisor profile is private" }, { status: 403 });
    }

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
