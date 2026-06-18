import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildPlansResponse } from "@/lib/admin/plans/mapPlanRecord";
import {
  createPlanConfig,
  getMembershipPlansSnapshot,
  listConfiguredPlans,
  updateFeaturedProductPricing,
  updatePlanPricing,
} from "@/lib/local-data/membership-plans-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import {
  createPlanInSupabase,
  getPricingFromSupabase,
  updateFeaturedPricingInSupabase,
  updatePlanPricingInSupabase,
} from "@/lib/supabase/pricing-queries";

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
    if (localDataAvailable()) {
      const { plans, featuredProducts, subscriberCounts } = getMembershipPlansSnapshot();
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
        templates: listConfiguredPlans().map((plan) => ({ id: plan.id, name: plan.name })),
      });
    }
    return NextResponse.json(await getPricingFromSupabase());
  } catch (error) {
    console.error("Admin pricing GET failed", error);
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
    if (action === "update") {
      // eslint-disable-next-line no-unused-vars
      const { planId, action: _a, ...updates } = payload;
      if (!planId) return NextResponse.json({ error: "planId is required" }, { status: 400 });
      const result = local
        ? updatePlanPricing(planId, updates)
        : await updatePlanPricingInSupabase(planId, updates);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "create") {
      // eslint-disable-next-line no-unused-vars
      const { action: _a, ...createPayload } = payload;
      const result = local ? createPlanConfig(createPayload) : await createPlanInSupabase(createPayload);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "update_featured") {
      // eslint-disable-next-line no-unused-vars
      const { productId, action: _a, ...updates } = payload;
      if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });
      const result = local
        ? updateFeaturedProductPricing(productId, updates)
        : await updateFeaturedPricingInSupabase(productId, updates);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin pricing POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
