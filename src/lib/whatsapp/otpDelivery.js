import {
  buildOtpWhatsAppMessage,
  getOtpTemplateName,
  getWhatsAppAccessToken,
  getWhatsAppMessagesUrl,
  isWhatsAppApiConfigured,
  useMetaOtpTemplate,
} from "@/lib/whatsapp/config";
import { toWhatsAppFormat } from "@/lib/whatsapp/sender";

function parseWhatsAppApiError(responseText) {
  try {
    const data = JSON.parse(responseText);
    return (
      data?.error?.error_data?.details ||
      data?.error?.message ||
      responseText.slice(0, 300)
    );
  } catch {
    return responseText.slice(0, 300);
  }
}

function hasMetaMessageId(responseText) {
  try {
    const data = JSON.parse(responseText);
    return Boolean(data?.messages?.[0]?.id);
  } catch {
    return false;
  }
}

function buildMetaOtpPayload(to, code, includeButton) {
  const templateName = getOtpTemplateName();
  if (!templateName) {
    throw new Error("[WHATSAPP] WHATSAPP_OTP_TEMPLATE_NAME is not configured");
  }

  const language = process.env.WHATSAPP_OTP_TEMPLATE_LANGUAGE?.trim() || "en";
  const buttonSubType = process.env.WHATSAPP_OTP_BUTTON_SUB_TYPE?.trim() || "copy_code";
  const buttonParamType = buttonSubType === "copy_code" ? "coupon_code" : "text";
  const buttonParameter =
    buttonParamType === "coupon_code"
      ? { type: "coupon_code", coupon_code: code }
      : { type: "text", text: code };

  const components = [
    {
      type: "body",
      parameters: [{ type: "text", text: code }],
    },
  ];

  if (includeButton) {
    components.push({
      type: "button",
      sub_type: buttonSubType,
      index: "0",
      parameters: [buttonParameter],
    });
  }

  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: language },
      components,
    },
  };
}

async function postWhatsAppRequest({ url, token, body, preview, to }) {
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseText = await response.text();
      const isMeta = url.includes("graph.facebook.com");
      const metaAccepted = !isMeta || hasMetaMessageId(responseText);

      console.log(
        `[WHATSAPP][OTP RESPONSE attempt ${attempt}]`,
        response.status,
        responseText.slice(0, 500),
      );

      if (response.ok && metaAccepted) {
        return { status: response.status, responseText, preview, to };
      }

      const detail = response.ok
        ? "Meta API accepted request but returned no message id"
        : parseWhatsAppApiError(responseText);

      lastError = new Error(`[WHATSAPP] Gateway returned ${response.status}: ${detail}`);
    } catch (error) {
      lastError = error;
      console.error(`[WHATSAPP][OTP RETRY ${attempt}]`, error?.message || error);
    }
  }

  throw lastError || new Error("[WHATSAPP] Failed to send OTP after 3 attempts");
}

async function sendMetaOtpTemplate({ phone, code, apiUrl, apiToken }) {
  const includeButtonEnv = process.env.WHATSAPP_OTP_INCLUDE_BUTTON?.trim();
  const attempts =
    includeButtonEnv === "true"
      ? [true]
      : includeButtonEnv === "false"
        ? [false]
        : [false, true];

  let lastError = null;

  for (const includeButton of attempts) {
    try {
      const payload = buildMetaOtpPayload(phone, code, includeButton);
      return await postWhatsAppRequest({
        url: apiUrl,
        token: apiToken,
        body: payload,
        preview: `template:${payload.template.name}${includeButton ? "+button" : ""}`,
        to: phone,
      });
    } catch (error) {
      lastError = error;
      const message = error?.message || "";
      const retryable =
        !includeButton &&
        (message.toLowerCase().includes("button") ||
          message.toLowerCase().includes("component") ||
          message.includes("132000") ||
          message.toLowerCase().includes("parameter"));

      if (!retryable || includeButtonEnv !== undefined) {
        throw error;
      }
    }
  }

  throw lastError || new Error("[WHATSAPP] Failed to send Meta OTP template");
}

/**
 * Admin OTP delivery — aligned with Yvity_Users sendOtpWhatsApp().
 */
export async function sendOtpViaGateway(phone, otp) {
  if (!isWhatsAppApiConfigured()) {
    throw new Error("[WHATSAPP] Missing API config");
  }

  const to = toWhatsAppFormat(phone);
  const apiUrl = getWhatsAppMessagesUrl();
  const apiToken = getWhatsAppAccessToken();
  const mode = useMetaOtpTemplate() ? "meta" : "gateway";

  console.log("[WHATSAPP][OTP SEND]", { mode, url: apiUrl, to });

  if (useMetaOtpTemplate()) {
    return sendMetaOtpTemplate({ phone: to, code: String(otp), apiUrl, apiToken });
  }

  const message = buildOtpWhatsAppMessage(otp);
  return postWhatsAppRequest({
    url: apiUrl,
    token: apiToken,
    body: { to, message },
    preview: message.slice(0, 80),
    to,
  });
}
