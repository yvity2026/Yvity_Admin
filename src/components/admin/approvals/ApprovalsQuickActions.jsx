"use client";

import Link from "next/link";
import { FiCheck, FiExternalLink, FiFileText, FiX } from "react-icons/fi";

export default function ApprovalsQuickActions({
  approval,
  onApprove,
  onReject,
  isProcessing = false,
}) {
  if (!approval) return null;

  return (
    <section className="rounded-2xl border border-[#E6ECEA] bg-[#FCFDFC] p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
        Quick actions
      </p>
      <div className="flex flex-wrap gap-2">
        {approval.canReview && (
          <>
            <button
              type="button"
              onClick={onApprove}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 rounded-full bg-[#0A4A4A] px-3.5 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
            >
              <FiCheck size={14} />
              Approve
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 rounded-full border border-[#FFD7D7] bg-[#FFF5F5] px-3.5 py-2 text-[12px] font-semibold text-[#DC2626] disabled:opacity-60"
            >
              <FiX size={14} />
              Reject
            </button>
          </>
        )}
        {approval.profileHref && (
          <Link
            href={approval.profileHref}
            className="inline-flex items-center gap-2 rounded-full border border-[#0A4A4A]/20 bg-[#F4F8F7] px-3.5 py-2 text-[12px] font-semibold text-[#0A4A4A]"
          >
            <FiExternalLink size={14} />
            View profile
          </Link>
        )}
        {approval.uploadedProofs?.length > 0 && (
          <a
            href={approval.uploadedProofs[0]}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#0A4A4A]/20 bg-white px-3.5 py-2 text-[12px] font-semibold text-[#0A4A4A]"
          >
            <FiFileText size={14} />
            View documents
          </a>
        )}
      </div>
    </section>
  );
}
