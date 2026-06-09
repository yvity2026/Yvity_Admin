"use client";

import Link from "next/link";
import { FiClock, FiStar } from "react-icons/fi";
import AdminModal from "@/components/admin/ui/AdminModal";

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

export default function AdvisorReviewModal({
  review,
  onClose,
  onHide,
  onRestore,
  isProcessing = false,
  quickActions = null,
}) {
  if (!review) return null;

  return (
    <AdminModal
      open={Boolean(review)}
      onClose={onClose}
      eyebrow="Review details"
      title={review.advisorName}
      size="md"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row">
          {review.visibility === "public" ? (
            <button
              type="button"
              onClick={onHide}
              disabled={isProcessing}
              className="flex-1 cursor-pointer rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm font-semibold text-[#B45309] disabled:opacity-60"
            >
              Hide review
            </button>
          ) : (
            <button
              type="button"
              onClick={onRestore}
              disabled={isProcessing}
              className="flex-1 cursor-pointer rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-4 py-3 text-sm font-semibold text-[#1A7A5A] disabled:opacity-60"
            >
              Restore review
            </button>
          )}
        </div>
      }
    >
      <p className="mb-5 text-sm text-[#5C7571]">Customer: {review.reviewerName}</p>

      <div className="no-scrollbar space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              STATUS_STYLES[review.moderationStatus] || STATUS_STYLES.resolved
            }`}
          >
            {review.moderationStatusLabel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F8F7] px-3 py-1 text-xs font-semibold text-[#0A4A4A]">
            <FiStar size={12} className="text-[#F59E0B]" />
            {review.rating}/5
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-[#475569]">
            <FiClock size={12} />
            {formatDate(review.reportedAt || review.submittedAt)}
          </span>
        </div>

        {quickActions}

        <div className="grid gap-3 rounded-2xl bg-[#F8FBFA] p-4 sm:grid-cols-2">
          <InfoField label="Advisor name" value={review.advisorName} />
          <InfoField label="Customer name" value={review.reviewerName} />
          <InfoField label="Report reason" value={review.reportReasonLabel} />
          <InfoField label="Reported by" value={review.reportedBy} />
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            Review
          </div>
          <div className="mt-2 rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C]">
            {review.type === "text" ? (
              review.content || review.preview || "No review provided."
            ) : review.mediaUrl ? (
              <a
                href={review.mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#0A4A4A] underline underline-offset-4"
              >
                Open {review.type} review
              </a>
            ) : (
              review.preview
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            Report description
          </div>
          <div className="mt-2 rounded-2xl border border-[#FECACA] bg-[#FFF7F7] px-4 py-4 text-sm leading-7 text-[#7F1D1D]">
            {review.reportDescription || "No report description provided."}
          </div>
        </div>

        {review.caseNumber && (
          <p className="text-[12px] text-[#7A928D]">
            Linked case:{" "}
            <Link
              href="/admin/complaints"
              className="font-semibold text-[#0A4A4A] underline underline-offset-2"
            >
              {review.caseNumber}
            </Link>
          </p>
        )}
      </div>
    </AdminModal>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-[#173736]">{value || "—"}</div>
    </div>
  );
}
