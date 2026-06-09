import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import {
  parseAudienceParams,
  resolveSupabaseTestimonialAudience,
} from "@/lib/admin/platform-reviews/resolveTestimonialAudience";
import { resolveLocalTestimonialAudience } from "@/lib/local-data/testimonial-audience";
import { useLocalTestimonialAudience } from "@/lib/local-data/testimonial-audience";
import { sendWhatsAppTestimonialRequest } from "@/lib/whatsapp/triggers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_PERSONAL_MESSAGE =
  "Your feedback about YVITY would really help us improve the platform.";
const TESTIMONIAL_PUBLIC_PATH = "/testimonial";

function resolveTestimonialBaseUrl(request) {
  const envBaseUrl =
    process.env.TESTIMONIAL_REQUEST_BASE_URL ||
    process.env.PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL;

  if (envBaseUrl) return envBaseUrl.replace(/\/+$/, "");

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return "";

  const protocol =
    request.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export async function POST(request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const filters = parseAudienceParams(body?.filters || body);
    const message = String(body?.message || "").trim();

    let recipients = [];

    if (useLocalTestimonialAudience()) {
      recipients = resolveLocalTestimonialAudience(filters).recipients;
    } else {
      const supabase = createAdminClient();
      recipients = await resolveSupabaseTestimonialAudience(supabase, filters);
    }

    if (!recipients.length) {
      return NextResponse.json(
        { error: "No matching recipients for these filters. Try broadening the audience." },
        { status: 404 },
      );
    }

    const baseUrl = resolveTestimonialBaseUrl(request);
    if (!baseUrl) {
      return NextResponse.json({ error: "Unable to build testimonial link" }, { status: 500 });
    }

    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        const query = new URLSearchParams({
          name: recipient.name,
          mobile: recipient.mobile,
          source: "whatsapp-bulk",
        });

        const profileLink = `${baseUrl}${TESTIMONIAL_PUBLIC_PATH}?${query.toString()}`;

        await sendWhatsAppTestimonialRequest(recipient.mobile, {
          client_name: recipient.name,
          personal_message: message || DEFAULT_PERSONAL_MESSAGE,
          profile_link: profileLink,
        });

        sent += 1;
      } catch (error) {
        console.error("[bulk testimonial request]", recipient.id, error);
        failed += 1;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: recipients.length,
      message: `Sent ${sent} testimonial request${sent === 1 ? "" : "s"}.`,
    });
  } catch (error) {
    console.error("[testimonials/request/bulk]", error);
    return NextResponse.json(
      { error: error.message || "Failed to send bulk testimonial requests" },
      { status: 500 },
    );
  }
}
