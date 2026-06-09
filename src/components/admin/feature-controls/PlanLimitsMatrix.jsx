"use client";

import {
  formatLimitDisplay,
  LIMIT_FIELD_DEFS,
} from "@/lib/admin/features/featureCatalog";

const PLAN_STYLES = {
  free: "text-[#0A4A4A]",
  silver: "text-[#334155]",
  gold: "text-[#B45309]",
  platinum: "text-[#6D28D9]",
};

function planStyle(planId) {
  return PLAN_STYLES[planId] || "text-[#183534]";
}

function planLabel(tier) {
  return tier.name || tier.id;
}

export default function PlanLimitsMatrix({ planTiers = [], planLimits = {}, onEdit }) {
  if (!planTiers.length) return null;

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="mobile-scroll-x">
        <table className="w-full min-w-[920px] text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Feature / limit</th>
              {planTiers.map((tier) => (
                <th key={tier.id} className="px-5 py-4 text-center">
                  <span className={planStyle(tier.id)}>{planLabel(tier)}</span>
                </th>
              ))}
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {LIMIT_FIELD_DEFS.map((field) => (
              <tr key={field.key} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-[#183534]">{field.label}</p>
                  <p className="text-[11px] text-[#7A928D]">{field.group}</p>
                </td>
                {planTiers.map((tier) => (
                  <td
                    key={`${tier.id}-${field.key}`}
                    className="px-5 py-4 text-center text-sm text-[#35504C]"
                  >
                    {formatLimitDisplay(planLimits[tier.id]?.[field.key])}
                  </td>
                ))}
                <td className="px-5 py-4" />
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#FAFCFB]">
              <td className="px-5 py-4 text-sm font-semibold text-[#183534]">Edit tier</td>
              {planTiers.map((tier) => (
                <td key={`edit-${tier.id}`} className="px-5 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => onEdit?.(tier.id)}
                    className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white"
                  >
                    Edit {planLabel(tier)}
                  </button>
                </td>
              ))}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
