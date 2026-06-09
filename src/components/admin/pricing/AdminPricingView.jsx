"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { usePricing, usePricingActions } from "@/hooks/TanstankQuery/usePricing";
import AddPlanModal from "./AddPlanModal";
import FeaturedPlacementPricing from "./FeaturedPlacementPricing";
import FeaturedPricingEditModal from "./FeaturedPricingEditModal";
import PlanPricingEditModal from "./PlanPricingEditModal";
import PricingPlanCards from "./PricingPlanCards";
import PricingPlansTable from "./PricingPlansTable";
import { AdminErrorState, AdminPageSkeleton } from "@/components/admin/ui";

function formatInr(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function buildPricingMetrics(data = {}) {
  const overview = data.pricingOverview || {};
  const plansOverview = data.overview || {};

  return [
    {
      id: "plans",
      label: "Subscription plans",
      value: String(overview.subscriptionPlans || 0),
      emoji: "📋",
      hint: "Free, Silver, Gold + custom",
      accent: "teal",
    },
    {
      id: "discounts",
      label: "Plans on discount",
      value: String(overview.plansOnDiscount || 0),
      emoji: "🏷️",
      hint: "Sale below list price",
      accent: "gold",
    },
    {
      id: "featured",
      label: "Featured products",
      value: String(overview.featuredProducts || 0),
      emoji: "⭐",
      hint: "Hero + Find Advisors",
      accent: "slate",
    },
    {
      id: "arr",
      label: "Annual run rate",
      value: formatInr(plansOverview.annualRunRateInr),
      emoji: "💰",
      hint: "At current sale prices",
      accent: "success",
    },
  ];
}

export default function AdminPricingView() {
  const { data, isLoading, isError, error, refetch } = usePricing();
  const { updatePlan, createPlan, updateFeaturedProduct, isProcessing } = usePricingActions();
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingFeatured, setEditingFeatured] = useState(null);
  const [showAddPlan, setShowAddPlan] = useState(false);

  const savePricing = async (updates) => {
    if (!editingPlan?.id) return;
    try {
      await updatePlan(editingPlan.id, updates);
      toast.success("Pricing updated");
      setEditingPlan(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to update pricing");
    }
  };

  const saveFeaturedPricing = async (updates) => {
    if (!editingFeatured?.id) return;
    try {
      await updateFeaturedProduct(editingFeatured.id, updates);
      toast.success("Featured pricing updated");
      setEditingFeatured(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to update featured pricing");
    }
  };

  const saveNewPlan = async (payload) => {
    try {
      await createPlan(payload);
      toast.success("Plan created");
      setShowAddPlan(false);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to create plan");
    }
  };

  if (isLoading) {
    return <AdminPageSkeleton layout="default" />;
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load pricing"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const plans = data?.plans || [];
  const featuredProducts = data?.featuredProducts || [];
  const pricingMetrics = buildPricingMetrics(data);

  return (
    <div className="min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            Plans and Pricing
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Pricing control
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Set list and sale prices for subscription plans and featured placements. Changes reflect
            on the{" "}
            <Link href="/admin/plans" className="font-semibold text-[#FFE7B8] underline">
              Plans
            </Link>{" "}
            page. Send payment links from{" "}
            <Link href="/admin/payments" className="font-semibold text-[#FFE7B8] underline">
              Payments
            </Link>
            ; assign Hero / Find Advisors slots from{" "}
            <Link
              href="/admin/visibility-controls"
              className="font-semibold text-[#FFE7B8] underline"
            >
              Visibility controls
            </Link>
            .
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pricingMetrics.map((metric) => (
            <DashboardMetricTile key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-cormorant text-2xl font-bold text-[#0A4A4A]">
                Subscription plans
              </h2>
              <p className="mt-1 text-sm text-[#5C7571]">
                Annual membership pricing — list vs sale discount.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddPlan(true)}
              className="rounded-xl bg-[#0A4A4A] px-4 py-3 text-sm font-semibold text-white"
            >
              Add new plan
            </button>
          </div>

          <PricingPlanCards plans={plans} onEdit={setEditingPlan} />
          <PricingPlansTable plans={plans} onEdit={setEditingPlan} />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-cormorant text-2xl font-bold text-[#0A4A4A]">
              Featured placements
            </h2>
            <p className="mt-1 text-sm text-[#5C7571]">
              Separate one-off products — Hero (3 slots) and Find Advisors (6 slots).
            </p>
          </div>

          <FeaturedPlacementPricing products={featuredProducts} onEdit={setEditingFeatured} />
        </section>
      </div>

      <AnimatePresence>
        {editingPlan && (
          <PlanPricingEditModal
            plan={editingPlan}
            onClose={() => setEditingPlan(null)}
            onSave={savePricing}
            isProcessing={isProcessing}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingFeatured && (
          <FeaturedPricingEditModal
            product={editingFeatured}
            onClose={() => setEditingFeatured(null)}
            onSave={saveFeaturedPricing}
            isProcessing={isProcessing}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddPlan && (
          <AddPlanModal
            templates={data?.templates || plans}
            onClose={() => setShowAddPlan(false)}
            onSave={saveNewPlan}
            isProcessing={isProcessing}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
