"use client";

import { useMemo, useState } from "react";
import AdminModal from "@/components/admin/ui/AdminModal";
import { computeDiscountPercent } from "@/lib/admin/plans/planPricing";

export default function PlanPricingEditModal({
  plan,
  onClose,
  onSave,
  isProcessing = false,
}) {
  const [name, setName] = useState(plan?.name || "");
  const [listPriceInr, setListPriceInr] = useState(String(plan?.listPriceInr ?? 0));
  const [salePriceInr, setSalePriceInr] = useState(String(plan?.salePriceInr ?? 0));
  const [tagline, setTagline] = useState(plan?.tagline || "");
  const [highlight, setHighlight] = useState(plan?.highlight || "");
  const [status, setStatus] = useState(plan?.status || "active");

  const discountPercent = useMemo(
    () => computeDiscountPercent(Number(listPriceInr), Number(salePriceInr)),
    [listPriceInr, salePriceInr],
  );

  if (!plan) return null;

  const handleSave = () => {
    onSave?.({
      name: name.trim(),
      listPriceInr: Number(listPriceInr),
      salePriceInr: Number(salePriceInr),
      tagline: tagline.trim(),
      highlight: highlight.trim() || null,
      status,
    });
  };

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="Edit pricing"
      title={plan.name}
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
            {isProcessing ? "Saving…" : "Save pricing"}
          </button>
        </div>
      }
    >
      <p className="mb-4 text-sm text-[#5C7571]">Plan id: {plan.id}</p>

      <div className="space-y-4">
        <Field label="Plan name">
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASS} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="List price (₹)">
            <input
              type="number"
              min="0"
              value={listPriceInr}
              onChange={(e) => setListPriceInr(e.target.value)}
              className={INPUT_CLASS}
              placeholder="9999"
            />
          </Field>
          <Field label="Sale price (₹)">
            <input
              type="number"
              min="0"
              value={salePriceInr}
              onChange={(e) => setSalePriceInr(e.target.value)}
              className={INPUT_CLASS}
              placeholder="2999"
            />
          </Field>
        </div>

        {discountPercent > 0 ? (
          <p className="rounded-xl bg-[#FFFBEB] px-4 py-3 text-sm font-medium text-[#92400E]">
            Discount: {discountPercent}% off list price
          </p>
        ) : (
          <p className="text-sm text-[#7A928D]">No discount — sale price matches list price.</p>
        )}

        <Field label="Tagline">
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={INPUT_CLASS} />
        </Field>

        <Field label="Highlight badge (optional)">
          <input value={highlight} onChange={(e) => setHighlight(e.target.value)} className={INPUT_CLASS} />
        </Field>

        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={INPUT_CLASS}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
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
