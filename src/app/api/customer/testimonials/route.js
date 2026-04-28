import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";

// CREATE testimonial
export async function POST(req) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const {
      advisor_id,
      name,
      mobile_number,
      content,
      media_url,
      testimonial_type = "text",
      rating = 5,
      is_verified = false,
    } = body;

    // 🔐 Validation
    if (!advisor_id || !name || !mobile_number) {
      return NextResponse.json(
        { error: "Missing required fields: advisor_id, name, mobile_number" },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobile_number)) {
      return NextResponse.json(
        { error: "Invalid mobile number format" },
        { status: 400 }
      );
    }

    if (!content && !media_url) {
      return NextResponse.json(
        { error: "Either content or media_url is required" },
        { status: 400 }
      );
    }

    // 🔐 Check if user is logged in
    let currentUser = null;
    let user_id = null;
    let is_mobile_verified = false;

    try {
      currentUser = await ValidateUser();
      if (currentUser) {
        user_id = currentUser.id;
        // If user is logged in, mobile is automatically verified
        is_mobile_verified = true;
      }
    } catch (err) {
      // User not logged in - require OTP verification
      if (!is_verified) {
        return NextResponse.json(
          {
            error: "Unauthenticated users must verify OTP",
            require_otp: true,
          },
          { status: 403 }
        );
      }
      // OTP already verified, proceed
      is_mobile_verified = true;
    }

    // Insert testimonial
    const { data, error } = await supabase
      .from("advisor_testimonials")
      .insert({
        advisor_id,
        user_id: user_id || null,
        name,
        mobile_number,
        testimonial_type,
        content: testimonial_type === "text" ? content : null,
        media_url: testimonial_type !== "text" ? media_url : null,
        rating: Number(rating) || 5,
        status: is_mobile_verified ? "pending" : "unverified",
        is_verified: is_mobile_verified,
        is_mobile_verified,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial submitted successfully",
        data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Testimonial submission error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
