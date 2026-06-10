/**
 * WhatsApp env — aligned with Yvity_Users src/lib/server/otp/whatsapp-config.ts
 * Keeps WHATSAPP_ACCESS_TOKEN as the primary production secret.
 */

export function getWhatsAppAccessToken() {
  return (
    process.env.WHATSAPP_ACCESS_TOKEN ||
    process.env.WHATSAPP_API_TOKEN ||
    ""
  ).trim();
}

export function getWhatsAppPhoneNumberId() {
  return (process.env.WHATSAPP_PHONE_NUMBER_ID || "").trim();
}

export function getOtpTemplateName() {
  return (
    process.env.WHATSAPP_OTP_TEMPLATE_NAME ||
    process.env.WHATSAPP_TEMPLATE_NAME ||
    ""
  ).trim();
}

/**
 * Resolved WhatsApp send endpoint (same rules as Yvity_Users).
 * - Custom gateway: WHATSAPP_API_URL as-is
 * - Meta Graph base URL + phone number id → .../messages
 * - Phone number id only → graph.facebook.com/v21.0/{id}/messages
 */
export function getWhatsAppMessagesUrl() {
  const explicit = (process.env.WHATSAPP_API_URL || "").trim();

  if (explicit) {
    if (explicit.includes("/messages")) return explicit;

    if (explicit.includes("graph.facebook.com")) {
      const phoneNumberId = getWhatsAppPhoneNumberId();
      let base = explicit.replace(/\/$/, "");
      if (phoneNumberId && !base.includes(phoneNumberId)) {
        base = `${base}/${phoneNumberId}`;
      }
      return `${base}/messages`;
    }

    return explicit;
  }

  const phoneNumberId = getWhatsAppPhoneNumberId();
  if (!phoneNumberId) return "";

  const version = (process.env.WHATSAPP_GRAPH_API_VERSION || "v21.0").trim();
  return `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;
}

/** @deprecated use getWhatsAppMessagesUrl */
export function getWhatsAppApiUrl() {
  return (process.env.WHATSAPP_API_URL || "").trim() || getWhatsAppMessagesUrl();
}

function isMetaGraphEndpoint() {
  return getWhatsAppMessagesUrl().toLowerCase().includes("graph.facebook.com");
}

/** Meta Graph template send when a template name is configured and we're not in gateway mode. */
export function useMetaOtpTemplate() {
  const mode = (process.env.WHATSAPP_OTP_DELIVERY_MODE || "").trim().toLowerCase();
  if (mode === "gateway") return false;
  if (!getOtpTemplateName()) return false;
  if (mode === "meta") return true;

  return isMetaGraphEndpoint();
}

export function isWhatsAppApiConfigured() {
  return Boolean(getWhatsAppAccessToken() && getWhatsAppMessagesUrl());
}

export function isWhatsAppOtpConfigured() {
  return isWhatsAppApiConfigured();
}

export function buildOtpWhatsAppMessage(code) {
  const template = process.env.WHATSAPP_OTP_MESSAGE?.trim();
  if (template?.includes("{code}")) {
    return template.replaceAll("{code}", String(code));
  }
  return `Your YVITY verification code is ${code}. Valid for 5 minutes. Do not share this code with anyone.`;
}
