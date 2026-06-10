import { sendOtpViaGateway } from "@/lib/whatsapp/otpDelivery";

export async function sendWhatsAppOtp(phone, otp) {
  if (!phone) {
    throw new Error("[WHATSAPP] Phone is required");
  }

  if (!otp) {
    throw new Error("[WHATSAPP] OTP is required");
  }

  try {
    return await sendOtpViaGateway(phone, otp);
  } catch (error) {
    console.error("[WHATSAPP][OTP SEND ERROR]", {
      phone,
      message: error.message,
    });

    throw new Error(error.message || "Failed to send OTP via WhatsApp");
  }
}
