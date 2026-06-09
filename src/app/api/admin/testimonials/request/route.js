import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { resolveTestimonialRecipientById } from "@/lib/admin/platform-reviews/resolveTestimonialRecipient";
import { sendWhatsAppTestimonialRequest } from "@/lib/whatsapp/triggers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_PERSONAL_MESSAGE =
  "Your feedback means a lot to us and would really help.";
const TESTIMONIAL_PUBLIC_PATH = "/testimonial";

function resolveTestimonialBaseUrl(request) {
  const envBaseUrl =
    process.env.TESTIMONIAL_REQUEST_BASE_URL ||
    process.env.PUBLIC_APP_URL ||
    process.env.DASHBOARD_PRODUCTION_FALLBACK ||
    process.env.DASHBOARD_LOCAL_FALLBACK ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.SITE_URL;

  if (envBaseUrl) {
    return envBaseUrl.replace(/\/+$/, "");
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");

  if (!host) {
    return "";
  }

  const protocol =
    forwardedProto || (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export async function POST(request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const userId = String(body?.userId || "").trim();
    const personalMessage = String(body?.message || "").trim();

    if (!userId) {
      return NextResponse.json(
        { error: "Select a user to send the testimonial request" },
        { status: 400 },
      );
    }

    const recipient = await resolveTestimonialRecipientById(userId);

    if (!recipient) {
      return NextResponse.json(
        { error: "User not found or has no valid mobile on file" },
        { status: 404 },
      );
    }

    const baseUrl = resolveTestimonialBaseUrl(request);

    if (!baseUrl) {
      return NextResponse.json(
        { error: "Unable to build testimonial link" },
        { status: 500 },
      );
    }

    const query = new URLSearchParams({
      name: recipient.name,
      mobile: recipient.mobile,
      source: "whatsapp",
    });

    const profileLink = `${baseUrl}${TESTIMONIAL_PUBLIC_PATH}?${query.toString()}`;

    await sendWhatsAppTestimonialRequest(recipient.mobile, {
      client_name: recipient.name,
      personal_message: personalMessage || DEFAULT_PERSONAL_MESSAGE,
      profile_link: profileLink,
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial request sent successfully",
      recipient: {
        id: recipient.id,
        name: recipient.name,
      },
    });
  } catch (error) {
    console.error("[TESTIMONIAL_REQUEST][ERROR]", error);

    return NextResponse.json(
      { error: error.message || "Failed to send testimonial request" },
      { status: 500 },
    );
  }
}
