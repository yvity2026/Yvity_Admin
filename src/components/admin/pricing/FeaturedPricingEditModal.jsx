"use client";

import { useMemo, useState } from "react";
import AdminModal from "@/components/admin/ui/AdminModal";
import { computeDiscountPercent } from "@/lib/admin/plans/planPricing";

export default function FeaturedPricingEditModal({
  product,
  onClose,
  onSave,
  isProcessing = false,
}) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [listPriceInr, setListPriceInr] = useState(String(product?.listPriceInr ?? 0));
  const [salePriceInr, setSalePriceInr] = useState(String(product?.salePriceInr ?? 0));
  const [durationDays, setDurationDays] = useState(String(product?.durationDays ?? 30));
  const [status, setStatus] = useState(product?.status || "active");

  const discountPercent = useMemo(
    () => computeDiscountPercent(Number(listPriceInr), Number(salePriceInr)),
    [listPriceInr, salePriceInr],
  );

  if (!product) return null;

  const handleSave = () => {
    onSave?.({
      name: name.trim(),
      description: description.trim(),
      listPriceInr: Number(listPriceInr),
      salePriceInr: Number(salePriceInr),
      durationDays: Number(durationDays),
      status,
    });
  };

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="Featured placement pricing"
      title={product.name}
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
      <p className="mb-4 text-sm text-[#5C7571]">Product id: {product.id}</p>

      <div className="space-y-4">
        <Field label="Product name">
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLASS} />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={INPUT_CLASS}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="List price (₹)">
            <input
              type="number"
              min="0"
              value={listPriceInr}
              onChange={(e) => setListPriceInr(e.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Sale price (₹)">
            <input
              type="number"
              min="0"
              value={salePriceInr}
              onChange={(e) => setSalePriceInr(e.target.value)}
              className={INPUT_CLASS}
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

        <Field label="Term (days)">
          <input
            type="number"
            min="1"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            className={INPUT_CLASS}
          />
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
