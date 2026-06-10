import {
  buildOtpWhatsAppMessage,
  getWhatsAppAccessToken,
  getWhatsAppApiUrl,
  isWhatsAppApiConfigured,
} from "@/lib/whatsapp/config";
import { toWhatsAppFormat } from "@/lib/whatsapp/sender";

/**
 * Gateway OTP delivery — same contract as Yvity_Users:
 * POST { to, message } with Bearer WHATSAPP_ACCESS_TOKEN.
 */
export async function sendOtpViaGateway(phone, otp) {
  if (!isWhatsAppApiConfigured()) {
    throw new Error("[WHATSAPP] Missing API config");
  }

  const to = toWhatsAppFormat(phone);
  const message = buildOtpWhatsAppMessage(otp);
  const apiUrl = getWhatsAppApiUrl();
  const token = getWhatsAppAccessToken();

  console.log("[WHATSAPP][OTP GATEWAY]", { to, preview: `${message.slice(0, 40)}...` });

  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, message }),
      });

      const responseText = await response.text();
      console.log("[WHATSAPP][OTP GATEWAY RESPONSE]", response.status, responseText.slice(0, 500));

      if (!response.ok) {
        const detail = responseText.slice(0, 300).trim();
        throw new Error(
          `[WHATSAPP] Gateway returned ${response.status}${detail ? `: ${detail}` : ""}`,
        );
      }

      return { status: response.status, responseText, mode: "gateway" };
    } catch (error) {
      lastError = error;
      console.error(`[WHATSAPP][OTP GATEWAY RETRY ${attempt}]`, error);
    }
  }

  const errorMessage = lastError?.message || "Failed to send OTP after 3 retries";
  throw new Error(
    errorMessage.includes("[WHATSAPP]") ? errorMessage : `[WHATSAPP] ${errorMessage}`,
  );
}
