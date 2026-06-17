import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/adminSession";
import {
  getFeatureControlsSnapshot,
  resetPlanLimits,
  updateGlobalFlags,
  updatePlanLimits,
} from "@/lib/local-data/feature-controls-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

export async function GET() {
  const adminSession = await requireAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!localDataAvailable()) {
      return NextResponse.json(
        { error: "Feature controls are available in local data mode only for now" },
        { status: 501 },
      );
    }

    return NextResponse.json(getFeatureControlsSnapshot());
  } catch (error) {
    console.error("Admin feature-controls GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const adminSession = await requireAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!localDataAvailable()) {
    return NextResponse.json(
      { error: "Feature controls are available in local data mode only for now" },
      { status: 501 },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = payload;

  try {
    if (action === "update_global") {
      const { flags } = payload;
      if (!flags || typeof flags !== "object") {
        return NextResponse.json({ error: "flags object is required" }, { status: 400 });
      }
      return NextResponse.json(updateGlobalFlags(flags));
    }

    if (action === "update_plan_limits") {
      const { planId, limits } = payload;
      if (!planId) {
        return NextResponse.json({ error: "planId is required" }, { status: 400 });
      }
      const result = updatePlanLimits(planId, limits || {});
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "reset_plan_limits") {
      const { planId } = payload;
      if (!planId) {
        return NextResponse.json({ error: "planId is required" }, { status: 400 });
      }
      const result = resetPlanLimits(planId);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin feature-controls POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
