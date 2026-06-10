import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashOtp, hashPhone, normalizePhone } from "@/lib/auth/hash";
import { normalizePermissions } from "@/lib/admin/permissions";
import { createAdminClient } from "@/lib/supabase/server";
import {
  devAdminSession,
  isDevAdminPhone,
  isDevAdminAuthEnabled,
  verifyDevAdminOtp,
} from "@/lib/admin-dev-auth";
import { isDevDummyOtpEnabled, verifyDevDummyOtp } from "@/lib/auth/devDummyOtp";
import { findActiveAdminByPhone } from "@/lib/admin/adminUsers";
import { mapAdminLoginApiError } from "@/lib/auth/adminLoginApiError";

async function createAdminSessionResponse(admin) {
  const response = NextResponse.json({
    success: true,
    admin: {
      id: admin.id,
      role: admin.role,
      permissions: normalizePermissions(admin.permissions),
    },
  });

  response.cookies.set(
    "admin_session",
    JSON.stringify({
      admin_id: admin.id,
      role: admin.role,
      permissions: normalizePermissions(admin.permissions),
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    },
  );

  return response;
}

export async function POST(request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP required" },
        { status: 400 },
      );
    }

    const mobile = normalizePhone(phone);

    if (isDevAdminAuthEnabled() && isDevAdminPhone(mobile) && verifyDevAdminOtp(otp)) {
      const session = devAdminSession();
      const response = NextResponse.json({
        success: true,
        admin: {
          id: session.admin_id,
          role: session.role,
          permissions: session.permissions,
        },
      });

      response.cookies.set("admin_session", JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    const supabase = createAdminClient();

    if (isDevDummyOtpEnabled() && verifyDevDummyOtp(phone, otp)) {
      const { admin, error: adminLookupError } = await findActiveAdminByPhone(
        supabase,
        mobile,
      );

      if (adminLookupError) {
        console.error("[admin/login/verify-otp] admin lookup failed:", adminLookupError);
        return NextResponse.json(
          { error: "Unable to verify admin account" },
          { status: 503 },
        );
      }

      if (!admin) {
        return NextResponse.json(
          {
            error:
              "This mobile number is not registered as an admin. Ask a super admin to add you under Roles & Permissions.",
          },
          { status: 404 },
        );
      }

      return createAdminSessionResponse(admin);
    }

    const phoneHash = hashPhone(phone);
    // 1. get latest OTP
    const { data: otpRecord, error } = await supabase
      .from("admin_otps")
      .select("*")
      .eq("phone", phoneHash)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // 2. expiry check
    if (Date.now() > new Date(otpRecord.expires_at).getTime()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // 3. verify hash
    if (hashOtp(otp) !== otpRecord.otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // 4. mark used
    await supabase
      .from("admin_otps")
      .update({ used: true })
      .eq("id", otpRecord.id);

    const { admin, error: adminLookupError } = await findActiveAdminByPhone(
      supabase,
      mobile,
    );

    if (adminLookupError) {
      console.error("[admin/login/verify-otp] admin lookup failed:", adminLookupError);
      return NextResponse.json(
        { error: "Unable to verify admin account" },
        { status: 503 },
      );
    }

    if (!admin) {
      return NextResponse.json(
        {
          error:
            "This mobile number is not registered as an admin. Ask a super admin to add you under Roles & Permissions.",
        },
        { status: 404 },
      );
    }

    return createAdminSessionResponse(admin);
  } catch (err) {
    console.error("[admin/login/verify-otp]", err);
    const { error, status } = mapAdminLoginApiError(err);
    return NextResponse.json({ error }, { status });
  }
}
