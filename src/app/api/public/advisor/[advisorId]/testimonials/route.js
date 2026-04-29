import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET public advisor testimonials by advisor ID
 * Used for public profile viewing
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
      .from("advisor_testimonials")
      .select("*")
      .eq("advisor_id", advisorId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch user details for testimonials
    const userIds = [...new Set((data ?? []).map((item) => item.user_id).filter(Boolean))];

    let usersById = {};

    if (userIds.length) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id,name,selfie_url")
        .in("id", userIds);

      if (usersError) throw usersError;

      usersById = (users ?? []).reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
    }

    const enrichedData = (data ?? []).map((item) => ({
      ...item,
      user: usersById[item.user_id] ?? null,
    }));

    return NextResponse.json({
      success: true,
      data: enrichedData,
    });
  } catch (error) {
    console.error("Error fetching public testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials", success: false },
      { status: 500 }
    );
  }
}
