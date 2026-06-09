"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { useBilling, useBillingActions } from "@/hooks/TanstankQuery/useBilling";
import BillingSubscriptionsTable from "./BillingSubscriptionsTable";
import ExtendSubscriptionModal from "./ExtendSubscriptionModal";
import PaginationControls from "@/components/common/PaginationControls";
import { getPaginationData } from "@/lib/pagination";
import {
  AdminErrorState,
  AdminPageSkeleton,
  AdminSearchInput,
  AdminTabBar,
} from "@/components/admin/ui";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "paid", label: "Paid" },
  { id: "active", label: "Active" },
  { id: "expiring_soon", label: "Expiring (30d)" },
  { id: "expired", label: "Expired" },
  { id: "free", label: "Free" },
];

function formatInr(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function buildMetrics(overview = {}) {
  return [
    {
      id: "paid",
      label: "Paid subscriptions",
      value: String(overview.paidSubscriptions || 0),
      emoji: "💳",
      hint: "Silver, Gold, custom tiers",
      accent: "teal",
    },
    {
      id: "active",
      label: "Active paid",
      value: String(overview.activePaid || 0),
      emoji: "✅",
      hint: "Not expired",
      accent: "success",
    },
    {
      id: "expiring",
      label: "Expiring soon",
      value: String(overview.expiringSoon || 0),
      emoji: "⏳",
      hint: "Within 30 days",
      accent: "gold",
    },
    {
      id: "arr",
      label: "Active ARR",
      value: formatInr(overview.annualRunRateInr),
      emoji: "📈",
      hint: "At current sale prices",
      accent: "slate",
    },
  ];
}

export default function AdminBillingView() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [extendTarget, setExtendTarget] = useState(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useBilling({
    filter,
    search,
    page,
    limit: 20,
  });
  const { extendSubscription, isProcessing } = useBillingActions();

  const handleExtend = async (options) => {
    if (!extendTarget?.userId) return;
    try {
      await extendSubscription(extendTarget.userId, options);
      toast.success("Subscription extended");
      setExtendTarget(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to extend subscription");
    }
  };

  if (isLoading) {
    return <AdminPageSkeleton layout="default" />;
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load billing"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const metrics = buildMetrics(data?.overview);
  const subscriptions = data?.subscriptions || [];
  const pagination = data?.pagination || {};

  return (
    <div className="min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            Plans and Pricing
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Billing
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Subscription lifecycle — who is active, expiring, or overdue. Payment transactions live
            under{" "}
            <Link href="/admin/payments" className="font-semibold text-[#FFE7B8] underline">
              Payments
            </Link>
            ; send renewal links from there. Plan catalog under{" "}
            <Link href="/admin/plans" className="font-semibold text-[#FFE7B8] underline">
              Plans
            </Link>
            .
          </p>
          {isFetching && !isLoading ? (
            <p className="mt-3 text-[11px] font-medium text-[#FFE7B8]">Refreshing…</p>
          ) : null}
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <DashboardMetricTile key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="flex flex-col gap-4 rounded-[24px] border border-[#E6ECEA] bg-white p-4 shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
          <AdminTabBar
            items={FILTER_TABS}
            value={filter}
            onChange={(id) => {
              setFilter(id);
              setPage(1);
            }}
            ariaLabel="Subscription filters"
            scrollable
          />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search advisor, email, plan, order id…"
            className="w-full rounded-xl border border-[#D7E5E1] bg-[#FAFCFB] px-4 py-3 text-sm text-[#183534] outline-none focus:border-[#0A4A4A]"
          />
        </section>

        <BillingSubscriptionsTable
          subscriptions={subscriptions}
          onExtend={setExtendTarget}
        />

        {pagination.total > 0 ? (
          <PaginationControls
            pagination={getPaginationData(
              Array.from({ length: pagination.total }),
              pagination.page,
              pagination.limit,
            )}
            onPageChange={setPage}
            label="subscriptions"
          />
        ) : null}
      </div>

      <AnimatePresence>
        {extendTarget ? (
          <ExtendSubscriptionModal
            subscription={extendTarget}
            onClose={() => setExtendTarget(null)}
            onSave={handleExtend}
            isProcessing={isProcessing}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
