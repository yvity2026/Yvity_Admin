"use client";

const PLAN_STYLES = {
  free: {
    border: "border-[#D7E5E1]",
    badge: "bg-[#F8FAFC] text-[#475569]",
    accent: "text-[#0A4A4A]",
  },
  silver: {
    border: "border-[#CBD5E1]",
    badge: "bg-[#F1F5F9] text-[#334155]",
    accent: "text-[#334155]",
  },
  gold: {
    border: "border-[#F59E0B]/40",
    badge: "bg-[#FFFBEB] text-[#B45309]",
    accent: "text-[#B45309]",
  },
};

export default function PlanTierCard({ plan, selected = false, onSelect }) {
  const styles = PLAN_STYLES[plan.id] || PLAN_STYLES.free;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(plan.id)}
      className={`w-full rounded-[24px] border bg-white p-5 text-left shadow-[0_8px_30px_rgba(10,74,74,0.05)] transition hover:shadow-[0_12px_40px_rgba(10,74,74,0.08)] ${
        styles.border
      } ${selected ? "ring-2 ring-[#0A4A4A]/20" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            {plan.id} plan
          </p>
          <h3 className={`mt-1 font-cormorant text-2xl font-bold ${styles.accent}`}>
            {plan.name}
          </h3>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${styles.badge}`}>
          {plan.statusLabel}
        </span>
      </div>

      <div className="mt-3">
        {plan.hasDiscount ? (
          <div className="flex flex-wrap items-end gap-2">
            <p className="text-sm text-[#94A3B8] line-through">{plan.listPriceLabel}</p>
            <p className="text-2xl font-bold text-[#183534]">{plan.priceLabel}</p>
            <span className="rounded-full bg-[#FFFBEB] px-2 py-0.5 text-[10px] font-semibold text-[#B45309]">
              {plan.discountPercent}% off
            </span>
          </div>
        ) : (
          <p className="text-2xl font-bold text-[#183534]">{plan.priceLabel}</p>
        )}
      </div>
      <p className="mt-1 text-sm text-[#5C7571]">{plan.tagline}</p>

      {plan.highlight ? (
        <p className="mt-3 rounded-xl bg-[#FFFBEB] px-3 py-2 text-[12px] font-medium text-[#92400E]">
          {plan.highlight}
        </p>
      ) : null}

      <div className="mt-4 rounded-2xl bg-[#F8FBFA] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
          Active subscribers
        </p>
        <p className="mt-1 text-xl font-bold text-[#0A4A4A]">
          {Number(plan.subscriberCount || 0).toLocaleString("en-IN")}
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
          Key entitlements
        </p>
        <ul className="space-y-1.5 text-[13px] text-[#35504C]">
          <li>Service verification: {plan.limits.serviceVerification ? "Yes" : "No"}</li>
          <li>Search appearance: {plan.limits.searchAppearance ? "Yes" : "No"}</li>
          <li>Featured eligibility: {plan.limits.featuredAdvisorEligibility ? "Yes" : "No"}</li>
          <li>Intro video: {plan.limits.introVideoSeconds ? `${plan.limits.introVideoSeconds}s` : "—"}</li>
        </ul>
      </div>
    </button>
  );
}
