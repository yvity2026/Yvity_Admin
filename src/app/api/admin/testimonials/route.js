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
        advisor:users!advisor_testimonials_advisor_id_fkey(id, name)
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
        advisor_name: item.advisor?.name || "—",
        profile_pic: user.selfie_url || null,
        review: item.content || (item.media_url ? item.media_url.split("/").pop() : "No review"),
        content: item.content || "",
        media_url: item.media_url || null,
        is_verified: item.is_mobile_verified || false,
        status: item.status || "pending",

        joinedAt: item.created_at || null,
        location: user.city || "Unknown, IN",

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

export async function POST(req) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const testimonialId = String(body?.testimonialId || "").trim();
    const action = String(body?.action || "").trim().toLowerCase();

    if (!testimonialId) {
      return NextResponse.json(
        { error: "testimonialId is required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const updates = {
      status: action === "approve" ? "approved" : "rejected",
      is_mobile_verified: action === "approve",
    };

    const { data, error } = await supabase
      .from("advisor_testimonials")
      .update(updates)
      .eq("id", testimonialId)
      .select("id, status, is_mobile_verified")
      .single();

    if (error) {
      console.error("Failed to update testimonial", error);
      return NextResponse.json(
        { error: "Failed to update testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("POST testimonials failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
