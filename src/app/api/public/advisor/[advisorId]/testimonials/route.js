import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/public/advisor/[advisorId]/testimonials
 * Fetch public testimonials for an advisor (only approved)
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

/**
 * POST /api/public/advisor/[advisorId]/testimonials
 * Submit a new testimonial as a user (no authentication required)
 * Handles text, audio, and video testimonials
 * 
 * Body:
 * {
 *   name: string,
 *   mobileNumber: string,
 *   testimonialType: 'text' | 'audio' | 'video',
 *   content: string,
 *   mediaUrl?: string (required for audio/video),
 *   testimonialRating: number (1-5)
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
    const {
      name,
      mobileNumber,
      testimonialType = "text",
      content,
      mediaUrl,
      testimonialRating = 5,
    } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!mobileNumber || !mobileNumber.trim()) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
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

    // Validate rating
    const rating = Number(testimonialRating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate mobile number format (basic)
    const phoneRegex = /^[0-9]{10,}$/;
    const cleanPhone = mobileNumber.replace(/[^\d]/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Invalid mobile number format" },
        { status: 400 }
      );
    }

    // Generate OTP for verification (6 digits)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    const supabase = createAdminClient();

    // Insert testimonial
    const { data, error } = await supabase
      .from("advisor_testimonials")
      .insert({
        advisor_id: advisorId,
        name,
        mobile_number: cleanPhone,
        testimonial_type: testimonialType.toLowerCase(),
        content,
        media_url: mediaUrl || null,
        testimonial_rating: rating,
        otp_code: otpCode,
        otp_expires_at: otpExpiresAt,
        is_verified: false,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Send OTP via SMS to mobile_number
    // For now, return the OTP in response (only in development)
    const isDevelopment = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        success: true,
        data: {
          id: data.id,
          message: "Testimonial submitted. Please verify your mobile number.",
          ...(isDevelopment && { otp: otpCode }),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to submit testimonial", success: false },
      { status: 500 }
    );
  }
}
