"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import {
  useFeatureControlActions,
  useFeatureControls,
} from "@/hooks/TanstankQuery/useFeatureControls";
import EditPlanLimitsModal from "./EditPlanLimitsModal";
import GlobalFeatureToggles from "./GlobalFeatureToggles";
import PlanLimitsMatrix from "./PlanLimitsMatrix";
import { AdminErrorState, AdminPageSkeleton } from "@/components/admin/ui";

function buildMetrics(overview = {}) {
  return [
    {
      id: "tiers",
      label: "Plan tiers",
      value: String(overview.planTiers || 0),
      emoji: "📊",
      hint: "Free, Silver, Gold",
      accent: "teal",
    },
    {
      id: "limits",
      label: "Limit fields",
      value: String(overview.limitFields || 0),
      emoji: "🎛️",
      hint: "Caps and toggles",
      accent: "slate",
    },
    {
      id: "global",
      label: "Global switches on",
      value: `${overview.globalFlagsEnabled || 0}/${overview.globalFlagsTotal || 0}`,
      emoji: "🔌",
      hint: "Platform-wide controls",
      accent: "gold",
    },
    {
      id: "updated",
      label: "Last saved",
      value: overview.lastUpdatedAt
        ? new Date(overview.lastUpdatedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })
        : "Defaults",
      emoji: "🕒",
      hint: "Config timestamp",
      accent: "success",
    },
  ];
}

export default function AdminFeatureControlsView() {
  const { data, isLoading, isError, error, refetch } = useFeatureControls();
  const { updateGlobalFlags, updatePlanLimits, resetPlanLimits, isProcessing } =
    useFeatureControlActions();
  const [editingPlanId, setEditingPlanId] = useState(null);

  const handleGlobalToggle = async (key, enabled) => {
    try {
      await updateGlobalFlags({ [key]: enabled });
      toast.success("Platform setting updated");
    } catch (actionError) {
      toast.error(actionError.message || "Failed to update setting");
    }
  };

  const handleSaveLimits = async (planId, limits) => {
    try {
      await updatePlanLimits(planId, limits);
      toast.success(`${planId} limits updated`);
      setEditingPlanId(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to update limits");
    }
  };

  const handleResetLimits = async (planId) => {
    try {
      await resetPlanLimits(planId);
      toast.success(`${planId} limits reset to defaults`);
      setEditingPlanId(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to reset limits");
    }
  };

  if (isLoading) {
    return <AdminPageSkeleton layout="default" />;
  }

  if (data?._localOnly) {
    return (
      <AdminErrorState
        title="Feature controls — coming soon"
        message="This section is managed via local config files and is not yet available in the cloud environment."
      />
    );
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load feature controls"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const metrics = buildMetrics(data?.overview);
  const planTiers = data?.planTiers || [];
  const planLimits = data?.planLimits || {};
  const globalFlags = data?.globalFlags || {};
  const editingLimits = editingPlanId ? planLimits[editingPlanId] : null;

  return (
    <div className="min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            Plans and Pricing
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Feature controls
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Control what each plan tier can do — gallery caps, search, analytics, verification.{" "}
            <Link href="/admin/plans" className="font-semibold text-[#FFE7B8] underline">
              Plans
            </Link>{" "}
            shows marketing copy; this page sets the enforced limits.{" "}
            <Link href="/admin/pricing" className="font-semibold text-[#FFE7B8] underline">
              Pricing
            </Link>{" "}
            stays separate.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <DashboardMetricTile key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-cormorant text-2xl font-bold text-[#0A4A4A]">Platform switches</h2>
            <p className="mt-1 text-sm text-[#5C7571]">
              Master toggles — turn off checkout or uploads platform-wide without changing plan tiers.
            </p>
          </div>
          <GlobalFeatureToggles
            flags={globalFlags}
            onToggle={handleGlobalToggle}
            isProcessing={isProcessing}
          />
        </section>

        <section className="rounded-[20px] border border-[#E6ECEA] bg-[#FAFCFB] px-4 py-4 text-sm text-[#5C7571]">
          <strong className="text-[#183534]">Custom plans (e.g. Platinum):</strong> add under{" "}
          <Link href="/admin/pricing" className="font-semibold text-[#0A4A4A] underline">
            Pricing
          </Link>{" "}
          first — the tier appears here automatically. Set technical limits below; edit marketing
          feature labels on{" "}
          <Link href="/admin/plans" className="font-semibold text-[#0A4A4A] underline">
            Plans
          </Link>
          .
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-cormorant text-2xl font-bold text-[#0A4A4A]">Plan tier limits</h2>
            <p className="mt-1 text-sm text-[#5C7571]">
              All configured tiers — numeric caps and yes/no entitlements synced to the advisor app.
            </p>
          </div>
          <PlanLimitsMatrix
            planTiers={planTiers}
            planLimits={planLimits}
            onEdit={setEditingPlanId}
          />
        </section>
      </div>

      <AnimatePresence>
        {editingPlanId && editingLimits ? (
          <EditPlanLimitsModal
            planId={editingPlanId}
            limits={editingLimits}
            onClose={() => setEditingPlanId(null)}
            onSave={handleSaveLimits}
            onReset={handleResetLimits}
            isProcessing={isProcessing}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
