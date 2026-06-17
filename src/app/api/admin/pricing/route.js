import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/adminSession";
import { buildPlansResponse } from "@/lib/admin/plans/mapPlanRecord";
import { createAdminClient } from "@/lib/supabase/server";
import {
  createPlanConfig,
  listFeaturedProducts,
  listConfiguredPlans,
  updateFeaturedProductPricing,
  updatePlanPricing,
} from "@/lib/local-data/membership-plans-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

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
  const adminSession = await requireAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!localDataAvailable()) {
      return NextResponse.json(
        { error: "Editable pricing is available in local data mode only for now" },
        { status: 501 },
      );
    }

    const plans = listConfiguredPlans();
    const featuredProducts = listFeaturedProducts();
    const subscriberCounts = await countSupabaseSubscribers(plans.map((p) => p.id));
    const response = buildPlansResponse(plans, subscriberCounts);
    const discountedPlans = plans.filter((plan) => plan.hasDiscount).length;

    return NextResponse.json({
      ...response,
      featuredProducts,
      pricingOverview: {
        subscriptionPlans: plans.length,
        plansOnDiscount: discountedPlans,
        featuredProducts: featuredProducts.length,
        featuredOnDiscount: featuredProducts.filter((item) => item.hasDiscount).length,
      },
      templates: plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
      })),
    });
  } catch (error) {
    console.error("Admin pricing GET failed", error);
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
      { error: "Editable pricing is available in local data mode only for now" },
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
    if (action === "update") {
      const { planId, ...updates } = payload;
      if (!planId) {
        return NextResponse.json({ error: "planId is required" }, { status: 400 });
      }

      const result = updatePlanPricing(planId, updates);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "create") {
      const result = createPlanConfig(payload);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "update_featured") {
      const { productId, ...updates } = payload;
      if (!productId) {
        return NextResponse.json({ error: "productId is required" }, { status: 400 });
      }

      const result = updateFeaturedProductPricing(productId, updates);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin pricing POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
