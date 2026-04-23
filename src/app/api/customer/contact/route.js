import { apiResponse } from "@/lib/apiResponse";
import { getUser } from "@/lib/auth/Getuser";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { profileId } = await req.json();
    const user = await getUser();
    const supabase = createAdminClient();

    let viewerId = null;

    // ✅ Logged-in user detection
    if (user?.token) {
      const { data: viewer } = await supabase
        .from("users")
        .select("id")
        .filter("device_tokens", "cs", JSON.stringify([{ token: user.token }]))
        .maybeSingle();

      if (viewer) {
        viewerId = viewer.id;
      }
    }

    // ✅ Anonymous tracking
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    const anonymousId = crypto
      .createHash("sha256")
      .update(ip + userAgent + "contact") // 🔥 unique per event type
      .digest("hex");

    // ✅ Prevent duplicate contacts (24h window)
    const { data: existing } = await supabase
      .from("advisor_profile_stats")
      .select("id")
      .eq("profile_id", profileId)
      .eq("stats_type", "contact")
      .or(
        viewerId
          ? `viewer_id.eq.${viewerId}`
          : `anonymous_id.eq.${anonymousId}`
      )
      .gte(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      )
      .maybeSingle();

    if (existing) {
      return apiResponse({ message: "Already contacted recently" });
    }

    // ✅ Insert contact event
    await supabase.from("profile_contacts").insert({
      profile_id: profileId,
      viewer_id: viewerId,
      anonymous_id: viewerId ? null : anonymousId,
      stats_type : 'contact'
    });

    return apiResponse({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}