"use client";

import { AdminEmptyState } from "@/components/admin/ui";

const STATUS_STYLES = {
  earned: "bg-[#E8F5F0] text-[#1A7A5A]",
  claimed: "bg-[#E8F4F3] text-[#0A4A4A]",
  pending: "bg-[#FFF6E8] text-[#B45309]",
  approved: "bg-[#E8F4F3] text-[#0A4A4A]",
  issued: "bg-[#E8F5F0] text-[#1A7A5A]",
  redeemed: "bg-[#F8FAFC] text-[#475569]",
  cancelled: "bg-[#FFF1F0] text-[#DC2626]",
};

export default function RewardsTable({ rewards = [] }) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-[#E6ECEA]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
          <tr>
            <th className="px-4 py-3">Ambassador</th>
            <th className="px-4 py-3">Campaign</th>
            <th className="px-4 py-3">Target</th>
            <th className="px-4 py-3">Reward</th>
            <th className="px-4 py-3">Coupon</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Granted</th>
          </tr>
        </thead>
        <tbody>
          {rewards.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-0">
                <AdminEmptyState
                  title="No rewards generated yet"
                  description="Create campaigns in Rewards Engine — grants are automatic."
                  className="m-4 border-none bg-transparent"
                />
              </td>
            </tr>
          ) : (
            rewards.map((row) => (
              <tr key={row.id} className="border-t border-[#EEF2F0] bg-white">
                <td className="px-4 py-3 font-semibold text-[#183534]">{row.referrerName}</td>
                <td className="px-4 py-3">{row.campaignName || "—"}</td>
                <td className="admin-num px-4 py-3">{row.referralTarget ?? "—"}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[#183534]">{row.rewardTypeLabel}</p>
                  <p className="text-[11px] text-[#7A928D]">{row.rewardValue || row.fulfillmentNotes}</p>
                </td>
                <td className="px-4 py-3 font-mono text-[11px]">{row.couponCode || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      STATUS_STYLES[row.status] || STATUS_STYLES.earned
                    }`}
                  >
                    {row.statusLabel}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#5C7571]">
                  {row.issuedAt || row.createdAt
                    ? new Date(row.issuedAt || row.createdAt).toLocaleDateString("en-IN")
                    : "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
