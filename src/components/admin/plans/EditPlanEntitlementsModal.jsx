"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

function LimitBadge({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-[#E6ECEA] bg-white px-3 py-2">
      <span className="text-[11px] text-[#5C7571]">{label}</span>
      <span className="text-[11px] font-semibold text-[#183534]">{value}</span>
    </div>
  );
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

  const lim = plan.limits || {};

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

      {/* Cross-reference: current technical limits so marketing copy stays accurate */}
      <div className="mt-5 rounded-2xl border border-[#FFF0C2] bg-[#FFFBEB] px-4 py-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#92660A]">
            Current technical limits
          </p>
          <Link
            href="/admin/feature-controls"
            className="text-[11px] font-semibold text-[#0A4A4A] underline underline-offset-2"
          >
            Edit in Feature Controls →
          </Link>
        </div>
        <p className="mb-3 text-[11px] text-[#A07820]">
          Make sure your marketing copy matches these enforced limits — if they differ, advisors will
          see a different number in the UI than what was advertised.
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          <LimitBadge label="Video testimonials" value={lim.testimonials?.video ?? "—"} />
          <LimitBadge label="Audio testimonials" value={lim.testimonials?.audio ?? "—"} />
          <LimitBadge label="Text testimonials" value={lim.testimonials?.text ?? "—"} />
          <LimitBadge label="Gallery photos" value={lim.galleryPhotos ?? "—"} />
          <LimitBadge label="Recommendations" value={lim.recommendations ?? "—"} />
          <LimitBadge label="Leads visible" value={lim.leadsVisible ?? "—"} />
          {lim.introVideoSeconds !== undefined && (
            <LimitBadge
              label="Intro video"
              value={lim.introVideoSeconds > 0 ? `${lim.introVideoSeconds}s` : "Disabled"}
            />
          )}
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
