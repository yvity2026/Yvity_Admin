export const DEFAULT_PLATFORM_SETTINGS = {
  platform: {
    name: "YVITY",
    tagline: "Credibility that Connects",
    description: "India's trusted platform for financial advisors and professionals.",
    logoUrl: "/images/yvity-logo.png",
    faviconUrl: "/icon.png",
    status: "active",
  },
  branding: {
    primaryColor: "#0A4A4A",
    secondaryColor: "#F59E0B",
    buttonStyle: "rounded",
    defaultTheme: "light",
    loginBranding: true,
    emailBranding: true,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    whatsappEnabled: true,
    pushEnabled: false,
    defaultPreferences: {
      transactional: true,
      marketing: false,
      weeklyDigest: true,
    },
  },
  email: {
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    senderName: "YVITY",
    senderEmail: "noreply@yvity.in",
    footer: "© YVITY. All rights reserved.",
    testRecipient: "",
  },
  smsWhatsapp: {
    smsProvider: "msg91",
    whatsappProvider: "meta_cloud_api",
    apiUrl: "",
    apiKey: "",
    testPhone: "",
  },
  security: {
    sessionTimeoutMinutes: 10080,
    adminLoginSecurity: "otp",
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    twoFactorEnabled: false,
    loginAttemptLimit: 5,
  },
  general: {
    defaultCountry: "IN",
    defaultTimezone: "Asia/Kolkata",
    defaultLanguage: "en",
    dateFormat: "DD/MM/YYYY",
    currencyFormat: "INR",
  },
  legal: {
    termsUrl: "https://yvity.in/terms",
    privacyUrl: "https://yvity.in/privacy",
    disclaimerText: "Information on YVITY is provided by professionals. YVITY does not offer financial advice.",
    consentRequired: true,
  },
  media: {
    maxImageUploadMb: 5,
    maxVideoUploadMb: 50,
    allowedFileTypes: "jpg,jpeg,png,webp,mp4",
    storageProvider: "s3",
  },
  backup: {
    status: "healthy",
    lastBackupAt: null,
    version: "0.1.0",
    systemHealth: "operational",
  },
  advanced: {
    maintenanceMode: false,
    debugMode: false,
    featureFlags: {
      ambassadors: true,
      analytics: true,
      rewardsEngine: true,
    },
    comingSoonFeatures: "In-app chat, advanced A/B campaigns",
  },
};

export const SETTINGS_SECTIONS = [
  { id: "platform", label: "Platform", emoji: "🌐" },
  { id: "branding", label: "Branding", emoji: "🎨" },
  { id: "notifications", label: "Notifications", emoji: "🔔" },
  { id: "email", label: "Email", emoji: "📧" },
  { id: "smsWhatsapp", label: "SMS & WhatsApp", emoji: "📱" },
  { id: "security", label: "Security", emoji: "🔒" },
  { id: "general", label: "General", emoji: "🌍" },
  { id: "legal", label: "Legal", emoji: "📜" },
  { id: "media", label: "Media", emoji: "📂" },
  { id: "backup", label: "Backup & System", emoji: "💾" },
  { id: "advanced", label: "Advanced", emoji: "🛠" },
];

export function mergeSettings(current = {}) {
  const defaults = structuredClone(DEFAULT_PLATFORM_SETTINGS);
  return Object.keys(defaults).reduce((acc, section) => {
    acc[section] = {
      ...defaults[section],
      ...(current[section] || {}),
    };
    return acc;
  }, {});
}

export function maskSecrets(settings) {
  const clone = structuredClone(settings);
  if (clone.email?.smtpPassword) clone.email.smtpPassword = "••••••••";
  if (clone.smsWhatsapp?.apiKey) clone.smsWhatsapp.apiKey = "••••••••";
  return clone;
}
