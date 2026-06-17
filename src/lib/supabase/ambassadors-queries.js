import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { getPlatformConfig, setPlatformConfig } from "@/lib/supabase/platform-configs";
import {
  mapAmbassadorRow,
  mapReferralRow,
  mapRewardRow,
} from "@/lib/admin/ambassadors/mapAmbassadorRecord";
import {
  formatRelativeTime,
  generateAmbassadorCode,
  normalizeReferralCode,
} from "@/lib/admin/ambassadors/ambassadorUtils";
import { isWhatsAppApiConfigured } from "@/lib/whatsapp/config";
import { REWARD_ENGINE_TYPE_OPTIONS } from "@/lib/admin/ambassadors/rewardEngineConstants";
import { goldAppBaseUrl } from "@/lib/local-data/paths";
import { createCouponInSupabaseRaw } from "@/lib/supabase/coupons-queries";

const CONFIG_KEY = "ambassador_program";

const DEFAULT_PROGRAM_CONFIG = {
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

async function loadProgramConfig() {
  const stored = await getPlatformConfig(CONFIG_KEY);
  if (!stored) return { ...DEFAULT_PROGRAM_CONFIG };
  return {
    ...DEFAULT_PROGRAM_CONFIG,
    ...stored,
    referralRules: { ...DEFAULT_PROGRAM_CONFIG.referralRules, ...(stored.referralRules || {}) },
    rewardRules: {
      ...DEFAULT_PROGRAM_CONFIG.rewardRules,
      ...(stored.rewardRules || {}),
      onQualifiedReferral: {
        ...DEFAULT_PROGRAM_CONFIG.rewardRules.onQualifiedReferral,
        ...(stored.rewardRules?.onQualifiedReferral || {}),
      },
    },
    eligibilityRules: {
      ...DEFAULT_PROGRAM_CONFIG.eligibilityRules,
      ...(stored.eligibilityRules || {}),
    },
  };
}

function buildReferralLink(code, config) {
  const base = goldAppBaseUrl();
  const param = config?.referralRules?.linkParam || "ref";
  return `${base}/register?${param}=${encodeURIComponent(code)}`;
}

async function resolveCampaignRecipients(supabase, audience, config) {
  let rows = [];

  if (audience === "all_advisors") {
    const { data = [] } = await supabase
      .from("users")
      .select("id, name, mobile")
      .not("mobile", "is", null);
    rows = data.map((u) => ({ userId: u.id, name: u.name || "Advisor", phone: u.mobile }));
  } else {
    const query = supabase.from("ambassadors").select("user_id, status");
    if (audience === "active_ambassadors") query.eq("status", "active");
    const { data: ambRows = [] } = await query;
    const userIds = ambRows.map((r) => r.user_id);
    if (!userIds.length) return [];
    const { data: users = [] } = await supabase
      .from("users")
      .select("id, name, mobile")
      .in("id", userIds);
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
    rows = ambRows.map((r) => {
      const u = userMap[r.user_id] || {};
      return { userId: r.user_id, name: u.name || "Advisor", phone: u.mobile };
    });
  }

  return rows.filter((r) => r.phone);
}

async function deliverCampaignMessage({ phone, messageBody }) {
  if (!isWhatsAppApiConfigured()) {
    return { success: true, simulated: true };
  }
  try {
    const { sendWhatsAppTemplate } = await import("@/lib/whatsapp/sender");
    await sendWhatsAppTemplate({
      to: phone,
      templateKey: "PLATFORM_ANNOUNCEMENT",
      data: { message: String(messageBody).slice(0, 900) },
    });
    return { success: true, simulated: false };
  } catch (err) {
    return { success: false, error: err?.message };
  }
}

function mapCampaignRow(row) {
  const status = row.status || "draft";
  return {
    id: row.id,
    name: row.name,
    messageBody: row.message_body,
    audience: row.audience,
    audienceLabel: CAMPAIGN_AUDIENCES[row.audience] || row.audience,
    channel: "whatsapp",
    status,
    statusLabel: CAMPAIGN_STATUS_LABELS[status] || status,
    recipientCount: Number(row.recipient_count) || 0,
    sentCount: Number(row.sent_count) || 0,
    failedCount: Number(row.failed_count) || 0,
    createdAt: row.created_at || null,
    sentAt: row.sent_at || null,
  };
}

function mapRewardCampaignRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    type: row.type,
    status: row.status,
    config: row.config || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAmbassadorsSnapshotFromSupabase(options = {}) {
  const search = String(options.search || "").trim().toLowerCase();
  const supabase = createAdminClient();
  const config = await loadProgramConfig();

  const [
    { data: ambRows = [] },
    { data: referralRows = [] },
    { data: rewardRows = [] },
    { data: campaignRows = [] },
    { data: rewardCampaignRows = [] },
  ] = await Promise.all([
    supabase.from("ambassadors").select("*"),
    supabase.from("referrals").select("*").order("created_at", { ascending: false }),
    supabase.from("ambassador_rewards").select("*").order("created_at", { ascending: false }),
    supabase.from("ambassador_campaigns").select("*").order("created_at", { ascending: false }),
    supabase.from("reward_campaigns").select("*").order("created_at", { ascending: false }),
  ]);

  const userIds = [
    ...new Set([
      ...ambRows.map((r) => r.user_id),
      ...referralRows.map((r) => r.referrer_user_id),
      ...referralRows.map((r) => r.referred_user_id),
      ...rewardRows.map((r) => r.user_id),
    ].filter(Boolean)),
  ];

  const { data: users = [] } = userIds.length
    ? await supabase.from("users").select("id, name, email, mobile, city").in("id", userIds)
    : { data: [] };

  const { data: profiles = [] } = ambRows.length
    ? await supabase
        .from("advisor_profiles")
        .select("advisor_id, subscription_plan")
        .in("advisor_id", ambRows.map((r) => r.user_id))
    : { data: [] };

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const profileMap = Object.fromEntries(profiles.map((p) => [p.advisor_id, p]));

  const ambassadors = ambRows.map((row) => {
    const user = userMap[row.user_id] || {};
    const profile = profileMap[row.user_id] || {};
    const myReferrals = referralRows.filter((r) => r.referrer_user_id === row.user_id);
    const myRewards = rewardRows.filter((r) => r.user_id === row.user_id);
    return mapAmbassadorRow(
      {
        id: row.id,
        userId: row.user_id,
        referralCode: row.referral_code,
        referralLink: buildReferralLink(row.referral_code, config),
        status: row.status,
        totalReferrals: myReferrals.length,
        successfulReferrals: myReferrals.filter((r) => r.status === "qualified").length,
        rewardsEarned: myRewards.length,
        rewardsClaimed: myRewards.filter((r) => r.status === "claimed" || r.status === "redeemed").length,
        createdAt: row.promoted_at,
        promotedAt: row.promoted_at,
      },
      user,
      profile,
    );
  });

  const referrals = referralRows.map((row) => {
    const referrer = userMap[row.referrer_user_id] || {};
    const referred = userMap[row.referred_user_id] || {};
    return mapReferralRow(
      {
        id: row.id,
        referrerUserId: row.referrer_user_id,
        referrerCode: row.referral_code,
        referredUserId: row.referred_user_id,
        registeredAt: row.created_at,
        planPurchased: row.plan_id || null,
        purchasedAt: row.qualified_at || null,
        status: row.status || "registered",
        rewardId: null,
      },
      referrer,
      referred,
    );
  });

  const rewards = rewardRows.map((row) => {
    const referrer = userMap[row.user_id] || {};
    return mapRewardRow(
      {
        id: row.id,
        referralId: row.referral_id,
        referrerUserId: row.user_id,
        rewardType: row.reward_type,
        status: row.status,
        couponCode: row.coupon_code || null,
        createdAt: row.created_at,
        issuedAt: row.approved_at || null,
      },
      referrer,
    );
  });

  let filteredAmbassadors = ambassadors;
  if (search) {
    filteredAmbassadors = ambassadors.filter((a) =>
      [a.name, a.email, a.referralCode, a.userId, a.city, a.planLabel]
        .filter(Boolean).join(" ").toLowerCase().includes(search),
    );
  }

  const overview = {
    totalAmbassadors: ambassadors.length,
    activeAmbassadors: ambassadors.filter((a) => a.status === "active").length,
    totalReferrals: referrals.length,
    successfulReferrals: referrals.filter((r) => r.status === "qualified").length,
    rewardsGenerated: rewards.length,
    rewardsClaimed: rewards.filter((r) => r.status === "claimed" || r.status === "redeemed").length,
    pendingRewards: rewards.filter((r) => r.status === "earned" || r.status === "pending").length,
    programStatus: config.status || "active",
    programStatusLabel: config.status === "paused" ? "Paused" : "Active",
  };

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
    referrals,
    rewards,
    rewardEngine: {
      campaigns: rewardCampaignRows.map(mapRewardCampaignRow),
      rewardTypes: REWARD_ENGINE_TYPE_OPTIONS,
    },
    quickActions: [
      { id: "campaign", label: "Create campaign", description: "Message ambassadors on WhatsApp", action: "create_campaign", emoji: "📣", live: true },
      { id: "coupon", label: "Referral coupon", description: "Generate reward coupon", href: "/admin/coupons", emoji: "🎟️", live: true },
      { id: "notify", label: "Notification", description: "Send ambassador update", action: "create_campaign", emoji: "🔔", live: true },
      { id: "leaders", label: "Top ambassadors", description: "View leaderboard", href: "#leaderboard", emoji: "🏆", live: true },
    ],
    campaigns: campaignRows.map(mapCampaignRow),
    campaignAudiences: Object.entries(CAMPAIGN_AUDIENCES).map(([id, label]) => ({ id, label })),
    leaderboard: { monthly: [], allTime: [] },
    filters: { search },
  };
}

export async function updateProgramConfigInSupabase(updates = {}) {
  const current = await loadProgramConfig();
  const next = {
    ...current,
    ...updates,
    referralRules: { ...current.referralRules, ...(updates.referralRules || {}) },
    rewardRules: {
      ...current.rewardRules,
      ...(updates.rewardRules || {}),
      onQualifiedReferral: {
        ...current.rewardRules.onQualifiedReferral,
        ...(updates.rewardRules?.onQualifiedReferral || {}),
      },
    },
    eligibilityRules: { ...current.eligibilityRules, ...(updates.eligibilityRules || {}) },
    updatedAt: new Date().toISOString(),
  };
  await setPlatformConfig(CONFIG_KEY, next);
  return { success: true, config: next };
}

export async function setProgramStatusInSupabase(status) {
  return updateProgramConfigInSupabase({ status: status === "paused" ? "paused" : "active" });
}

export async function promoteAmbassadorInSupabase(userId, input = {}, adminId = null) {
  const supabase = createAdminClient();

  const { data: user } = await supabase.from("users").select("id, name").eq("id", userId).maybeSingle();
  if (!user) return { error: "User not found", status: 404 };

  const { data: existing } = await supabase.from("ambassadors").select("id").eq("user_id", userId).maybeSingle();
  if (existing) return { error: "User is already an ambassador", status: 409 };

  const config = await loadProgramConfig();
  const code = normalizeReferralCode(input.referralCode) || generateAmbassadorCode();
  const { data: dupCode } = await supabase.from("ambassadors").select("id").eq("referral_code", code).maybeSingle();
  if (dupCode) return { error: "Referral code already in use", status: 409 };

  const { data: inserted, error } = await supabase
    .from("ambassadors")
    .insert({
      user_id: userId,
      referral_code: code,
      status: "active",
      promoted_at: new Date().toISOString(),
      promoted_by_admin_id: adminId || null,
      note: input.notes?.trim() || null,
    })
    .select()
    .single();

  if (error) return { error: error.message, status: 500 };

  const { data: profile } = await supabase.from("advisor_profiles").select("subscription_plan").eq("advisor_id", userId).maybeSingle();

  return {
    success: true,
    ambassador: mapAmbassadorRow(
      { id: inserted.id, userId, referralCode: code, referralLink: buildReferralLink(code, config), status: "active", promotedAt: inserted.promoted_at },
      user,
      profile || {},
    ),
  };
}

export async function approveRewardInSupabase(rewardId, adminId = null) {
  const supabase = createAdminClient();
  const { data: reward } = await supabase.from("ambassador_rewards").select("*").eq("id", rewardId).maybeSingle();
  if (!reward) return { error: "Reward not found", status: 404 };
  if (reward.status === "issued" || reward.status === "redeemed") return { error: "Reward already issued", status: 400 };

  const config = await loadProgramConfig();
  const rule = config.rewardRules?.onQualifiedReferral || DEFAULT_PROGRAM_CONFIG.rewardRules.onQualifiedReferral;

  const { data: referrerUser } = reward.user_id
    ? await supabase.from("users").select("name, email").eq("id", reward.user_id).maybeSingle()
    : { data: null };

  let couponCode = reward.coupon_code || null;

  if (reward.reward_type === "discount_coupon" || reward.reward_type === "silver_discount" || reward.reward_type === "gold_discount") {
    const couponResult = await createCouponInSupabaseRaw({
      code: generateCouponCode(),
      label: rule.label || `Ambassador reward · ${referrerUser?.name || "Advisor"}`,
      discount_type: rule.discountType || "percent",
      discount_value: rule.discountValue || 10,
      applies_to: rule.appliesTo || ["silver", "gold"],
      assigned_user_id: reward.user_id || null,
      assigned_email: referrerUser?.email || null,
      max_redemptions: 1,
      redemption_count: 0,
      status: "active",
      created_by_admin_id: adminId || null,
    });

    if (couponResult.error) return couponResult;
    couponCode = couponResult.coupon?.code || null;
  }

  const { data: updated, error } = await supabase
    .from("ambassador_rewards")
    .update({ status: "issued", coupon_code: couponCode, approved_at: new Date().toISOString(), approved_by_admin_id: adminId || null })
    .eq("id", rewardId)
    .select()
    .single();

  if (error) return { error: "Failed to approve reward", status: 500 };

  return {
    success: true,
    reward: mapRewardRow({ id: updated.id, referralId: updated.referral_id, referrerUserId: updated.user_id, rewardType: updated.reward_type, status: updated.status, couponCode: updated.coupon_code, createdAt: updated.created_at, issuedAt: updated.approved_at }, referrerUser || {}),
  };
}

export async function previewCampaignAudienceInSupabase(audience) {
  const supabase = createAdminClient();
  const config = await loadProgramConfig();
  const recipients = await resolveCampaignRecipients(supabase, audience, config);
  return { success: true, audience, count: recipients.length, audienceLabel: CAMPAIGN_AUDIENCES[audience] || audience };
}

export async function createAmbassadorCampaignInSupabase(input = {}, adminId = null) {
  const name = String(input.name || "").trim();
  const messageBody = String(input.messageBody || "").trim();
  const audience = input.audience || "active_ambassadors";

  if (!name) return { error: "Campaign title is required", status: 400 };
  if (!messageBody || messageBody.length < 10) return { error: "Message must be at least 10 characters", status: 400 };
  if (messageBody.length > 900) return { error: "Message must be under 900 characters", status: 400 };

  const supabase = createAdminClient();
  const config = await loadProgramConfig();
  const recipients = await resolveCampaignRecipients(supabase, audience, config);

  if (!recipients.length) return { error: "No reachable recipients. Ambassadors need a valid phone number.", status: 400 };

  const { data: inserted, error } = await supabase
    .from("ambassador_campaigns")
    .insert({ name, message_body: messageBody, audience, status: "draft", recipient_count: recipients.length, created_by_admin_id: adminId || null })
    .select()
    .single();

  if (error) return { error: error.message, status: 500 };
  return { success: true, campaign: mapCampaignRow(inserted) };
}

export async function sendAmbassadorCampaignInSupabase(campaignId, adminId = null) {
  const supabase = createAdminClient();
  const { data: campaign } = await supabase.from("ambassador_campaigns").select("*").eq("id", campaignId).maybeSingle();
  if (!campaign) return { error: "Campaign not found", status: 404 };
  if (campaign.status === "sent" || campaign.status === "sending") return { error: "Campaign was already sent or is in progress", status: 409 };

  const config = await loadProgramConfig();
  const recipients = await resolveCampaignRecipients(supabase, campaign.audience, config);
  if (!recipients.length) return { error: "No reachable recipients for this campaign", status: 400 };

  await supabase.from("ambassador_campaigns").update({ status: "sending", recipient_count: recipients.length }).eq("id", campaignId);

  let sentCount = 0, failedCount = 0;
  for (const recipient of recipients) {
    const result = await deliverCampaignMessage({ phone: recipient.phone, messageBody: campaign.message_body });
    if (result.success) sentCount++; else failedCount++;
  }

  const finalStatus = failedCount > 0 && sentCount === 0 ? "failed" : "sent";
  const { data: updated } = await supabase
    .from("ambassador_campaigns")
    .update({ status: finalStatus, sent_count: sentCount, failed_count: failedCount, recipient_count: recipients.length, sent_at: new Date().toISOString() })
    .eq("id", campaignId)
    .select()
    .single();

  return { success: true, campaign: mapCampaignRow(updated || campaign), sentCount, failedCount, simulated: !isWhatsAppApiConfigured() };
}

export async function createRewardCampaignInSupabase(input = {}, adminId = null) {
  const supabase = createAdminClient();
  if (!input.name || !input.type) return { error: "name and type are required", status: 400 };
  const { data, error } = await supabase
    .from("reward_campaigns")
    .insert({ name: input.name, description: input.description || "", type: input.type, status: input.status || "draft", config: input.config || {}, created_by_admin_id: adminId || null })
    .select().single();
  if (error) return { error: error.message, status: 500 };
  return { success: true, campaign: mapRewardCampaignRow(data) };
}

export async function updateRewardCampaignInSupabase(campaignId, input = {}) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reward_campaigns")
    .update({ name: input.name, description: input.description, type: input.type, config: input.config, updated_at: new Date().toISOString() })
    .eq("id", campaignId).select().single();
  if (error || !data) return { error: "Campaign not found or update failed", status: error ? 500 : 404 };
  return { success: true, campaign: mapRewardCampaignRow(data) };
}

export async function duplicateRewardCampaignInSupabase(campaignId) {
  const supabase = createAdminClient();
  const { data: source } = await supabase.from("reward_campaigns").select("*").eq("id", campaignId).maybeSingle();
  if (!source) return { error: "Campaign not found", status: 404 };
  const { data, error } = await supabase
    .from("reward_campaigns")
    .insert({ name: `${source.name} (copy)`, description: source.description, type: source.type, status: "draft", config: source.config })
    .select().single();
  if (error) return { error: error.message, status: 500 };
  return { success: true, campaign: mapRewardCampaignRow(data) };
}

export async function setRewardCampaignStatusInSupabase(campaignId, status) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reward_campaigns")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", campaignId).select().single();
  if (error || !data) return { error: "Campaign not found", status: 404 };
  return { success: true, campaign: mapRewardCampaignRow(data) };
}

export async function deleteRewardCampaignInSupabase(campaignId) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("reward_campaigns").delete().eq("id", campaignId);
  if (error) return { error: "Failed to delete campaign", status: 500 };
  return { success: true };
}

export async function getRewardCampaignInSupabase(campaignId) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("reward_campaigns").select("*").eq("id", campaignId).maybeSingle();
  if (!data) return null;
  return mapRewardCampaignRow(data);
}

export async function getReferralsForAmbassadorInSupabase(userId) {
  const supabase = createAdminClient();
  const { data: referralRows = [] } = await supabase
    .from("referrals").select("*").eq("referrer_user_id", userId).order("created_at", { ascending: false });
  const referredIds = referralRows.map((r) => r.referred_user_id).filter(Boolean);
  const { data: users = [] } = referredIds.length
    ? await supabase.from("users").select("id, name").in("id", referredIds)
    : { data: [] };
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const { data: referrer } = await supabase.from("users").select("id, name").eq("id", userId).maybeSingle();

  return referralRows.map((row) =>
    mapReferralRow(
      { id: row.id, referrerUserId: row.referrer_user_id, referrerCode: row.referral_code, referredUserId: row.referred_user_id, registeredAt: row.created_at, planPurchased: row.plan_id, purchasedAt: row.qualified_at, status: row.status || "registered" },
      referrer || {},
      userMap[row.referred_user_id] || {},
    ),
  );
}
