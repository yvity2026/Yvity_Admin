"use client";

import { AdminEmptyState } from "@/components/admin/ui";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES = {
  active: "bg-[#E8F5F0] text-[#1A7A5A]",
  reserved: "bg-[#FFFBEB] text-[#B45309]",
  redeemed: "bg-[#F1F5F9] text-[#475569]",
  revoked: "bg-[#FFF1F0] text-[#DC2626]",
  expired: "bg-[#F8FAFC] text-[#64748B]",
};

export default function CouponsTable({ coupons = [], onRevoke, onCopy, isProcessing = false }) {
  if (!coupons.length) {
    return (
      <AdminEmptyState
        title="No coupons yet"
        description="Generate a one-time code for a trusted contact."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="mobile-scroll-x">
        <table className="w-full min-w-[980px] text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Code</th>
              <th className="px-5 py-4">Discount</th>
              <th className="px-5 py-4">Applies to</th>
              <th className="px-5 py-4">Assignee</th>
              <th className="px-5 py-4">Uses</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Redeemed</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-4">
                  <p className="font-mono text-sm font-semibold text-[#183534]">{coupon.code}</p>
                  {coupon.label ? (
                    <p className="mt-1 text-[12px] text-[#7A928D]">{coupon.label}</p>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[#0A4A4A]">
                  {coupon.discountLabel}
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">{coupon.appliesToLabel}</td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">
                  {coupon.assignedEmail || coupon.assignedUserId || "Anyone"}
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">
                  {coupon.redemptionCount}/{coupon.maxRedemptions}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      STATUS_STYLES[coupon.status] || STATUS_STYLES.expired
                    }`}
                  >
                    {coupon.statusLabel}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">
                  {coupon.redeemedByEmail || formatDate(coupon.redeemedAt)}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onCopy?.(coupon.code)}
                      className="rounded-xl border border-[#D7E5E1] bg-white px-3 py-2 text-[11px] font-semibold text-[#35504C]"
                    >
                      Copy
                    </button>
                    {coupon.status === "active" || coupon.status === "reserved" ? (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => onRevoke?.(coupon)}
                        className="rounded-xl bg-[#FFF1F0] px-3 py-2 text-[11px] font-semibold text-[#DC2626] disabled:opacity-60"
                      >
                        Revoke
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
