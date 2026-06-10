import { NextResponse } from "next/server";
import { sendWhatsAppOtp } from "@/lib/auth/sendWhatsappOtp";
import { hashOtp, hashPhone, normalizePhone } from "@/lib/auth/hash";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { isDevAdminPhone, isDevAdminAuthEnabled } from "@/lib/admin-dev-auth";
import {
  devDummyOtpCode,
  isDevDummyOtpEnabled,
  storeDevDummyOtp,
} from "@/lib/auth/devDummyOtp";
import { mapAdminLoginApiError } from "@/lib/auth/adminLoginApiError";
import { findActiveAdminByPhone } from "@/lib/admin/adminUsers";
import { isWhatsAppOtpConfigured } from "@/lib/whatsapp/config";

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();
const OTP_TTL_SECONDS = 5 * 60;

export async function POST(request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    const mobile = normalizePhone(phone);

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    if (isDevAdminAuthEnabled() && isDevAdminPhone(mobile)) {
      return NextResponse.json({
        success: true,
        message: "Dev OTP enabled (use 123456)",
      });
    }

    const supabase = createAdminClient();

    const { admin, error: adminLookupError } = await findActiveAdminByPhone(
      supabase,
      mobile,
    );

    if (adminLookupError) {
      console.error("[admin/login/send-otp] admin lookup failed:", adminLookupError);
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

    if (isDevDummyOtpEnabled()) {
      storeDevDummyOtp(phone, admin.id);
      return NextResponse.json({
        success: true,
        message: `Dev OTP: ${devDummyOtpCode()}`,
      });
    }

    if (!isWhatsAppOtpConfigured()) {
      return NextResponse.json(
        { error: "WhatsApp OTP is not configured" },
        { status: 503 },
      );
    }

    const otp = generateOtp();
    const phoneHash = hashPhone(phone);
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000).toISOString();

    const { data: otpRow, error: insertError } = await supabase
      .from("admin_otps")
      .insert({
        admin_id: admin.id,
        phone: phoneHash,
        otp: otpHash,
        purpose: "login",
        expires_at: expiresAt,
        used: false,
      })
      .select("id")
      .single();

    if (insertError || !otpRow?.id) {
      throw insertError || new Error("Failed to store OTP");
    }

    try {
      await sendWhatsAppOtp(`+91${mobile}`, otp);
    } catch (sendError) {
      await supabase.from("admin_otps").delete().eq("id", otpRow.id);
      throw sendError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/login/send-otp]", err);
    const { error, status } = mapAdminLoginApiError(err);
    return NextResponse.json({ error }, { status });
  }
}