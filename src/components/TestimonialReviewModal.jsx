"use client";

import { useState } from "react";
import { FiCheck, FiClock, FiMapPin, FiPhone, FiStar } from "react-icons/fi";
import AdminModal from "@/components/admin/ui/AdminModal";

function StatusBadge({ status }) {
  const variants = {
    approved: "bg-[#E8F5F0] text-[#1A7A5A]",
    rejected: "bg-[#FFF1F1] text-[#CC3333]",
    pending: "bg-[#FFF6E8] text-[#C57A00]",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${variants[status] || variants.pending}`}>
      {status || "pending"}
    </span>
  );
}

export default function TestimonialReviewModal({
  testimonial,
  onClose,
  onApprove,
  onReject,
  onSendReply,
  isProcessing = false,
}) {
  const [reply, setReply] = useState("");

  if (!testimonial) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <AdminModal
      open={Boolean(testimonial)}
      onClose={onClose}
      eyebrow="Testimonial Review"
      title={testimonial.name}
      size="md"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onReject}
            disabled={isProcessing || testimonial.status === "rejected"}
            className="flex-1 cursor-pointer rounded-xl border border-[#FFD7D7] bg-[#FFF5F5] px-4 py-3 text-sm font-semibold text-[#CC3333] disabled:opacity-60"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => onApprove(reply)}
            disabled={isProcessing || testimonial.status === "approved"}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-4 py-3 text-sm font-semibold text-[#1A7A5A] disabled:opacity-60"
          >
            <FiCheck />
            {isProcessing ? "Updating..." : "Approve"}
          </button>
        </div>
      }
    >
      <div className="no-scrollbar space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={testimonial.status} />
          <span className="inline-flex items-center gap-1 text-sm text-[#5C7571]">
            <FiMapPin size={14} />
            {testimonial.location}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-[#5C7571]">
            <FiPhone size={14} />
            {testimonial.phone || "Not available"}
          </span>
        </div>

        <div className="grid gap-3 rounded-2xl bg-[#F8FBFA] p-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Advisor
            </div>
            <div className="mt-1 text-sm font-semibold text-[#173736]">
              {testimonial.advisor || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Type
            </div>
            <div className="mt-1 text-sm font-semibold capitalize text-[#173736]">
              {testimonial.type}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Submitted
            </div>
            <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#173736]">
              <FiClock size={14} />
              {formatDate(testimonial.submitted)}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Rating
            </div>
            <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#173736]">
              <FiStar size={14} className="text-[#E8A020]" />
              {testimonial.rating}/5
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            Review
          </div>
          <div className="mt-2 rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C]">
            {testimonial.type === "text" ? (
              testimonial.content || testimonial.review || "No review provided."
            ) : testimonial.media_url ? (
              testimonial.type === "image" ? (
                <img
                  src={testimonial.media_url}
                  alt="Testimonial"
                  className="h-auto max-w-full rounded-lg"
                />
              ) : (
                <a
                  href={testimonial.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#0A4A4A] underline underline-offset-4"
                >
                  Open {testimonial.type} file
                </a>
              )
            ) : (
              "No media attached."
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            Reply
          </div>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Enter your reply..."
            className="mt-2 w-full resize-none rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C]"
            rows={3}
          />
          <button
            type="button"
            onClick={() => onSendReply(reply)}
            disabled={isProcessing || !reply.trim()}
            className="mt-2 w-full cursor-pointer rounded-xl bg-[#1A7A5A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Send Reply
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
