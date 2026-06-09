"use client";

import { AdminEmptyState } from "@/components/admin/ui";

const STATUS_STYLES = {
  registered: "bg-[#E8F4F3] text-[#0A4A4A]",
  qualified: "bg-[#E8F5F0] text-[#1A7A5A]",
  expired: "bg-[#FFF6E8] text-[#B45309]",
  invalid: "bg-[#FFF1F0] text-[#DC2626]",
};

export default function ReferralsTable({ referrals = [] }) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-[#E6ECEA]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
          <tr>
            <th className="px-4 py-3">Referrer</th>
            <th className="px-4 py-3">Referred user</th>
            <th className="px-4 py-3">Registration</th>
            <th className="px-4 py-3">Plan purchased</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {referrals.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-0">
                <AdminEmptyState
                  title="No referrals yet"
                  className="m-4 border-none bg-transparent"
                />
              </td>
            </tr>
          ) : (
            referrals.map((row) => (
              <tr key={row.id} className="border-t border-[#EEF2F0] bg-white">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[#183534]">{row.referrerName}</p>
                  <p className="text-[11px] text-[#7A928D]">{row.referrerCode}</p>
                </td>
                <td className="px-4 py-3">{row.referredUserName}</td>
                <td className="px-4 py-3 text-[12px] text-[#5C7571]">
                  {row.registeredAt
                    ? new Date(row.registeredAt).toLocaleDateString("en-IN")
                    : "—"}
                </td>
                <td className="px-4 py-3">{row.planPurchasedLabel}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      STATUS_STYLES[row.status] || STATUS_STYLES.registered
                    }`}
                  >
                    {row.statusLabel}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
