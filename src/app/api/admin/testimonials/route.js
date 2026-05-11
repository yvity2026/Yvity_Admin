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

    const { data, error, count } = await supabase
      .from("yvity_testimonials")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Query failed:", error);

      return NextResponse.json(
        { error: "Unable to load testimonials" },
        { status: 500 },
      );
    }

    const output = (data || []).map((item) => {
      const type = item.testimonial_type || "text";

      return {
        id: item.id,
        name: item.name || "Public User",
        email: null,
        phone: item.mobile_number || null,
        type,
        rating: item.testimonial_rating || 0,
        advisor_name:
          item.respondent_type === "advisor"
            ? "Advisor"
            : "Customer",
        profile_pic: null,
        review:
          type === "text"
            ? item.content || "No review"
            : item.media_url
            ? item.media_url.split("/").pop()
            : "No media attached",
        content: item.content || "",
        media_url: item.media_url || null,
        is_verified: false,
        status: item.status === "submitted" ? "pending" : item.status || "pending",
        joinedAt: item.created_at || null,
        location: item.city || "Unknown, IN",
        reviewCount: 0,
        lastLogin: null,
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
    const reply = String(body?.reply || "").trim();

    if (!testimonialId) {
      return NextResponse.json(
        { error: "testimonialId is required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject", "send_reply"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const updates = {};

    if (action === "approve") {
      updates.status = "approved";
    } else if (action === "reject") {
      updates.status = "rejected";
    }

    if ((action === "approve" || action === "send_reply") && reply) {
      updates.yvity_reply = reply;
    }

    const { data, error } = await supabase
      .from("yvity_testimonials")
      .update(updates)
      .eq("id", testimonialId)
      .select("id, status")
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
