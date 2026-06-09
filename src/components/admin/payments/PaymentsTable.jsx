"use client";

import { AdminEmptyState } from "@/components/admin/ui";

const STATUS_STYLES = {
  paid: "bg-[#E8F5F0] text-[#1A7A5A]",
  created: "bg-[#FFFBEB] text-[#B45309]",
  pending: "bg-[#FFFBEB] text-[#B45309]",
  failed: "bg-[#FFF1F0] text-[#DC2626]",
};

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PaymentsTable({ payments = [], onView }) {
  if (!payments.length) {
    return <AdminEmptyState title="No transactions match this filter." />;
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="mobile-scroll-x">
        <table className="w-full min-w-[1040px] text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Advisor</th>
              <th className="px-5 py-4">Plan</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Coupon</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Paid at</th>
              <th className="px-5 py-4">Order id</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#183534]">{payment.advisorName}</p>
                  <p className="text-[12px] text-[#7A928D]">{payment.email || payment.userId}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-[#F8FBFA] px-2.5 py-1 text-[11px] font-semibold text-[#0A4A4A]">
                    {payment.planLabel}
                  </span>
                  <p className="mt-1 text-[11px] text-[#7A928D]">{payment.checkoutKind}</p>
                </td>
                <td className="px-5 py-4 text-sm font-bold text-[#0A4A4A]">
                  {payment.amountLabel}
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">
                  {payment.couponCode ? (
                    <>
                      <p className="font-mono text-xs">{payment.couponCode}</p>
                      {payment.couponDiscountInr > 0 ? (
                        <p className="text-[11px] text-[#7A928D]">
                          −₹{payment.couponDiscountInr.toLocaleString("en-IN")}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      STATUS_STYLES[payment.status] || STATUS_STYLES.pending
                    }`}
                  >
                    {payment.statusLabel}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">
                  {formatDate(payment.paidAt || payment.createdAt)}
                </td>
                <td className="px-5 py-4 font-mono text-[11px] text-[#5C7571]">
                  {payment.razorpayOrderId || "—"}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onView?.(payment)}
                    className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
