import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { NextResponse } from "next/server";

function normalizeProfession(profession) {
  if (typeof profession !== "string") {
    return "Unspecified";
  }

  const cleaned = profession.trim().replace(/\s+/g, " ");

  return cleaned || "Unspecified";
}

export async function GET() {
  try {
    // Check authentication
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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
      roleWiseRes,
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

      supabase
        .from("users")
        .select(`
          profession,
          advisor:advisor_profiles!inner(id)
        `),
    ]);

    // Check for errors in any query
    if (totalRes.error) {
      console.error("Failed to fetch total advisors:", totalRes.error);
      return NextResponse.json(
        { error: "Failed to fetch dashboard data" },
        { status: 500 }
      );
    }

    if (cityRes.error || companyRes.error || serviceRes.error) {
      console.error("Analytics query failed:", { cityRes: cityRes.error, companyRes: companyRes.error, serviceRes: serviceRes.error });
      return NextResponse.json(
        { error: "Failed to fetch analytics data" },
        { status: 500 }
      );
    }

    const professionCounts = new Map();

    for (const item of roleWiseRes.data || []) {
      const profession = normalizeProfession(item.profession);
      professionCounts.set(
        profession,
        (professionCounts.get(profession) || 0) + 1,
      );
    }

    const sortedProfessions = Array.from(professionCounts.entries())
      .map(([profession, total]) => ({ profession, total }))
      .sort((a, b) => b.total - a.total);

    const topProfessions = sortedProfessions.slice(0, 7);
    const remainingTotal = sortedProfessions
      .slice(7)
      .reduce((sum, item) => sum + item.total, 0);

    const roleWise = remainingTotal
      ? [
          ...topProfessions,
          { profession: "Others", total: remainingTotal },
        ]
      : topProfessions;

    return NextResponse.json({
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

      subscriptions: {
        active: silverRes.count + goldRes.count || 0,
      },

      revenue: {
        total: 0,
      },

      approvals: {
        pending: underReviewRes.count || 0,
      },

      analytics: {
        cities: cityRes.data || [],
        companies: companyRes.data || [],
        services: serviceRes.data || [],
        serviceWise: serviceRes.data || [],
        roleWise,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/overview failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
