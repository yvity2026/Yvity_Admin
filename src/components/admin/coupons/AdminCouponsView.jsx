"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { useCouponActions, useCoupons } from "@/hooks/TanstankQuery/useCoupons";
import CouponsTable from "./CouponsTable";
import CreateCouponModal from "./CreateCouponModal";
import { AdminErrorState, AdminPageSkeleton } from "@/components/admin/ui";

function buildCouponMetrics(overview = {}) {
  return [
    {
      id: "total",
      label: "Total coupons",
      value: String(overview.total || 0),
      emoji: "🎟️",
      hint: "All generated codes",
      accent: "teal",
    },
    {
      id: "active",
      label: "Active",
      value: String(overview.active || 0),
      emoji: "✅",
      hint: "Ready to redeem",
      accent: "success",
    },
    {
      id: "redeemed",
      label: "Redeemed",
      value: String(overview.redeemed || 0),
      emoji: "🔒",
      hint: "Already used",
      accent: "slate",
    },
    {
      id: "reserved",
      label: "In checkout",
      value: String(overview.reserved || 0),
      emoji: "⏳",
      hint: "Reserved during payment",
      accent: "gold",
    },
  ];
}

export default function AdminCouponsView() {
  const { data, isLoading, isError, error, refetch } = useCoupons();
  const { createCoupon, revokeCoupon, isProcessing } = useCouponActions();
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = async (payload) => {
    try {
      const result = await createCoupon(payload);
      toast.success(`Coupon ${result.coupon?.code || "created"}`);
      setShowCreate(false);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to create coupon");
    }
  };

  const handleRevoke = async (coupon) => {
    if (!coupon?.id) return;
    try {
      await revokeCoupon(coupon.id);
      toast.success("Coupon revoked");
    } catch (actionError) {
      toast.error(actionError.message || "Failed to revoke coupon");
    }
  };

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Coupon code copied");
    } catch {
      toast.error("Could not copy code");
    }
  };

  if (isLoading) {
    return <AdminPageSkeleton layout="default" />;
  }

  if (data?._localOnly) {
    return (
      <AdminErrorState
        title="Coupons — coming soon"
        message="Coupon management is not yet available in the cloud environment."
      />
    );
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load coupons"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const coupons = data?.coupons || [];
  const metrics = buildCouponMetrics(data?.overview);

  return (
    <div className="min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            Plans and Pricing
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Coupons
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Everyone sees the same sale price from{" "}
            <Link href="/admin/pricing" className="font-semibold text-[#FFE7B8] underline">
              Pricing
            </Link>
            . Generate personal codes for trusted contacts — an extra discount at checkout, burned
            after one successful payment. Send payment links from{" "}
            <Link href="/admin/payments" className="font-semibold text-[#FFE7B8] underline">
              Payments
            </Link>
            .
          </p>
        </section>

        <section className="rounded-[20px] border border-[#E6ECEA] bg-[#FAFCFB] px-4 py-4 text-sm text-[#5C7571]">
          <strong className="text-[#183534]">How it works:</strong> Gold sale price stays ₹2,999 for
          everyone. A 10% coupon makes checkout ₹2,699 for that person only. The code is reserved when
          they start payment and marked <em>redeemed</em> only after Razorpay succeeds — so reusing the
          same code fails.
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <DashboardMetricTile key={metric.id} metric={metric} />
          ))}
        </section>

        <section className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-cormorant text-2xl font-bold text-[#0A4A4A]">Coupon codes</h2>
            <p className="mt-1 text-sm text-[#5C7571]">
              One-time personal discounts on top of regular sale pricing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="rounded-xl bg-[#0A4A4A] px-4 py-3 text-sm font-semibold text-white"
          >
            Generate coupon
          </button>
        </section>

        <CouponsTable
          coupons={coupons}
          onRevoke={handleRevoke}
          onCopy={handleCopy}
          isProcessing={isProcessing}
        />
      </div>

      <AnimatePresence>
        {showCreate && (
          <CreateCouponModal
            onClose={() => setShowCreate(false)}
            onSave={handleCreate}
            isProcessing={isProcessing}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
