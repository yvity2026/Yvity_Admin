import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { buildPlansResponse } from "@/lib/admin/plans/mapPlanRecord";
import { listLocalMembershipPlans, useLocalMembershipPlans } from "@/lib/local-data/membership-plans";
import { updatePlanEntitlements } from "@/lib/local-data/membership-plans-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { getPricingFromSupabase, updatePlanEntitlementsInSupabase } from "@/lib/supabase/pricing-queries";

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

async function countSupabaseSubscribers(planIds = []) {
  const supabase = createAdminClient();
  const counts = {};
  for (const planId of planIds) {
    const { count, error } = await supabase
      .from("advisor_profiles")
      .select("*", { count: "exact", head: true })
      .eq("account_status", "active")
      .eq("subscription_plan", planId);
    if (error) throw error;
    counts[planId] = count || 0;
  }
  return counts;
}

export async function GET() {
  const adminSession = await requireAdmin();
  if (!adminSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    if (useLocalMembershipPlans()) {
      return NextResponse.json(listLocalMembershipPlans());
    }

    // Use live prices from platform_configs (same source as Pricing page)
    const pricingData = await getPricingFromSupabase();
    const livePlans = pricingData.plans || [];
    const subscriberCounts = await countSupabaseSubscribers(livePlans.map((plan) => plan.id));
    return NextResponse.json(buildPlansResponse(livePlans, subscriberCounts));
  } catch (error) {
    console.error("Admin plans GET failed", error);
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

  const { action, planId, included, excluded } = payload;

  try {
    if (action === "update_entitlements") {
      if (!planId) return NextResponse.json({ error: "planId is required" }, { status: 400 });

      const result = localDataAvailable()
        ? updatePlanEntitlements(planId, { included, excluded })
        : await updatePlanEntitlementsInSupabase(planId, { included, excluded });

      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin plans POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
