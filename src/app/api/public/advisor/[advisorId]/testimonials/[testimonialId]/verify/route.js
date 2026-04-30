import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const supabase = createAdminClient();

/**
 * POST /api/public/advisor/[advisorId]/testimonials/[testimonialId]/verify
 * Verify testimonial OTP and approve the testimonial
 * 
 * Body: { otpCode: string }
 */
export async function POST(request, context) {
  try {
    const params = await context.params;
    const advisorId = params?.advisorId;
    const testimonialId = params?.testimonialId;

    if (!advisorId || !testimonialId) {
      return NextResponse.json(
        { error: "Advisor ID and Testimonial ID are required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { otpCode } = body;

    if (!otpCode) {
      return NextResponse.json(
        { error: "OTP code is required" },
        { status: 400 }
      );
    }

    // Fetch the testimonial
    const { data: testimonial, error: fetchError } = await supabase
      .from("advisor_testimonials")
      .select("*")
      .eq("id", testimonialId)
      .eq("advisor_id", advisorId)
      .single();

    if (fetchError || !testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Check if OTP is expired
    if (new Date(testimonial.otp_expires_at) < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired. Please submit a new testimonial." },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (testimonial.otp_code !== otpCode) {
      return NextResponse.json(
        { error: "Invalid OTP code" },
        { status: 400 }
      );
    }

    // Update testimonial to verified and approved
    const { data: updated, error: updateError } = await supabase
      .from("advisor_testimonials")
      .update({
        is_verified: true,
        status: "approved",
        otp_code: null, // Clear OTP after verification
        updated_at: new Date().toISOString(),
      })
      .eq("id", testimonialId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(
      {
        success: true,
        message: "Testimonial verified and approved",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying testimonial:", error);
    return NextResponse.json(
      { error: "Failed to verify testimonial", success: false },
      { status: 500 }
    );
  }
}
