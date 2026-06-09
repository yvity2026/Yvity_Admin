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

    const { data: admin } = await supabase
      .from("admin_users")
      .select("id, phone_number")
      .eq("phone_number", `+91${mobile}`)
      .eq("is_active", true)
      .single();

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    if (isDevDummyOtpEnabled()) {
      storeDevDummyOtp(phone, admin.id);
      return NextResponse.json({
        success: true,
        message: `Dev OTP: ${devDummyOtpCode()}`,
      });
    }

    const otp = generateOtp();

    const phoneHash = hashPhone(phone);
    const otpHash = hashOtp(otp);

    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000).toISOString();

    await sendWhatsAppOtp(`+91${mobile}`, otp);

    await supabase.from("admin_otps").insert({
      admin_id: admin.id,
      phone: phoneHash,
      otp: otpHash,
      expires_at: expiresAt,
      used: false,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/login/send-otp]", err);
    const { error, status } = mapAdminLoginApiError(err);
    return NextResponse.json({ error }, { status });
  }
}