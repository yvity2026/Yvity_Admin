import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { mobile_number, otp_code } = body;

    // Validation
    if (!mobile_number || !otp_code) {
      return NextResponse.json(
        { error: "Mobile number and OTP code are required" },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobile_number)) {
      return NextResponse.json(
        { error: "Invalid mobile number format" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp_code)) {
      return NextResponse.json(
        { error: "OTP must be 6 digits" },
        { status: 400 }
      );
    }

    // ✅ For now, use dummy OTP validation (123456)
    // In production, validate against stored OTP in database with expiry check
    const DUMMY_OTP = "123456";
    
    if (otp_code !== DUMMY_OTP) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again or request a new one." },
        { status: 401 }
      );
    }

    // TODO: In production, verify against database:
    // 1. Check if OTP exists for this mobile number
    // 2. Check if OTP has expired (usually 10 minutes)
    // 3. Mark OTP as used/verified
    // 4. Return verification token

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
        mobile_verified: true,
        verification_token: `verified_${mobile_number}_${Date.now()}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
