"use client";

import { useState } from "react";
import AdminModal from "@/components/admin/ui/AdminModal";

export default function ExtendSubscriptionModal({
  subscription,
  onClose,
  onSave,
  isProcessing = false,
}) {
  const [extendDays, setExtendDays] = useState("365");
  const [note, setNote] = useState("");

  if (!subscription) return null;

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="Extend subscription"
      title={subscription.advisorName}
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
                extendDays: Number(extendDays),
                note: note.trim() || null,
              })
            }
            disabled={isProcessing}
            className="flex-1 rounded-xl bg-[#0A4A4A] py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isProcessing ? "Saving…" : "Extend subscription"}
          </button>
        </div>
      }
    >
      <p className="mb-4 text-sm text-[#5C7571]">
        {subscription.planLabel} · expires{" "}
        {subscription.subscriptionExpiresAt
          ? new Date(subscription.subscriptionExpiresAt).toLocaleDateString("en-IN")
          : "not set"}
      </p>

      <div className="space-y-4">
        <Field label="Extend by (days)">
          <input
            type="number"
            min="1"
            value={extendDays}
            onChange={(e) => setExtendDays(e.target.value)}
            className={INPUT_CLASS}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {[30, 90, 365].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setExtendDays(String(days))}
                className="rounded-full border border-[#D7E5E1] px-3 py-1 text-[11px] font-semibold text-[#35504C]"
              >
                +{days} days
              </button>
            ))}
          </div>
        </Field>

        <Field label="Admin note (optional)">
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Grace extension while payment link is resent"
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
