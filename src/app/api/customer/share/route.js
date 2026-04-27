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

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const anonymousId = crypto
      .createHash("sha256")
      .update(ip + userAgent + "share")
      .digest("hex");

    const { data: advisorProfile, error: profileError } = await supabase
      .from("advisor_profiles")
      .select("id,advisor_id")
      .eq("id", profileId)
      .maybeSingle();

    if (profileError || !advisorProfile?.advisor_id) {
      return NextResponse.json(
        { error: profileError?.message || "Advisor profile not found" },
        { status: 404 }
      );
    }

    const shareType =
      viewerId && viewerId === advisorProfile.advisor_id ? "self" : "client";

    const { data: existing } = await supabase
      .from("advisor_profile_stats")
      .select("id")
      .eq("profile_id", profileId)
      .eq("stats_type", "share")
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
      return apiResponse({ message: "Already shared recently" });
    }

    const { error: statsError } = await supabase
      .from("advisor_profile_stats")
      .insert({
        profile_id: profileId,
        viewer_id: viewerId,
        anonymous_id: viewerId ? null : anonymousId,
        stats_type: "share",
      });

    if (statsError) {
      throw statsError;
    }

    const { error: shareEventError } = await supabase
      .from("advisor_share_events")
      .insert({
        advisor_id: advisorProfile.advisor_id,
        user_id: viewerId,
        share_type: shareType,
        channel: "public-profile",
      });

    if (shareEventError) {
      throw shareEventError;
    }

    const recalculateResult = await supabase.rpc("recalculate_advisor_score", {
      p_advisor: advisorProfile.advisor_id,
    });

    if (recalculateResult.error) {
      console.error(
        "recalculate_advisor_score failed after share create:",
        recalculateResult.error
      );
    }

    return apiResponse({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
