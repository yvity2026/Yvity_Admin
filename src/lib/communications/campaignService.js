import { countAudienceRecipients, resolveAudienceRecipients } from "@/lib/communications/audience";
import {
  getAudienceLabel,
  getCampaignTypeLabel,
  getChannelLabel,
} from "@/lib/communications/constants";
import { sendWhatsAppTemplate } from "@/lib/whatsapp/sender";

const BATCH_SIZE = 25;

function isWhatsAppConfigured() {
  return Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_API_URL,
  );
}

function serializeCampaign(row) {
  const filters = row.segment_filters || {};
  const channel = row.channels?.[0] || "whatsapp";
  const campaignType = filters.campaign_type || "platform_announcement";
  const audienceFilters = filters.audience_filters || {
    audiencePreset: row.audience,
  };

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    audience: row.audience,
    channels: row.channels || [],
    channel,
    channelLabel: getChannelLabel(channel),
    campaignType,
    campaignTypeLabel: getCampaignTypeLabel(campaignType),
    audienceFilters,
    audienceLabel: getAudienceLabel(audienceFilters),
    communicationType: filters.communication_type || "platform",
    messageBody: filters.message_body || row.description || "",
    recipientCount: row.recipient_count ?? 0,
    sentCount: row.sent_count ?? 0,
    failedCount: row.failed_count ?? 0,
    scheduledAt: row.scheduled_at,
    sentAt: row.sent_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listCommunications(supabase, { limit = 20 } = {}) {
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data || []).map(serializeCampaign);
}

export async function createCommunication(supabase, payload, adminId) {
  const {
    name,
    messageBody,
    audience = "all_users",
    communicationType = "platform",
    channel = "whatsapp",
  } = payload;

  const recipientCount = await countAudienceRecipients(supabase, {
    audience,
    communicationType,
    channel,
  });

  const { data, error } = await supabase
    .from("marketing_campaigns")
    .insert({
      name,
      description: messageBody,
      status: "draft",
      audience,
      channels: [channel],
      segment_filters: {
        communication_type: communicationType,
        message_body: messageBody,
      },
      whatsapp_template_key: "PLATFORM_ANNOUNCEMENT",
      recipient_count: recipientCount,
      created_by: adminId || null,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return serializeCampaign(data);
}

async function deliverWhatsApp({ phone, messageBody }) {
  if (!isWhatsAppConfigured()) {
    console.log("[COMM][DEV] Simulated WhatsApp send", { phone: `***${String(phone).slice(-4)}` });
    return {
      success: true,
      providerMessageId: `dev-${Date.now()}`,
      simulated: true,
    };
  }

  const result = await sendWhatsAppTemplate({
    to: phone,
    templateKey: "PLATFORM_ANNOUNCEMENT",
    data: {
      message: String(messageBody).slice(0, 900),
    },
  });

  let providerMessageId = null;

  try {
    const parsed = JSON.parse(result?.responseText || "{}");
    providerMessageId = parsed?.messages?.[0]?.id || null;
  } catch {
    providerMessageId = null;
  }

  return {
    success: true,
    providerMessageId,
    simulated: false,
  };
}

export async function sendCommunication(supabase, campaignId, adminId) {
  const { data: campaign, error: loadError } = await supabase
    .from("marketing_campaigns")
    .select("*")
    .eq("id", campaignId)
    .maybeSingle();

  if (loadError) {
    throw loadError;
  }

  if (!campaign) {
    const notFound = new Error("Communication not found");
    notFound.statusCode = 404;
    throw notFound;
  }

  if (campaign.status === "sent" || campaign.status === "sending") {
    const conflict = new Error("Communication was already sent or is in progress");
    conflict.statusCode = 409;
    throw conflict;
  }

  const filters = campaign.segment_filters || {};
  const communicationType = filters.communication_type || "platform";
  const messageBody = filters.message_body || campaign.description || "";
  const channel = campaign.channels?.[0] || "whatsapp";

  const recipients = await resolveAudienceRecipients(supabase, {
    audience: campaign.audience,
    communicationType,
    channel,
  });

  await supabase
    .from("marketing_campaigns")
    .update({
      status: "sending",
      recipient_count: recipients.length,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId);

  let sentCount = 0;
  let failedCount = 0;

  for (let index = 0; index < recipients.length; index += BATCH_SIZE) {
    const batch = recipients.slice(index, index + BATCH_SIZE);

    await Promise.all(
      batch.map(async (recipient) => {
        const phone = recipient.mobile;

        if (!phone) {
          failedCount += 1;
          await supabase.from("marketing_campaign_sends").upsert(
            {
              campaign_id: campaignId,
              user_id: recipient.id,
              channel,
              status: "skipped",
              error_message: "Missing phone number",
            },
            { onConflict: "campaign_id,user_id,channel" },
          );
          return;
        }

        try {
          if (channel === "whatsapp") {
            const delivery = await deliverWhatsApp({ phone, messageBody });

            await supabase.from("marketing_campaign_sends").upsert(
              {
                campaign_id: campaignId,
                user_id: recipient.id,
                channel,
                status: "sent",
                provider_message_id: delivery.providerMessageId,
                sent_at: new Date().toISOString(),
              },
              { onConflict: "campaign_id,user_id,channel" },
            );

            sentCount += 1;
          } else {
            throw new Error(`Channel "${channel}" is not supported yet`);
          }
        } catch (sendError) {
          failedCount += 1;

          await supabase.from("marketing_campaign_sends").upsert(
            {
              campaign_id: campaignId,
              user_id: recipient.id,
              channel,
              status: "failed",
              error_message: sendError.message?.slice(0, 500) || "Send failed",
            },
            { onConflict: "campaign_id,user_id,channel" },
          );
        }
      }),
    );
  }

  const finalStatus = failedCount > 0 && sentCount === 0 ? "failed" : "sent";

  const { data: updated, error: updateError } = await supabase
    .from("marketing_campaigns")
    .update({
      status: finalStatus,
      sent_count: sentCount,
      failed_count: failedCount,
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .select("*")
    .single();

  if (updateError) {
    throw updateError;
  }

  return {
    campaign: serializeCampaign(updated),
    sentCount,
    failedCount,
    simulated: !isWhatsAppConfigured(),
    adminId,
  };
}
