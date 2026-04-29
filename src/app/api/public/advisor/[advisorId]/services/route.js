import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET public advisor services by advisor ID
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

    const { data: services, error } = await supabase
      .from("advisor_services")
      .select("*")
      .eq("advisor_id", advisorId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: services || [],
    });
  } catch (error) {
    console.error("Error fetching public services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services", success: false },
      { status: 500 }
    );
  }
}
