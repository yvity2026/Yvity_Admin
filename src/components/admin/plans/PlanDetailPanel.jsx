"use client";

import { FiCheck, FiX } from "react-icons/fi";

function LimitRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#F3F6F5] py-2.5 last:border-0">
      <span className="text-sm text-[#5C7571]">{label}</span>
      <span className="text-sm font-semibold text-[#183534]">{value}</span>
    </div>
  );
}

export default function PlanDetailPanel({ plan, onEditEntitlements }) {
  if (!plan) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#D7E5E1] bg-[#FCFDFC] px-6 py-16 text-center">
        <p className="text-sm text-[#7A928D]">Select a plan to view full entitlements.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-[#E6ECEA] bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            Plan details
          </p>
          <h3 className="mt-1 font-cormorant text-2xl font-bold text-[#183534]">{plan.name}</h3>
          <p className="mt-1 text-sm text-[#5C7571]">
            {plan.priceLabel} · {plan.subscriberCount} active subscribers
          </p>
        </div>
        <button
          type="button"
          onClick={() => onEditEntitlements?.(plan)}
          className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white"
        >
          Edit marketing features
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            Included features
          </p>
          <ul className="space-y-2">
            {plan.included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-[#35504C]">
                <FiCheck className="mt-0.5 shrink-0 text-[#1A7A5A]" size={14} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {plan.excluded.length > 0 ? (
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Not included
            </p>
            <ul className="space-y-2">
              {plan.excluded.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] text-[#7A928D]">
                  <FiX className="mt-0.5 shrink-0 text-[#DC2626]" size={14} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#F8FBFA] px-4 py-6 text-sm text-[#5C7571]">
            All platform features are included on this plan.
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-[#F8FBFA] px-4 py-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
          Technical limits
        </p>
        <LimitRow label="Text testimonials" value={plan.limits.testimonials.text} />
        <LimitRow label="Audio testimonials" value={plan.limits.testimonials.audio} />
        <LimitRow label="Video testimonials" value={plan.limits.testimonials.video} />
        <LimitRow label="Gallery photos" value={plan.limits.galleryPhotos} />
        <LimitRow label="Recommendations" value={plan.limits.recommendations} />
        <LimitRow label="Leads visible" value={plan.limits.leadsVisible} />
        <LimitRow label="Profile themes" value={plan.limits.profileThemes} />
        <LimitRow
          label="Profile analytics"
          value={plan.limits.profileAnalytics ? "Yes" : "No"}
        />
      </div>
    </div>
  );
}
