import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

// CREATE testimonial
export async function POST(req) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const {
      advisor_id,
      user_id,
      name,
      mobile_number,
      testimonial_type,
      content,
      media_url,
    } = body;

    // 🔐 Basic validation
    if (!advisor_id || !user_id || !name || !mobile_number || !testimonial_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔐 Auth check (optional but recommended)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== user_id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("advisor_testimonials")
      .insert({
        advisor_id,
        user_id,
        name,
        mobile_number,
        testimonial_type,
        content: testimonial_type === "text" ? content : null,
        media_url:
          testimonial_type === "text" ? null : media_url,
        status: "pending",
        is_verified: false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
