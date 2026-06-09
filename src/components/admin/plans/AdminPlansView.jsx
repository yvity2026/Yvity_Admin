"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { usePlanActions, usePlans } from "@/hooks/TanstankQuery/usePlans";
import EditPlanEntitlementsModal from "./EditPlanEntitlementsModal";
import PlanDetailPanel from "./PlanDetailPanel";
import PlanTierCard from "./PlanTierCard";
import PlansComparisonTable from "./PlansComparisonTable";
import PlansSkeleton from "./PlansSkeleton";
import { AdminErrorState } from "@/components/admin/ui";

function formatInr(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function buildOverviewMetrics(overview = {}) {
  return [
    {
      id: "total",
      label: "Active subscribers",
      value: Number(overview.totalSubscribers || 0).toLocaleString("en-IN"),
      emoji: "👥",
      hint: "All paid + free plans",
      accent: "teal",
    },
    {
      id: "paid",
      label: "Paid subscribers",
      value: Number(overview.paidSubscribers || 0).toLocaleString("en-IN"),
      emoji: "💳",
      hint: "Silver + Gold",
      accent: "gold",
    },
    {
      id: "silver",
      label: "Silver members",
      value: Number(overview.silverSubscribers || 0).toLocaleString("en-IN"),
      emoji: "🥈",
      hint: "Verified tier",
      accent: "slate",
    },
    {
      id: "gold",
      label: "Gold members",
      value: Number(overview.goldSubscribers || 0).toLocaleString("en-IN"),
      emoji: "🏅",
      hint: "Visibility tier",
      accent: "success",
    },
  ];
}

export default function AdminPlansView() {
  const { data, isLoading, isError, error, refetch, isFetching } = usePlans();
  const { updateEntitlements, isProcessing } = usePlanActions();
  const [selectedPlanId, setSelectedPlanId] = useState("silver");
  const [editingEntitlementsPlan, setEditingEntitlementsPlan] = useState(null);

  if (isLoading) return <PlansSkeleton />;

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load plans"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const overviewMetrics = buildOverviewMetrics(data?.overview);
  const plans = data?.plans || [];
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) || plans[0];

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            Plans and Pricing
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Subscription plans
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Free, Silver, and Gold tiers for advisor subscriptions. Review entitlements, subscriber
            counts, and limits here. Price changes and payment links are managed under{" "}
            <Link href="/admin/pricing" className="font-semibold text-[#FFE7B8] underline">
              Pricing
            </Link>{" "}
            to change list and sale prices. Payment links under{" "}
            <Link href="/admin/payments" className="font-semibold text-[#FFE7B8] underline">
              Payments
            </Link>
            . Featured landing placements are billed separately.
          </p>
          {isFetching && !isLoading && (
            <p className="mt-3 text-[11px] font-medium text-[#FFE7B8]">Refreshing…</p>
          )}
        </section>

        <section className="rounded-[26px] border border-[#0A4A4A]/8 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
                Overview
              </p>
              <p className="mt-1 text-sm text-[#5C7571]">
                Annual run rate at sale price:{" "}
                <span className="font-semibold text-[#0A4A4A]">
                  {formatInr(data?.overview?.annualRunRateInr)}
                </span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {overviewMetrics.map((metric, index) => (
              <DashboardMetricTile key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Plan tiers
            </p>
            <p className="mt-1 text-sm text-[#5C7571]">
              Click a plan to inspect entitlements and technical limits.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanTierCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan?.id === plan.id}
                onSelect={setSelectedPlanId}
              />
            ))}
          </div>
        </section>

        <PlanDetailPanel
          plan={selectedPlan}
          onEditEntitlements={setEditingEntitlementsPlan}
        />

        <PlansComparisonTable comparison={data?.comparison} />
      </div>

      <AnimatePresence>
        {editingEntitlementsPlan ? (
          <EditPlanEntitlementsModal
            plan={editingEntitlementsPlan}
            onClose={() => setEditingEntitlementsPlan(null)}
            onSave={async (entitlements) => {
              try {
                await updateEntitlements(editingEntitlementsPlan.id, entitlements);
                toast.success("Marketing features updated");
                setEditingEntitlementsPlan(null);
              } catch (actionError) {
                toast.error(actionError.message || "Failed to update features");
              }
            }}
            isProcessing={isProcessing}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
