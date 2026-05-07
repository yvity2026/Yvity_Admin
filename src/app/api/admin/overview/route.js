import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const [
      totalRes,
      freeRes,
      silverRes,
      goldRes,
      underReviewRes,
      totalUsersRes,
      cityRes,
      companyRes,
      serviceRes,
    ] = await Promise.all([
      // total advisors
      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true }),

      // plan counts
      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("subscription_plan", "free"),

      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("subscription_plan", "silver"),

      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("subscription_plan", "gold"),

      // under review advisors
      supabase
        .from("advisor_profiles")
        .select("*", { count: "exact", head: true })
        .eq("profile_status", "under_review"),

      // total users/customers
      supabase
        .from("users")
        .select("*", { count: "exact", head: true }),

      // analytics tables
      supabase.from("city_counts").select("*"),
      supabase.from("company_counts").select("*"),
      supabase.from("service_counts").select("*"),
    ]);

    return Response.json({
      advisors: {
        total: totalRes.count || 0,
        free: freeRes.count || 0,
        silver: silverRes.count || 0,
        gold: goldRes.count || 0,
        under_review: underReviewRes.count || 0,
      },

      users: {
        total: totalUsersRes.count || 0,
      },

      analytics: {
        cities: cityRes.data || [],
        companies: companyRes.data || [],
        services: serviceRes.data || [],
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}