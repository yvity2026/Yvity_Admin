"use client";

import { useEffect, useMemo, useState } from "react";
import AdminModal from "@/components/admin/ui/AdminModal";
import {
  LIMIT_FIELD_DEFS,
  normalizeLimitInput,
} from "@/lib/admin/features/featureCatalog";

const PLAN_LABELS = {
  free: "Free",
  silver: "Silver",
  gold: "Gold",
};

export default function EditPlanLimitsModal({
  planId,
  limits,
  onClose,
  onSave,
  onReset,
  isProcessing = false,
}) {
  const [draft, setDraft] = useState(limits || {});

  useEffect(() => {
    setDraft(limits || {});
  }, [limits]);

  const groupedFields = useMemo(() => {
    const groups = {};
    for (const field of LIMIT_FIELD_DEFS) {
      if (!groups[field.group]) groups[field.group] = [];
      groups[field.group].push(field);
    }
    return groups;
  }, []);

  if (!planId) return null;

  const updateField = (field, rawValue) => {
    setDraft((current) => ({
      ...current,
      [field.key]: normalizeLimitInput(rawValue, field.type),
    }));
  };

  return (
    <AdminModal
      open={Boolean(planId)}
      onClose={onClose}
      eyebrow="Plan limits"
      title={`${PLAN_LABELS[planId] || planId} tier`}
      size="md"
      footer={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onReset?.(planId)}
            disabled={isProcessing}
            className="rounded-xl border border-[#FECACA] bg-[#FFF1F0] px-4 py-3 text-sm font-semibold text-[#DC2626] disabled:opacity-60"
          >
            Reset to defaults
          </button>
          <div className="ml-auto flex flex-1 justify-end gap-2 sm:flex-none">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="rounded-xl bg-[#F3F4F6] px-4 py-3 text-sm font-semibold text-[#35504C]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave?.(planId, draft)}
              disabled={isProcessing}
              className="rounded-xl bg-[#0A4A4A] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isProcessing ? "Saving…" : "Save limits"}
            </button>
          </div>
        </div>
      }
    >
      <p className="mb-5 text-sm text-[#5C7571]">
        Numeric caps and boolean entitlements enforced in the advisor app.
      </p>

      <div className="space-y-5">
        {Object.entries(groupedFields).map(([group, fields]) => (
          <div key={group}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              {group}
            </p>
            <div className="space-y-3">
              {fields.map((field) => (
                <FieldRow
                  key={field.key}
                  field={field}
                  value={draft[field.key]}
                  onChange={(value) => updateField(field, value)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminModal>
  );
}

function FieldRow({ field, value, onChange }) {
  if (field.type === "boolean") {
    const enabled = Boolean(value);
    return (
      <div className="flex items-center justify-between rounded-xl border border-[#E6ECEA] px-4 py-3">
        <div>
          <p className="text-sm font-medium text-[#183534]">{field.label}</p>
          {field.hint ? <p className="text-[12px] text-[#7A928D]">{field.hint}</p> : null}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange(!enabled)}
          className={`relative h-7 w-12 rounded-full transition ${
            enabled ? "bg-[#0A4A4A]" : "bg-[#CBD5E1]"
          }`}
        >
          <span
            className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition ${
              enabled ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
        {field.label}
      </label>
      <input
        value={value === "Unlimited" ? "Unlimited" : String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.hint || (field.type === "limit" ? "Unlimited" : "0")}
        className="w-full rounded-xl border border-[#D7E5E1] bg-white px-4 py-3 text-sm text-[#183534] outline-none focus:border-[#0A4A4A] focus:ring-2 focus:ring-[#0A4A4A]/10"
      />
    </div>
  );
}
