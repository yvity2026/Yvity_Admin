import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";

export async function POST(req) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();

    const {
      advisor_id,
      mobile_number,
      recommendations,
      verification_token,
    } = body;

    // 🔐 Basic validation
    if (!advisor_id || !mobile_number) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobile_number)) {
      return NextResponse.json(
        { error: "Invalid mobile number" },
        { status: 400 }
      );
    }

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      return NextResponse.json(
        { error: "Select at least one reason" },
        { status: 400 }
      );
    }

    // 🔐 Auth check
    let user_id = null;
    let is_mobile_verified = false;

    try {
      const currentUser = await ValidateUser();
      if (currentUser) {
        user_id = currentUser.id;
        is_mobile_verified = true;
      }
    } catch (err) {
      // Not logged in → must verify OTP
      if (!verification_token) {
        return NextResponse.json(
          { error: "OTP verification required", require_otp: true },
          { status: 403 }
        );
      }

      // ✅ Decode token
      let decoded;
      try {
        decoded = JSON.parse(
          Buffer.from(verification_token, "base64").toString()
        );
      } catch {
        return NextResponse.json(
          { error: "Invalid verification token" },
          { status: 401 }
        );
      }

      // ✅ Validate token
      if (decoded.mobile_number !== mobile_number) {
        return NextResponse.json(
          { error: "Token mobile mismatch" },
          { status: 401 }
        );
      }

      // ⏱ Expiry check (10 mins)
      const TEN_MIN = 10 * 60 * 1000;
      if (Date.now() - decoded.verified_at > TEN_MIN) {
        return NextResponse.json(
          { error: "OTP expired" },
          { status: 401 }
        );
      }

      is_mobile_verified = true;
    }

    // ✅ Insert
    const { data, error } = await supabase
      .from("advisor_recommendations")
      .insert({
        advisor_id,
        user_id,
        mobile_number,
        recommendations,
        status: "pending",
        is_verified: is_mobile_verified,
        is_mobile_verified,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: "Recommendation submitted",
        data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}