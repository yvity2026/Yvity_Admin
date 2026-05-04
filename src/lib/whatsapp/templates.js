export const WHATSAPP_TEMPLATES = {
  LOGIN_OTP: {
    name:
      process.env.WHATSAPP_OTP_TEMPLATE_NAME ||
      process.env.WHATSAPP_TEMPLATE_NAME,
    language:
      process.env.WHATSAPP_OTP_TEMPLATE_LANGUAGE ||
      process.env.WHATSAPP_TEMPLATE_LANGUAGE ||
      "en",
    bodyParams: ["otp"],
    buttonParams: ["otp"],
    button: {
      sub_type: process.env.WHATSAPP_OTP_BUTTON_SUB_TYPE || "url",
      index: "0",
      parameterType:
        process.env.WHATSAPP_OTP_BUTTON_SUB_TYPE === "copy_code"
          ? "coupon_code"
          : "text",
    },
  },
};