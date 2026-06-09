"use client";

import Link from "next/link";
import { FiCheck, FiPlay, FiUser, FiUserCheck, FiX } from "react-icons/fi";

export default function ComplaintsQuickActions({
  complaint,
  onAssign,
  onStartReview,
  onResolve,
  onClose,
  isProcessing = false,
}) {
  if (!complaint) return null;

  return (
    <section className="rounded-2xl border border-[#E6ECEA] bg-[#FCFDFC] p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
        Quick actions
      </p>
      <div className="flex flex-wrap gap-2">
        {complaint.isActive && !complaint.assignedAdminId && (
          <button
            type="button"
            onClick={onAssign}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-full border border-[#0A4A4A]/20 bg-[#F4F8F7] px-3.5 py-2 text-[12px] font-semibold text-[#0A4A4A] disabled:opacity-60"
          >
            <FiUserCheck size={14} />
            Assign case
          </button>
        )}
        {complaint.status === "open" && (
          <button
            type="button"
            onClick={onStartReview}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-[#FFF9F0] px-3.5 py-2 text-[12px] font-semibold text-[#B45309] disabled:opacity-60"
          >
            <FiPlay size={14} />
            Mark in progress
          </button>
        )}
        {complaint.isActive && (
          <>
            <button
              type="button"
              onClick={onResolve}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 rounded-full bg-[#0A4A4A] px-3.5 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
            >
              <FiCheck size={14} />
              Resolve case
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 rounded-full border border-[#E6ECEA] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#64748B] disabled:opacity-60"
            >
              <FiX size={14} />
              Close case
            </button>
          </>
        )}
        {(complaint.targetUserId || complaint.reporterUserId) && (
          <Link
            href={`/admin/users/${complaint.targetUserId || complaint.reporterUserId}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#0A4A4A]/20 bg-white px-3.5 py-2 text-[12px] font-semibold text-[#0A4A4A]"
          >
            <FiUser size={14} />
            View user
          </Link>
        )}
        {complaint.entityHref && (
          <Link
            href={complaint.entityHref}
            className="inline-flex items-center gap-2 rounded-full border border-[#0A4A4A]/20 bg-white px-3.5 py-2 text-[12px] font-semibold text-[#0A4A4A]"
          >
            View profile
          </Link>
        )}
      </div>
    </section>
  );
}
