"use client";

import { FiCheck, FiX } from "react-icons/fi";

const PLAN_HEADERS = {
  free: "Free",
  silver: "Silver",
  gold: "Gold",
};

export default function PlansComparisonTable({ comparison }) {
  if (!comparison?.labels?.length) return null;

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
      <div className="border-b border-[#EDF1F0] px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
          Feature comparison
        </p>
        <h3 className="mt-1 font-cormorant text-xl font-bold text-[#183534]">
          Free vs Silver vs Gold
        </h3>
      </div>

      <div className="mobile-scroll-x">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Feature</th>
              {comparison.plans.map((plan) => (
                <th key={plan.id} className="px-5 py-4 text-center">
                  {PLAN_HEADERS[plan.id] || plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.labels.map((label) => (
              <tr key={label} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-3 text-sm text-[#35504C]">{label}</td>
                {comparison.plans.map((plan) => {
                  const included = (plan.includedLabels || []).includes(label);
                  return (
                    <td key={`${plan.id}-${label}`} className="px-5 py-3 text-center">
                      {included ? (
                        <FiCheck className="mx-auto text-[#1A7A5A]" size={16} />
                      ) : (
                        <FiX className="mx-auto text-[#CBD5E1]" size={16} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
