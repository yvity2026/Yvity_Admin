export const CAMPAIGN_TYPES = {
  platform_announcement: {
    id: "platform_announcement",
    label: "Platform Announcement",
    communicationType: "platform",
    defaultChannel: "whatsapp",
  },
  plan_upgrade: {
    id: "plan_upgrade",
    label: "Plan Upgrade Campaign",
    communicationType: "marketing",
    defaultChannel: "whatsapp",
  },
  profile_completion: {
    id: "profile_completion",
    label: "Profile Completion Reminder",
    communicationType: "platform",
    defaultChannel: "whatsapp",
  },
  verification_reminder: {
    id: "verification_reminder",
    label: "Verification Reminder",
    communicationType: "platform",
    defaultChannel: "whatsapp",
  },
  subscription_renewal: {
    id: "subscription_renewal",
    label: "Subscription Renewal Reminder",
    communicationType: "marketing",
    defaultChannel: "whatsapp",
  },
  ambassador_campaign: {
    id: "ambassador_campaign",
    label: "Ambassador Campaign",
    communicationType: "marketing",
    defaultChannel: "whatsapp",
  },
  festival_greetings: {
    id: "festival_greetings",
    label: "Festival Greetings",
    communicationType: "marketing",
    defaultChannel: "whatsapp",
  },
  testimonial_request: {
    id: "testimonial_request",
    label: "Testimonial Request",
    communicationType: "platform",
    defaultChannel: "whatsapp",
  },
  recommendation_request: {
    id: "recommendation_request",
    label: "Recommendation Request",
    communicationType: "platform",
    defaultChannel: "whatsapp",
  },
  custom: {
    id: "custom",
    label: "Custom Campaign",
    communicationType: "platform",
    defaultChannel: "whatsapp",
  },
};

/** @deprecated use CAMPAIGN_TYPES */
export const COMMUNICATION_TYPES = {
  platform: CAMPAIGN_TYPES.platform_announcement,
  marketing: CAMPAIGN_TYPES.plan_upgrade,
};

export const CHANNEL_OPTIONS = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "sms", label: "SMS" },
  { id: "email", label: "Email" },
  { id: "notification", label: "In-app notification" },
];

export const USER_TYPE_OPTIONS = [
  { id: "all", label: "All users" },
  { id: "professionals", label: "Professionals" },
  { id: "customers", label: "Customers" },
];

export const PLAN_OPTIONS = [
  { id: "all", label: "All plans" },
  { id: "free", label: "Free" },
  { id: "silver", label: "Silver" },
  { id: "gold", label: "Gold" },
];

export const GENDER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
];

export const AGE_GROUP_OPTIONS = [
  { id: "all", label: "All ages" },
  { id: "18-25", label: "18-25" },
  { id: "26-35", label: "26-35" },
  { id: "36-45", label: "36-45" },
  { id: "46-60", label: "46-60" },
  { id: "60+", label: "60+" },
];

export const AUDIENCE_OPTIONS = [
  { id: "all_users", label: "All users" },
  { id: "advisors", label: "Professionals only" },
  { id: "customers", label: "Customers only" },
  { id: "plan_gold", label: "Gold members" },
  { id: "plan_silver", label: "Silver members" },
  { id: "plan_free", label: "Free members" },
];

export const MESSAGE_TEMPLATES = {
  platform_announcement: {
    id: "platform_announcement",
    label: "Platform Announcement",
    body: "Hello {{name}}, we have an important update from YVITY. Please check your dashboard for details.",
  },
  upgrade_reminder: {
    id: "upgrade_reminder",
    label: "Upgrade Reminder",
    body: "Hi {{name}}, unlock more visibility and leads with a Silver or Gold plan on YVITY.",
  },
  renewal_reminder: {
    id: "renewal_reminder",
    label: "Renewal Reminder",
    body: "Hi {{name}}, your YVITY subscription is due for renewal. Renew now to keep your profile active.",
  },
  profile_completion: {
    id: "profile_completion",
    label: "Profile Completion Reminder",
    body: "Hi {{name}}, complete your YVITY profile to improve trust and discoverability.",
  },
  verification_reminder: {
    id: "verification_reminder",
    label: "Verification Reminder",
    body: "Hi {{name}}, please complete verification on YVITY to publish your professional profile.",
  },
  testimonial_request: {
    id: "testimonial_request",
    label: "Testimonial Request",
    body: "Hi {{name}}, we'd love a short testimonial about your YVITY experience. Share yours from your dashboard.",
  },
  recommendation_request: {
    id: "recommendation_request",
    label: "Recommendation Request",
    body: "Hi {{name}}, request a recommendation on YVITY to strengthen your credibility score.",
  },
  festival_greeting: {
    id: "festival_greeting",
    label: "Festival Greeting",
    body: "Warm wishes from YVITY, {{name}}! Wishing you and your family a wonderful celebration.",
  },
  custom: {
    id: "custom",
    label: "Custom Template",
    body: "",
  },
};

export const QUICK_ACTIONS = [
  { id: "notification", label: "Send Notification", channel: "notification", campaignType: "platform_announcement" },
  { id: "email", label: "Send Email", channel: "email", campaignType: "custom" },
  { id: "sms", label: "Send SMS", channel: "sms", campaignType: "custom" },
  { id: "whatsapp", label: "Send WhatsApp", channel: "whatsapp", campaignType: "platform_announcement" },
  { id: "announcement", label: "Send Announcement", channel: "notification", campaignType: "platform_announcement" },
  { id: "testimonial", label: "Send Testimonial Request", channel: "whatsapp", campaignType: "testimonial_request" },
  { id: "recommendation", label: "Send Recommendation Request", channel: "whatsapp", campaignType: "recommendation_request" },
];

export const STATUS_LABELS = {
  draft: "Draft",
  scheduled: "Scheduled",
  sending: "Sending",
  sent: "Sent",
  cancelled: "Cancelled",
  failed: "Failed",
  active: "Active",
};

export const STATUS_TONES = {
  draft: "bg-[#EEF2F0] text-[#53807E]",
  scheduled: "bg-[#FFF6E8] text-[#B45309]",
  sending: "bg-[#E8F4F3] text-[#0A4A4A]",
  sent: "bg-[#E8F5F0] text-[#1A7A5A]",
  cancelled: "bg-[#F1F5F9] text-[#64748B]",
  failed: "bg-[#FFF1F0] text-[#DC2626]",
  active: "bg-[#E8F5F0] text-[#1A7A5A]",
};

export function getCampaignTypeLabel(typeId) {
  return CAMPAIGN_TYPES[typeId]?.label || typeId || "Campaign";
}

export function getChannelLabel(channelId) {
  return CHANNEL_OPTIONS.find((row) => row.id === channelId)?.label || channelId;
}

export function getAudienceLabel(filters = {}) {
  if (filters.audiencePreset) {
    return AUDIENCE_OPTIONS.find((row) => row.id === filters.audiencePreset)?.label || filters.audiencePreset;
  }
  const parts = [];
  if (filters.userType && filters.userType !== "all") parts.push(filters.userType);
  if (filters.plan && filters.plan !== "all") parts.push(`${filters.plan} plan`);
  if (filters.state && filters.state !== "all") parts.push(filters.state);
  if (filters.city && filters.city !== "all") parts.push(filters.city);
  return parts.length ? parts.join(" · ") : "All users";
}
