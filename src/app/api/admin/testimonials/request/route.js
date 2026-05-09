import { NextResponse } from "next/server";

// import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
// import { createAdminClient } from "@/lib/supabase/server";
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

// export async function GET(request) {
//   try {
//     const advisor = await ValidateAdvisor();

//     if (!advisor?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const mobile = normalizeIndianMobile(
//       request.nextUrl.searchParams.get("mobile")
//     );

//     if (!/^[6-9]\d{9}$/.test(mobile)) {
//       return NextResponse.json(
//         { error: "Enter valid 10-digit mobile number" },
//         { status: 400 }
//       );
//     }

//     const supabase = createAdminClient();
//     const client = await findUserByMobile(supabase, mobile);

//     if (!client?.id) {
//       return NextResponse.json(
//         { error: "No user found with this mobile number" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: {
//         id: client.id,
//         name: client.name || "",
//         mobile: client.mobile || mobile,
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message || "Failed to find client" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request) {
  try {
    // const advisor = await ValidateAdvisor();

    // if (!advisor?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();

    const name = String(body?.name || "").trim();
    const mobile = String(body?.mobile || "").trim();
    const personalMessage = String(body?.message || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { error: "Enter valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    // const supabase = createAdminClient();
    // const client = await findUserByMobile(supabase, mobile);

    // if (!client?.id) {
    //   return NextResponse.json(
    //     { error: "No user found with this mobile number" },
    //     { status: 404 }
    //   );
    // }

    const baseUrl = resolveTestimonialBaseUrl(request);

    if (!baseUrl) {
      return NextResponse.json(
        { error: "Unable to build testimonial link" },
        { status: 500 }
      );
    }

    const query = new URLSearchParams({
      name,
      mobile,
      source: "whatsapp",
    });

    const profileLink = `${baseUrl}${TESTIMONIAL_PUBLIC_PATH}?${query.toString()}`;

    await sendWhatsAppTestimonialRequest(mobile, {
      client_name: name,
      personal_message: personalMessage || DEFAULT_PERSONAL_MESSAGE,
      profile_link: profileLink,
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial request sent successfully",
    });
  } catch (error) {
    console.error("[TESTIMONIAL_REQUEST][ERROR]", error);

    return NextResponse.json(
      { error: error.message || "Failed to send testimonial request" },
      { status: 500 }
    );
  }
}
