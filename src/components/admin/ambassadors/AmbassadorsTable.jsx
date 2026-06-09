"use client";

import { AdminEmptyState } from "@/components/admin/ui";

const STATUS_STYLES = {
  active: "bg-[#E8F5F0] text-[#1A7A5A]",
  paused: "bg-[#FFF6E8] text-[#B45309]",
  suspended: "bg-[#FFF1F0] text-[#DC2626]",
};

export default function AmbassadorsTable({ ambassadors = [], onView, onViewReferrals }) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-[#E6ECEA]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">User ID</th>
            <th className="px-4 py-3">Plan</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Successful</th>
            <th className="px-4 py-3">Earned</th>
            <th className="px-4 py-3">Claimed</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ambassadors.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-0">
                <AdminEmptyState
                  title="No ambassadors found"
                  className="m-4 border-none bg-transparent"
                />
              </td>
            </tr>
          ) : (
            ambassadors.map((row) => (
              <tr key={row.id} className="border-t border-[#EEF2F0] bg-white">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[#183534]">{row.name}</p>
                  <p className="text-[11px] text-[#7A928D]">{row.city || row.email || "—"}</p>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-[#5C7571]">{row.userId}</td>
                <td className="px-4 py-3">{row.planLabel}</td>
                <td className="admin-num px-4 py-3 font-semibold">{row.totalReferrals}</td>
                <td className="admin-num px-4 py-3 font-semibold">{row.successfulReferrals}</td>
                <td className="admin-num px-4 py-3 font-semibold text-[#1A7A5A]">
                  {row.rewardsEarned ?? 0}
                </td>
                <td className="admin-num px-4 py-3 font-semibold">{row.rewardsClaimed ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView?.(row)}
                      className="rounded-full border border-[#0A4A4A]/15 px-3 py-1 text-[12px] font-semibold text-[#0A4A4A] hover:bg-[#E8F4F3]"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onViewReferrals?.(row)}
                      className="rounded-full border border-[#0A4A4A]/15 px-3 py-1 text-[12px] font-semibold text-[#0A4A4A] hover:bg-[#E8F4F3]"
                    >
                      Referrals
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
