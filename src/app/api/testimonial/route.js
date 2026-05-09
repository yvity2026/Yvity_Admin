import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["text", "audio", "video"];
const ALLOWED_RESPONDENT_TYPES = ["customer", "advisor"];

function normalizeIndianMobile(phone) {
  return String(phone || "").replace(/\D/g, "").slice(-10);
}

export async function POST(request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const name = String(body?.name || "").trim();
    const profession = String(body?.profession || "").trim();
    const city = String(body?.city || "").trim();
    const respondentType = String(body?.respondent_type || "").trim().toLowerCase();
    const mobileNumber = normalizeIndianMobile(body?.mobile_number);
    const testimonialType = String(body?.testimonial_type || "text").trim().toLowerCase();
    const testimonialRating = Number(body?.testimonial_rating || 0);
    const content = String(body?.content || "").trim();
    const mediaUrl = String(body?.media_url || "").trim();

    if (!name || !profession || !city || !respondentType || !mobileNumber) {
      return NextResponse.json(
        {
          error:
            "Name, profession, city, respondent type, and mobile number are required",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_RESPONDENT_TYPES.includes(respondentType)) {
      return NextResponse.json(
        { error: "Respondent type must be either customer or advisor" },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(testimonialType)) {
      return NextResponse.json(
        { error: "Invalid testimonial type" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(testimonialRating) || testimonialRating < 1 || testimonialRating > 5) {
      return NextResponse.json(
        { error: "Please select a rating between 1 and 5" },
        { status: 400 }
      );
    }

    if (testimonialType === "text" && !content) {
      return NextResponse.json(
        { error: "Text testimonial content is required" },
        { status: 400 }
      );
    }

    if (testimonialType !== "text" && !mediaUrl) {
      return NextResponse.json(
        { error: "Audio and video testimonials require an uploaded file" },
        { status: 400 }
      );
    }

    const { data: duplicate } = await supabase
      .from("yvity_testimonials")
      .select("id")
      .eq("mobile_number", mobileNumber)
      .eq("testimonial_type", testimonialType)
      .maybeSingle();

    if (duplicate?.id) {
      return NextResponse.json(
        {
          error: `A ${testimonialType} testimonial has already been submitted for this mobile number`,
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("yvity_testimonials")
      .insert({
        name,
        profession,
        city,
        respondent_type: respondentType,
        mobile_number: mobileNumber,
        testimonial_type: testimonialType,
        testimonial_rating,
        content: testimonialType === "text" ? content : null,
        media_url: testimonialType === "text" ? null : mediaUrl,
        status: "submitted",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: `A ${testimonialType} testimonial has already been submitted for this mobile number`,
          },
          { status: 409 }
        );
      }

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
  } catch (error) {
    console.error("[PUBLIC_TESTIMONIAL][POST]", error);

    return NextResponse.json(
      { error: error.message || "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}
