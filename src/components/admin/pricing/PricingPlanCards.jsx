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

export default function PricingPlanCards({ plans = [], onEdit }) {
  if (!plans.length) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => {
        const styles = PLAN_STYLES[plan.id] || PLAN_STYLES.free;

        return (
          <article
            key={plan.id}
            className={`rounded-[24px] border bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)] ${styles.border}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                  Subscription
                </p>
                <h3 className={`mt-1 font-cormorant text-2xl font-bold ${styles.accent}`}>
                  {plan.name}
                </h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${styles.badge}`}
              >
                {plan.statusLabel}
              </span>
            </div>

            <div className="mt-4">
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

            {plan.tagline ? (
              <p className="mt-2 text-sm text-[#5C7571]">{plan.tagline}</p>
            ) : null}

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F8FBFA] px-4 py-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
                  Subscribers
                </p>
                <p className="mt-1 text-lg font-bold text-[#0A4A4A]">
                  {Number(plan.subscriberCount || 0).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEdit?.(plan)}
                className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white"
              >
                Edit pricing
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
