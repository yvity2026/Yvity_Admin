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

    let query = supabase
      .from("advisor_testimonials")
      .select(
        `
        *,
        user:users(*),
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Query failed:", error);

      return NextResponse.json(
        { error: "Unable to load testimonials" },
        { status: 500 },
      );
    }

    const typeCounts = {
      text: 0,
      audio: 0,
      video: 0,
    };

    const output = (data || []).map((item) => {
      const user = item.user || {};
      const advisor = item.advisor;
      const type = item.testimonial_type || "text";

      // normalize + count
      if (type === "text") typeCounts.text += 1;
      else if (type === "audio") typeCounts.audio += 1;
      else if (type === "video") typeCounts.video += 1;

      return {
        id: item.id,
        name: user.name || "User",
        email: user.email || null,
        phone: user.mobile || null,
        type,
        rating: item.testimonial_rating || 0,
        advisorname: advisor?.advisorUser?.name,
        profile_pic: user.selfie_url || null,

        joinedAt: item.created_at || null,
        location: user.city || "Unknown, IN",

        status: user.account_status || "pending",

        reviewCount: user.advisor_testimonials?.length || 0,

        lastLogin: user.last_login_at || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: output,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
