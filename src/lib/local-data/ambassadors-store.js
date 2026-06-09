import { randomUUID } from "crypto";
import {
  formatRelativeTime,
  generateAmbassadorCode,
  normalizeReferralCode,
} from "@/lib/admin/ambassadors/ambassadorUtils";
import {
  mapAmbassadorRow,
  mapReferralRow,
  mapRewardRow,
} from "@/lib/admin/ambassadors/mapAmbassadorRecord";
import { createCoupon } from "@/lib/local-data/coupons-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { useSupabasePersistence } from "@/lib/supabase/persistence-mode";
import {
  buildLeaderboardWithRewards,
  buildRewardEngineOverview,
  ensureRewardEngineSeed,
  evaluateAndGrantRewardsForUser,
  reevaluateAllAmbassadorRewards,
  getReferralsForAmbassador,
  listEarnedRewards,
  listRewardEngineCampaigns,
  getAmbassadorRewardStats,
} from "@/lib/local-data/reward-engine-store";
import { REWARD_ENGINE_TYPE_OPTIONS } from "@/lib/admin/ambassadors/rewardEngineConstants";
import { goldAppBaseUrl, readJsonFile, writeJsonFile } from "@/lib/local-data/paths";

const CONFIG_FILE = "ambassador-program-config.json";
const AMBASSADORS_FILE = "ambassadors.json";
const REFERRALS_FILE = "referrals.json";
const REWARDS_FILE = "ambassador-rewards.json";
const CAMPAIGNS_FILE = "ambassador-campaigns.json";
const REGISTRATION_FILE = "registration.json";
const PROFILES_FILE = "advisor-profiles.json";

const CAMPAIGN_AUDIENCES = {
  all_ambassadors: "All ambassadors",
  active_ambassadors: "Active ambassadors only",
  all_advisors: "All advisors (referral program)",
};

const CAMPAIGN_STATUS_LABELS = {
  draft: "Draft",
  sending: "Sending",
  sent: "Sent",
  failed: "Failed",
};

export const DEFAULT_PROGRAM_CONFIG = {
  status: "active",
  referralRules: {
    qualifyingPlans: ["silver", "gold"],
    qualifyingCheckoutKinds: ["purchase"],
    attributionWindowDays: 30,
    linkParam: "ref",
  },
  rewardRules: {
    onQualifiedReferral: {
      rewardType: "discount_coupon",
      discountType: "percent",
      discountValue: 10,
      appliesTo: ["silver", "gold"],
      label: "Ambassador referral reward",
    },
  },
  eligibilityRules: {
    autoEnrollAllAdvisors: true,
    allowFreeReferrers: true,
    requireApproval: false,
  },
  updatedAt: new Date().toISOString(),
};

function loadRegistration() {
  return readJsonFile(REGISTRATION_FILE, { users: [] });
}

function loadProfilesDb() {
  return readJsonFile(PROFILES_FILE, { profiles: {} });
}

function findUser(userId) {
  return loadRegistration().users.find((user) => user.id === userId) ?? null;
}

function profileForUser(userId) {
  return loadProfilesDb().profiles?.[userId] || null;
}

function loadConfigDb() {
  return readJsonFile(CONFIG_FILE, { config: DEFAULT_PROGRAM_CONFIG });
}

function saveConfigDb(db) {
  writeJsonFile(CONFIG_FILE, db);
}

function loadAmbassadorsDb() {
  return readJsonFile(AMBASSADORS_FILE, { ambassadors: {} });
}

function saveAmbassadorsDb(db) {
  writeJsonFile(AMBASSADORS_FILE, db);
}

function loadReferralsDb() {
  return readJsonFile(REFERRALS_FILE, { referrals: {} });
}

function saveReferralsDb(db) {
  writeJsonFile(REFERRALS_FILE, db);
}

function loadRewardsDb() {
  return readJsonFile(REWARDS_FILE, { rewards: {} });
}

function saveRewardsDb(db) {
  writeJsonFile(REWARDS_FILE, db);
}

function loadCampaignsDb() {
  return readJsonFile(CAMPAIGNS_FILE, { campaigns: {} });
}

function saveCampaignsDb(db) {
  writeJsonFile(CAMPAIGNS_FILE, db);
}

function userPhone(user = {}) {
  return String(user.phone || user.mobile || "").trim();
}

function resolveCampaignRecipients(audience = "active_ambassadors") {
  const ambassadorsDb = loadAmbassadorsDb();
  const ambassadors = Object.values(ambassadorsDb.ambassadors || {});
  const registrationUsers = loadRegistration().users || [];

  let userIds = [];

  if (audience === "all_advisors") {
    userIds = registrationUsers.map((user) => user.id).filter(Boolean);
  } else if (audience === "all_ambassadors") {
    userIds = ambassadors.map((row) => row.userId).filter(Boolean);
  } else {
    userIds = ambassadors
      .filter((row) => row.status === "active")
      .map((row) => row.userId)
      .filter(Boolean);
  }

  const uniqueIds = [...new Set(userIds)];

  return uniqueIds
    .map((userId) => {
      const user = findUser(userId);
      if (!user) return null;
      const phone = userPhone(user);
      if (!phone) return null;
      return {
        userId,
        name: user.fullName || user.name || "Advisor",
        phone,
      };
    })
    .filter(Boolean);
}

function mapCampaignRow(campaign = {}) {
  const status = campaign.status || "draft";
  return {
    id: campaign.id,
    name: campaign.name,
    messageBody: campaign.messageBody,
    audience: campaign.audience,
    audienceLabel: CAMPAIGN_AUDIENCES[campaign.audience] || campaign.audience,
    channel: campaign.channel || "whatsapp",
    status,
    statusLabel: CAMPAIGN_STATUS_LABELS[status] || status,
    recipientCount: Number(campaign.recipientCount) || 0,
    sentCount: Number(campaign.sentCount) || 0,
    failedCount: Number(campaign.failedCount) || 0,
    createdAt: campaign.createdAt || null,
    sentAt: campaign.sentAt || null,
  };
}

async function deliverCampaignMessage({ phone, messageBody }) {
  const hasWhatsApp = Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_API_URL,
  );

  if (!hasWhatsApp) {
    console.log("[AMBASSADOR-CAMPAIGN][DEV] Simulated WhatsApp send", {
      phone: `***${String(phone).slice(-4)}`,
    });
    return { success: true, simulated: true };
  }

  try {
    const { sendWhatsAppTemplate } = await import("@/lib/whatsapp/sender");
    await sendWhatsAppTemplate({
      to: phone,
      templateKey: "PLATFORM_ANNOUNCEMENT",
      data: {
        message: String(messageBody).slice(0, 900),
      },
    });
    return { success: true, simulated: false };
  } catch (error) {
    return {
      success: false,
      error: error?.message || "Send failed",
    };
  }
}

function buildReferralLink(code) {
  const base = goldAppBaseUrl();
  const param = loadConfigDb().config?.referralRules?.linkParam || "ref";
  return `${base}/register?${param}=${encodeURIComponent(code)}`;
}

function ensureSeedData() {
  const ambassadorsDb = loadAmbassadorsDb();
  if (Object.keys(ambassadorsDb.ambassadors || {}).length > 0) return;

  const users = loadRegistration().users || [];
  const seedUser = users.find((user) => user.id === "cd4a358b-78f7-458b-9264-45d61016d177") || users[0];
  if (!seedUser) return;

  const code = generateAmbassadorCode();
  const ambassadorId = randomUUID();
  const now = new Date().toISOString();

  ambassadorsDb.ambassadors = {
    [seedUser.id]: {
      id: ambassadorId,
      userId: seedUser.id,
      referralCode: code,
      status: "active",
      totalReferrals: 2,
      successfulReferrals: 1,
      createdAt: now,
      promotedAt: now,
      referralLink: buildReferralLink(code),
      notes: "Seed ambassador for program preview",
    },
  };
  saveAmbassadorsDb(ambassadorsDb);

  const referralsDb = loadReferralsDb();
  const rewardsDb = loadRewardsDb();
  const referralId = randomUUID();
  const rewardId = randomUUID();
  const secondUser = users.find((user) => user.id !== seedUser.id);

  referralsDb.referrals = {
    [referralId]: {
      id: referralId,
      referrerUserId: seedUser.id,
      referrerCode: code,
      referredUserId: secondUser?.id || randomUUID(),
      referredUserName: secondUser?.fullName || "Priya Sharma",
      registeredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      planPurchased: "silver",
      purchasedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      paymentId: "seed-payment-1",
      status: "qualified",
      rewardId,
    },
  };

  if (secondUser) {
    const pendingReferralId = randomUUID();
    referralsDb.referrals[pendingReferralId] = {
      id: pendingReferralId,
      referrerUserId: seedUser.id,
      referrerCode: code,
      referredUserId: users[2]?.id || randomUUID(),
      referredUserName: users[2]?.fullName || "Anitha Reddy",
      registeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      planPurchased: null,
      purchasedAt: null,
      paymentId: null,
      status: "registered",
      rewardId: null,
    };
  }

  saveReferralsDb(referralsDb);

  rewardsDb.rewards = {
    [rewardId]: {
      id: rewardId,
      referralId,
      referrerUserId: seedUser.id,
      rewardType: "discount_coupon",
      status: "pending",
      couponCode: null,
      amountInr: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      issuedAt: null,
      notes: "Auto-generated on Silver purchase",
    },
  };
  saveRewardsDb(rewardsDb);

  if (!readJsonFile(CONFIG_FILE, null)) {
    saveConfigDb({ config: DEFAULT_PROGRAM_CONFIG });
  }
}

function buildOverview(ambassadors = [], referrals = [], config = {}) {
  const base = buildRewardEngineOverview(ambassadors, referrals);
  return {
    ...base,
    programStatus: config.status || "active",
    programStatusLabel: config.status === "paused" ? "Paused" : "Active",
  };
}

function buildQuickActions(overview = {}) {
  return [
    {
      id: "campaign",
      label: "Create campaign",
      description: "Message ambassadors on WhatsApp",
      action: "create_campaign",
      emoji: "📣",
      live: true,
    },
    {
      id: "coupon",
      label: "Referral coupon",
      description: "Generate reward coupon",
      href: "/admin/coupons",
      emoji: "🎟️",
      live: true,
    },
    {
      id: "notify",
      label: "Notification",
      description: "Send ambassador update",
      action: "create_campaign",
      emoji: "🔔",
      live: true,
    },
    {
      id: "leaders",
      label: "Top ambassadors",
      description: "View leaderboard",
      href: "#leaderboard",
      emoji: "🏆",
      live: true,
    },
  ];
}

export function useAmbassadorsStore() {
  return localDataAvailable() || useSupabasePersistence();
}

export function getAmbassadorsSnapshot(options = {}) {
  ensureSeedData();
  ensureRewardEngineSeed();

  const search = String(options.search || "").trim().toLowerCase();
  const config = loadConfigDb().config || DEFAULT_PROGRAM_CONFIG;
  const ambassadorsDb = loadAmbassadorsDb();
  const referralsDb = loadReferralsDb();

  const ambassadors = Object.values(ambassadorsDb.ambassadors || {}).map((record) => {
    const user = findUser(record.userId);
    const profile = profileForUser(record.userId);
    const rewardStats = getAmbassadorRewardStats(record.userId);
    return mapAmbassadorRow(
      {
        ...record,
        referralLink: record.referralLink || buildReferralLink(record.referralCode),
        ...rewardStats,
      },
      user || {},
      profile || {},
    );
  });

  const referrals = Object.values(referralsDb.referrals || {}).map((record) => {
    const referrer = findUser(record.referrerUserId);
    const referred = findUser(record.referredUserId);
    return mapReferralRow(record, referrer || {}, referred || {});
  });

  const rewards = listEarnedRewards();

  let filteredAmbassadors = ambassadors;
  if (search) {
    filteredAmbassadors = ambassadors.filter((row) => {
      const haystack = [row.name, row.email, row.referralCode, row.userId, row.city, row.planLabel]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }

  const overview = buildOverview(ambassadors, referrals, config);
  const rewardEngineCampaigns = listRewardEngineCampaigns();

  return {
    success: true,
    isLive: true,
    meta: {
      updatedAt: formatRelativeTime(config.updatedAt || new Date().toISOString()),
      sectionLabel: "Ambassador Program",
    },
    overview,
    config,
    ambassadors: filteredAmbassadors,
    referrals: referrals.sort((a, b) =>
      String(b.registeredAt || "").localeCompare(String(a.registeredAt || "")),
    ),
    rewards,
    rewardEngine: {
      campaigns: rewardEngineCampaigns,
      rewardTypes: REWARD_ENGINE_TYPE_OPTIONS,
    },
    quickActions: buildQuickActions(overview),
    campaigns: Object.values(loadCampaignsDb().campaigns || {})
      .map(mapCampaignRow)
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))),
    campaignAudiences: Object.entries(CAMPAIGN_AUDIENCES).map(([id, label]) => ({ id, label })),
    leaderboard: {
      monthly: buildLeaderboardWithRewards(ambassadors, referrals, "monthly"),
      allTime: buildLeaderboardWithRewards(ambassadors, referrals, "allTime"),
    },
    filters: { search },
  };
}

export function updateProgramConfig(updates = {}) {
  const db = loadConfigDb();
  db.config = {
    ...DEFAULT_PROGRAM_CONFIG,
    ...db.config,
    ...updates,
    referralRules: {
      ...DEFAULT_PROGRAM_CONFIG.referralRules,
      ...db.config?.referralRules,
      ...updates.referralRules,
    },
    rewardRules: {
      ...DEFAULT_PROGRAM_CONFIG.rewardRules,
      ...db.config?.rewardRules,
      ...updates.rewardRules,
      onQualifiedReferral: {
        ...DEFAULT_PROGRAM_CONFIG.rewardRules.onQualifiedReferral,
        ...db.config?.rewardRules?.onQualifiedReferral,
        ...updates.rewardRules?.onQualifiedReferral,
      },
    },
    eligibilityRules: {
      ...DEFAULT_PROGRAM_CONFIG.eligibilityRules,
      ...db.config?.eligibilityRules,
      ...updates.eligibilityRules,
    },
    updatedAt: new Date().toISOString(),
  };
  saveConfigDb(db);
  return { success: true, config: db.config };
}

export function setProgramStatus(status = "active") {
  return updateProgramConfig({ status: status === "paused" ? "paused" : "active" });
}

export function promoteAmbassador(userId, input = {}) {
  const user = findUser(userId);
  if (!user) return { error: "User not found", status: 404 };

  const db = loadAmbassadorsDb();
  if (db.ambassadors?.[userId]) {
    return { error: "User is already an ambassador", status: 409 };
  }

  const code = normalizeReferralCode(input.referralCode) || generateAmbassadorCode();
  const duplicate = Object.values(db.ambassadors || {}).some(
    (item) => normalizeReferralCode(item.referralCode) === code,
  );
  if (duplicate) return { error: "Referral code already in use", status: 409 };

  const now = new Date().toISOString();
  const ambassador = {
    id: randomUUID(),
    userId,
    referralCode: code,
    status: "active",
    totalReferrals: 0,
    successfulReferrals: 0,
    createdAt: now,
    promotedAt: now,
    referralLink: buildReferralLink(code),
    notes: input.notes?.trim() || "",
  };

  db.ambassadors[userId] = ambassador;
  saveAmbassadorsDb(db);

  const profile = profileForUser(userId);
  return {
    success: true,
    ambassador: mapAmbassadorRow(ambassador, user, profile || {}),
  };
}

export function approveReward(rewardId, adminId = null) {
  const rewardsDb = loadRewardsDb();
  const reward = rewardsDb.rewards?.[rewardId];
  if (!reward) return { error: "Reward not found", status: 404 };
  if (reward.status === "issued" || reward.status === "redeemed") {
    return { error: "Reward already issued", status: 400 };
  }

  const config = loadConfigDb().config || DEFAULT_PROGRAM_CONFIG;
  const rule = config.rewardRules?.onQualifiedReferral || DEFAULT_PROGRAM_CONFIG.rewardRules.onQualifiedReferral;
  const referrer = findUser(reward.referrerUserId);

  let couponCode = reward.couponCode || null;

  if (reward.rewardType === "discount_coupon" || reward.rewardType === "silver_discount" || reward.rewardType === "gold_discount") {
    const couponResult = createCoupon(
      {
        label: rule.label || `Ambassador reward · ${referrer?.fullName || "Advisor"}`,
        discountType: rule.discountType || "percent",
        discountValue: rule.discountValue || 10,
        appliesTo: rule.appliesTo || ["silver", "gold"],
        assignedUserId: reward.referrerUserId,
        assignedEmail: referrer?.email || null,
        maxRedemptions: 1,
      },
      adminId,
    );

    if (couponResult.error) return couponResult;
    couponCode = couponResult.coupon?.code || null;
  }

  rewardsDb.rewards[rewardId] = {
    ...reward,
    status: "issued",
    couponCode,
    issuedAt: new Date().toISOString(),
  };
  saveRewardsDb(rewardsDb);

  return {
    success: true,
    reward: mapRewardRow(rewardsDb.rewards[rewardId], referrer || {}),
  };
}

export function previewAmbassadorCampaignAudience(audience = "active_ambassadors") {
  const recipients = resolveCampaignRecipients(audience);
  return {
    success: true,
    audience,
    count: recipients.length,
    audienceLabel: CAMPAIGN_AUDIENCES[audience] || audience,
  };
}

export function createAmbassadorCampaign(input = {}, adminId = null) {
  const name = String(input.name || "").trim();
  const messageBody = String(input.messageBody || "").trim();
  const audience = input.audience || "active_ambassadors";

  if (!name) return { error: "Campaign title is required", status: 400 };
  if (!messageBody || messageBody.length < 10) {
    return { error: "Message must be at least 10 characters", status: 400 };
  }
  if (messageBody.length > 900) {
    return { error: "Message must be under 900 characters", status: 400 };
  }

  const recipients = resolveCampaignRecipients(audience);
  if (recipients.length === 0) {
    return {
      error: "No reachable recipients for this audience. Ambassadors need a valid phone number.",
      status: 400,
    };
  }

  const campaignsDb = loadCampaignsDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const campaign = {
    id,
    name,
    messageBody,
    audience,
    channel: "whatsapp",
    status: "draft",
    recipientCount: recipients.length,
    sentCount: 0,
    failedCount: 0,
    createdAt: now,
    sentAt: null,
    createdBy: adminId,
  };

  campaignsDb.campaigns[id] = campaign;
  saveCampaignsDb(campaignsDb);

  return {
    success: true,
    campaign: mapCampaignRow(campaign),
  };
}

export async function sendAmbassadorCampaign(campaignId, adminId = null) {
  const campaignsDb = loadCampaignsDb();
  const campaign = campaignsDb.campaigns?.[campaignId];
  if (!campaign) return { error: "Campaign not found", status: 404 };

  if (campaign.status === "sent" || campaign.status === "sending") {
    return { error: "Campaign was already sent or is in progress", status: 409 };
  }

  const recipients = resolveCampaignRecipients(campaign.audience);
  if (recipients.length === 0) {
    return { error: "No reachable recipients for this campaign", status: 400 };
  }

  campaignsDb.campaigns[campaignId] = {
    ...campaign,
    status: "sending",
    recipientCount: recipients.length,
  };
  saveCampaignsDb(campaignsDb);

  let sentCount = 0;
  let failedCount = 0;

  for (const recipient of recipients) {
    const result = await deliverCampaignMessage({
      phone: recipient.phone,
      messageBody: campaign.messageBody,
    });

    if (result.success) {
      sentCount += 1;
    } else {
      failedCount += 1;
    }
  }

  const finalStatus = failedCount > 0 && sentCount === 0 ? "failed" : "sent";
  const updated = {
    ...campaignsDb.campaigns[campaignId],
    status: finalStatus,
    sentCount,
    failedCount,
    recipientCount: recipients.length,
    sentAt: new Date().toISOString(),
    sentBy: adminId,
  };

  campaignsDb.campaigns[campaignId] = updated;
  saveCampaignsDb(campaignsDb);

  return {
    success: true,
    campaign: mapCampaignRow(updated),
    sentCount,
    failedCount,
    simulated: !Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_API_URL),
  };
}

export function findAmbassadorByCode(code) {
  const normalized = normalizeReferralCode(code);
  if (!normalized) return null;
  const db = loadAmbassadorsDb();
  return (
    Object.values(db.ambassadors || {}).find(
      (item) => normalizeReferralCode(item.referralCode) === normalized,
    ) || null
  );
}
