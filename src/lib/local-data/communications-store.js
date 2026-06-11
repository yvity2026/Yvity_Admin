import { randomUUID } from "crypto";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { readJsonFile, writeJsonFile } from "@/lib/local-data/paths";
import { useSupabasePersistence } from "@/lib/supabase/persistence-mode";
import {
  CAMPAIGN_TYPES,
  getAudienceLabel,
  getCampaignTypeLabel,
  getChannelLabel,
} from "@/lib/communications/constants";

const STORE_FILE = "marketing-communications.json";
const REGISTRATION_FILE = "registration.json";
const PROFILES_FILE = "advisor-profiles.json";
const ANNOUNCEMENTS_FILE = "platform-announcements.json";

const DEFAULT_STORE = {
  campaigns: [],
  updatedAt: new Date().toISOString(),
};

function loadStore() {
  return readJsonFile(STORE_FILE, DEFAULT_STORE);
}

function saveStore(store) {
  writeJsonFile(STORE_FILE, { ...store, updatedAt: new Date().toISOString() });
}

function loadAnnouncements() {
  return readJsonFile(ANNOUNCEMENTS_FILE, { announcements: [] });
}

function saveAnnouncements(data) {
  writeJsonFile(ANNOUNCEMENTS_FILE, data);
}

function findProfile(profilesDb, userId) {
  return (
    profilesDb.profiles?.[userId] ||
    Object.values(profilesDb.profiles || {}).find((p) => p.user_id === userId) ||
    null
  );
}

function ageFromDob(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

function matchesAgeGroup(age, group) {
  if (!group || group === "all") return true;
  if (age == null) return false;
  if (group === "18-25") return age >= 18 && age <= 25;
  if (group === "26-35") return age >= 26 && age <= 35;
  if (group === "36-45") return age >= 36 && age <= 45;
  if (group === "46-60") return age >= 46 && age <= 60;
  if (group === "60+") return age >= 60;
  return true;
}

function normalizeFilters(filters = {}) {
  return {
    audiencePreset: filters.audiencePreset || filters.audience || "all_users",
    userType: filters.userType || "all",
    plan: filters.plan || "all",
    industry: filters.industry || "all",
    category: filters.category || "all",
    service: filters.service || "all",
    company: filters.company || "all",
    state: filters.state || "all",
    city: filters.city || "all",
    gender: filters.gender || "all",
    ageGroup: filters.ageGroup || "all",
  };
}

export function resolveLocalAudienceRecipients(filters = {}) {
  const f = normalizeFilters(filters);
  const registration = readJsonFile(REGISTRATION_FILE, { users: [] });
  const profilesDb = readJsonFile(PROFILES_FILE, { profiles: {} });

  return (registration.users || []).filter((user) => {
    const profile = findProfile(profilesDb, user.id);
    const isProfessional = Boolean(profile);
    const plan = String(profile?.subscription_plan || "free").toLowerCase();

    if (f.audiencePreset === "advisors" && !isProfessional) return false;
    if (f.audiencePreset === "customers" && isProfessional) return false;
    if (f.audiencePreset === "plan_gold" && plan !== "gold") return false;
    if (f.audiencePreset === "plan_silver" && plan !== "silver") return false;
    if (f.audiencePreset === "plan_free" && plan !== "free") return false;

    if (f.userType === "professionals" && !isProfessional) return false;
    if (f.userType === "customers" && isProfessional) return false;
    if (f.plan !== "all" && isProfessional && plan !== f.plan) return false;
    if (f.state !== "all" && String(user.state || "").toLowerCase() !== f.state.toLowerCase()) return false;
    if (f.city !== "all" && String(user.city || "").toLowerCase() !== f.city.toLowerCase()) return false;
    if (f.gender !== "all" && String(user.gender || "").toLowerCase() !== f.gender.toLowerCase()) return false;
    if (!matchesAgeGroup(ageFromDob(user.dob), f.ageGroup)) return false;

    return Boolean(user.mobile || user.phone || user.email);
  });
}

export function countLocalAudienceRecipients(filters = {}) {
  return resolveLocalAudienceRecipients(filters).length;
}

function serializeCampaign(row) {
  const filters = row.audienceFilters || {};
  const channel = row.channel || row.channels?.[0] || "whatsapp";
  return {
    id: row.id,
    name: row.name,
    campaignType: row.campaignType,
    campaignTypeLabel: getCampaignTypeLabel(row.campaignType),
    channel,
    channelLabel: getChannelLabel(channel),
    channels: row.channels || [channel],
    communicationType:
      CAMPAIGN_TYPES[row.campaignType]?.communicationType || row.communicationType || "platform",
    messageBody: row.messageBody || "",
    audienceFilters: filters,
    audienceLabel: getAudienceLabel(filters),
    status: row.status || "draft",
    recipientCount: row.recipientCount ?? 0,
    sentCount: row.sentCount ?? 0,
    failedCount: row.failedCount ?? 0,
    scheduledAt: row.scheduledAt || null,
    sentAt: row.sentAt || null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    pinned: Boolean(row.pinned),
    templateId: row.templateId || null,
  };
}

export function listLocalCommunications({ limit = 50 } = {}) {
  const store = loadStore();
  return [...(store.campaigns || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map(serializeCampaign);
}

export function getLocalCommunication(id) {
  const store = loadStore();
  const row = (store.campaigns || []).find((item) => item.id === id);
  return row ? serializeCampaign(row) : null;
}

export function buildLocalCommunicationsOverview() {
  const campaigns = listLocalCommunications({ limit: 200 });
  const sent = campaigns.filter((row) => row.status === "sent");
  const active = campaigns.filter((row) => ["draft", "scheduled", "sending"].includes(row.status));

  const byChannel = (channel) =>
    sent.filter((row) => (row.channels || []).includes(channel) || row.channel === channel);

  return {
    totalMessagesSent: sent.reduce((sum, row) => sum + (row.sentCount || 0), 0),
    emailCampaigns: byChannel("email").length,
    smsCampaigns: byChannel("sms").length,
    whatsappCampaigns: byChannel("whatsapp").length,
    notificationCampaigns: byChannel("notification").length,
    activeCampaigns: active.length,
    totalCampaigns: campaigns.length,
  };
}

export function getLocalFilterOptions() {
  const registration = readJsonFile(REGISTRATION_FILE, { users: [] });
  const states = [...new Set((registration.users || []).map((u) => u.state).filter(Boolean))].sort();
  const cities = [...new Set((registration.users || []).map((u) => u.city).filter(Boolean))].sort();
  return { states, cities, industries: ["BFSI", "Real Estate", "Legal", "Healthcare", "Education"] };
}

export function createLocalCommunication(payload, adminId) {
  const store = loadStore();
  const filters = normalizeFilters(payload.audienceFilters || { audience: payload.audience });
  const campaignType = payload.campaignType || "custom";
  const channel = payload.channel || CAMPAIGN_TYPES[campaignType]?.defaultChannel || "whatsapp";
  const recipientCount = countLocalAudienceRecipients(filters);
  const now = new Date().toISOString();

  const row = {
    id: randomUUID(),
    name: String(payload.name || "").trim(),
    campaignType,
    channel,
    channels: [channel],
    communicationType: CAMPAIGN_TYPES[campaignType]?.communicationType || "platform",
    messageBody: String(payload.messageBody || "").trim(),
    audienceFilters: filters,
    status: payload.scheduledAt ? "scheduled" : "draft",
    scheduledAt: payload.scheduledAt || null,
    recipientCount,
    sentCount: 0,
    failedCount: 0,
    templateId: payload.templateId || null,
    pinned: Boolean(payload.pinned),
    createdBy: adminId || null,
    createdAt: now,
    updatedAt: now,
  };

  store.campaigns = [row, ...(store.campaigns || [])];
  saveStore(store);
  return serializeCampaign(row);
}

export function duplicateLocalCommunication(id, adminId) {
  const store = loadStore();
  const source = (store.campaigns || []).find((row) => row.id === id);
  if (!source) return null;

  const now = new Date().toISOString();
  const copy = {
    ...source,
    id: randomUUID(),
    name: `${source.name} (copy)`,
    status: "draft",
    sentCount: 0,
    failedCount: 0,
    sentAt: null,
    scheduledAt: null,
    createdBy: adminId || source.createdBy,
    createdAt: now,
    updatedAt: now,
  };

  store.campaigns = [copy, ...(store.campaigns || [])];
  saveStore(store);
  return serializeCampaign(copy);
}

export function sendLocalCommunication(id) {
  const store = loadStore();
  const index = (store.campaigns || []).findIndex((row) => row.id === id);
  if (index < 0) {
    const err = new Error("Communication not found");
    err.statusCode = 404;
    throw err;
  }

  const campaign = store.campaigns[index];
  if (campaign.status === "sent" || campaign.status === "sending") {
    const err = new Error("Communication was already sent or is in progress");
    err.statusCode = 409;
    throw err;
  }

  const recipients = resolveLocalAudienceRecipients(campaign.audienceFilters);
  const sentCount = recipients.length;
  const now = new Date().toISOString();

  store.campaigns[index] = {
    ...campaign,
    status: "sent",
    recipientCount: recipients.length,
    sentCount,
    failedCount: 0,
    sentAt: now,
    updatedAt: now,
  };

  saveStore(store);
  return {
    campaign: serializeCampaign(store.campaigns[index]),
    sentCount,
    failedCount: 0,
    simulated: true,
  };
}

export function listLocalAnnouncements() {
  const data = loadAnnouncements();
  return (data.announcements || []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}

export function createLocalAnnouncement(payload) {
  const data = loadAnnouncements();
  const row = {
    id: randomUUID(),
    title: String(payload.title || payload.name || "").trim(),
    messageBody: String(payload.messageBody || "").trim(),
    pinned: Boolean(payload.pinned),
    scheduledAt: payload.scheduledAt || null,
    status: payload.scheduledAt ? "scheduled" : "active",
    createdAt: new Date().toISOString(),
  };
  data.announcements = [row, ...(data.announcements || [])];
  saveAnnouncements(data);
  return row;
}

/** JSON store on sibling .data (dev) or Vercel runtime bootstrap (production). */
export function communicationsLocalMode() {
  return localDataAvailable() || useSupabasePersistence();
}
