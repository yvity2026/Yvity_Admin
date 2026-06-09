"use client";

import { useMemo, useState } from "react";
import AdminModal from "@/components/admin/ui/AdminModal";
import { computeDiscountPercent } from "@/lib/admin/plans/planPricing";

export default function AddPlanModal({
  open = true,
  templates = [],
  onClose,
  onSave,
  isProcessing = false,
}) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [listPriceInr, setListPriceInr] = useState("9999");
  const [salePriceInr, setSalePriceInr] = useState("2999");
  const [tagline, setTagline] = useState("");
  const [templatePlanId, setTemplatePlanId] = useState(templates[0]?.id || "silver");

  const discountPercent = useMemo(
    () => computeDiscountPercent(Number(listPriceInr), Number(salePriceInr)),
    [listPriceInr, salePriceInr],
  );

  const handleSave = () => {
    onSave?.({
      id: id.trim(),
      name: name.trim(),
      listPriceInr: Number(listPriceInr),
      salePriceInr: Number(salePriceInr),
      tagline: tagline.trim(),
      templatePlanId,
      status: "active",
    });
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      eyebrow="New plan"
      title="Add subscription plan"
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
            disabled={isProcessing || !id.trim() || !name.trim()}
            className="flex-1 rounded-xl bg-[#0A4A4A] py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isProcessing ? "Creating…" : "Create plan"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Plan id (slug)">
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="platinum"
            className={INPUT_CLASS}
          />
        </Field>

        <Field label="Plan name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Platinum Plan"
            className={INPUT_CLASS}
          />
        </Field>

        <Field label="Start from template">
          <select
            value={templatePlanId}
            onChange={(e) => setTemplatePlanId(e.target.value)}
            className={INPUT_CLASS}
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[12px] text-[#7A928D]">
            Copies marketing labels and technical limits as a starting point. Customize Platinum
            features on Plans and Feature controls after creating.
          </p>
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
            Discount: {discountPercent}% off
          </p>
        ) : null}

        <Field label="Tagline">
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={INPUT_CLASS} />
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
