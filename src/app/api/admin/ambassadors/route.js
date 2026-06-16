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
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
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

async function requireAdmin() {
  return requireAdminSession();
}

export async function GET(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!localDataAvailable()) {
      return NextResponse.json(
        { error: "Ambassador program storage unavailable. Check Supabase configuration." },
        { status: 501 },
      );
    }

    const { searchParams } = new URL(request.url);
    return NextResponse.json(
      getAmbassadorsSnapshot({
        search: searchParams.get("search") || "",
      }),
    );
  } catch (error) {
    console.error("Admin ambassadors GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!localDataAvailable()) {
    return NextResponse.json(
      { error: "Ambassador program is available in local data mode only for now" },
      { status: 501 },
    );
  }

  try {
    const body = await request.json();
    const action = body.action;

    if (action === "update_settings") {
      const result = updateProgramConfig(body.config || body);
      return NextResponse.json(result);
    }

    if (action === "pause_program") {
      return NextResponse.json(setProgramStatus("paused"));
    }

    if (action === "resume_program") {
      return NextResponse.json(setProgramStatus("active"));
    }

    if (action === "promote_ambassador") {
      const result = promoteAmbassador(body.userId, body);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "approve_reward") {
      const result = approveReward(body.rewardId, adminSession.admin_id);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "preview_campaign_audience") {
      return NextResponse.json(
        previewAmbassadorCampaignAudience(body.audience || "active_ambassadors"),
      );
    }

    if (action === "create_campaign") {
      const result = createAmbassadorCampaign(body, adminSession.admin_id);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "send_campaign") {
      const result = await sendAmbassadorCampaign(body.campaignId, adminSession.admin_id);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "create_reward_campaign") {
      const result = createRewardEngineCampaign(body);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "update_reward_campaign") {
      const result = updateRewardEngineCampaign(body.campaignId, body);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "duplicate_reward_campaign") {
      const result = duplicateRewardEngineCampaign(body.campaignId);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "pause_reward_campaign") {
      const result = setRewardEngineCampaignStatus(body.campaignId, "paused");
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "activate_reward_campaign") {
      const result = setRewardEngineCampaignStatus(body.campaignId, "active");
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "delete_reward_campaign") {
      const result = deleteRewardEngineCampaign(body.campaignId);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "get_reward_campaign") {
      const campaign = getRewardEngineCampaign(body.campaignId);
      if (!campaign) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, campaign });
    }

    if (action === "get_ambassador_referrals") {
      return NextResponse.json({
        success: true,
        referrals: getReferralsForAmbassador(body.userId),
      });
    }

    if (action === "reevaluate_rewards") {
      const result = evaluateAndGrantRewardsForUser(body.userId, adminSession.admin_id);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Admin ambassadors POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
