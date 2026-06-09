"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiCheck,
  FiClock,
  FiEyeOff,
  FiPhone,
  FiRefreshCw,
  FiStar,
} from "react-icons/fi";
import AdminModal from "@/components/admin/ui/AdminModal";
import { PLATFORM_SUBJECT } from "@/lib/admin/platform-reviews/mapPlatformReviewRecord";

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

export default function PlatformReviewModal({
  review,
  onClose,
  onApprove,
  onHide,
  onRestore,
  onSendReply,
  isProcessing = false,
}) {
  const [reply, setReply] = useState(review?.platformReply || "");

  useEffect(() => {
    setReply(review?.platformReply || "");
  }, [review?.id, review?.platformReply]);

  if (!review) return null;

  return (
    <AdminModal
      open={Boolean(review)}
      onClose={onClose}
      eyebrow="Platform testimonial moderation"
      title={review.reviewerName}
      size="md"
      footer={
        <div className="flex gap-3">
          {review.canHide && (
            <button
              type="button"
              onClick={onHide}
              disabled={isProcessing}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E6ECEA] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#64748B]"
            >
              <FiEyeOff size={14} />
              Hide
            </button>
          )}
          {review.canRestore && (
            <button
              type="button"
              onClick={onRestore}
              disabled={isProcessing}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-4 py-3 text-sm font-semibold text-[#1A7A5A]"
            >
              <FiRefreshCw size={14} />
              Restore
            </button>
          )}
          {review.canApprove ? (
            <button
              type="button"
              onClick={() => onApprove(reply)}
              disabled={isProcessing}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-4 py-3 text-sm font-semibold text-[#1A7A5A]"
            >
              <FiCheck />
              Approve for landing
            </button>
          ) : null}
        </div>
      }
    >
      <p className="mb-5 text-sm text-[#5C7571]">about {PLATFORM_SUBJECT}</p>

      <div className="no-scrollbar space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-[#F4F8F7] px-3 py-1 text-xs font-semibold capitalize text-[#0A4A4A]">
            {review.type}
          </span>
          <span className="inline-flex rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-[#475569]">
            {review.userType}
          </span>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              review.isPublished
                ? "bg-[#E8F5F0] text-[#1A7A5A]"
                : review.isHidden
                  ? "bg-[#F8FAFC] text-[#64748B]"
                  : "bg-[#FFF6E8] text-[#B45309]"
            }`}
          >
            {review.statusLabel}
          </span>
        </div>

        <div className="grid gap-3 rounded-2xl bg-[#F8FBFA] p-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">Rating</div>
            <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#173736]">
              <FiStar size={14} className="text-[#E8A020]" />
              {review.rating}/5
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">Location</div>
            <div className="mt-1 text-sm font-semibold text-[#173736]">{review.location}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">Phone</div>
            <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#173736]">
              <FiPhone size={14} />
              {review.phoneMasked}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">Submitted</div>
            <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#173736]">
              <FiClock size={14} />
              {formatDate(review.submittedAt)}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            Review content
          </div>
          <div className="mt-2 rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C]">
            {review.type === "text" ? (
              review.content || "No review provided."
            ) : review.mediaUrl ? (
              <a
                href={review.mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#0A4A4A] underline underline-offset-4"
              >
                Open {review.type} file
              </a>
            ) : (
              "No media attached."
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            YVITY platform reply
          </div>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Optional reply shown on the landing page after approval…"
            className="mt-2 w-full resize-none rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C]"
            rows={3}
          />
          <button
            type="button"
            onClick={() => onSendReply(reply)}
            disabled={isProcessing || !reply.trim()}
            className="mt-2 w-full rounded-xl bg-[#1A7A5A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Save reply
          </button>
        </div>

        <Link
          href={`/admin/users?q=${encodeURIComponent(review.mobile || "")}`}
          className="inline-flex text-[12px] font-semibold text-[#0A4A4A] underline underline-offset-2"
        >
          View user by mobile
        </Link>
      </div>
    </AdminModal>
  );
}
