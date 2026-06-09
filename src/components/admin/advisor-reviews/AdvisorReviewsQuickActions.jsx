"use client";

import Link from "next/link";
import { FiEye, FiEyeOff, FiRotateCcw, FiUser } from "react-icons/fi";

export default function AdvisorReviewsQuickActions({
  review,
  onHide,
  onRestore,
  isProcessing = false,
}) {
  if (!review) return null;

  const canHide = review.visibility === "public";
  const canRestore = review.visibility === "hidden";

  return (
    <section className="rounded-2xl border border-[#E6ECEA] bg-[#FCFDFC] p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
        Quick actions
      </p>
      <div className="flex flex-wrap gap-2">
        {canHide && (
          <button
            type="button"
            onClick={onHide}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-3.5 py-2 text-[12px] font-semibold text-[#B45309] transition hover:bg-[#FEF3C7] disabled:opacity-60"
          >
            <FiEyeOff size={14} />
            Hide review
          </button>
        )}
        {canRestore && (
          <button
            type="button"
            onClick={onRestore}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-full border border-[#CFE6DA] bg-[#E8F5F0] px-3.5 py-2 text-[12px] font-semibold text-[#1A7A5A] transition hover:bg-[#DDF0E8] disabled:opacity-60"
          >
            <FiRotateCcw size={14} />
            Restore review
          </button>
        )}
        {review.advisorId && (
          <Link
            href={`/admin/users/${review.advisorId}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#0A4A4A]/20 bg-[#F4F8F7] px-3.5 py-2 text-[12px] font-semibold text-[#0A4A4A] transition hover:bg-[#E8F5F0]"
          >
            <FiUser size={14} />
            View advisor
          </Link>
        )}
        {review.reviewerUserId && (
          <Link
            href={`/admin/users/${review.reviewerUserId}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#0A4A4A]/20 bg-white px-3.5 py-2 text-[12px] font-semibold text-[#0A4A4A] transition hover:bg-[#F4F8F7]"
          >
            <FiEye size={14} />
            View customer
          </Link>
        )}
      </div>
    </section>
  );
}
