import {
  AMBASSADOR_STATUSES,
  REFERRAL_STATUSES,
  REWARD_STATUSES,
  REWARD_TYPES,
  formatPlanLabel,
} from "@/lib/admin/ambassadors/ambassadorUtils";

export function mapAmbassadorRow(ambassador = {}, user = {}, profile = {}) {
  const status = ambassador.status || "active";
  const planKey = String(profile.subscription_plan || ambassador.planKey || "free").toLowerCase();

  return {
    id: ambassador.id,
    userId: ambassador.userId,
    name: user.fullName || user.name || ambassador.name || "Advisor",
    email: user.email || ambassador.email || null,
    phone: user.phone || user.mobile || ambassador.phone || null,
    city: user.city || ambassador.city || null,
    planKey,
    planLabel: formatPlanLabel(planKey),
    referralCode: ambassador.referralCode,
    status,
    statusLabel: AMBASSADOR_STATUSES[status] || status,
    totalReferrals: Number(ambassador.totalReferrals) || 0,
    successfulReferrals: Number(ambassador.successfulReferrals) || 0,
    rewardsEarned: Number(ambassador.rewardsEarned) || 0,
    rewardsClaimed: Number(ambassador.rewardsClaimed) || 0,
    createdAt: ambassador.createdAt || null,
    promotedAt: ambassador.promotedAt || null,
    referralLink: ambassador.referralLink || null,
  };
}

export function mapReferralRow(referral = {}, referrer = {}, referred = {}) {
  const status = referral.status || "registered";
  return {
    id: referral.id,
    referrerUserId: referral.referrerUserId,
    referrerName: referrer.fullName || referrer.name || referral.referrerName || "Ambassador",
    referrerCode: referral.referrerCode,
    referredUserId: referral.referredUserId,
    referredUserName: referred.fullName || referred.name || referral.referredUserName || "User",
    registeredAt: referral.registeredAt || null,
    planPurchased: referral.planPurchased || null,
    planPurchasedLabel: referral.planPurchased
      ? formatPlanLabel(referral.planPurchased)
      : status === "registered"
        ? "Free"
        : "—",
    purchasedAt: referral.purchasedAt || null,
    paymentId: referral.paymentId || null,
    status,
    statusLabel: REFERRAL_STATUSES[status] || status,
    rewardId: referral.rewardId || null,
  };
}

export function mapRewardRow(reward = {}, referrer = {}) {
  const status = reward.status || "earned";
  const rewardType = reward.rewardType || "discount_coupon";
  return {
    id: reward.id,
    referralId: reward.referralId || null,
    campaignId: reward.campaignId || null,
    campaignName: reward.campaignName || reward.label || null,
    referrerUserId: reward.referrerUserId,
    referrerName: referrer.fullName || referrer.name || reward.referrerName || "Ambassador",
    rewardType,
    rewardTypeLabel: REWARD_TYPES[rewardType] || reward.rewardTypeLabel || rewardType,
    rewardValue: reward.rewardValue || "",
    referralTarget: reward.referralTarget ?? null,
    status,
    statusLabel: REWARD_STATUSES[status] || reward.statusLabel || status,
    couponCode: reward.couponCode || null,
    amountInr: reward.amountInr ?? null,
    createdAt: reward.createdAt || null,
    issuedAt: reward.issuedAt || null,
    claimedAt: reward.claimedAt || null,
    fulfillmentNotes: reward.fulfillmentNotes || reward.notes || "",
  };
}
