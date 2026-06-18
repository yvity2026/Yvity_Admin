"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { usePaymentActions, usePayments } from "@/hooks/TanstankQuery/usePayment";
import CreatePaymentLinkModal from "./CreatePaymentLinkModal";
import PaymentDetailModal from "./PaymentDetailModal";
import PaymentLinksPanel from "./PaymentLinksPanel";
import PaymentsTable from "./PaymentsTable";
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
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
];

function formatInr(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function buildMetrics(overview = {}) {
  return [
    {
      id: "month",
      label: "Revenue this month",
      value: formatInr(overview.revenueThisMonthInr),
      emoji: "💰",
      hint: "Paid transactions",
      accent: "teal",
    },
    {
      id: "alltime",
      label: "All-time revenue",
      value: formatInr(overview.revenueAllTimeInr),
      emoji: "📈",
      hint: "Successful payments",
      accent: "success",
    },
    {
      id: "paid",
      label: "Paid",
      value: String(overview.paidCount || 0),
      emoji: "✅",
      hint: "Completed checkouts",
      accent: "gold",
    },
    {
      id: "pending",
      label: "Pending",
      value: String(overview.pendingCount || 0),
      emoji: "⏳",
      hint: "Awaiting Razorpay",
      accent: "slate",
    },
  ];
}

export default function AdminPaymentsView() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showCreateLink, setShowCreateLink] = useState(false);

  const { data, isLoading, isError, error, refetch, isFetching } = usePayments({
    filter,
    search,
    page,
    limit: 20,
  });
  const { createPaymentLink, isProcessing } = usePaymentActions();

  const handleCreateLink = async (payload) => {
    try {
      const result = await createPaymentLink(payload);
      toast.success("Payment link created");
      return result;
    } catch (actionError) {
      toast.error(actionError.message || "Failed to create payment link");
      return null;
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  if (isLoading) {
    return <AdminPageSkeleton layout="default" />;
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load payments"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const metrics = buildMetrics(data?.overview);
  const payments = data?.payments || [];
  const pagination = data?.pagination || {};

  return (
    <div className="min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            Plans and Pricing
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Payments
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Razorpay transactions and payment links. Subscription expiry and renewals live under{" "}
            <Link href="/admin/billing" className="font-semibold text-[#FFE7B8] underline">
              Billing
            </Link>
            ; sale prices from{" "}
            <Link href="/admin/pricing" className="font-semibold text-[#FFE7B8] underline">
              Pricing
            </Link>
            ; coupons from{" "}
            <Link href="/admin/coupons" className="font-semibold text-[#FFE7B8] underline">
              Coupons
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

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[#E6ECEA] bg-white px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[#183534]">Send a payment link</p>
            <p className="text-[12px] text-[#5C7571]">
              Pick advisor, plan, optional coupon — share via WhatsApp or email.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateLink(true)}
            className="rounded-xl bg-[#0A4A4A] px-4 py-3 text-sm font-semibold text-white"
          >
            Create payment link
          </button>
        </section>

        <PaymentLinksPanel links={data?.paymentLinks || []} onCopy={handleCopy} />

        <section className="flex flex-col gap-4 rounded-[24px] border border-[#E6ECEA] bg-white p-4 shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
          <AdminTabBar
            items={FILTER_TABS}
            value={filter}
            onChange={(id) => {
              setFilter(id);
              setPage(1);
            }}
            ariaLabel="Payment status filters"
            scrollable
          />
          <AdminSearchInput
            label="Search payments"
            size="compact"
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Name, email, phone, plan, or order id"
          />
        </section>

        <PaymentsTable payments={payments} onView={setSelectedPayment} />

        {pagination.total > 0 ? (
          <PaginationControls
            pagination={getPaginationData(
              Array.from({ length: pagination.total }),
              pagination.page,
              pagination.limit,
            )}
            onPageChange={setPage}
            label="transactions"
          />
        ) : null}
      </div>

      <AnimatePresence>
        {selectedPayment ? (
          <PaymentDetailModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateLink ? (
          <CreatePaymentLinkModal
            advisors={data?.advisors || []}
            planOptions={data?.planOptions || []}
            onClose={() => setShowCreateLink(false)}
            onCreate={handleCreateLink}
            isProcessing={isProcessing}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
