"use client";

import Image from "next/image";
import { AdminEmptyState } from "@/components/admin/ui";

const STATUS_STYLES = {
  pending: "bg-[#FFF6E8] text-[#B45309]",
  approved: "bg-[#E8F5F0] text-[#1A7A5A]",
  rejected: "bg-[#FFF1F0] text-[#DC2626]",
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Avatar({ src, name }) {
  if (src) {
    return (
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#E6ECEA]">
        <Image src={src} alt={name || "Advisor"} fill sizes="40px" className="object-cover" unoptimized />
      </div>
    );
  }

  const initials = (name || "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A4A4A] text-sm font-bold text-white">
      {initials}
    </div>
  );
}

export default function ApprovalsTable({
  approvals = [],
  onView,
  onApprove,
  onReject,
  isProcessing = false,
}) {
  if (!approvals.length) {
    return (
      <AdminEmptyState
        title="No approval requests found"
        description="The queue is clear, or try broadening your filters."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="hidden lg:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Industry</th>
              <th className="px-5 py-4">Service</th>
              <th className="px-5 py-4">Request type</th>
              <th className="px-5 py-4">Submitted date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((row) => (
              <tr key={row.id} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={row.profilePic} name={row.name} />
                    <div>
                      <p className="text-sm font-semibold text-[#183534]">{row.name}</p>
                      <p className="text-[12px] text-[#7A928D]">{row.userShortId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[#35504C]">{row.industry}</td>
                <td className="px-5 py-4 text-sm text-[#35504C]">{row.service}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#F4F8F7] px-2.5 py-1 text-[11px] font-semibold text-[#0A4A4A]">
                    {row.requestTypeLabel}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">{formatDate(row.submittedAt)}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[row.status] || STATUS_STYLES.pending}`}
                  >
                    {row.statusLabel}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView?.(row)}
                      className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0D6060]"
                    >
                      View
                    </button>
                    {row.canReview && (
                      <>
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => onApprove?.(row)}
                          className="rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-3 py-2 text-[11px] font-semibold text-[#1A7A5A] disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => onReject?.(row)}
                          className="rounded-xl border border-[#FFD7D7] bg-[#FFF5F5] px-3 py-2 text-[11px] font-semibold text-[#DC2626] disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#F3F6F5] lg:hidden">
        {approvals.map((row) => (
          <div key={row.id} className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <Avatar src={row.profilePic} name={row.name} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#183534]">{row.name}</p>
                <p className="text-[12px] text-[#7A928D]">
                  {row.industry} · {row.service}
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${STATUS_STYLES[row.status] || STATUS_STYLES.pending}`}
              >
                {row.statusLabel}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-[#5C7571]">
              <span className="rounded-full bg-[#F4F8F7] px-2 py-0.5 font-semibold text-[#0A4A4A]">
                {row.requestTypeLabel}
              </span>
              <span>{formatDate(row.submittedAt)}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onView?.(row)}
                className="flex-1 rounded-xl bg-[#0A4A4A] px-3 py-2.5 text-[12px] font-semibold text-white"
              >
                View
              </button>
              {row.canReview && (
                <>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => onApprove?.(row)}
                    className="rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-3 py-2.5 text-[12px] font-semibold text-[#1A7A5A]"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => onReject?.(row)}
                    className="rounded-xl border border-[#FFD7D7] bg-[#FFF5F5] px-3 py-2.5 text-[12px] font-semibold text-[#DC2626]"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
