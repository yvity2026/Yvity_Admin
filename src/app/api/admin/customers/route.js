import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Base query
    let query = supabase
      .from("users")
      .select(
        `
        *,
        advisor_testimonials(*)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error("Admin approvals query failed:", error);

      return NextResponse.json(
        { error: "Unable to load advisors" },
        { status: 500 }
      );
    }

    // Safe mapping
    const output = (data || []).map((item) => {
      const reviews = item.advisor_testimonials || [];

      return {
        id: item.id,
        name: item.name || "Advisor",
        email: item.email || null,
        phone: item.mobile || null,
        profile_pic: item.selfie_url || null,
        joinedAt: item.created_at || null,
        location: item.city || "Unknown, IN",
        status: item.account_status || "pending",
        reviewCount: reviews.length || 0,
        lastLogin: item.last_login_at || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: output,

      // pagination meta
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
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
