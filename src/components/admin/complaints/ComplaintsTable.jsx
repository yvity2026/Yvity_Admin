"use client";

import { AdminEmptyState } from "@/components/admin/ui";

const STATUS_STYLES = {
  open: "bg-[#FFF6E8] text-[#B45309]",
  in_review: "bg-[#E8F4F3] text-[#0A4A4A]",
  resolved: "bg-[#E8F5F0] text-[#1A7A5A]",
  dismissed: "bg-[#F8FAFC] text-[#475569]",
};

const PRIORITY_STYLES = {
  low: "bg-[#F8FAFC] text-[#64748B]",
  medium: "bg-[#F4F8F7] text-[#0A4A4A]",
  high: "bg-[#FFF6E8] text-[#B45309]",
  urgent: "bg-[#FFF1F0] text-[#DC2626]",
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

export default function ComplaintsTable({ complaints = [], onOpen }) {
  if (!complaints.length) {
    return (
      <AdminEmptyState
        title="No complaints found"
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
              <th className="px-5 py-4">Case</th>
              <th className="px-5 py-4">Target</th>
              <th className="px-5 py-4">Reason</th>
              <th className="px-5 py-4">Priority</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Reporter</th>
              <th className="px-5 py-4">Filed</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#183534]">{complaint.caseNumber}</p>
                  <p className="mt-1 line-clamp-1 text-[12px] text-[#7A928D]">
                    {complaint.descriptionPreview}
                  </p>
                </td>
                <td className="px-5 py-4 text-sm text-[#35504C]">{complaint.entityTypeLabel}</td>
                <td className="px-5 py-4 text-sm text-[#35504C]">{complaint.reasonLabel}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${PRIORITY_STYLES[complaint.priority] || PRIORITY_STYLES.medium}`}
                  >
                    {complaint.priorityLabel}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[complaint.status] || STATUS_STYLES.open}`}
                  >
                    {complaint.statusLabel}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-[#183534]">{complaint.reporterName}</p>
                  <p className="text-[12px] text-[#7A928D]">{complaint.reporterPhoneMasked}</p>
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">{formatDate(complaint.createdAt)}</td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onOpen(complaint)}
                    className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0D6060]"
                  >
                    Open case
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#F3F6F5] lg:hidden">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#183534]">{complaint.caseNumber}</p>
                <p className="text-[12px] text-[#7A928D]">
                  {complaint.entityTypeLabel} · {complaint.reasonLabel}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[complaint.status] || STATUS_STYLES.open}`}
              >
                {complaint.statusLabel}
              </span>
            </div>
            <p className="line-clamp-2 text-[13px] leading-6 text-[#35504C]">
              {complaint.descriptionPreview}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5C7571]">
              <span
                className={`rounded-full px-2 py-1 font-semibold ${PRIORITY_STYLES[complaint.priority] || PRIORITY_STYLES.medium}`}
              >
                {complaint.priorityLabel}
              </span>
              <span>{complaint.reporterName}</span>
              <span>{formatDate(complaint.createdAt)}</span>
            </div>
            <button
              type="button"
              onClick={() => onOpen(complaint)}
              className="w-full rounded-xl bg-[#0A4A4A] px-3 py-2.5 text-[12px] font-semibold text-white"
            >
              Open case
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
