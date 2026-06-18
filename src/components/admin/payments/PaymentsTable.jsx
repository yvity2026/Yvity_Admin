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
        <table className="w-full min-w-[1140px] text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Advisor</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4">Plan</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Coupon</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Order id</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-[#F3F6F5] last:border-0 hover:bg-[#FAFCFB]">

                {/* Advisor name + designation */}
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#183534]">{payment.advisorName}</p>
                  {payment.designation ? (
                    <p className="mt-0.5 text-[11px] text-[#7A928D]">{payment.designation}</p>
                  ) : null}
                  {payment.city ? (
                    <p className="mt-0.5 text-[11px] text-[#AABAB6]">{payment.city}</p>
                  ) : null}
                </td>

                {/* Email + phone */}
                <td className="px-5 py-4">
                  {payment.email ? (
                    <a
                      href={`mailto:${payment.email}`}
                      className="block text-[12px] font-medium text-[#0A4A4A] hover:underline"
                    >
                      {payment.email}
                    </a>
                  ) : (
                    <p className="text-[12px] text-[#AABAB6]">No email</p>
                  )}
                  {payment.phone ? (
                    <a
                      href={`tel:${payment.phone.replace(/\s/g, "")}`}
                      className="mt-0.5 block text-[12px] text-[#5C7571] hover:underline"
                    >
                      {payment.phone}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-[12px] text-[#AABAB6]">No phone</p>
                  )}
                </td>

                {/* Plan */}
                <td className="px-5 py-4">
                  <span className="rounded-full bg-[#F8FBFA] px-2.5 py-1 text-[11px] font-semibold text-[#0A4A4A]">
                    {payment.planLabel}
                  </span>
                  {payment.checkoutKind && payment.checkoutKind !== "purchase" ? (
                    <p className="mt-1 text-[11px] text-[#7A928D]">{payment.checkoutKind}</p>
                  ) : null}
                </td>

                {/* Amount */}
                <td className="px-5 py-4 text-sm font-bold text-[#0A4A4A]">
                  {payment.amountLabel}
                </td>

                {/* Coupon */}
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

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      STATUS_STYLES[payment.status] || STATUS_STYLES.pending
                    }`}
                  >
                    {payment.statusLabel}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-[12px] text-[#5C7571]">
                  {formatDate(payment.paidAt || payment.createdAt)}
                </td>

                {/* Order ID */}
                <td className="px-5 py-4 font-mono text-[11px] text-[#5C7571]">
                  {payment.razorpayOrderId ? (
                    <span title={payment.razorpayOrderId}>
                      {payment.razorpayOrderId.length > 18
                        ? `${payment.razorpayOrderId.slice(0, 18)}…`
                        : payment.razorpayOrderId}
                    </span>
                  ) : "—"}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onView?.(payment)}
                    className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#0D6060]"
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
