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
  
  TESTIMONIAL_REQUEST_WITH_PROFILE: {
    name: "testimonial_request_with_profile",
    language: "en",
    bodyParams: ["client_name", "personal_message", "profile_link"],
  },

  PLATFORM_ANNOUNCEMENT: {
    name:
      process.env.WHATSAPP_BROADCAST_TEMPLATE_NAME ||
      process.env.WHATSAPP_PLATFORM_TEMPLATE_NAME ||
      "platform_update",
    language:
      process.env.WHATSAPP_BROADCAST_TEMPLATE_LANGUAGE ||
      process.env.WHATSAPP_TEMPLATE_LANGUAGE ||
      "en",
    bodyParams: ["message"],
  },
};


