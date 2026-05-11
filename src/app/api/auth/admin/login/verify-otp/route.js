import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashOtp, hashPhone } from "@/lib/auth/hash";
import { normalizePermissions } from "@/lib/admin/permissions";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP required" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const phoneHash = hashPhone(phone);
    console.log(phoneHash);
    // 1. get latest OTP
    const { data: otpRecord, error } = await supabase
      .from("admin_otps")
      .select("*")
      .eq("phone", phoneHash)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    console.log(error, otpRecord);
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

    // 5. get admin
    const { data: admin } = await supabase
      .from("admin_users")
      .select("id, role, permissions, is_active")
      .eq("phone_number", `+91${phone}`)
      .eq("is_active", true)
      .single();

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
