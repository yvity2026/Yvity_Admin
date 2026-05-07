import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const supabase = createAdminClient();

    // Query params
    const { searchParams } = new URL(req.url);

    const plan = searchParams.get("plan");
    const account_status = searchParams.get("account_status");

    // Base query
    let query = supabase
      .from("users")
      .select(`
        *,
        reviews:advisor_testimonials(*),
        scores:advisor_scores(*),
        recommendations:advisor_recommendations(*),
        advisor:advisor_profiles!inner(
          *
        )
      `)
      .order("created_at", { ascending: false });

    // Strict account status filter
    if (account_status) {
      query = query.eq("advisor.account_status", account_status);
    } else {
      query = query.in("advisor.account_status", [
        "under_review",
        "active",
        "action_required",
      ]);
    }

    // Strict plan filter
    if (plan) {
      query = query.eq("advisor.subscription_plan", plan);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error("Admin approvals query failed:", error);

      return NextResponse.json(
        { error: "Unable to load advisors" },
        { status: 500 }
      );
    }

    // Stats
    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    // Response formatter
    const output = (data || []).map((item) => {
      const advisor = item.advisor || {};
      const scores = item.scores || {};
      const reviews = item.reviews || [];

      // Status mapping
      const status =
        advisor.account_status === "active"
          ? "approved"
          : advisor.account_status === "action_required"
          ? "rejected"
          : "pending";

      stats[status] += 1;

      return {
        id: item.id,
        advisor_id: advisor.id,

        // User Info
        name: item.name || "Advisor",
        email: item.email || null,
        phone: item.mobile || null,
        profile_pic: item.selfie_url || null,

        // Location
        location: item.city || "Unknown, IN",

        // Advisor Info
        licenseUrl: advisor.iridai_certificate_url || null,
        licenseNo: advisor.services?.[0]?.license || null,

        // Verification
        isVerified: advisor.profile_status || false,

        // Plan & Status
        plan: advisor.subscription_plan || "Free",
        status,

        // Dates
        submittedAt: advisor.created_at || null,
        updatedAt: advisor.updated_at || null,

        // Scores
        identityScore: scores.identity_total || 0,
        visibilityScore: scores.visibility_total || 0,
        trustScore: scores.trust_total || 0,
        total: scores.total_score || 0,

        // Reviews
        reviewCount: reviews.length || 0,

        // Recommendation count
        recommendationCount:
          item.recommendations?.length || 0,
      };
    });

    return NextResponse.json({
      success: true,
      count: output.length,
      stats,
      data: output,
    });
  } catch (error) {
    console.error("Admin approvals GET failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}