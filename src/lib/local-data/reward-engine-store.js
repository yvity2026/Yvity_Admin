import { randomUUID } from "crypto";
import {
  EARNED_REWARD_STATUSES,
  REWARD_ENGINE_TYPES,
  computeCampaignEffectiveStatus,
  isCampaignRunnable,
} from "@/lib/admin/ambassadors/rewardEngineConstants";
import { createCoupon } from "@/lib/local-data/coupons-store";
import { readJsonFile, writeJsonFile } from "@/lib/local-data/paths";

const REWARD_ENGINE_FILE = "reward-engine-campaigns.json";
const REWARDS_FILE = "ambassador-rewards.json";
const REFERRALS_FILE = "referrals.json";
const AMBASSADORS_FILE = "ambassadors.json";
const PROFILES_FILE = "advisor-profiles.json";
const REGISTRATION_FILE = "registration.json";

function loadEngineDb() {
  return readJsonFile(REWARD_ENGINE_FILE, { campaigns: {} });
}

function saveEngineDb(db) {
  writeJsonFile(REWARD_ENGINE_FILE, db);
}

function loadRewardsDb() {
  return readJsonFile(REWARDS_FILE, { rewards: {} });
}

function saveRewardsDb(db) {
  writeJsonFile(REWARDS_FILE, db);
}

function loadReferralsDb() {
  return readJsonFile(REFERRALS_FILE, { referrals: {} });
}

function loadAmbassadorsDb() {
  return readJsonFile(AMBASSADORS_FILE, { ambassadors: {} });
}

function loadProfilesDb() {
  return readJsonFile(PROFILES_FILE, { profiles: {} });
}

function saveProfilesDb(db) {
  writeJsonFile(PROFILES_FILE, db);
}

function loadRegistration() {
  return readJsonFile(REGISTRATION_FILE, { users: [] });
}

function findUser(userId) {
  return loadRegistration().users.find((user) => user.id === userId) ?? null;
}

function normalizeCampaignInput(input = {}) {
  const referralTarget = Math.max(1, Number(input.referralTarget) || 1);
  return {
    name: String(input.name || "").trim(),
    description: String(input.description || "").trim(),
    referralTarget,
    rewardType: String(input.rewardType || "discount_coupon"),
    rewardValue: String(input.rewardValue || "").trim(),
    startDate: input.startDate || null,
    endDate: input.endDate || null,
    status: input.status === "paused" ? "paused" : "active",
  };
}

export function mapRewardEngineCampaign(campaign = {}) {
  const effectiveStatus = computeCampaignEffectiveStatus(campaign);
  return {
    id: campaign.id,
    name: campaign.name,
    description: campaign.description || "",
    referralTarget: Number(campaign.referralTarget) || 0,
    rewardType: campaign.rewardType,
    rewardTypeLabel: REWARD_ENGINE_TYPES[campaign.rewardType] || campaign.rewardType,
    rewardValue: campaign.rewardValue || "",
    startDate: campaign.startDate || null,
    endDate: campaign.endDate || null,
    status: campaign.status || "paused",
    effectiveStatus,
    statusLabel:
      effectiveStatus === "active"
        ? "Active"
        : effectiveStatus === "expired"
          ? "Expired"
          : "Paused",
    createdAt: campaign.createdAt || null,
    updatedAt: campaign.updatedAt || null,
  };
}

function mapEarnedReward(reward = {}, referrer = {}) {
  const status = reward.status || "earned";
  return {
    id: reward.id,
    referrerUserId: reward.referrerUserId,
    referrerName: referrer.fullName || referrer.name || reward.referrerName || "Ambassador",
    campaignId: reward.campaignId || null,
    campaignName: reward.campaignName || reward.label || "Reward",
    referralTarget: reward.referralTarget ?? null,
    rewardType: reward.rewardType,
    rewardTypeLabel: REWARD_ENGINE_TYPES[reward.rewardType] || reward.rewardType,
    rewardValue: reward.rewardValue || "",
    status,
    statusLabel: EARNED_REWARD_STATUSES[status] || reward.status,
    couponCode: reward.couponCode || null,
    fulfillmentNotes: reward.fulfillmentNotes || "",
    successfulReferralsAtGrant: reward.successfulReferralsAtGrant ?? null,
    createdAt: reward.createdAt || null,
    claimedAt: reward.claimedAt || null,
    issuedAt: reward.issuedAt || reward.createdAt || null,
  };
}

export function ensureRewardEngineSeed() {
  const db = loadEngineDb();
  if (Object.keys(db.campaigns || {}).length > 0) return;

  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const defaults = [
    {
      name: "Silver Starter",
      description: "Reward advisors who bring 3 qualified referrals.",
      referralTarget: 3,
      rewardType: "discount_coupon",
      rewardValue: "50% Discount",
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
      status: "active",
    },
    {
      name: "Silver Milestone",
      description: "One month Silver extension after 5 successful referrals.",
      referralTarget: 5,
      rewardType: "free_silver_extension",
      rewardValue: "1 Month",
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
      status: "active",
    },
    {
      name: "Gold Milestone",
      description: "One month Gold extension after 10 successful referrals.",
      referralTarget: 10,
      rewardType: "free_gold_extension",
      rewardValue: "1 Month",
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
      status: "active",
    },
  ];

  for (const item of defaults) {
    const id = randomUUID();
    db.campaigns[id] = {
      id,
      ...item,
      createdAt: now,
      updatedAt: now,
    };
  }

  saveEngineDb(db);
}

export function listRewardEngineCampaigns() {
  ensureRewardEngineSeed();
  return Object.values(loadEngineDb().campaigns || {})
    .map(mapRewardEngineCampaign)
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
}

export function getRewardEngineCampaign(campaignId) {
  const record = loadEngineDb().campaigns?.[campaignId];
  if (!record) return null;
  return mapRewardEngineCampaign(record);
}

export function createRewardEngineCampaign(input = {}) {
  const normalized = normalizeCampaignInput(input);
  if (!normalized.name) return { error: "Campaign name is required", status: 400 };
  if (!normalized.rewardValue) return { error: "Reward value is required", status: 400 };
  if (!REWARD_ENGINE_TYPES[normalized.rewardType]) {
    return { error: "Invalid reward type", status: 400 };
  }

  const db = loadEngineDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const campaign = { id, ...normalized, createdAt: now, updatedAt: now };
  db.campaigns[id] = campaign;
  saveEngineDb(db);

  const reeval = reevaluateAllAmbassadorRewards();
  return {
    success: true,
    campaign: mapRewardEngineCampaign(campaign),
    grantsCreated: reeval.totalGrants,
  };
}

export function updateRewardEngineCampaign(campaignId, input = {}) {
  const db = loadEngineDb();
  const existing = db.campaigns?.[campaignId];
  if (!existing) return { error: "Campaign not found", status: 404 };

  const normalized = normalizeCampaignInput({ ...existing, ...input });
  if (!normalized.name) return { error: "Campaign name is required", status: 400 };
  if (!normalized.rewardValue) return { error: "Reward value is required", status: 400 };

  const updated = {
    ...existing,
    ...normalized,
    updatedAt: new Date().toISOString(),
  };
  db.campaigns[campaignId] = updated;
  saveEngineDb(db);

  return { success: true, campaign: mapRewardEngineCampaign(updated) };
}

export function duplicateRewardEngineCampaign(campaignId) {
  const existing = loadEngineDb().campaigns?.[campaignId];
  if (!existing) return { error: "Campaign not found", status: 404 };

  return createRewardEngineCampaign({
    ...existing,
    name: `${existing.name} (Copy)`,
    status: "paused",
  });
}

export function setRewardEngineCampaignStatus(campaignId, status = "active") {
  const result = updateRewardEngineCampaign(campaignId, {
    status: status === "active" ? "active" : "paused",
  });
  if (result.success && status === "active") {
    const reeval = reevaluateAllAmbassadorRewards();
    result.grantsCreated = (result.grantsCreated || 0) + reeval.totalGrants;
  }
  return result;
}

export function deleteRewardEngineCampaign(campaignId) {
  const db = loadEngineDb();
  if (!db.campaigns?.[campaignId]) return { error: "Campaign not found", status: 404 };

  const grants = Object.values(loadRewardsDb().rewards || {}).filter(
    (row) => row.campaignId === campaignId,
  );
  if (grants.length > 0) {
    return {
      error: "Cannot delete a campaign that already has earned rewards. Pause it instead.",
      status: 409,
    };
  }

  delete db.campaigns[campaignId];
  saveEngineDb(db);
  return { success: true };
}

export function countSuccessfulReferrals(userId) {
  return Object.values(loadReferralsDb().referrals || {}).filter(
    (row) => row.referrerUserId === userId && row.status === "qualified",
  ).length;
}

function hasExistingGrant(userId, campaignId) {
  return Object.values(loadRewardsDb().rewards || {}).some(
    (row) => row.referrerUserId === userId && row.campaignId === campaignId,
  );
}

function parseMonthsFromValue(value = "") {
  const match = String(value).match(/(\d+)/);
  return match ? Number(match[1]) : 1;
}

function parseCouponFromValue(value = "") {
  const text = String(value);
  const percentMatch = text.match(/(\d+)\s*%/);
  if (percentMatch) {
    return { discountType: "percent", discountValue: Number(percentMatch[1]) };
  }
  const inrMatch = text.match(/₹\s*(\d+)/i) || text.match(/(\d+)\s*(?:inr|rs)/i);
  if (inrMatch) {
    return { discountType: "fixed", discountValue: Number(inrMatch[1]) };
  }
  return { discountType: "percent", discountValue: 10 };
}

function applyPlanExtension(userId, plan, months) {
  const profilesDb = loadProfilesDb();
  const profile = profilesDb.profiles?.[userId] || { userId };
  const extensions = Array.isArray(profile.plan_extensions) ? [...profile.plan_extensions] : [];
  extensions.push({
    plan,
    months,
    grantedAt: new Date().toISOString(),
    source: "reward-engine",
  });
  profilesDb.profiles[userId] = { ...profile, plan_extensions: extensions };
  saveProfilesDb(profilesDb);
}

function applyPlanUpgrade(userId, plan) {
  const profilesDb = loadProfilesDb();
  const profile = profilesDb.profiles?.[userId] || { userId };
  profilesDb.profiles[userId] = {
    ...profile,
    subscription_plan: plan,
    upgraded_via_reward_at: new Date().toISOString(),
  };
  saveProfilesDb(profilesDb);
}

function fulfillRewardGrant(campaign, userId, adminId = "reward-engine") {
  const user = findUser(userId);
  const base = {
    couponCode: null,
    fulfillmentNotes: `${campaign.rewardTypeLabel}: ${campaign.rewardValue}`,
  };

  switch (campaign.rewardType) {
    case "discount_coupon": {
      const parsed = parseCouponFromValue(campaign.rewardValue);
      const couponResult = createCoupon(
        {
          label: `Reward · ${campaign.name}`,
          discountType: parsed.discountType,
          discountValue: parsed.discountValue,
          appliesTo: ["silver", "gold"],
          assignedUserId: userId,
          assignedEmail: user?.email || null,
          maxRedemptions: 1,
        },
        adminId,
      );
      if (couponResult.error) {
        return { error: couponResult.error, status: couponResult.status || 500 };
      }
      return {
        ...base,
        couponCode: couponResult.coupon?.code || null,
        fulfillmentNotes: `Coupon ${couponResult.coupon?.code} · ${campaign.rewardValue}`,
      };
    }
    case "free_silver_extension": {
      const months = parseMonthsFromValue(campaign.rewardValue);
      applyPlanExtension(userId, "silver", months);
      return {
        ...base,
        fulfillmentNotes: `${months} month(s) Silver extension`,
      };
    }
    case "free_gold_extension": {
      const months = parseMonthsFromValue(campaign.rewardValue);
      applyPlanExtension(userId, "gold", months);
      return {
        ...base,
        fulfillmentNotes: `${months} month(s) Gold extension`,
      };
    }
    case "silver_upgrade":
      applyPlanUpgrade(userId, "silver");
      return { ...base, fulfillmentNotes: "Silver plan upgrade applied" };
    case "gold_upgrade":
      applyPlanUpgrade(userId, "gold");
      return { ...base, fulfillmentNotes: "Gold plan upgrade applied" };
    case "feature_unlock":
      return { ...base, fulfillmentNotes: `Feature unlock: ${campaign.rewardValue}` };
    case "custom_reward":
    default:
      return { ...base, fulfillmentNotes: campaign.rewardValue };
  }
}

export function evaluateAndGrantRewardsForUser(userId, adminId = "reward-engine") {
  ensureRewardEngineSeed();
  const successfulCount = countSuccessfulReferrals(userId);
  const campaigns = Object.values(loadEngineDb().campaigns || {});
  const grants = [];

  for (const raw of campaigns) {
    const campaign = mapRewardEngineCampaign(raw);
    if (!isCampaignRunnable(raw)) continue;
    if (successfulCount < campaign.referralTarget) continue;
    if (hasExistingGrant(userId, campaign.id)) continue;

    const fulfillment = fulfillRewardGrant(campaign, userId, adminId);
    if (fulfillment.error) continue;

    const rewardId = randomUUID();
    const now = new Date().toISOString();
    const reward = {
      id: rewardId,
      referrerUserId: userId,
      campaignId: campaign.id,
      campaignName: campaign.name,
      referralTarget: campaign.referralTarget,
      rewardType: campaign.rewardType,
      rewardValue: campaign.rewardValue,
      successfulReferralsAtGrant: successfulCount,
      status: "earned",
      couponCode: fulfillment.couponCode,
      fulfillmentNotes: fulfillment.fulfillmentNotes,
      createdAt: now,
      issuedAt: now,
      claimedAt: null,
      source: "reward-engine",
    };

    const rewardsDb = loadRewardsDb();
    rewardsDb.rewards[rewardId] = reward;
    saveRewardsDb(rewardsDb);
    grants.push(mapEarnedReward(reward, findUser(userId) || {}));
  }

  return { success: true, grants, successfulCount };
}

export function listEarnedRewards() {
  return Object.values(loadRewardsDb().rewards || {})
    .map((row) => mapEarnedReward(row, findUser(row.referrerUserId) || {}))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

export function getAmbassadorRewardStats(userId) {
  const rows = Object.values(loadRewardsDb().rewards || {}).filter(
    (row) => row.referrerUserId === userId,
  );
  const earned = rows.filter((row) => row.status === "earned" || row.status === "issued").length;
  const claimed = rows.filter((row) => row.status === "claimed" || row.status === "redeemed").length;
  return { rewardsEarned: rows.length, rewardsClaimed: claimed, rewardsPending: earned };
}

export function buildRewardEngineOverview(ambassadors = [], referrals = []) {
  const rewards = listEarnedRewards();
  const totalReferrals = referrals.length;
  const successfulReferrals = referrals.filter((row) => row.status === "qualified").length;
  const rewardsGenerated = rewards.length;
  const rewardsClaimed = rewards.filter(
    (row) => row.status === "claimed" || row.status === "redeemed",
  ).length;

  return {
    totalAmbassadors: ambassadors.length,
    activeAmbassadors: ambassadors.filter((row) => row.status === "active").length,
    totalReferrals,
    successfulReferrals,
    rewardsGenerated,
    rewardsClaimed,
    pendingRewards: rewards.filter((row) => row.status === "earned").length,
  };
}

export function buildLeaderboardWithRewards(ambassadors = [], referrals = [], period = "monthly") {
  const now = new Date();
  const rewards = listEarnedRewards();

  const scores = ambassadors.map((ambassador) => {
    const rows = referrals.filter((referral) => referral.referrerUserId === ambassador.userId);
    const qualified =
      period === "monthly"
        ? rows.filter(
            (referral) =>
              referral.status === "qualified" &&
              referral.purchasedAt &&
              new Date(referral.purchasedAt).getFullYear() === now.getFullYear() &&
              new Date(referral.purchasedAt).getMonth() === now.getMonth(),
          )
        : rows.filter((referral) => referral.status === "qualified");

    const userRewards = rewards.filter((row) => row.referrerUserId === ambassador.userId);

    return {
      userId: ambassador.userId,
      name: ambassador.name,
      city: ambassador.city,
      count: qualified.length,
      successfulReferrals: qualified.length,
      rewardsEarned: userRewards.length,
      planLabel: ambassador.planLabel,
      referralCode: ambassador.referralCode,
    };
  });

  return scores.sort((a, b) => b.count - a.count || b.rewardsEarned - a.rewardsEarned).slice(0, 10);
}

export function reevaluateAllAmbassadorRewards(adminId = "reward-engine") {
  const ambassadors = Object.values(loadAmbassadorsDb().ambassadors || {});
  let totalGrants = 0;
  for (const ambassador of ambassadors) {
    const result = evaluateAndGrantRewardsForUser(ambassador.userId, adminId);
    totalGrants += result.grants?.length || 0;
  }
  return { success: true, totalGrants };
}

export function getReferralsForAmbassador(userId) {
  return Object.values(loadReferralsDb().referrals || {})
    .filter((row) => row.referrerUserId === userId)
    .map((row) => {
      const referred = findUser(row.referredUserId);
      return {
        id: row.id,
        referredUserName: referred?.fullName || row.referredUserName || "User",
        registeredAt: row.registeredAt,
        planPurchased: row.planPurchased,
        status: row.status,
        purchasedAt: row.purchasedAt,
      };
    })
    .sort((a, b) => String(b.registeredAt || "").localeCompare(String(a.registeredAt || "")));
}
