"use client";

import { useEffect, useState } from "react";
import AdminModal from "@/components/admin/ui/AdminModal";

function linesToList(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function listToLines(items = []) {
  return items.join("\n");
}

export default function EditPlanEntitlementsModal({
  plan,
  onClose,
  onSave,
  isProcessing = false,
}) {
  const [includedText, setIncludedText] = useState(listToLines(plan?.included));
  const [excludedText, setExcludedText] = useState(listToLines(plan?.excluded));

  useEffect(() => {
    setIncludedText(listToLines(plan?.included));
    setExcludedText(listToLines(plan?.excluded));
  }, [plan]);

  if (!plan) return null;

  return (
    <AdminModal
      open={Boolean(plan)}
      onClose={onClose}
      eyebrow="Marketing entitlements"
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
            onClick={() =>
              onSave?.({
                included: linesToList(includedText),
                excluded: linesToList(excludedText),
              })
            }
            disabled={isProcessing}
            className="flex-1 rounded-xl bg-[#0A4A4A] py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isProcessing ? "Saving…" : "Save entitlements"}
          </button>
        </div>
      }
    >
      <p className="mb-4 text-sm text-[#5C7571]">
        Shown on the Plans comparison table — one feature per line. Add Platinum-only perks here
        (e.g. Dedicated account manager).
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Included features">
          <textarea
            rows={14}
            value={includedText}
            onChange={(e) => setIncludedText(e.target.value)}
            placeholder={"Dedicated account manager\nPriority phone support"}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Not included">
          <textarea
            rows={14}
            value={excludedText}
            onChange={(e) => setExcludedText(e.target.value)}
            placeholder={"Features listed as not on this plan"}
            className={INPUT_CLASS}
          />
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
