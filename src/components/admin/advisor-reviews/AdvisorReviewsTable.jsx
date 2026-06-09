"use client";

import { FiEye, FiEyeOff, FiRotateCcw, FiStar } from "react-icons/fi";
import { AdminEmptyState } from "@/components/admin/ui";

const STATUS_STYLES = {
  reported: "bg-[#FFF1F0] text-[#DC2626]",
  hidden: "bg-[#FFF6E8] text-[#B45309]",
  resolved: "bg-[#E8F5F0] text-[#1A7A5A]",
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

export default function AdvisorReviewsTable({
  reviews = [],
  onInspect,
  onHide,
  onRestore,
  isProcessing = false,
}) {
  if (!reviews.length) {
    return (
      <AdminEmptyState
        title="No reported reviews found"
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
              <th className="px-5 py-4">Advisor name</th>
              <th className="px-5 py-4">Review preview</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4">Reported by</th>
              <th className="px-5 py-4">Report reason</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#183534]">{review.advisorName}</p>
                  <p className="text-[12px] text-[#7A928D]">{review.advisorShortId}</p>
                </td>
                <td className="max-w-[240px] px-5 py-4">
                  <p className="line-clamp-2 text-[13px] leading-6 text-[#35504C]">{review.preview}</p>
                  <p className="mt-1 text-[11px] text-[#7A928D]">by {review.reviewerName}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#183534]">
                    <FiStar size={12} className="text-[#F59E0B]" />
                    {review.rating}/5
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-[#35504C]">{review.reportedBy}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-[#475569]">
                    {review.reportReasonLabel}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      STATUS_STYLES[review.moderationStatus] || STATUS_STYLES.resolved
                    }`}
                  >
                    {review.moderationStatusLabel}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">
                  {formatDate(review.reportedAt || review.submittedAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onInspect(review)}
                      className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0D6060]"
                    >
                      View
                    </button>
                    {review.visibility === "public" && (
                      <button
                        type="button"
                        onClick={() => onHide(review)}
                        disabled={isProcessing}
                        className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-[11px] font-semibold text-[#B45309] disabled:opacity-60"
                      >
                        <FiEyeOff size={12} className="inline" /> Hide
                      </button>
                    )}
                    {review.visibility === "hidden" && (
                      <button
                        type="button"
                        onClick={() => onRestore(review)}
                        disabled={isProcessing}
                        className="rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-3 py-2 text-[11px] font-semibold text-[#1A7A5A] disabled:opacity-60"
                      >
                        <FiRotateCcw size={12} className="inline" /> Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#F3F6F5] lg:hidden">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#183534]">{review.advisorName}</p>
                <p className="text-[12px] text-[#7A928D]">Reported by {review.reportedBy}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  STATUS_STYLES[review.moderationStatus] || STATUS_STYLES.resolved
                }`}
              >
                {review.moderationStatusLabel}
              </span>
            </div>

            <p className="line-clamp-2 text-[13px] leading-6 text-[#35504C]">{review.preview}</p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5C7571]">
              <span className="inline-flex items-center gap-1 font-semibold text-[#183534]">
                <FiStar size={11} className="text-[#F59E0B]" />
                {review.rating}/5
              </span>
              <span>{review.reportReasonLabel}</span>
              <span>{formatDate(review.reportedAt || review.submittedAt)}</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onInspect(review)}
                className="flex-1 rounded-xl bg-[#0A4A4A] px-3 py-2.5 text-[12px] font-semibold text-white"
              >
                View
              </button>
              {review.visibility === "public" && (
                <button
                  type="button"
                  onClick={() => onHide(review)}
                  disabled={isProcessing}
                  className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5 text-[12px] font-semibold text-[#B45309]"
                >
                  Hide
                </button>
              )}
              {review.visibility === "hidden" && (
                <button
                  type="button"
                  onClick={() => onRestore(review)}
                  disabled={isProcessing}
                  className="rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-3 py-2.5 text-[12px] font-semibold text-[#1A7A5A]"
                >
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
