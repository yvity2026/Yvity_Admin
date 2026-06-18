"use client";

import AdminModal from "@/components/admin/ui/AdminModal";
import { PiiField } from "@/components/admin/ui";
import { maskEmail, maskPhone } from "@/lib/pii";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN");
}

export default function PaymentDetailModal({ payment, onClose }) {
  if (!payment) return null;

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="Payment details"
      title={payment.advisorName}
      size="md"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#0A4A4A] py-3 text-sm font-semibold text-white"
        >
          Close
        </button>
      }
    >
      <div className="space-y-3 text-sm">
        <Row label="Amount" value={payment.amountLabel} bold />
        <Row label="Plan" value={`${payment.planLabel} (${payment.checkoutKind})`} />
        <Row label="Status" value={payment.statusLabel} />
        <Row
          label="Email"
          value={
            <PiiField
              masked={maskEmail(payment.email)}
              full={payment.email}
              type="email"
              entityType="payment"
              entityId={payment.id}
              href={payment.email ? `mailto:${payment.email}` : undefined}
            />
          }
        />
        <Row
          label="Phone"
          value={
            <PiiField
              masked={maskPhone(payment.phone)}
              full={payment.phone}
              type="phone"
              entityType="payment"
              entityId={payment.id}
            />
          }
        />
        <Row label="Coupon" value={payment.couponCode || "—"} />
        {payment.couponDiscountInr > 0 ? (
          <Row label="Coupon discount" value={`₹${payment.couponDiscountInr.toLocaleString("en-IN")}`} />
        ) : null}
        {payment.creditInr > 0 ? (
          <Row label="Upgrade credit" value={`₹${payment.creditInr.toLocaleString("en-IN")}`} />
        ) : null}
        <Row label="Razorpay order" value={payment.razorpayOrderId || "—"} mono />
        <Row label="Razorpay payment" value={payment.razorpayPaymentId || "—"} mono />
        <Row label="Created" value={formatDate(payment.createdAt)} />
        <Row label="Paid at" value={formatDate(payment.paidAt)} />
        <Row label="Method" value={payment.paymentMethod || "Razorpay"} />
      </div>
    </AdminModal>
  );
}

function Row({ label, value, bold = false, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F3F6F5] py-2 last:border-0">
      <span className="shrink-0 text-[#7A928D]">{label}</span>
      <span
        className={`text-right text-[#183534] ${bold ? "font-bold" : "font-medium"} ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
