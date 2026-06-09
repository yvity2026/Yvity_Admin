import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyDevDummyOtp, isDevDummyOtpEnabled } from "@/lib/auth/devDummyOtp";
import { S3_FOLDERS } from "@/lib/s3/Types";
import { uploadToS3 } from "@/lib/s3/upload";
import {
  mapPlatformReviewForLanding,
  mapPlatformReviewRow,
} from "@/lib/admin/platform-reviews/mapPlatformReviewRecord";
import {
  insertLocalPlatformReview,
  listLocalPublishedPlatformReviews,
  useLocalPlatformReviews,
} from "@/lib/local-data/platform-reviews";
import {
  normalizeIndianMobile,
  parseRating,
  validatePlatformTestimonialDraft,
} from "@/lib/platform-testimonials/submit-utils";

async function saveMediaFile(file, type) {
  if (!file || typeof file.arrayBuffer !== "function") return null;

  const maxSize = 20 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File too large. Please upload a file under 20MB");
  }

  if (type === "audio" && !String(file.type || "").startsWith("audio/")) {
    throw new Error("Please choose a valid audio file");
  }

  if (type === "video" && !String(file.type || "").startsWith("video/")) {
    throw new Error("Please choose a valid video file");
  }

  const folder =
    type === "video" ? S3_FOLDERS.testimonial_video : S3_FOLDERS.testimonial_audio;
  const upload = await uploadToS3({
    file: Buffer.from(await file.arrayBuffer()),
    fileName: file.name || `platform_${type}`,
    mimeType: file.type || "application/octet-stream",
    folder,
  });

  return upload.url;
}

function parseSubmissionBody(body, isFormData) {
  if (isFormData) {
    return {
      name: String(body.get("name") || body.get("fullName") || "").trim(),
      profession: String(body.get("profession") || "").trim(),
      city: String(body.get("city") || body.get("location") || "").trim(),
      respondent_type: String(body.get("respondent_type") || "customer").trim().toLowerCase(),
      mobile_number: normalizeIndianMobile(body.get("mobile_number") || body.get("mobile")),
      testimonial_type: String(body.get("testimonial_type") || body.get("type") || "text")
        .trim()
        .toLowerCase(),
      testimonial_rating: parseRating(body.get("testimonial_rating") || body.get("rating")),
      content: String(body.get("content") || body.get("quote") || "").trim(),
      media_url: String(body.get("media_url") || "").trim() || null,
      mediaFile: body.get("media") instanceof File && body.get("media").size > 0 ? body.get("media") : null,
      otp: String(body.get("otp") || "").trim(),
      skipOtp: String(body.get("skipOtp") || "") === "true",
    };
  }

  return {
    name: String(body?.name || "").trim(),
    profession: String(body?.profession || "").trim(),
    city: String(body?.city || "").trim(),
    respondent_type: String(body?.respondent_type || "customer").trim().toLowerCase(),
    mobile_number: normalizeIndianMobile(body?.mobile_number),
    testimonial_type: String(body?.testimonial_type || "text").trim().toLowerCase(),
    testimonial_rating: parseRating(body?.testimonial_rating),
    content: String(body?.content || "").trim(),
    media_url: String(body?.media_url || "").trim() || null,
    mediaFile: null,
    otp: String(body?.otp || "").trim(),
    skipOtp: Boolean(body?.skipOtp),
  };
}

export async function GET() {
  try {
    if (useLocalPlatformReviews()) {
      const rows = listLocalPublishedPlatformReviews();
      return NextResponse.json({
        success: true,
        data: rows.map(mapPlatformReviewForLanding),
      });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("yvity_testimonials")
      .select("*")
      .eq("status", "approved")
      .order("testimonial_rating", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error("GET /api/platform-testimonials failed:", error);
      return NextResponse.json({ error: "Unable to load testimonials" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: (data || []).map(mapPlatformReviewForLanding),
    });
  } catch (error) {
    console.error("GET /api/platform-testimonials failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const isFormData = contentType.includes("multipart/form-data");
    const rawBody = isFormData ? await request.formData() : await request.json();
    const draft = parseSubmissionBody(rawBody, isFormData);

    const validationError = validatePlatformTestimonialDraft(draft);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!draft.skipOtp) {
      if (!draft.otp) {
        return NextResponse.json({ error: "OTP verification is required" }, { status: 401 });
      }
      if (!(isDevDummyOtpEnabled() && verifyDevDummyOtp(draft.mobile_number, draft.otp))) {
        return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 401 });
      }
    }

    let mediaUrl = draft.media_url;
    if (draft.testimonial_type !== "text") {
      if (draft.mediaFile) {
        mediaUrl = await saveMediaFile(draft.mediaFile, draft.testimonial_type);
      }
      if (!mediaUrl) {
        return NextResponse.json(
          { error: "Audio and video testimonials require an uploaded file" },
          { status: 400 },
        );
      }
    }

    const payload = {
      name: draft.name,
      profession: draft.profession,
      city: draft.city,
      respondent_type: draft.respondent_type,
      mobile_number: draft.mobile_number,
      testimonial_type: draft.testimonial_type,
      testimonial_rating: draft.testimonial_rating,
      content: draft.testimonial_type === "text" ? draft.content : null,
      media_url: draft.testimonial_type === "text" ? null : mediaUrl,
    };

    if (useLocalPlatformReviews()) {
      const record = insertLocalPlatformReview(payload);
      return NextResponse.json(
        {
          success: true,
          message: "Thank you! Your YVITY testimonial was submitted for review.",
          data: mapPlatformReviewRow(record),
        },
        { status: 201 },
      );
    }

    const supabase = createAdminClient();

    const { data: duplicate } = await supabase
      .from("yvity_testimonials")
      .select("id")
      .eq("mobile_number", payload.mobile_number)
      .eq("testimonial_type", payload.testimonial_type)
      .maybeSingle();

    if (duplicate?.id) {
      return NextResponse.json(
        {
          error: `You already submitted a ${payload.testimonial_type} testimonial for this mobile number`,
        },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("yvity_testimonials")
      .insert({
        ...payload,
        status: "submitted",
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: `You already submitted a ${payload.testimonial_type} testimonial for this mobile number`,
          },
          { status: 409 },
        );
      }
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your YVITY testimonial was submitted for review.",
        data: mapPlatformReviewRow(data),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/platform-testimonials failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit testimonial" },
      { status: 500 },
    );
  }
}
