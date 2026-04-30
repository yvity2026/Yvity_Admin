import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/advisor/testimonials
 * Fetch testimonials for the authenticated advisor
 * Query params: type (text, audio, video, or All)
 */
export async function GET(req) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const user = await ValidateAdvisor();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("advisor_testimonials")
      .select("*")
      .eq("advisor_id", user.id)
      .order("created_at", { ascending: false });

    if (type && type !== "All") {
      query = query.eq("testimonial_type", type.toLowerCase());
    }

    const { data, error } = await query;

    if (error) throw error;

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

    return NextResponse.json({ data: enrichedData });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/advisor/testimonials
 * Create a new testimonial for the advisor
 * Body: { testimonialType: 'text'|'audio'|'video', content: string, mediaUrl?: string }
 * Note: For audio/video, first upload to S3 and pass the URL
 */
export async function POST(req) {
  try {
    const supabase = createAdminClient();
    const user = await ValidateAdvisor();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { testimonialType = "text", content, mediaUrl, rating = 5 } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const validTypes = ["text", "audio", "video"];
    if (!validTypes.includes(testimonialType?.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid testimonial type" },
        { status: 400 }
      );
    }

    // For audio/video, mediaUrl is required
    if (["audio", "video"].includes(testimonialType?.toLowerCase()) && !mediaUrl) {
      return NextResponse.json(
        { error: "Media URL is required for audio/video testimonials" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("advisor_testimonials")
      .insert({
        advisor_id: user.id,
        testimonial_type: testimonialType.toLowerCase(),
        content,
        media_url: mediaUrl || null,
        testimonial_rating: rating,
        status: "approved",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
