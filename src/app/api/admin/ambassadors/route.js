import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/adminSession";
import {
  approveReward,
  createAmbassadorCampaign,
  getAmbassadorsSnapshot,
  previewAmbassadorCampaignAudience,
  promoteAmbassador,
  sendAmbassadorCampaign,
  setProgramStatus,
  updateProgramConfig,
} from "@/lib/local-data/ambassadors-store";
import {
  createRewardEngineCampaign,
  deleteRewardEngineCampaign,
  duplicateRewardEngineCampaign,
  evaluateAndGrantRewardsForUser,
  getReferralsForAmbassador,
  getRewardEngineCampaign,
  setRewardEngineCampaignStatus,
  updateRewardEngineCampaign,
} from "@/lib/local-data/reward-engine-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import {
  approveRewardInSupabase,
  createAmbassadorCampaignInSupabase,
  createRewardCampaignInSupabase,
  deleteRewardCampaignInSupabase,
  duplicateRewardCampaignInSupabase,
  getAmbassadorsSnapshotFromSupabase,
  getRewardCampaignInSupabase,
  getReferralsForAmbassadorInSupabase,
  previewCampaignAudienceInSupabase,
  promoteAmbassadorInSupabase,
  sendAmbassadorCampaignInSupabase,
  setProgramStatusInSupabase,
  setRewardCampaignStatusInSupabase,
  updateProgramConfigInSupabase,
  updateRewardCampaignInSupabase,
} from "@/lib/supabase/ambassadors-queries";

async function requireAdmin() {
  return requireAdminSession();
}

export async function GET(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const opts = { search: searchParams.get("search") || "" };

    if (localDataAvailable()) {
      return NextResponse.json(getAmbassadorsSnapshot(opts));
    }
    return NextResponse.json(await getAmbassadorsSnapshotFromSupabase(opts));
  } catch (error) {
    console.error("Admin ambassadors GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const local = localDataAvailable();

  try {
    const body = await request.json();
    const action = body.action;

    if (action === "update_settings") {
      const result = local
        ? updateProgramConfig(body.config || body)
        : await updateProgramConfigInSupabase(body.config || body);
      return NextResponse.json(result);
    }

    if (action === "pause_program") {
      const result = local
        ? setProgramStatus("paused")
        : await setProgramStatusInSupabase("paused");
      return NextResponse.json(result);
    }

    if (action === "resume_program") {
      const result = local
        ? setProgramStatus("active")
        : await setProgramStatusInSupabase("active");
      return NextResponse.json(result);
    }

    if (action === "promote_ambassador") {
      const result = local
        ? promoteAmbassador(body.userId, body)
        : await promoteAmbassadorInSupabase(body.userId, body, adminSession.admin_id);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "approve_reward") {
      const result = local
        ? approveReward(body.rewardId, adminSession.admin_id)
        : await approveRewardInSupabase(body.rewardId, adminSession.admin_id);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "preview_campaign_audience") {
      const result = local
        ? previewAmbassadorCampaignAudience(body.audience || "active_ambassadors")
        : await previewCampaignAudienceInSupabase(body.audience || "active_ambassadors");
      return NextResponse.json(result);
    }

    if (action === "create_campaign") {
      const result = local
        ? createAmbassadorCampaign(body, adminSession.admin_id)
        : await createAmbassadorCampaignInSupabase(body, adminSession.admin_id);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "send_campaign") {
      const result = local
        ? await sendAmbassadorCampaign(body.campaignId, adminSession.admin_id)
        : await sendAmbassadorCampaignInSupabase(body.campaignId, adminSession.admin_id);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "create_reward_campaign") {
      const result = local
        ? createRewardEngineCampaign(body)
        : await createRewardCampaignInSupabase(body, adminSession.admin_id);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "update_reward_campaign") {
      const result = local
        ? updateRewardEngineCampaign(body.campaignId, body)
        : await updateRewardCampaignInSupabase(body.campaignId, body);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "duplicate_reward_campaign") {
      const result = local
        ? duplicateRewardEngineCampaign(body.campaignId)
        : await duplicateRewardCampaignInSupabase(body.campaignId);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "pause_reward_campaign") {
      const result = local
        ? setRewardEngineCampaignStatus(body.campaignId, "paused")
        : await setRewardCampaignStatusInSupabase(body.campaignId, "paused");
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "activate_reward_campaign") {
      const result = local
        ? setRewardEngineCampaignStatus(body.campaignId, "active")
        : await setRewardCampaignStatusInSupabase(body.campaignId, "active");
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "delete_reward_campaign") {
      const result = local
        ? deleteRewardEngineCampaign(body.campaignId)
        : await deleteRewardCampaignInSupabase(body.campaignId);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "get_reward_campaign") {
      const campaign = local
        ? getRewardEngineCampaign(body.campaignId)
        : await getRewardCampaignInSupabase(body.campaignId);
      if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      return NextResponse.json({ success: true, campaign });
    }

    if (action === "get_ambassador_referrals") {
      const referrals = local
        ? getReferralsForAmbassador(body.userId)
        : await getReferralsForAmbassadorInSupabase(body.userId);
      return NextResponse.json({ success: true, referrals });
    }

    if (action === "reevaluate_rewards") {
      if (local) {
        const result = evaluateAndGrantRewardsForUser(body.userId, adminSession.admin_id);
        return NextResponse.json(result);
      }
      return NextResponse.json({ success: true, message: "Reward re-evaluation is managed automatically on cloud." });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Admin ambassadors POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
