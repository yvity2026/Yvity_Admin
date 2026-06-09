import {
  buildLocalCommunicationsOverview,
  communicationsLocalMode,
  countLocalAudienceRecipients,
  createLocalCommunication,
  duplicateLocalCommunication,
  getLocalCommunication,
  getLocalFilterOptions,
  listLocalAnnouncements,
  listLocalCommunications,
  sendLocalCommunication,
  createLocalAnnouncement,
} from "@/lib/local-data/communications-store";
import {
  createCommunication,
  listCommunications,
  sendCommunication,
} from "@/lib/communications/campaignService";
import { countAudienceRecipients } from "@/lib/communications/audience";

function mapLegacyPayload(payload = {}) {
  const filters = payload.audienceFilters || {
    audiencePreset: payload.audience || "all_users",
    userType: payload.userType || "all",
    plan: payload.plan || "all",
    industry: payload.industry || "all",
    category: payload.category || "all",
    service: payload.service || "all",
    company: payload.company || "all",
    state: payload.state || "all",
    city: payload.city || "all",
    gender: payload.gender || "all",
    ageGroup: payload.ageGroup || "all",
  };

  return {
    name: payload.name,
    messageBody: payload.messageBody,
    campaignType: payload.campaignType || "platform_announcement",
    channel: payload.channel || "whatsapp",
    audienceFilters: filters,
    audience: filters.audiencePreset,
    communicationType:
      payload.communicationType ||
      (payload.campaignType === "plan_upgrade" ? "marketing" : "platform"),
    scheduledAt: payload.scheduledAt || null,
    templateId: payload.templateId || null,
    pinned: payload.pinned,
  };
}

export function useLocalCommunications() {
  return communicationsLocalMode();
}

export async function fetchCommunicationsOverview(supabase) {
  if (communicationsLocalMode()) {
    const campaigns = listLocalCommunications({ limit: 200 });
    return {
      overview: buildLocalCommunicationsOverview(),
      campaigns,
      history: campaigns.filter((row) => row.status === "sent"),
      announcements: listLocalAnnouncements(),
      filterOptions: getLocalFilterOptions(),
      isLive: true,
      mode: "local",
    };
  }

  const campaigns = await listCommunications(supabase, { limit: 50 });
  const sent = campaigns.filter((row) => row.status === "sent");
  const active = campaigns.filter((row) => ["draft", "scheduled", "sending"].includes(row.status));

  return {
    overview: {
      totalMessagesSent: sent.reduce((sum, row) => sum + (row.sentCount || 0), 0),
      emailCampaigns: sent.filter((row) => row.channels?.includes("email")).length,
      smsCampaigns: sent.filter((row) => row.channels?.includes("sms")).length,
      whatsappCampaigns: sent.filter((row) => row.channels?.includes("whatsapp")).length,
      notificationCampaigns: 0,
      activeCampaigns: active.length,
      totalCampaigns: campaigns.length,
    },
    campaigns,
    history: sent,
    announcements: [],
    filterOptions: { states: [], cities: [], industries: [] },
    isLive: true,
    mode: "supabase",
  };
}

export async function previewAudience(supabase, payload) {
  const mapped = mapLegacyPayload(payload);
  if (communicationsLocalMode()) {
    return countLocalAudienceRecipients(mapped.audienceFilters);
  }
  return countAudienceRecipients(supabase, {
    audience: mapped.audience,
    communicationType: mapped.communicationType,
    channel: mapped.channel,
  });
}

export async function createCampaign(supabase, payload, adminId) {
  const mapped = mapLegacyPayload(payload);
  if (communicationsLocalMode()) {
    return createLocalCommunication(mapped, adminId);
  }
  return createCommunication(
    supabase,
    {
      name: mapped.name,
      messageBody: mapped.messageBody,
      audience: mapped.audience,
      communicationType: mapped.communicationType,
      channel: mapped.channel,
    },
    adminId,
  );
}

export async function sendCampaign(supabase, id, adminId) {
  if (communicationsLocalMode()) {
    return sendLocalCommunication(id);
  }
  return sendCommunication(supabase, id, adminId);
}

export async function duplicateCampaign(supabase, id, adminId) {
  if (communicationsLocalMode()) {
    return duplicateLocalCommunication(id, adminId);
  }

  const campaigns = await listCommunications(supabase, { limit: 200 });
  const source = campaigns.find((row) => row.id === id);
  if (!source) return null;

  return createCommunication(
    supabase,
    {
      name: `${source.name} (copy)`,
      messageBody: source.messageBody,
      audience: source.audience,
      communicationType: source.communicationType,
      channel: source.channels?.[0] || "whatsapp",
    },
    adminId,
  );
}

export async function getCampaign(supabase, id) {
  if (communicationsLocalMode()) {
    return getLocalCommunication(id);
  }
  const campaigns = await listCommunications(supabase, { limit: 200 });
  return campaigns.find((row) => row.id === id) || null;
}

export async function createAnnouncement(supabase, payload, adminId) {
  if (communicationsLocalMode()) {
    return createLocalAnnouncement(payload);
  }
  return createCampaign(
    supabase,
    {
      name: payload.title,
      messageBody: payload.messageBody,
      campaignType: "platform_announcement",
      channel: "notification",
      pinned: payload.pinned,
      scheduledAt: payload.scheduledAt || null,
    },
    adminId,
  );
}
