import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/advisor/recommendations
 * Fetch recommendations for the authenticated advisor
 */
export async function GET(req) {
  try {
    const supabase = createAdminClient();
    const user = await ValidateAdvisor();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("advisor_recommendations")
      .select("*")
      .eq("advisor_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/advisor/recommendations
 * Create a new recommendation for the advisor
 * Body: { recommendations: string[] }
 */
export async function POST(req) {
  try {
    const supabase = createAdminClient();
    const user = await ValidateAdvisor();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { recommendations } = body;

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      return NextResponse.json(
        { error: "Recommendations must be a non-empty array" },
        { status: 400 }
      );
    }

    // Filter out empty strings
    const filteredRecommendations = recommendations.filter(
      (rec) => rec && rec.trim()
    );

    if (filteredRecommendations.length === 0) {
      return NextResponse.json(
        { error: "At least one recommendation is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("advisor_recommendations")
      .insert({
        advisor_id: user.id,
        recommendations: filteredRecommendations,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to create recommendation" },
      { status: 500 }
    );
  }
}