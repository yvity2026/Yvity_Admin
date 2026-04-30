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
    advisor_scores (
      total_score
    ),
    advisor_profiles (
      *,
      advisor_roles (*)
    )
  `)
  .filter("roles", "cs", JSON.stringify(["advisor"]))
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
    const score = Array.isArray(data.advisor_scores)
      ? data.advisor_scores[0]
      : data.advisor_scores;

    if (!profile?.ispublic_profile) {
      return NextResponse.json({ error: "Advisor profile is private" }, { status: 403 });
    }

    const [
      testimonialCountResult,
      testimonialClientsResult,
      recommendationCountResult,
      recommendationClientsResult,
      viewCountResult,
    ] = await Promise.all([
      supabase
        .from("advisor_testimonials")
        .select("id", { count: "exact", head: true })
        .eq("advisor_id", data.id)
        .eq("status", "approved"),
      supabase
        .from("advisor_testimonials")
        .select("user_id,mobile_number")
        .eq("advisor_id", data.id)
        .eq("status", "approved"),
      supabase
        .from("advisor_recommendations")
        .select("id", { count: "exact", head: true })
        .eq("advisor_id", data.id),
      supabase
        .from("advisor_recommendations")
        .select("user_id,mobile_number")
        .eq("advisor_id", data.id),
      profile?.id
        ? supabase
            .from("advisor_profile_stats")
            .select("id", { count: "exact", head: true })
            .eq("profile_id", profile.id)
            .eq("stats_type", "view")
        : Promise.resolve({ count: 0, error: null }),
    ]);

    const clientKeys = new Set();

    for (const item of testimonialClientsResult.data || []) {
      if (item?.user_id) {
        clientKeys.add(`user:${item.user_id}`);
      } else if (item?.mobile_number) {
        clientKeys.add(`mobile:${item.mobile_number}`);
      }
    }

    for (const item of recommendationClientsResult.data || []) {
      if (item?.user_id) {
        clientKeys.add(`user:${item.user_id}`);
      } else if (item?.mobile_number) {
        clientKeys.add(`mobile:${item.mobile_number}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        advisor_score: {
          total: score?.total_score ?? 0,
          max: 100,
        },
        profile_summary: {
          testimonials: testimonialCountResult.count ?? 0,
          recommendations: recommendationCountResult.count ?? 0,
          profile_views: viewCountResult.count ?? 0,
          clients: clientKeys.size,
          member_since_year: data?.created_at?.slice(0, 4) || "",
        },
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
