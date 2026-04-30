import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/public/advisor/[advisorId]/recommendations
 * Fetch public recommendations for an advisor
 */
export async function GET(request, context) {
  try {
    const params = await context.params;
    const advisorId = params?.advisorId;

    if (!advisorId) {
      return NextResponse.json(
        { error: "Advisor ID is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_recommendations")
      .select("*")
      .eq("advisor_id", advisorId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching public recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations", success: false },
      { status: 500 }
    );
  }
}

/**
 * POST /api/public/advisor/[advisorId]/recommendations
 * Submit a recommendation for an advisor (no authentication required)
 * Note: No S3 upload required, just store the recommendation text
 * 
 * Body:
 * {
 *   recommendations: string[],
 *   mobileNumber?: string,
 *   email?: string,
 *   name?: string
 * }
 */
export async function POST(request, context) {
  try {
    const params = await context.params;
    const advisorId = params?.advisorId;

    if (!advisorId) {
      return NextResponse.json(
        { error: "Advisor ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { recommendations, mobileNumber, email, name } = body;

    // Validation
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
        { error: "At least one valid recommendation is required" },
        { status: 400 }
      );
    }

    // Validate mobile number if provided
    if (mobileNumber) {
      const phoneRegex = /^[0-9]{10,}$/;
      const cleanPhone = mobileNumber.replace(/[^\d]/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        return NextResponse.json(
          { error: "Invalid mobile number format" },
          { status: 400 }
        );
      }
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    const supabase = createAdminClient();

    // Insert recommendation
    const { data, error } = await supabase
      .from("advisor_recommendations")
      .insert({
        advisor_id: advisorId,
        recommendations: filteredRecommendations,
        mobile_number: mobileNumber ? mobileNumber.replace(/[^\d]/g, "") : null,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        data: {
          id: data.id,
          message: "Thank you for your recommendation!",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating recommendation:", error);
    return NextResponse.json(
      { error: "Failed to submit recommendation", success: false },
      { status: 500 }
    );
  }
}
