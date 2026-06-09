import { NextResponse } from "next/server";
import { isDevDummyOtpEnabled } from "@/lib/auth/devDummyOtp";

export async function POST(request) {
  try {
    const body = await request.json();
    const mobile = String(body?.mobile || "").replace(/\D/g, "").slice(-10);

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
    }

    if (isDevDummyOtpEnabled()) {
      return NextResponse.json({
        success: true,
        message: "Dev OTP enabled — use 123456",
      });
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your mobile number",
    });
  } catch (error) {
    console.error("[platform-testimonials/otp/send]", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
