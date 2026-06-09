"use client";

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

export default function ProfileUpdateRequestsTable({ requests = [], onReview }) {
  if (!requests.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[#D7E5E1] bg-[#FCFDFC] px-4 py-10 text-center text-sm text-[#7A928D]">
        No profile update requests in this filter.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="hidden lg:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Change type</th>
              <th className="px-5 py-4">Submitted date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((row) => (
              <tr key={row.id} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#183534]">{row.name}</p>
                  <p className="text-[12px] text-[#7A928D]">{row.industry} · {row.service}</p>
                </td>
                <td className="px-5 py-4 text-sm text-[#35504C]">{row.changeTypeLabel}</td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">{formatDate(row.submittedAt)}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[row.status] || STATUS_STYLES.pending}`}
                  >
                    {row.statusLabel}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onReview(row)}
                    className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0D6060]"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#F3F6F5] lg:hidden">
        {requests.map((row) => (
          <div key={row.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#183534]">{row.name}</p>
                <p className="text-[12px] text-[#7A928D]">{row.changeTypeLabel}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[row.status] || STATUS_STYLES.pending}`}
              >
                {row.statusLabel}
              </span>
            </div>
            <p className="line-clamp-2 text-[13px] text-[#35504C]">{row.summary}</p>
            <button
              type="button"
              onClick={() => onReview(row)}
              className="w-full rounded-xl bg-[#0A4A4A] px-3 py-2.5 text-[12px] font-semibold text-white"
            >
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
