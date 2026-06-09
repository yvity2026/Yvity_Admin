"use client";

function formatInr(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export default function PricingPlansTable({ plans = [], onEdit }) {
  if (!plans.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#D7E5E1] bg-[#FCFDFC] px-4 py-16 text-center text-sm text-[#7A928D]">
        No plans configured yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="mobile-scroll-x">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Plan</th>
              <th className="px-5 py-4">List price</th>
              <th className="px-5 py-4">Sale price</th>
              <th className="px-5 py-4">Discount</th>
              <th className="px-5 py-4">Subscribers</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#183534]">{plan.name}</p>
                  <p className="text-[12px] text-[#7A928D]">{plan.id}</p>
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">
                  {formatInr(plan.listPriceInr)}
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-[#0A4A4A]">{formatInr(plan.salePriceInr)}</p>
                  <p className="text-[12px] text-[#7A928D]">{plan.priceLabel}</p>
                </td>
                <td className="px-5 py-4">
                  {plan.hasDiscount ? (
                    <span className="rounded-full bg-[#FFFBEB] px-2.5 py-1 text-[11px] font-semibold text-[#B45309]">
                      {plan.discountPercent}% off
                    </span>
                  ) : (
                    <span className="text-sm text-[#7A928D]">—</span>
                  )}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[#183534]">
                  {Number(plan.subscriberCount || 0).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      plan.status === "active"
                        ? "bg-[#E8F5F0] text-[#1A7A5A]"
                        : "bg-[#F8FAFC] text-[#64748B]"
                    }`}
                  >
                    {plan.statusLabel}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onEdit(plan)}
                    className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white"
                  >
                    Edit pricing
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
