import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getFeatureControlsSnapshot,
  resetPlanLimits,
  updateGlobalFlags,
  updatePlanLimits,
} from "@/lib/local-data/feature-controls-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import {
  getFeatureControlsFromSupabase,
  resetPlanLimitsInSupabase,
  updateGlobalFlagsInSupabase,
  updatePlanLimitsInSupabase,
} from "@/lib/supabase/feature-controls-queries";

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
  if (!adminSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    if (localDataAvailable()) return NextResponse.json(getFeatureControlsSnapshot());
    return NextResponse.json(await getFeatureControlsFromSupabase());
  } catch (error) {
    console.error("Admin feature-controls GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = payload;
  const local = localDataAvailable();

  try {
    if (action === "update_global") {
      const { flags } = payload;
      if (!flags || typeof flags !== "object")
        return NextResponse.json({ error: "flags object is required" }, { status: 400 });
      const result = local
        ? updateGlobalFlags(flags)
        : await updateGlobalFlagsInSupabase(flags);
      return NextResponse.json(result);
    }

    if (action === "update_plan_limits") {
      const { planId, limits } = payload;
      if (!planId) return NextResponse.json({ error: "planId is required" }, { status: 400 });
      const result = local
        ? updatePlanLimits(planId, limits || {})
        : await updatePlanLimitsInSupabase(planId, limits || {});
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "reset_plan_limits") {
      const { planId } = payload;
      if (!planId) return NextResponse.json({ error: "planId is required" }, { status: 400 });
      const result = local
        ? resetPlanLimits(planId)
        : await resetPlanLimitsInSupabase(planId);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin feature-controls POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
