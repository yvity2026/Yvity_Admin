export const REWARD_ENGINE_TYPES = {
  free_silver_extension: "Free Silver Extension",
  free_gold_extension: "Free Gold Extension",
  silver_upgrade: "Silver Upgrade",
  gold_upgrade: "Gold Upgrade",
  discount_coupon: "Discount Coupon",
  feature_unlock: "Feature Unlock",
  custom_reward: "Custom Reward",
};

export const REWARD_ENGINE_TYPE_OPTIONS = Object.entries(REWARD_ENGINE_TYPES).map(([id, label]) => ({
  id,
  label,
}));

export const REWARD_CAMPAIGN_STATUSES = {
  active: "Active",
  paused: "Paused",
  expired: "Expired",
};

export const EARNED_REWARD_STATUSES = {
  earned: "Earned",
  claimed: "Claimed",
  cancelled: "Cancelled",
};

export function computeCampaignEffectiveStatus(campaign = {}, now = new Date()) {
  const adminStatus = campaign.status || "paused";
  if (adminStatus === "paused") return "paused";

  const start = campaign.startDate ? new Date(campaign.startDate) : null;
  const end = campaign.endDate ? new Date(campaign.endDate) : null;

  if (end && end.getTime() < now.getTime()) return "expired";
  if (start && start.getTime() > now.getTime()) return "paused";

  return adminStatus === "active" ? "active" : "paused";
}

export function isCampaignRunnable(campaign = {}, now = new Date()) {
  return computeCampaignEffectiveStatus(campaign, now) === "active";
}
