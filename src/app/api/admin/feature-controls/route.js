import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getFeatureControlsSnapshot,
  resetPlanLimits,
  updateGlobalFlags,
  updatePlanLimits,
  useFeatureControlsStore,
} from "@/lib/local-data/feature-controls-store";

async function parseAdminSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("admin_session")?.value;
  if (!sessionValue) return null;

  try {
    return JSON.parse(sessionValue);
  } catch {
    return null;
  }
}

async function requireAdmin() {
  const session = await parseAdminSession();
  if (!session?.admin_id || !session?.role) return null;
  return session;
}

export async function GET() {
  const adminSession = await requireAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!useFeatureControlsStore()) {
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
  const adminSession = await requireAdmin();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!useFeatureControlsStore()) {
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
