/**
 * WhatsApp env — aligned with Yvity_Users src/lib/server/otp/whatsapp-config.ts
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

function getGraphApiVersion() {
  return (process.env.WHATSAPP_GRAPH_API_VERSION || "v21.0").trim();
}

/** Meta Cloud API messages endpoint — ignores legacy gateway WHATSAPP_API_URL when in meta mode. */
export function getMetaOtpMessagesUrl() {
  const explicit = (process.env.WHATSAPP_API_URL || "").trim();
  const phoneNumberId = getWhatsAppPhoneNumberId();

  if (explicit?.includes("/messages") && explicit.includes("graph.facebook.com")) {
    return explicit;
  }

  if (explicit?.includes("graph.facebook.com")) {
    let base = explicit.replace(/\/$/, "");
    if (phoneNumberId && !base.includes(phoneNumberId)) {
      base = `${base}/${phoneNumberId}`;
    }
    return `${base}/messages`;
  }

  if (!phoneNumberId) return "";

  return `https://graph.facebook.com/${getGraphApiVersion()}/${phoneNumberId}/messages`;
}

/**
 * Resolved WhatsApp send endpoint (same rules as Yvity_Users).
 * - Meta OTP: Graph API when template + phone id (or mode=meta).
 * - Gateway: WHATSAPP_API_URL as-is.
 */
export function getWhatsAppMessagesUrl() {
  if (useMetaOtpTemplate()) {
    return getMetaOtpMessagesUrl();
  }

  const explicit = (process.env.WHATSAPP_API_URL || "").trim();
  if (explicit) return explicit;

  return getMetaOtpMessagesUrl();
}

/** @deprecated use getWhatsAppMessagesUrl */
export function getWhatsAppApiUrl() {
  return (process.env.WHATSAPP_API_URL || "").trim() || getWhatsAppMessagesUrl();
}

function isMetaGraphEndpoint() {
  const explicit = (process.env.WHATSAPP_API_URL || "").trim();
  if (explicit?.includes("graph.facebook.com")) return true;
  return Boolean(getWhatsAppPhoneNumberId());
}

/** Meta Graph template send when a template name is configured and we're not in gateway mode. */
export function useMetaOtpTemplate() {
  const mode = (process.env.WHATSAPP_OTP_DELIVERY_MODE || "").trim().toLowerCase();
  if (mode === "gateway") return false;
  if (!getOtpTemplateName()) return false;
  if (mode === "meta") return true;
  if (getWhatsAppPhoneNumberId()) return true;

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

export function describeWhatsAppOtpConfig() {
  return {
    configured: isWhatsAppOtpConfigured(),
    deliveryMode: useMetaOtpTemplate() ? "meta" : "gateway",
    messagesUrl: getWhatsAppMessagesUrl() || null,
    hasAccessToken: Boolean(getWhatsAppAccessToken()),
    phoneNumberId: getWhatsAppPhoneNumberId() || null,
    templateName: getOtpTemplateName() || null,
    templateLanguage: process.env.WHATSAPP_OTP_TEMPLATE_LANGUAGE?.trim() || "en",
    graphApiVersion: getGraphApiVersion(),
  };
}
