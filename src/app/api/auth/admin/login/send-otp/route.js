import { NextResponse } from "next/server";
import { sendWhatsAppOtp } from "@/lib/auth/sendWhatsappOtp";
import { hashOtp, hashPhone, normalizePhone } from "@/lib/auth/hash";
import crypto from 'crypto'
import { createAdminClient } from "@/lib/supabase/server";

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

    return NextResponse.json({ success: true },{OTP : otp});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}