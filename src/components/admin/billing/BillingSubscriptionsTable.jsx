"use client";

import Link from "next/link";
import { AdminEmptyState } from "@/components/admin/ui";

const STATUS_STYLES = {
  active: "bg-[#E8F5F0] text-[#1A7A5A]",
  expiring_soon: "bg-[#FFFBEB] text-[#B45309]",
  expired: "bg-[#FFF1F0] text-[#DC2626]",
  unknown: "bg-[#F8FAFC] text-[#64748B]",
};

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatInr(amount) {
  if (amount == null) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export default function BillingSubscriptionsTable({
  subscriptions = [],
  onExtend,
}) {
  if (!subscriptions.length) {
    return <AdminEmptyState title="No subscriptions match this filter." />;
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="mobile-scroll-x">
        <table className="w-full min-w-[1080px] text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Advisor</th>
              <th className="px-5 py-4">Plan</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Started</th>
              <th className="px-5 py-4">Expires</th>
              <th className="px-5 py-4">Last payment</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((row) => (
              <tr key={row.userId} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#183534]">{row.advisorName}</p>
                  <p className="text-[12px] text-[#7A928D]">{row.email || row.userId}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-[#F8FBFA] px-2.5 py-1 text-[11px] font-semibold text-[#0A4A4A]">
                    {row.planLabel}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      STATUS_STYLES[row.billingStatus] || STATUS_STYLES.unknown
                    }`}
                  >
                    {row.billingStatusLabel}
                  </span>
                  {row.daysRemaining != null && row.isPaid ? (
                    <p className="mt-1 text-[11px] text-[#7A928D]">
                      {row.daysRemaining < 0
                        ? `${Math.abs(row.daysRemaining)} days overdue`
                        : `${row.daysRemaining} days left`}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">
                  {formatDate(row.subscriptionStartedAt)}
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">
                  {formatDate(row.subscriptionExpiresAt)}
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">
                  <p className="font-semibold text-[#183534]">
                    {formatInr(row.lastPaymentAmountInr)}
                  </p>
                  <p className="text-[11px] text-[#7A928D]">{formatDate(row.lastPaymentAt)}</p>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/profiles?search=${encodeURIComponent(row.advisorName)}`}
                      className="rounded-xl border border-[#D7E5E1] bg-white px-3 py-2 text-[11px] font-semibold text-[#35504C]"
                    >
                      Profile
                    </Link>
                    {row.isPaid ? (
                      <button
                        type="button"
                        onClick={() => onExtend?.(row)}
                        className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white"
                      >
                        Extend
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
