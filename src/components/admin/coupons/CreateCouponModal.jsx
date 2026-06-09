"use client";

import { useMemo, useState } from "react";
import AdminModal from "@/components/admin/ui/AdminModal";
import { generateCouponCode } from "@/lib/admin/coupons/couponUtils";

const PLAN_OPTIONS = [
  { id: "silver", label: "Silver" },
  { id: "gold", label: "Gold" },
];

export default function CreateCouponModal({ open = true, onClose, onSave, isProcessing = false }) {
  const [code, setCode] = useState(generateCouponCode());
  const [label, setLabel] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("10");
  const [appliesTo, setAppliesTo] = useState(["gold"]);
  const [assignedEmail, setAssignedEmail] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("1");
  const [expiresInDays, setExpiresInDays] = useState("30");

  const previewDiscount = useMemo(() => {
    const value = Number(discountValue) || 0;
    if (discountType === "fixed") return `₹${value.toLocaleString("en-IN")} off checkout`;
    return `${value}% extra off sale price`;
  }, [discountType, discountValue]);

  const togglePlan = (planId) => {
    setAppliesTo((current) =>
      current.includes(planId) ? current.filter((id) => id !== planId) : [...current, planId],
    );
  };

  const handleSave = () => {
    const days = Number(expiresInDays);
    const expiresAt =
      days > 0 ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : null;

    onSave?.({
      code: code.trim(),
      label: label.trim(),
      discountType,
      discountValue: Number(discountValue),
      appliesTo,
      assignedEmail: assignedEmail.trim() || null,
      maxRedemptions: Number(maxRedemptions) || 1,
      expiresAt,
    });
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      eyebrow="Generate coupon"
      title="Personal discount code"
      size="md"
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 rounded-xl bg-[#F3F4F6] py-3 text-sm font-semibold text-[#35504C]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing}
            className="flex-1 rounded-xl bg-[#0A4A4A] py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isProcessing ? "Creating…" : "Generate coupon"}
          </button>
        </div>
      }
    >
      <p className="mb-4 text-sm text-[#5C7571]">
        Stacks on top of the regular sale price at checkout. Single-use by default.
      </p>

      <div className="space-y-4">
        <Field label="Coupon code">
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className={INPUT_CLASS}
            />
            <button
              type="button"
              onClick={() => setCode(generateCouponCode())}
              className="shrink-0 rounded-xl border border-[#D7E5E1] px-3 text-[11px] font-semibold text-[#35504C]"
            >
              Regenerate
            </button>
          </div>
        </Field>

        <Field label="Label (internal note)">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. 10% for Ravi — Gold upgrade"
            className={INPUT_CLASS}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Discount type">
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="percent">Percent off</option>
              <option value="fixed">Fixed ₹ off</option>
            </select>
          </Field>
          <Field label={discountType === "percent" ? "Percent" : "Amount (₹)"}>
            <input
              type="number"
              min="1"
              max={discountType === "percent" ? "100" : undefined}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
        </div>

        <p className="rounded-xl bg-[#E8F4F3] px-4 py-3 text-sm text-[#0A4A4A]">{previewDiscount}</p>

        <Field label="Applies to plans">
          <div className="flex flex-wrap gap-2">
            {PLAN_OPTIONS.map((plan) => {
              const selected = appliesTo.includes(plan.id);
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => togglePlan(plan.id)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold ${
                    selected
                      ? "bg-[#0A4A4A] text-white"
                      : "border border-[#D7E5E1] bg-white text-[#35504C]"
                  }`}
                >
                  {plan.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Assign to email (optional)">
          <input
            type="email"
            value={assignedEmail}
            onChange={(e) => setAssignedEmail(e.target.value)}
            placeholder="Only this advisor can redeem"
            className={INPUT_CLASS}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Max redemptions">
            <input
              type="number"
              min="1"
              value={maxRedemptions}
              onChange={(e) => setMaxRedemptions(e.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Expires in (days)">
            <input
              type="number"
              min="0"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
        </div>
      </div>
    </AdminModal>
  );
}

const INPUT_CLASS =
  "w-full rounded-xl border border-[#D7E5E1] bg-white px-4 py-3 text-sm text-[#183534] outline-none focus:border-[#0A4A4A] focus:ring-2 focus:ring-[#0A4A4A]/10";

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
        {label}
      </label>
      {children}
    </div>
  );
}
