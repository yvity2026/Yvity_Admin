import { NextResponse } from "next/server";
import { describeWhatsAppOtpConfig } from "@/lib/whatsapp/config";

export const dynamic = "force-dynamic";

/** Check WhatsApp OTP env wiring on Vercel (no message sent). */
export async function GET() {
  const config = describeWhatsAppOtpConfig();

  return NextResponse.json({
    ok: Boolean(config.configured),
    ...config,
    hint: config.configured
      ? "Config looks complete. If OTP still fails, check Vercel function logs for [WHATSAPP][OTP]."
      : "Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_OTP_TEMPLATE_NAME (same as Yvity_Users Vercel project).",
  });
}
