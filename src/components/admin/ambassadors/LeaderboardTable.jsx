"use client";

import { AdminEmptyState } from "@/components/admin/ui";

export default function LeaderboardTable({ rows = [], periodLabel = "All time" }) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-[#E6ECEA]">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Successful referrals</th>
            <th className="px-4 py-3">Rewards earned</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-0">
                <AdminEmptyState
                  title={`No leaders for ${periodLabel.toLowerCase()} yet`}
                  className="m-4 border-none bg-transparent"
                />
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.userId} className="border-t border-[#EEF2F0] bg-white">
                <td className="admin-num px-4 py-3 font-bold text-[#0A4A4A]">#{index + 1}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-[#183534]">{row.name}</p>
                  <p className="text-[11px] text-[#7A928D]">{row.city || row.referralCode || "—"}</p>
                </td>
                <td className="admin-num px-4 py-3 font-semibold">{row.successfulReferrals ?? row.count}</td>
                <td className="admin-num px-4 py-3 font-semibold">{row.rewardsEarned ?? 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
